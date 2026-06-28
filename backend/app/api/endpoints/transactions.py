import json
import re
from datetime import date
from typing import Any, Optional

import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.auth import CurrentUser, require_current_user
from app.core.config import settings
from app.core.db import try_get_supabase_client

router = APIRouter()

INCOME_KEYWORDS = ("thu", "lương", "luong", "bán", "ban", "doanh thu")
EXPENSE_KEYWORDS = ("chi", "mua", "ăn", "an", "cơm", "com", "grab", "xăng", "xang")
FOOD_KEYWORDS = ("ăn", "an", "cơm", "com", "bún", "bun", "coffee", "cafe", "trà", "tra")
TRAVEL_KEYWORDS = ("grab", "taxi", "xăng", "xang", "xe")
REVENUE_KEYWORDS = ("lương", "luong", "doanh thu", "bán", "ban")


class TransactionParseRequest(BaseModel):
    raw_text: str = Field(min_length=1, max_length=5000)
    receipt_id: Optional[str] = None


def _parse_amount(raw_text: str) -> int:
    matches = re.findall(r"(\d[\d.,]*)\s*(?:d|đ|vnd|k)?", raw_text.lower())
    if not matches:
        return 0

    values = []
    has_thousand_suffix = "k" in raw_text.lower()
    for match in matches:
        if re.fullmatch(r"\d{1,2}\.\d{1,2}\.\d{2,4}", match):
            continue
        normalized = match.replace(".", "").replace(",", "")
        if normalized.isdigit():
            amount = int(normalized)
            if has_thousand_suffix and amount < 1000:
                amount *= 1000
            values.append(amount)
    return max(values) if values else 0


def _contains_any(text: str, keywords: tuple[str, ...]) -> bool:
    return any(keyword in text for keyword in keywords)


def _fallback_parse(raw_text: str) -> dict[str, Any]:
    lowered = raw_text.lower()
    transaction_type = "INCOME" if _contains_any(lowered, INCOME_KEYWORDS) else "EXPENSE"

    if _contains_any(lowered, FOOD_KEYWORDS):
        category = "Ăn uống"
    elif _contains_any(lowered, TRAVEL_KEYWORDS):
        category = "Di chuyển"
    elif _contains_any(lowered, REVENUE_KEYWORDS):
        category = "Doanh thu"
    elif _contains_any(lowered, EXPENSE_KEYWORDS):
        category = "Chi phí"
    else:
        category = "Khác"

    return {
        "amount": _parse_amount(raw_text),
        "transaction_date": str(date.today()),
        "type": transaction_type,
        "category": category,
        "confidence_score": 0.65,
    }


def _extract_json(text: str) -> dict[str, Any]:
    text_response = text.strip()
    if text_response.startswith("```json"):
        text_response = text_response[7:-3].strip()
    elif text_response.startswith("```"):
        text_response = text_response[3:-3].strip()
    return json.loads(text_response)


def _build_gemini_prompt(raw_text: str) -> str:
    return f"""
                Bạn là một trợ lý tài chính AI. Hãy đọc đoạn văn bản được trích xuất từ hóa đơn hoặc sổ tay sau đây và trích xuất các thông tin giao dịch tài chính.
                Văn bản:
                ---
                {raw_text}
                ---

                Trả về kết quả dưới định dạng JSON chính xác với các field sau (không có code block format, chỉ nguyên chuỗi JSON):
                - amount: (số tiền, định dạng số nguyên)
                - transaction_date: (ngày giao dịch định dạng YYYY-MM-DD, nếu không có thì lấy ngày hôm nay là {date.today()})
                - type: (INCOME hoặc EXPENSE)
                - category: (phân loại danh mục, ví dụ: Ăn uống, Di chuyển, Mua sắm, Tiền lương...)
                - confidence_score: (độ tự tin từ 0.00 đến 1.00)
                """


def _parse_with_gemini(raw_text: str) -> dict[str, Any]:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(_build_gemini_prompt(raw_text))
    return _extract_json(response.text)


def _build_transaction_record(
    request: TransactionParseRequest,
    parsed_data: dict[str, Any],
    user_id: str,
) -> dict[str, Any]:
    transaction_record = {
        "user_id": user_id,
        "amount": parsed_data.get("amount") or 0,
        "transaction_date": parsed_data.get("transaction_date"),
        "type": parsed_data.get("type"),
        "category": parsed_data.get("category"),
        "confidence_score": parsed_data.get("confidence_score"),
        "status": "CONFIRMED",
    }
    if request.receipt_id:
        transaction_record["receipt_id"] = request.receipt_id
    return transaction_record


def _save_transaction(record: dict[str, Any]) -> tuple[dict[str, Any] | None, str | None]:
    supabase = try_get_supabase_client()
    if not supabase:
        return None, None

    try:
        response = supabase.table("transactions").insert(record).execute()
        return (response.data or [None])[0], None
    except Exception as exc:
        return None, str(exc)


@router.post("/parse")
async def parse_transaction(
    request: TransactionParseRequest,
    current_user: CurrentUser = Depends(require_current_user),
):
    try:
        parse_source = "fallback"
        parse_error = None

        if not settings.has_gemini:
            parsed_data = _fallback_parse(request.raw_text)
        else:
            try:
                parsed_data = _parse_with_gemini(request.raw_text)
                parse_source = "gemini"
            except Exception as exc:
                parsed_data = _fallback_parse(request.raw_text)
                parse_error = f"Gemini request failed; used fallback parser ({exc.__class__.__name__})"

        transaction_record = _build_transaction_record(request, parsed_data, current_user.id)
        saved_record, save_error = _save_transaction(transaction_record)

        return {
            "message": "Successfully parsed and saved",
            "parsed_data": parsed_data,
            "record": saved_record,
            "saved": bool(saved_record),
            "save_error": save_error,
            "parse_source": parse_source,
            "parse_error": parse_error,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("")
async def list_transactions(
    limit: int = Query(default=50, ge=1, le=100),
    current_user: CurrentUser = Depends(require_current_user),
):
    supabase = try_get_supabase_client()
    if not supabase:
        return {"items": [], "source": "mock", "message": "Supabase is not configured"}

    try:
        response = (
            supabase.table("transactions")
            .select("*")
            .eq("user_id", current_user.id)
            .order("transaction_date", desc=True)
            .limit(limit)
            .execute()
        )
        return {"items": response.data or [], "source": "supabase"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

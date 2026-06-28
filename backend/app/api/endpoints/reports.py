from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.auth import CurrentUser, require_current_user
from app.core.db import try_get_supabase_client

router = APIRouter()


def _build_mock_summary() -> dict[str, object]:
    return {
        "source": "mock",
        "total_income": 0,
        "total_expense": 0,
        "balance": 0,
        "transaction_count": 0,
        "recent_transactions": [],
        "categories": [],
        "message": "Supabase is not configured",
    }


def _build_categories(transactions: list[dict[str, object]]) -> list[dict[str, float | str]]:
    category_totals: dict[str, float] = {}
    for item in transactions:
        category = str(item.get("category") or "Khác")
        category_totals[category] = category_totals.get(category, 0) + float(item.get("amount") or 0)

    return [
        {"category": category, "amount": amount}
        for category, amount in sorted(category_totals.items(), key=lambda entry: entry[1], reverse=True)
    ]


@router.get("/summary")
async def get_summary(
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
    current_user: CurrentUser = Depends(require_current_user),
):
    supabase = try_get_supabase_client()
    if not supabase:
        return _build_mock_summary()

    try:
        query = (
            supabase.table("transactions")
            .select("id,amount,transaction_date,type,category,confidence_score,status,created_at")
            .eq("user_id", current_user.id)
            .order("transaction_date", desc=True)
            .limit(5000)
        )
        if date_from:
            query = query.gte("transaction_date", date_from.isoformat())
        if date_to:
            query = query.lte("transaction_date", date_to.isoformat())
        response = query.execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    transactions = response.data or []
    total_income = sum(float(item["amount"]) for item in transactions if item.get("type") == "INCOME")
    total_expense = sum(float(item["amount"]) for item in transactions if item.get("type") == "EXPENSE")

    return {
        "source": "supabase",
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
        "transaction_count": len(transactions),
        "recent_transactions": transactions[:limit],
        "categories": _build_categories(transactions),
    }

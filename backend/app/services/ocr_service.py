import json
import requests
from typing import Dict, Any
from app.core.config import settings

def extract_receipt_data(image_url_or_base64: str) -> Dict[str, Any]:
    """
    Uses Gemini AI (or Google Cloud Vision) to extract transaction details from a receipt image.
    For this MVP, we will use Gemini Pro Vision API to extract structured JSON.
    """
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set.")

    # Example logic using Gemini API via REST
    # In a real implementation, you might download the image and send it as base64 to Gemini
    # Or use the official google-genai SDK.

    api_key = settings.GEMINI_API_KEY
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    prompt = """
    Extract the transaction details from this receipt image.
    Return ONLY a JSON object with the following fields:
    - total_amount: float
    - transaction_date: YYYY-MM-DD
    - category: string (one of: FOOD, TRANSPORT, UTILITIES, ENTERTAINMENT, SHOPPING, OTHER)
    - type: string (always 'EXPENSE' for receipts)
    """

    # We stub the payload assuming we have the image data
    # payload = {
    #     "contents": [
    #         {
    #             "parts": [
    #                 {"text": prompt},
    #                 {
    #                     "inline_data": {
    #                         "mime_type": "image/jpeg",
    #                         "data": "BASE64_IMAGE_DATA_HERE"
    #                     }
    #                 }
    #             ]
    #         }
    #     ]
    # }

    # For now, return mock data
    return {
        "total_amount": 150.00,
        "transaction_date": "2026-06-25",
        "category": "FOOD",
        "type": "EXPENSE",
        "confidence_score": 0.95
    }

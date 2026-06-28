from fastapi import APIRouter, File, HTTPException, UploadFile
from google.cloud import vision

from app.core.config import settings

router = APIRouter()


def _build_mock_ocr_response() -> dict[str, object]:
    return {
        "message": "Mock OCR (No Google Credentials)",
        "full_text": "HÓA ĐƠN BÁN LẺ\nBún bò: 50.000\nTrà đá: 5.000\nTổng: 55.000\n",
        "blocks": [
            {"text": "HÓA ĐƠN BÁN LẺ", "confidence": 0.99, "bounding_box": []},
            {"text": "Bún bò: 50.000", "confidence": 0.98, "bounding_box": []},
            {"text": "Trà đá: 5.000", "confidence": 0.75, "bounding_box": []},
            {"text": "Tổng: 55.000", "confidence": 0.95, "bounding_box": []},
        ],
        "source": "mock",
    }


def _extract_blocks(annotation: vision.TextAnnotation) -> list[dict[str, object]]:
    blocks: list[dict[str, object]] = []
    for page in annotation.pages:
        for block in page.blocks:
            for paragraph in block.paragraphs:
                for word in paragraph.words:
                    blocks.append(
                        {
                            "text": "".join(symbol.text for symbol in word.symbols),
                            "confidence": word.confidence,
                            "bounding_box": [
                                {"x": vertex.x, "y": vertex.y}
                                for vertex in word.bounding_box.vertices
                            ],
                        }
                    )
    return blocks


@router.post("/extract")
async def extract_receipt(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        if not settings.has_google_vision:
            return _build_mock_ocr_response()

        client = vision.ImageAnnotatorClient()
        response = client.document_text_detection(image=vision.Image(content=content))

        if response.error.message:
            raise HTTPException(status_code=400, detail=response.error.message)

        annotation = response.full_text_annotation

        return {
            "full_text": annotation.text,
            "blocks": _extract_blocks(annotation),
            "source": "google_vision",
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

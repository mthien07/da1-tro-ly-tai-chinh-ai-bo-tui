# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import ocr, transactions, reports
from app.core.config import settings

app = FastAPI(
    title="Pocket Finance AI Backend",
    description="Backend API for DA1 MVP",
    version="1.0.0",
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ocr.router, prefix="/api/v1/ocr", tags=["ocr"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["transactions"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])


@app.get("/")
def root():
    return {"message": "Pocket Finance AI Backend is running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "services": {
            "supabase": settings.has_supabase,
            "google_vision": settings.has_google_vision,
            "gemini": settings.has_gemini,
        },
    }

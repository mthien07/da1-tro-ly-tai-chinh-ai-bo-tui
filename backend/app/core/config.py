import os

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

PLACEHOLDER_VALUES = {
    "",
    "your_supabase_url",
    "your_supabase_anon_key",
    "your_supabase_service_role_key",
    "YOUR_GOOGLE_CREDENTIALS_PATH_HERE",
    "YOUR_GEMINI_API_KEY_HERE",
    "your_gemini_api_key",
}


class Settings:
    def __init__(self) -> None:
        self.SUPABASE_URL = os.getenv("SUPABASE_URL")
        self.SUPABASE_KEY = os.getenv("SUPABASE_KEY")
        self.SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
        self.GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    @staticmethod
    def has_value(value: str | None) -> bool:
        return bool(value) and value not in PLACEHOLDER_VALUES

    def _has_credentials(self, value: str | None, secret: str | None) -> bool:
        return self.has_value(value) and self.has_value(secret)

    @property
    def has_supabase(self) -> bool:
        return self._has_credentials(self.SUPABASE_URL, self.SUPABASE_KEY)

    @property
    def has_supabase_service(self) -> bool:
        return self._has_credentials(self.SUPABASE_URL, self.SUPABASE_SERVICE_KEY)

    @property
    def has_google_vision(self) -> bool:
        return self.has_value(self.GOOGLE_APPLICATION_CREDENTIALS)

    @property
    def has_gemini(self) -> bool:
        return self.has_value(self.GEMINI_API_KEY)


settings = Settings()

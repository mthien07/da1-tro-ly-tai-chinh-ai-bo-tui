from supabase import create_client, Client

from app.core.config import settings


def _create_supabase_client(api_key: str | None, error_message: str) -> Client:
    if not api_key:
        raise ValueError(error_message)
    return create_client(settings.SUPABASE_URL, api_key)


def get_supabase_client() -> Client:
    if not settings.has_supabase:
        raise ValueError("Supabase URL and Key must be provided in environment variables")
    return _create_supabase_client(
        settings.SUPABASE_KEY,
        "Supabase URL and Key must be provided in environment variables",
    )

# For server-side administrative operations, like creating users or bypassing RLS.
def get_supabase_service_client() -> Client:
    if not settings.has_supabase_service:
        raise ValueError("Supabase URL and Service Key must be provided in environment variables")
    return _create_supabase_client(
        settings.SUPABASE_SERVICE_KEY,
        "Supabase URL and Service Key must be provided in environment variables",
    )

def try_get_supabase_client() -> Client | None:
    if not settings.has_supabase:
        return None
    return get_supabase_client()

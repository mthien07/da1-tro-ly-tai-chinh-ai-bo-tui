from dataclasses import dataclass

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.db import try_get_supabase_client

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    id: str
    email: str | None = None


def require_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> CurrentUser:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Bearer token is required")

    supabase = try_get_supabase_client()
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase auth is not configured")

    try:
        response = supabase.auth.get_user(credentials.credentials)
        user = response.user
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return CurrentUser(id=user.id, email=getattr(user, "email", None))

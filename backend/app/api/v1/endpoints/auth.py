"""Auth endpoints: register, login, current user."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.user import Token, UserLogin, UserOut, UserRegister
from app.services import auth_service
from app.services.auth_service import EmailAlreadyRegisteredError

router = APIRouter(prefix="/auth", tags=["auth"])


def _to_user_out(user: User) -> UserOut:
    return UserOut(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at,
    )


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
async def register(payload: UserRegister) -> UserOut:
    try:
        user = await auth_service.register_user(payload.email, payload.password)
    except EmailAlreadyRegisteredError as err:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        ) from err
    return _to_user_out(user)


@router.post("/login", response_model=Token)
async def login(payload: UserLogin) -> Token:
    user = await auth_service.authenticate_user(payload.email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token(subject=str(user.id))
    return Token(access_token=token)


@router.get("/me", response_model=UserOut)
async def me(current_user: User = Depends(get_current_user)) -> UserOut:
    return _to_user_out(current_user)

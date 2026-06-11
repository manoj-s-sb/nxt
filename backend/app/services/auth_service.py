"""Auth business logic: register, authenticate."""

from app.core.security import hash_password, verify_password
from app.models.user import User


class EmailAlreadyRegisteredError(Exception):
    pass


async def register_user(email: str, password: str) -> User:
    existing = await User.find_one(User.email == email)
    if existing is not None:
        raise EmailAlreadyRegisteredError(email)
    user = User(email=email, hashed_password=hash_password(password))
    await user.insert()
    return user


async def authenticate_user(email: str, password: str) -> User | None:
    user = await User.find_one(User.email == email)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

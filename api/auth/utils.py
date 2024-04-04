import bcrypt
from typing import Callable, Iterator

from sqlmodel import Session, select

from api.dependencies import get_session

from .schemas import UserCreate
from .manager import manager
from .models import User


def hash_password(plaintext_password: str):
    """Return the hash of a password"""
    pwd_bytes = plaintext_password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password


def verify_password(password_input: str, hashed_password: str):
    """Check if the provided password matches"""
    password_byte_enc = password_input.encode("utf-8")
    hashed_password = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password=password_byte_enc, hashed_password=hashed_password)


def create_user(session: Session, user: UserCreate):
    """Create a new entry in the database user table"""
    user_data = user.model_dump()
    print(user_data)
    user_data["password"] = hash_password(user.password)
    session_user = User.model_validate(user_data)
    print(session_user)
    session.add(session_user)
    session.commit()
    session.refresh(session_user)
    return session_user

@manager.user_loader(session_provider=get_session)
def get_user(
    email: str,
    session: Session = None,
    session_provider: Callable[[], Iterator[Session]] = None,
):
    if session is None and session_provider is None:
        raise ValueError("db and session_provider cannot both be None.")

    if session is None:
        session = next(session_provider())
    return session.exec(select(User).where(User.email == email)).first()

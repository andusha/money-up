from datetime import timedelta
from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException
from sqlmodel import Session

from ..dependencies import get_session

from .config import DEFAULT_SETTINGS
from .schemas import UserCreate, UserResponse
from .utils import get_user, create_user, verify_password
from .manager import manager

router = APIRouter()


@router.post("/auth/register")
def register(*, session: Session = Depends(get_session), user: UserCreate):
    if get_user(user.email, session) is not None:
        raise HTTPException(
            status_code=400, detail="Пользователь с таким почтовым ящиком уже существует"
        )
    else:
        db_user = create_user(session, user)
        return UserResponse(
            id=db_user.id, email=db_user.email, is_admin=db_user.is_admin
        )


@router.post(DEFAULT_SETTINGS.token_url)
def login(*, session: Session = Depends(get_session), data: OAuth2PasswordRequestForm = Depends()):
    email = data.username
    password = data.password

    user = get_user(email, session=session)  # we are using the same function to retrieve the user
    if user is None:
        raise InvalidCredentialsException  # you can also use your own HTTPException
    elif not verify_password(password, user.password):
        raise InvalidCredentialsException

    access_token = manager.create_access_token(data=dict(sub=user.email), expires=timedelta(hours=12))
    return {"access_token": access_token, "token_type": "Bearer"}


@router.get("/private")
def private_route(user=Depends(manager)):
    return {"detail": "auth"}

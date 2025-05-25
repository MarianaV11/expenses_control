from fastapi import APIRouter
from schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserLoginReturn,
    UserBase,
    UserIdentifier,
)
from services.user_service import create_user, login, get_user

router = APIRouter()


@router.post("/users/create")
def create_user_route(user: UserCreate):
    return create_user(user)


@router.post("/users/login", response_model=UserLoginReturn)
def login_user_route(user: UserLogin):
    return login(user)


@router.get("/users/user", response_model=UserBase)
def get_user_route(user_id: int):
    return get_user(UserIdentifier(id=user_id))

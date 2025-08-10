from fastapi import APIRouter, Depends
from schemas.user_schema import (
    UserBase,
    UserCreate,
    UserIdentifier,
    UserLogin,
    UserLoginReturn,
)
from services.user_service import create_user, get_user, login
from utils.auth import require_token_valid

router = APIRouter()


@router.post("/users/create")
def create_user_route(user: UserCreate):
    """Creates a new user"""

    return create_user(user)


@router.post("/users/login", response_model=UserLoginReturn)
def login_user_route(user: UserLogin):
    """Return information of authenticated user"""

    return login(user)


@router.get("/users/user", response_model=UserBase)
def get_user_route(user_id: int, _: None = Depends(require_token_valid)):
    """Return information of user by it's id"""

    return get_user(UserIdentifier(id=user_id))

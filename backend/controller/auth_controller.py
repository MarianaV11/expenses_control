from fastapi import APIRouter
from schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserLoginReturn,
)
from services.user_service import (
    create_user,
    login,
)

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/create", response_model=UserLoginReturn)
def create_user_route(user: UserCreate):
    """Creates a new user"""

    return create_user(user)


@router.post("/login", response_model=UserLoginReturn)
def login_user_route(user: UserLogin):
    """Return information of authenticated user"""

    return login(user)

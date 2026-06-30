from database import get_db
from fastapi import APIRouter, Depends
from schemas.user_schema import (
    UserCreate,
    UserLogin,
    UserLoginReturn,
)
from services.user_service import (
    create_user,
    login,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/create", response_model=UserLoginReturn)
def create_user_route(user: UserCreate, db: Session = Depends(get_db)):
    """Creates a new user"""

    return create_user(user, db)


@router.post("/login", response_model=UserLoginReturn)
def login_user_route(user: UserLogin, db: Session = Depends(get_db)):
    """Return information of authenticated user"""

    return login(user, db)

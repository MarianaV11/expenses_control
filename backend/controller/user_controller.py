from database import get_db
from fastapi import APIRouter, Depends
from schemas.user_schema import UserCreate, UserRead
from services.user_service import create_user
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/users", response_model=UserRead)
def create_user_route(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(user)
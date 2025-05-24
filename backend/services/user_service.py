from database import SessionLocal
from models.user import User
from schemas.user_schema import UserCreate


def create_user(user_data: UserCreate):
    db = SessionLocal()
    new_user = User(**user_data.model_dump())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
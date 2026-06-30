from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.user_schema import (
    UserBase,
    UserIdentifier,
    UserUpdatePassword,
    UpdatePersonalInfo,
)
from services.user_service import (
    delete_user,
    get_user,
    update_monthly_revenue,
    update_user,
    update_user_password,
    update_user_info,
)
from utils.auth import require_token_valid
from database import get_db

router = APIRouter(
    prefix="/api/users", tags=["Users"], dependencies=[Depends(require_token_valid)]
)


@router.get("/user", response_model=UserBase)
def get_user_route(user_id: int, db: Session = Depends(get_db)):
    """Return information of user by its id."""

    return get_user(user_id=UserIdentifier(id=user_id), db=db)


@router.put("/update", response_model=UserBase)
def update_user_route(user_data: UserBase, db: Session = Depends(get_db)):
    """Update general user information."""

    return update_user(user_data=user_data, db=db)


@router.patch("/update_password")
def update_user_password_route(
    user_data: UserUpdatePassword, db: Session = Depends(get_db)
):
    """Update password of user."""

    return update_user_password(user_data=user_data, db=db)


@router.patch("/monthly_revenue")
def update_monthly_revenue_route(
    user_id: int, new_monthly_revenue: float, db: Session = Depends(get_db)
):
    """Update monthly revenue of user."""

    return update_monthly_revenue(
        user_id=UserIdentifier(id=user_id), monthly_revenue=new_monthly_revenue, db=db
    )


@router.patch("/user_info")
def update_user_info_route(
    user_data: UpdatePersonalInfo, db: Session = Depends(get_db)
):
    """Update information about a user."""

    return update_user_info(user_data=user_data, db=db)


@router.delete("/delete/{user_id}")
def delete_user_route(user_id: int, db: Session = Depends(get_db)):
    """Permanently deletes a user."""

    return delete_user(user_id=UserIdentifier(id=user_id), db=db)

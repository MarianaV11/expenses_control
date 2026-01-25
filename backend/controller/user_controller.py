from fastapi import APIRouter, Depends
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

router = APIRouter(
    prefix="/api/users", tags=["Users"], dependencies=[Depends(require_token_valid)]
)


@router.get("/user", response_model=UserBase)
def get_user_route(user_id: int):
    """Return information of user by it's id"""

    return get_user(UserIdentifier(id=user_id))


@router.put("/update", response_model=UserBase)
def update_user_route(user_data: UserBase):
    """Update general user information."""

    return update_user(user_data=user_data)


@router.patch("/update_password")
def update_user_password_route(user_data: UserUpdatePassword):
    """Update password of user"""

    return update_user_password(user_data=user_data)


@router.patch("/monthly_revenue")
def update_monthly_revenue_route(user_id: int, new_monthly_revenue: float):
    """Update monthly revenue of user"""

    return update_monthly_revenue(
        monthly_revenue=new_monthly_revenue, user_id=UserIdentifier(id=user_id)
    )


@router.patch("/user_info")
def update_user_info_route(user_data: UpdatePersonalInfo):
    """Update information about an user"""

    return update_user_info(user_data=user_data)


@router.delete("/delete/{user_id}")
def delete_user_route(user_id: int):
    """Permanently deletes a user"""

    return delete_user(user_id=UserIdentifier(id=user_id))

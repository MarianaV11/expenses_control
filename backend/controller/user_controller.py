from fastapi import APIRouter, Depends
from schemas.user_schema import (
    UserBase,
    UserCreate,
    UserIdentifier,
    UserLogin,
    UserLoginReturn,
    UserUpdatePassword,
)
from services.user_service import (
    create_user,
    delete_user,
    get_user,
    login,
    update_user,
    update_user_password,
    update_monthly_revenue,
)
from utils.auth import require_token_valid

router = APIRouter()


@router.post("/users/create", response_model=UserLoginReturn)
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


@router.delete("/users/delete")
def delete_user_route(user_id: int, _: None = Depends(require_token_valid)):
    """Permanently deletes a user"""

    return delete_user(user_id=UserIdentifier(id=user_id))


@router.put("/users/update", response_model=UserBase)
def update_user_route(user_data: UserBase, _: None = Depends(require_token_valid)):
    """Update general user information."""

    return update_user(user_data=user_data)


@router.patch("/users/update_password")
def update_user_password_route(
    user_data: UserUpdatePassword, _: None = Depends(require_token_valid)
):
    """Update password of user"""

    return update_user_password(user_data=user_data)


@router.patch("/users/montlhy_revenue")
def update_monthly_revenue_route(
    user_id: int, new_monthly_revenue: float, _: None = Depends(require_token_valid)
):
    """Update monthly revenue of user"""

    return update_monthly_revenue(
        monthly_revenue=new_monthly_revenue, user_id=UserIdentifier(id=user_id)
    )

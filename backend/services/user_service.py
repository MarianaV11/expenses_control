from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models.user import User
from schemas.user_schema import (
    UserAuth,
    UserBase,
    UserCreate,
    UserIdentifier,
    UserLogin,
    UserLoginReturn,
    UserUpdatePassword,
    UpdatePersonalInfo,
)
from utils.auth import create_access_token
from utils.security import hash_password, verify_password
from decimal import Decimal


def get_user_or_404(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in our database.",
        )
    return user


def create_user(user_data: UserCreate, db: Session) -> UserLoginReturn:
    user = db.query(User).filter(User.email == user_data.email).first()

    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already a user created with this e-mail!",
        )

    try:
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            birthday=user_data.birthday,
            is_restricted=user_data.is_restricted,
            is_admin=user_data.is_admin,
            password=hash_password(user_data.password),
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_access_token(data={"sub": new_user.email})

        return UserLoginReturn(
            auth=UserAuth(access_token=token, token_type="bearer"), id=new_user.id
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to create a user: {e}",
        )


def login(user_data: UserLogin, db: Session) -> UserLoginReturn:
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(
        plain_password=user_data.password, hashed_password=user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong password or e-mail!",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.email})

    return UserLoginReturn(
        auth=UserAuth(access_token=token, token_type="bearer"), id=user.id
    )


def get_user(user_id: UserIdentifier, db: Session) -> UserBase:
    user = get_user_or_404(user_id.id, db)
    return UserBase.model_validate(user)


def delete_user(user_id: UserIdentifier, db: Session) -> JSONResponse:
    user = get_user_or_404(user_id.id, db)

    try:
        db.delete(user)
        db.commit()

        return JSONResponse(
            content={"message": "User deleted successfully!"},
            status_code=status.HTTP_200_OK,
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to delete an user: {e}",
        )


def update_user(user_data: UserBase, db: Session) -> UserBase:
    user = get_user_or_404(user_data.id, db)

    try:
        user.name = user_data.name
        user.email = user_data.email
        user.birthday = user_data.birthday
        user.is_restricted = user_data.is_restricted
        user.is_admin = user_data.is_admin

        db.commit()
        db.refresh(user)

        return UserBase.model_validate(user)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update an user: {e}",
        )


def update_user_password(user_data: UserUpdatePassword, db: Session) -> JSONResponse:
    user = get_user_or_404(user_data.id, db)

    if not verify_password(
        plain_password=user_data.old_password, hashed_password=user.password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The old password is wrong.",
        )

    try:
        user.password = hash_password(user_data.new_password)

        db.commit()
        db.refresh(user)

        return JSONResponse(
            content={"message": "Password updated successfully!"},
            status_code=status.HTTP_200_OK,
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update an user password: {e}",
        )


def update_monthly_revenue(
    user_id: UserIdentifier, monthly_revenue: Decimal, db: Session
) -> JSONResponse:
    user = get_user_or_404(user_id.id, db)

    try:
        user.monthly_revenue = monthly_revenue

        db.commit()
        db.refresh(user)

        return JSONResponse(
            content={"message": "Monthly revenue updated successfully!"},
            status_code=status.HTTP_200_OK,
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update an user data: {e}",
        )


def update_user_info(user_data: UpdatePersonalInfo, db: Session) -> JSONResponse:
    user = get_user_or_404(user_data.id, db)

    try:
        user.name = user_data.name
        user.email = user_data.email
        user.birthday = user_data.birthday

        db.commit()
        db.refresh(user)

        return JSONResponse(
            content={"message": "User personal information updated succesfully!"},
            status_code=status.HTTP_200_OK,
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update an user data: {e}",
        )

from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.user import User
from schemas.user_schema import (
    UserAuth,
    UserBase,
    UserCreate,
    UserIdentifier,
    UserLogin,
    UserLoginReturn,
    UserUpdatePassword,
)
from utils.auth import create_access_token
from utils.security import hash_password, verify_password


def create_user(user_data: UserCreate) -> UserLoginReturn | JSONResponse:
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == user_data.email).first()

        if user:
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={"message": "Already a user created with this e-mail!"},
            )

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
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to create a user: {e}",
        )
    finally:
        db.close()


def login(user_data: UserLogin) -> UserLoginReturn | JSONResponse:
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.email == user_data.email).first()

        if not user or not verify_password(
            plain_password=user_data.password, hashed_password=user.password
        ):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": "Wrong password or e-mail!"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = create_access_token(data={"sub": user.email})

        return UserLoginReturn(
            auth=UserAuth(access_token=token, token_type="bearer"), id=user.id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to auth: {e}",
        )
    finally:
        db.close()


def get_user(user_id: UserIdentifier) -> UserBase | JSONResponse:
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id.id).first()

        if not user:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Current user not found in our database."},
            )

        return UserBase.model_validate(user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to get an user: {e}",
        )
    finally:
        db.close()


def delete_user(user_id: UserIdentifier) -> JSONResponse:
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id.id).first()

        if not user:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "User not found in our database."},
            )

        db.delete(user)
        db.commit()

        return JSONResponse(
            content={"message": "User deleted successfully!"},
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to delete an user: {e}",
        )
    finally:
        db.close()


def update_user(user_data: UserBase) -> UserBase | JSONResponse:
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_data.id).first()

        if not user:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Current user not found in our database."},
            )

        user.name = user_data.name
        user.email = user_data.email
        user.birthday = user_data.birthday
        user.is_restricted = user_data.is_restricted
        user.is_admin = user_data.is_admin

        db.commit()
        db.refresh(user)

        return user
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update an user: {e}",
        )
    finally:
        db.close()


def update_user_password(user_data: UserUpdatePassword) -> JSONResponse:
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_data.id).first()

        if not user:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Current user not found in our database."},
            )
        if not verify_password(
            plain_password=user_data.old_password, hashed_password=user.password
        ):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"message": "The old password is wrong."},
            )

        user.password = hash_password(user_data.new_password)

        db.commit()
        db.refresh(user)

        return JSONResponse(
            content={"message": "Password updated successfully!"},
            status_code=status.HTTP_200_OK,
        )
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update an user password: {e}",
        )
    finally:
        db.close()

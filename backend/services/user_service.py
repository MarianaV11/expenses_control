from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.user import User
from schemas.user_schema import UserCreate, UserLogin, UserLoginReturn
from utils.auth import create_access_token
from utils.security import hash_password, verify_password


def create_user(user_data: UserCreate) -> JSONResponse:
    db = SessionLocal()

    user = db.query(User).filter(User.email == user_data.email).first()
    print(user)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already a user created with this e-mail!",
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

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "User created with success!", "id": new_user.id}
    )


def login(user_data: UserLogin) -> UserLoginReturn:
    db = SessionLocal()

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
        id=user.id,
        access_token=token,
        token_type="bearer",
    )

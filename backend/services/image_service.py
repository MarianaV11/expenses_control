from io import BytesIO

from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse
from models.image import Image
from models.user import User
from schemas.image_schema import ImageCreate, ImageRead


def attach_profile(image_data: ImageCreate) -> ImageRead:
    db = SessionLocal()

    user_id = db.query(User).filter(User.id == image_data.user_id).first()

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User id of {image_data.user_id} not found in database.",
        )

    existing_profile_image = (
        db.query(Image)
        .filter(Image.user_id == image_data.user_id, Image.is_profile)
        .first()
    )

    if existing_profile_image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile image already exists for this user.",
        )

    new_image = Image(
        name=image_data.name,
        mime_type=image_data.mime_type,
        data=image_data.data,
        user_id=image_data.user_id,
        is_profile=True,
    )

    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return new_image


def get_profile(user_id: int) -> StreamingResponse:
    db = SessionLocal()

    image = db.query(Image).filter(Image.user_id == user_id, Image.is_profile).first()

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User image not found."
        )

    return StreamingResponse(
        media_type=image.mime_type,
        content=BytesIO(image.data),
        headers={"Content-Disposition": f"inline; filename={image.name}"},
    )


def update_profile(user_id: int, image_data: ImageCreate) -> JSONResponse:
    db = SessionLocal()

    image = db.query(Image).filter(Image.user_id == user_id).first()

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User image not found."
        )

    image.name = image_data.name
    image.mime_type = image_data.mime_type
    image.data = image_data.data

    db.commit()
    db.refresh(image)

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "The profile picture was update with success!",
            "id": image.id,
        },
    )

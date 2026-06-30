from io import BytesIO

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse
from models.image import Image
from models.user import User
from schemas.image_schema import ImageCreate, ImageRead
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


def get_profile_or_404(user_id: int, db: Session) -> Image:
    image = db.query(Image).filter(Image.user_id == user_id, Image.is_profile).first()
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile image not found in our database.",
        )
    return image


def attach_profile(image_data: ImageCreate, db: Session) -> ImageRead:
    user = db.query(User).filter(User.id == image_data.user_id).first()

    if not user:
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

    try:
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
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to create an image: {e}",
        )


def get_profile(user_id: int, db: Session) -> StreamingResponse:
    image = get_profile_or_404(user_id, db)

    return StreamingResponse(
        media_type=image.mime_type,
        content=BytesIO(image.data),
        headers={"Content-Disposition": f"inline; filename={image.name}"},
    )


def update_profile(user_id: int, image_data: ImageCreate, db: Session) -> JSONResponse:
    image = get_profile_or_404(user_id, db)

    try:
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
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to update an image: {e}",
        )


def delete_profile(user_id: int, db: Session) -> JSONResponse:
    image = get_profile_or_404(user_id, db)

    try:
        db.delete(image)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Image deleted succesfully!"},
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to delete an image: {e}",
        )

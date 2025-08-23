from io import BytesIO

from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse
from models.image import Image
from models.user import User
from schemas.image_schema import ImageCreate, ImageRead


def attach_profile(image_data: ImageCreate) -> ImageRead | JSONResponse:
    db = SessionLocal()

    try:
        user_id = db.query(User).filter(User.id == image_data.user_id).first()

        if not user_id:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": f"User id of {image_data.user_id} not found in database."
                },
            )

        existing_profile_image = (
            db.query(Image)
            .filter(Image.user_id == image_data.user_id, Image.is_profile)
            .first()
        )

        if existing_profile_image:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "Profile image already exists for this user."},
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
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to create an image: {e}",
        )
    finally:
        db.close()


def get_profile(user_id: int) -> StreamingResponse | JSONResponse:
    db = SessionLocal()

    try:
        image = (
            db.query(Image).filter(Image.user_id == user_id, Image.is_profile).first()
        )

        if not image:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "User image not found."},
            )

        return StreamingResponse(
            media_type=image.mime_type,
            content=BytesIO(image.data),
            headers={"Content-Disposition": f"inline; filename={image.name}"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to get an image: {e}",
        )
    finally:
        db.close()


def update_profile(user_id: int, image_data: ImageCreate) -> JSONResponse:
    db = SessionLocal()

    try:
        image = (
            db.query(Image).filter(Image.user_id == user_id, Image.is_profile).first()
        )

        if not image:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "User image not found."},
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
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to update an image: {e}",
        )
    finally:
        db.close()


def delete_profile(user_id: int) -> JSONResponse:
    db = SessionLocal()

    try:
        image = (
            db.query(Image).filter(Image.user_id == user_id, Image.is_profile).first()
        )

        if not image:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": "Image of profile not founded in our database.",
                },
            )

        db.delete(image)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Image deleted succesfully!"},
        )
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to delete an image: {e}",
        )
    finally:
        db.close()

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import Session
from schemas.image_schema import ImageCreate, ImageRead
from services.image_service import (
    attach_profile,
    delete_profile,
    get_profile,
    update_profile,
)
from utils.auth import require_token_valid
from database import get_db

router = APIRouter(
    prefix="/api/images", tags=["Images"], dependencies=[Depends(require_token_valid)]
)

ALLOWED_EXTENSIONS = ("jpg", "jpeg", "png", "gif")
ALLOWED_MIME_TYPES = ("image/jpeg", "image/png", "image/gif")


def validate_image(file: UploadFile) -> None:
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload an image in one of the following formats: JPG, JPEG, PNG, or GIF.",
        )

    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect extension of image, the allowed extensions are: JPG, JPEG, PNG, or GIF.",
        )


@router.post("/profile/create/{user_id}", response_model=ImageRead)
async def attach_profile_route(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Attach a profile image to the user, if the user doesn't have one."""

    validate_image(file)

    image_schema = ImageCreate(
        name=file.filename,
        mime_type=file.content_type,
        user_id=user_id,
        data=await file.read(),
    )

    return attach_profile(image_data=image_schema, db=db)


@router.get("/{user_id}/profile")
def get_profile_route(user_id: int, db: Session = Depends(get_db)) -> StreamingResponse:
    """Get the profile image of the user."""

    return get_profile(user_id=user_id, db=db)


@router.put("/profile/update/{user_id}")
async def update_profile_route(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> JSONResponse:
    """Update the user profile picture."""

    validate_image(file)

    image_schema = ImageCreate(
        name=file.filename,
        mime_type=file.content_type,
        user_id=user_id,
        data=await file.read(),
    )

    return update_profile(user_id=user_id, image_data=image_schema, db=db)


@router.delete("/profile/delete")
def delete_profile_route(user_id: int, db: Session = Depends(get_db)) -> JSONResponse:
    """Delete the profile picture of the user."""

    return delete_profile(user_id=user_id, db=db)

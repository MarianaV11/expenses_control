from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse, StreamingResponse
from schemas.image_schema import ImageCreate, ImageRead
from services.image_service import attach_profile, get_profile, update_profile
from utils.auth import require_token_valid

router = APIRouter()


ALLOWED_EXTENSIONS = ("jpg", "jpeg", "png", "gif")
ALLOWED_MIME_TYPES = ("image/jpeg", "image/png", "image/gif")


@router.post("/images/profile/create", response_model=ImageRead)
async def attach_profile_route(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    _: None = Depends(require_token_valid),
):
    """
    This route is responsible to attach a profile image to user, if the user don't has one.
    """

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload an image in one of the following formats: JPG, JPEG, PNG, or GIF.",
        )

    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inccorrent extension of image, the allowed extensions is: JPG, JPEG, PNG, or GIF",
        )

    file_data = await file.read()

    image_schema = ImageCreate(
        name=file.filename, mime_type=file.content_type, user_id=user_id, data=file_data
    )

    return attach_profile(image_data=image_schema)


@router.get("/images/{user_id}/profile")
def get_profile_route(
    user_id: int, _: None = Depends(require_token_valid)
) -> StreamingResponse:
    """Get of the profile image of the user"""

    return get_profile(user_id=user_id)


@router.put("/images/profile/update")
async def update_profile_route(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    _: None = Depends(require_token_valid),
) -> JSONResponse:
    """Update of the user profile picture."""

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload an image in one of the following formats: JPG, JPEG, PNG, or GIF.",
        )

    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inccorrent extension of image, the allowed extensions is: JPG, JPEG, PNG, or GIF",
        )

    file_data = await file.read()

    image_schema = ImageCreate(
        name=file.filename, mime_type=file.content_type, user_id=user_id, data=file_data
    )

    return update_profile(user_id=user_id, image_data=image_schema)

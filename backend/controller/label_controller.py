from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.label_schema import (
    LabelBase,
    LabelCreate,
    LabelRead,
    LabelUpdate,
    LabelUserList,
)
from services.label_service import (
    create_label,
    delete_label,
    get_label,
    get_labels,
    update_label,
)
from utils.auth import require_token_valid
from database import get_db

router = APIRouter(
    prefix="/api/labels", tags=["Labels"], dependencies=[Depends(require_token_valid)]
)


@router.post("/create", response_model=LabelRead)
def create_label_route(label: LabelCreate, db: Session = Depends(get_db)):
    """Create a new label for a user."""

    return create_label(label=label, db=db)


@router.get("/user_label", response_model=LabelRead)
def get_label_route(label_id: int, db: Session = Depends(get_db)):
    """Get a specific label by label id."""

    return get_label(label_id=LabelBase(id=label_id), db=db)


@router.get("/user_labels", response_model=LabelUserList)
def get_labels_route(
    user_id: int, page: int, per_page: int, db: Session = Depends(get_db)
):
    """Get a label list of a user."""

    return get_labels(user_id=user_id, page=page, per_page=per_page, db=db)


@router.put("/update_label", response_model=LabelRead)
def update_label_route(label_data: LabelUpdate, db: Session = Depends(get_db)):
    """Update a label by label id."""

    return update_label(label_data=label_data, db=db)


@router.delete("/delete_label")
def delete_label_route(label_id: LabelBase, db: Session = Depends(get_db)):
    """Delete a label by label id."""

    return delete_label(label_id=label_id, db=db)

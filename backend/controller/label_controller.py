from fastapi import APIRouter, Depends
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

router = APIRouter()


@router.post("/labels/create", response_model=LabelRead)
def create_label_route(label: LabelCreate, _: None = Depends(require_token_valid)):
    """Create a new label for a user"""

    return create_label(label=label)


@router.get("/labels/user_label", response_model=LabelRead)
def get_label_route(label_id: int, _: None = Depends(require_token_valid)):
    """Get a specific label by label id"""

    return get_label(label_id=LabelBase(id=label_id))


@router.get("/labels/user_labels", response_model=LabelUserList)
def get_labels_route(
    user_id: int, page: int, per_page: int, _: None = Depends(require_token_valid)
):
    """Get a label list of a user"""

    return get_labels(user_id=user_id, page=page, per_page=per_page)


@router.put("/labels/update_label", response_model=LabelRead)
def update_label_route(label_data: LabelUpdate, _: None = Depends(require_token_valid)):
    """Update a label by label id"""

    return update_label(label_data=label_data)


@router.delete("/labels/delete_label")
def delete_label_route(label_id: LabelBase, _: None = Depends(require_token_valid)):
    """Delete a label by label it"""

    return delete_label(label_id=label_id)

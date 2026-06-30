from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models.label import Label
from schemas.label_schema import (
    LabelBase,
    LabelCreate,
    LabelRead,
    LabelUpdate,
    LabelUserList,
)


def get_label_or_404(label_id: int, db: Session) -> Label:
    label = db.query(Label).filter(Label.id == label_id).first()
    if not label:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Label of id {label_id} not found in database.",
        )
    return label


def create_label(label: LabelCreate, db: Session) -> LabelRead:
    try:
        new_label = Label(**label.model_dump())

        db.add(new_label)
        db.commit()
        db.refresh(new_label)

        return new_label
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to create a label: {e}",
        )


def get_label(label_id: LabelBase, db: Session) -> LabelRead:
    return get_label_or_404(label_id.id, db)


def get_labels(user_id: int, page: int, per_page: int, db: Session) -> LabelUserList:
    total_labels = db.query(Label).filter(Label.user_id == user_id).count()
    total_page = max((total_labels + per_page - 1) // per_page, 1)

    if page < 1:
        page = 1

    if page > total_page:
        return LabelUserList(
            page=page,
            total_page=total_page,
            total_labels=total_labels,
            labels=[],
        )

    skip = (page - 1) * per_page

    try:
        labels = (
            db.query(Label)
            .filter(Label.user_id == user_id)
            .offset(skip)
            .limit(per_page)
            .all()
        )

        return LabelUserList(
            page=page,
            total_page=total_page,
            total_labels=total_labels,
            labels=[LabelRead.model_validate(label) for label in labels],
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to get the labels: {e}",
        )


def update_label(label_data: LabelUpdate, db: Session) -> LabelRead:
    label = get_label_or_404(label_data.id, db)

    try:
        label.name = label_data.name
        label.color = label_data.color

        db.commit()
        db.refresh(label)

        return LabelRead.model_validate(label)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update a label: {e}",
        )


def delete_label(label_id: LabelBase, db: Session) -> JSONResponse:
    label = get_label_or_404(label_id.id, db)

    try:
        db.delete(label)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Label deleted succesfully."},
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to delete a label: {e}",
        )

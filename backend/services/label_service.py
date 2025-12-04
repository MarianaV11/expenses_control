from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.label import Label
from schemas.label_schema import (
    LabelBase,
    LabelCreate,
    LabelRead,
    LabelUpdate,
    LabelUserList,
)


def create_label(label: LabelCreate) -> LabelRead:
    db = SessionLocal()

    try:
        new_label = Label(**label.model_dump())

        db.add(new_label)
        db.commit()
        db.refresh(new_label)

        return new_label
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to create a label: {e}",
        )
    finally:
        db.close()


def get_label(label_id: LabelBase) -> LabelRead:
    db = SessionLocal()

    try:
        label = db.query(Label).filter(Label.id == label_id.id).first()

        if not label:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": f"Not founded the label of id {label_id}."},
            )

        return label
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to get a label: {e}",
        )
    finally:
        db.close()


def get_labels(user_id: int, page: int, per_page: int) -> LabelUserList:
    db = SessionLocal()

    try:
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

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to get the labels: {e}",
        )

    finally:
        db.close()


def update_label(label_data: LabelUpdate) -> LabelRead:
    db = SessionLocal()

    try:
        label = db.query(Label).filter(Label.id == label_data.id).first()

        if not label:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": f"Not founded the label of id {label_data.id} in database."
                },
            )

        label.name = label_data.name
        label.color = label_data.color

        db.commit()
        db.refresh(label)

        return label
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to update a label: {e}",
        )
    finally:
        db.close()


def delete_label(label_id: LabelBase) -> JSONResponse:
    db = SessionLocal()

    try:
        label = db.query(Label).filter(Label.id == label_id.id).first()

        db.delete(label)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Label deleted succesfully."},
        )
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {e}",
        )
    finally:
        db.close()

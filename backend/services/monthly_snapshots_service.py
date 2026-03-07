from datetime import date

from database import SessionLocal
from fastapi import HTTPException, status
from models.expense import Expense
from models.monthly_snapshots import MonthlySnapshot
from models.user import User
from schemas.monthly_snapshots_schema import (
    MonthlySnapshotRead,
    MonthlySnapshotsList,
)
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


def calculate_month_metrics(
    db: Session, user_id: int, start: date, end: date
) -> dict | None:
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == user_id)
        .filter(Expense.day >= start)
        .filter(Expense.day <= end)
        .all()
    )

    if not expenses:
        return None

    total_spent = sum(float(expense.value) for expense in expenses)

    total_by_label = {}
    for expense in expenses:
        label = expense.label_name or "No label"

        total_by_label[label] = total_by_label.get(label, 0) + float(expense.value)

    percentage_by_label = {}
    for expense in expenses:
        label = expense.label_name or "No label"
        percentage_by_label[label] = (
            (total_by_label[label] / total_spent * 100) if total_spent > 0 else 0
        )

    total_by_payment_type = {}
    for expense in expenses:
        payment_type = expense.payment_type
        total_by_payment_type[payment_type] = total_by_payment_type.get(
            payment_type, 0
        ) + float(expense.value)

    total_by_card = {}
    for expense in expenses:
        card = expense.card
        total_by_card[card] = total_by_card.get(card, 0) + float(expense.value)

    started_at, ended_at = (
        db.query(func.min(Expense.day), func.max(Expense.day))
        .filter(Expense.user_id == user_id)
        .filter(Expense.day >= start)
        .filter(Expense.day <= end)
        .first()
    )

    return {
        "total_spent": total_spent,
        "total_by_label": total_by_label,
        "percentage_by_label": percentage_by_label,
        "total_by_payment_type": total_by_payment_type,
        "total_by_card": total_by_card,
        "started_at": started_at,
        "ended_at": ended_at,
    }


def create_monthly_snapshot(start: date, end: date) -> None:
    db = SessionLocal()
    year_month = f"{start.year}-{start.month:02d}"

    try:
        users = db.query(User).all()

        for user in users:
            already_exists = (
                db.query(MonthlySnapshot)
                .filter(
                    MonthlySnapshot.user_id == user.id,
                    MonthlySnapshot.year_month == year_month,
                )
                .first()
            )
            if already_exists:
                continue

            metrics = calculate_month_metrics(db, user.id, start, end)

            if not metrics:
                continue

            snapshot = MonthlySnapshot(
                user_id=user.id,
                current_revenue=user.monthly_revenue,
                year_month=year_month,
                total_spent=metrics["total_spent"],
                total_by_label=metrics["total_by_label"],
                percentage_by_label=metrics["percentage_by_label"],
                total_by_payment_type=metrics["total_by_payment_type"],
                total_by_card=metrics["total_by_card"],
                started_at=metrics["started_at"],
                ended_at=metrics["ended_at"],
            )
            db.add(snapshot)
            db.commit()
            db.refresh(snapshot)

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def get_monthly_snapshots(
    user_id: int, page: int, per_page: int
) -> MonthlySnapshotsList:
    db = SessionLocal()

    try:
        total_snapshots = (
            db.query(MonthlySnapshot).filter(MonthlySnapshot.user_id == user_id).count()
        )
        total_page = max((total_snapshots + per_page - 1) // per_page, 1)

        if page < 1:
            page = 1

        if page > total_page:
            return MonthlySnapshotsList(
                page=page,
                total_page=total_page,
                total_snapshots=total_snapshots,
                snapshots=[],
            )

        skip = (page - 1) * per_page

        snapshots = (
            db.query(MonthlySnapshot)
            .filter(MonthlySnapshot.user_id == user_id)
            .order_by(MonthlySnapshot.year_month.desc())
            .offset(skip)
            .limit(per_page)
            .all()
        )

        return MonthlySnapshotsList(
            page=page,
            total_page=total_page,
            total_snapshots=total_snapshots,
            snapshots=[
                MonthlySnapshotRead.model_validate(snapshot) for snapshot in snapshots
            ],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to get monthly snapshots: {e}",
        )
    finally:
        db.close()


def get_monthly_snapshots_by_id(snapshot_Id: int, user_id: int) -> MonthlySnapshotRead:
    db = SessionLocal()

    try:
        snapshot = (
            db.query(MonthlySnapshot)
            .filter(MonthlySnapshot.id == snapshot_Id)
            .filter(MonthlySnapshot.user_id == user_id)
            .first()
        )

        if not snapshot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Monthly snapshot not found",
            )

        return MonthlySnapshotRead.model_validate(snapshot)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to get monthly snapshot by id: {e}",
        )
    finally:
        db.close()

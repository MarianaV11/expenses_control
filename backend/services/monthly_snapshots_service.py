import calendar
from datetime import date

from fastapi import HTTPException, status
from models.expense import Expense
from models.user import User
from schemas.monthly_snapshots_schema import (
    MonthlySnapshotRead,
    MonthlySnapshotsList,
)
from sqlalchemy.exc import SQLAlchemyError
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


def get_monthly_snapshots(
    user_id: int, page: int, per_page: int, db: Session
) -> MonthlySnapshotsList:
    year = func.extract("year", Expense.day)
    month = func.extract("month", Expense.day)
    try:
        months = (
            db.query(year, month)
            .filter(Expense.user_id == user_id)
            .group_by(year, month)
            .order_by(year.desc(), month.desc())
            .all()
        )
        user = db.get(User, user_id)

        total_snapshots = len(months)
        total_page = max((total_snapshots + per_page - 1) // per_page, 1)
        skip = (page - 1) * per_page

        snapshots = []
        for y, m in months[skip : skip + per_page]:
            y, m = int(y), int(m)
            start = date(y, m, 1)
            end = date(y, m, calendar.monthrange(y, m)[1])
            snapshots.append(
                MonthlySnapshotRead(
                    year_month=f"{y}-{m:02d}",
                    current_revenue=float(user.monthly_revenue or 0),
                    user_id=user_id,
                    **calculate_month_metrics(db, user_id, start, end),
                )
            )

        return MonthlySnapshotsList(
            page=page,
            total_page=total_page,
            total_snapshots=total_snapshots,
            snapshots=snapshots,
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occured when trying to get monthly snapshots: {e}",
        )

from datetime import date, datetime
from decimal import Decimal

from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.expense import Expense
from models.user import User
from schemas.expense_schema import (
    ExpenseCreate,
    ExpenseRead,
    ExpensesList,
    ExpensesStatus,
    ExpenseUpdate,
)
from sqlalchemy import asc, desc
from sqlalchemy.sql import extract, func


def create_expense(expense: ExpenseCreate) -> ExpenseRead:
    db = SessionLocal()

    try:
        new_expense = Expense(
            name=expense.name,
            day=expense.day,
            value=expense.value,
            card=expense.card,
            payment_type=expense.payment_type,
            user_id=expense.user_id,
            label_id=expense.label_id,
        )

        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)

        return ExpenseRead.model_validate(new_expense)
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to create an expense: {e}.",
        )
    finally:
        db.close()


def get_expenses(
    user_id: int,
    page: int,
    per_page: int,
    sort_by: str,
    order: str,
    label_id: int | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    card_name: str | None = None,
    payment_type: str | None = None,
) -> ExpensesList | JSONResponse:
    db = SessionLocal()

    try:
        query = db.query(Expense).filter(Expense.user_id == user_id)

        if label_id:
            query = query.filter(Expense.label_id == label_id)

        if start_date:
            query = query.filter(Expense.day >= start_date)
        if end_date:
            query = query.filter(Expense.day <= end_date)

        if card_name:
            query = query.filter(Expense.card == card_name)

        if payment_type:
            query = query.filter(Expense.payment_type == payment_type)

        sortable_fields = {
            "name": Expense.name,
            "value": Expense.value,
            "day": Expense.day,
            "card": Expense.card,
            "payment_type": Expense.payment_type,
            "created_at": Expense.created_at,
            "label": Expense.label_id,
        }

        sort_column = sortable_fields.get(sort_by, Expense.day)

        if order == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))

        total_expenses = query.count()
        total_page = (total_expenses + per_page - 1) // per_page

        if page > total_page and total_page != 0:
            return JSONResponse(
                status_code=status.HTTP_204_NO_CONTENT,
                content={"message": "No items on this page."},
            )

        skip = (page - 1) * per_page
        expenses = query.offset(skip).limit(per_page).all()

        return ExpensesList(
            page=page,
            total_page=total_page,
            total_expenses=total_expenses,
            expenses=[ExpenseRead.model_validate(expense) for expense in expenses],
        )

    finally:
        db.close()


def get_expense(expense_id: int) -> ExpenseRead | JSONResponse:
    db = SessionLocal()

    try:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()

        if not expense:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": f"Not founded the expense of id {expense_id} in database."
                },
            )

        return ExpenseRead.model_validate(expense)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to get an expense: {e}.",
        )
    finally:
        db.close()


def delete_expenses(expense_ids: list[int]) -> JSONResponse:
    db = SessionLocal()

    try:
        expenses_to_delete = db.query(Expense).filter(Expense.id.in_(expense_ids)).all()

        for expense in expenses_to_delete:
            db.delete(expense)

        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Expenses deleted succesfully!"},
        )
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to delete a list of expenses: {e}.",
        )
    finally:
        db.close()


def delete_expense(expense_id: int) -> JSONResponse:
    db = SessionLocal()

    try:
        expense = db.query(Expense).filter(Expense.id == expense_id).first()

        db.delete(expense)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Expense deleted succesfully."},
        )
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to delete an expense: {e}.",
        )
    finally:
        db.close()


def update_expense(expense_data: ExpenseUpdate) -> ExpenseRead | JSONResponse:
    db = SessionLocal()

    try:
        expense = db.query(Expense).filter(Expense.id == expense_data.id).first()

        if not expense:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "message": f"Not founded the expense of id {expense_data.id} in database."
                },
            )

        expense.name = expense_data.name
        expense.value = expense_data.value
        expense.day = expense_data.day
        expense.card = expense_data.card
        expense.payment_type = expense_data.payment_type
        expense.label_id = expense_data.label_id

        db.commit()
        db.refresh(expense)

        return ExpenseRead.model_validate(expense)
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to update an expense: {e}.",
        )
    finally:
        db.close()


def get_monthly_status(user_id: int) -> ExpensesStatus:
    db = SessionLocal()

    try:
        now = datetime.now()
        current_month = now.month
        current_year = now.year

        expense_total = db.query(func.sum(Expense.value)).filter(
            Expense.user_id == user_id
        ).filter(extract("month", Expense.day) == current_month).filter(
            extract("year", Expense.day) == current_year
        ).scalar() or Decimal("0.00")

        user_current_revenue = db.query(User.monthly_revenue).filter(
            User.id == user_id
        ).scalar() or Decimal("0.00")

        balance = user_current_revenue - expense_total

        return ExpensesStatus(
            monthly_revenue=user_current_revenue,
            remaining_value=balance,
            total_expenses=expense_total,
        )
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to get sum of monthly expenses: {e}.",
        )
    finally:
        db.close()

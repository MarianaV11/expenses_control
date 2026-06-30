from datetime import datetime
from decimal import Decimal

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import asc, desc
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.sql import extract, func
from models.expense import Expense
from models.user import User
from schemas.expense_schema import (
    ExpenseCreate,
    ExpenseRead,
    ExpensesList,
    ExpensesStatus,
    ExpenseUpdate,
    ExpenseFilter,
)


def get_expense_or_404(expense_id: int, db: Session) -> Expense:
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense of id {expense_id} not found in database.",
        )
    return expense


def create_expense(expense: ExpenseCreate, db: Session) -> ExpenseRead:
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
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to create an expense: {e}.",
        )


def get_expenses(
    page: int, per_page: int, filters: ExpenseFilter, db: Session
) -> ExpensesList:
    query = db.query(Expense).filter(Expense.user_id == filters.user_id)

    if filters.label_id:
        query = query.filter(Expense.label_id == filters.label_id)
    if filters.start_date:
        query = query.filter(Expense.day >= filters.start_date)
    if filters.end_date:
        query = query.filter(Expense.day <= filters.end_date)
    if filters.card_name:
        query = query.filter(Expense.card == filters.card_name)
    if filters.payment_type:
        query = query.filter(Expense.payment_type == filters.payment_type)

    sortable_fields = {
        "name": Expense.name,
        "value": Expense.value,
        "day": Expense.day,
        "card": Expense.card,
        "payment_type": Expense.payment_type,
        "created_at": Expense.created_at,
        "label": Expense.label_id,
    }

    sort_column = sortable_fields.get(filters.sort_by, Expense.day)
    query = query.order_by(
        asc(sort_column) if filters.order == "asc" else desc(sort_column)
    )

    total_expenses = query.count()
    total_page = (total_expenses + per_page - 1) // per_page

    if page > total_page and total_page != 0:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="No items on this page.",
        )

    skip = (filters.page - 1) * filters.per_page

    try:
        expenses = query.offset(skip).limit(filters.per_page).all()

        return ExpensesList(
            page=filters.page,
            total_page=total_page,
            total_expenses=total_expenses,
            expenses=[ExpenseRead.model_validate(expense) for expense in expenses],
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to get expenses: {e}.",
        )


def get_expense(expense_id: int, db: Session) -> ExpenseRead:
    expense = get_expense_or_404(expense_id, db)
    return ExpenseRead.model_validate(expense)


def delete_expenses(expense_ids: list[int], db: Session) -> JSONResponse:
    try:
        expenses_to_delete = db.query(Expense).filter(Expense.id.in_(expense_ids)).all()

        for expense in expenses_to_delete:
            db.delete(expense)

        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Expenses deleted succesfully!"},
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to delete a list of expenses: {e}.",
        )


def delete_expense(expense_id: int, db: Session) -> JSONResponse:
    expense = get_expense_or_404(expense_id, db)

    try:
        db.delete(expense)
        db.commit()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "Expense deleted succesfully."},
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to delete an expense: {e}.",
        )


def update_expense(expense_data: ExpenseUpdate, db: Session) -> ExpenseRead:
    expense = get_expense_or_404(expense_data.id, db)

    try:
        expense.name = expense_data.name
        expense.value = expense_data.value
        expense.day = expense_data.day
        expense.card = expense_data.card
        expense.payment_type = expense_data.payment_type
        expense.label_id = expense_data.label_id

        db.commit()
        db.refresh(expense)

        return ExpenseRead.model_validate(expense)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to update an expense: {e}.",
        )


def get_monthly_status(user_id: int, db: Session) -> ExpensesStatus:
    now = datetime.now()

    try:
        expense_total = db.query(func.sum(Expense.value)).filter(
            Expense.user_id == user_id
        ).filter(extract("month", Expense.day) == now.month).filter(
            extract("year", Expense.day) == now.year
        ).scalar() or Decimal("0.00")

        user_current_revenue = db.query(User.monthly_revenue).filter(
            User.id == user_id
        ).scalar() or Decimal("0.00")

        return ExpensesStatus(
            monthly_revenue=user_current_revenue,
            remaining_value=user_current_revenue - expense_total,
            total_expenses=expense_total,
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to get sum of monthly expenses: {e}.",
        )

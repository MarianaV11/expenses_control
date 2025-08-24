from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.expense import Expense
from schemas.expense_schema import (
    ExpenseCreate,
    ExpenseRead,
    ExpensesList,
    ExpenseUpdate,
)


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

        return new_expense
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to create an expense: {e}.",
        )
    finally:
        db.close()


def get_expenses(user_id: int, page: int, per_page: int) -> ExpensesList | JSONResponse:
    db = SessionLocal()

    try:
        total_expenses = db.query(Expense).filter(Expense.user_id == user_id).count()
        total_page = (total_expenses + per_page - 1) // per_page

        if page > total_page:
            return JSONResponse(
                status_code=status.HTTP_204_NO_CONTENT,
                content={
                    "message": "The page selected doens't has any item available."
                },
            )

        skip = (page - 1) * per_page

        expenses = (
            db.query(Expense)
            .filter(Expense.user_id == user_id)
            .offset(skip)
            .limit(per_page)
            .all()
        )

        return ExpensesList(
            page=page,
            total_page=total_page,
            total_expenses=total_expenses,
            expenses=[ExpenseRead.model_validate(expense) for expense in expenses],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to get expenses: {e}.",
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

        return expense
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

        return expense
    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred when trying to update an expense: {e}.",
        )
    finally:
        db.close()

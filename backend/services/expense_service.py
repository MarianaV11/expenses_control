from database import SessionLocal
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from models.expense import Expense
from schemas.expense_schema import ExpenseCreate, ExpenseRead, ExpensesList


def create_expense(expense: ExpenseCreate) -> ExpenseRead:
    db = SessionLocal()

    new_expense = Expense(
        name=expense.name,
        day=expense.day,
        value=expense.value,
        card=expense.card,
        payment_type=expense.payment_type,
        user_id=expense.user_id,
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    db.close()

    return new_expense


def get_expenses(user_id: int, page: int, per_page: int) -> ExpensesList:
    db = SessionLocal()

    total_expenses = db.query(Expense).filter(Expense.user_id == user_id).count()
    total_page = (total_expenses + per_page - 1) // per_page

    if page > total_page:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="The page selected doens't has any item available.",
        )

    skip = (page - 1) * per_page

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == user_id)
        .offset(skip)
        .limit(per_page)
        .all()
    )

    db.close()

    return ExpensesList(
        page=page,
        total_page=total_page,
        total_expenses=total_expenses,
        expenses=[ExpenseRead.model_validate(e) for e in expenses],
    )


def get_expense(expense_id: int) -> ExpenseRead:
    db = SessionLocal()

    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Not founded the expense of id {expense_id} in database.",
        )

    db.close()

    return expense


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

        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "message": f"Error deleting expenses, the operation was reversed: {e}"
            },
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
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": f"An error occurred: {e}"},
        )
    finally:
        db.close()


def update_expense(expense_id: int, expense_data: ExpenseCreate) -> JSONResponse:
    db = SessionLocal()

    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Not founded the expense of id {expense_id} in database.",
        )

    expense.name = expense_data.name
    expense.value = expense_data.value
    expense.day = expense_data.day
    expense.card = expense_data.card
    expense.payment_type = expense_data.payment_type

    db.commit()
    db.refresh(expense)

    db.close()

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": f"The expense {expense_id} was successfully updated."},
    )

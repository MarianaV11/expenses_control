from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from schemas.expense_schema import (
    ExpenseCreate,
    ExpenseFilter,
    ExpenseRead,
    ExpensesList,
    ExpensesStatus,
    ExpenseUpdate,
)
from services.expense_service import (
    create_expense,
    delete_expense,
    delete_expenses,
    get_expense,
    get_expenses,
    get_monthly_status,
    update_expense,
)
from utils.auth import require_token_valid
from database import get_db

router = APIRouter(
    prefix="/api/expenses",
    tags=["Expenses"],
    dependencies=[Depends(require_token_valid)],
)


@router.post("/create", response_model=ExpenseRead)
def create_expense_route(expense: ExpenseCreate, db: Session = Depends(get_db)):
    """Create a new expense for a user."""

    return create_expense(expense=expense, db=db)


@router.get("/user_expenses", response_model=ExpensesList)
def get_expenses_route(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    filters: ExpenseFilter = Depends(),
    db: Session = Depends(get_db),
):
    """Get all the expenses of a specific user."""

    return get_expenses(
        page=page,
        per_page=per_page,
        filters=filters,
        db=db,
    )


@router.get("/user_expense", response_model=ExpenseRead)
def get_expense_route(expense_id: int, db: Session = Depends(get_db)):
    """Get an expense by its id."""

    return get_expense(expense_id=expense_id, db=db)


@router.delete("/delete_expenses")
def delete_expenses_route(
    expense_ids: list[int], db: Session = Depends(get_db)
) -> JSONResponse:
    """Receive a list of expense IDs and delete all of them."""

    return delete_expenses(expense_ids=expense_ids, db=db)


@router.delete("/delete_expense")
def delete_expense_route(
    expense_id: int, db: Session = Depends(get_db)
) -> JSONResponse:
    """Receive an expense id and delete it."""

    return delete_expense(expense_id=expense_id, db=db)


@router.put("/update_expense", response_model=ExpenseRead)
def update_expense_route(expense_data: ExpenseUpdate, db: Session = Depends(get_db)):
    """Update an expense by its id."""

    return update_expense(expense_data=expense_data, db=db)


@router.get("/monthly_status", response_model=ExpensesStatus)
def get_monthly_status_route(user_id: int, db: Session = Depends(get_db)):
    """Get the monthly status."""

    return get_monthly_status(user_id=user_id, db=db)

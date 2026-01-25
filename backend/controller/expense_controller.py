from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from schemas.expense_schema import (
    ExpenseCreate,
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

router = APIRouter(
    prefix="/api/expenses",
    tags=["Expenses"],
    dependencies=[Depends(require_token_valid)],
)


@router.post("/create", response_model=ExpenseRead)
def create_expense_route(expense: ExpenseCreate):
    """
    Create a new expense for a user.
    """

    return create_expense(expense=expense)


@router.get("/user_expenses", response_model=ExpensesList)
def get_expenses_route(
    user_id: int, page: int = Query(1, ge=1), per_page: int = Query(10, ge=1, le=100)
):
    """
    Get all the expenses of a specific user.
    """

    return get_expenses(user_id=user_id, page=page, per_page=per_page)


@router.get("/user_expense", response_model=ExpenseRead)
def get_expense_route(
    expense_id: int,
):
    """
    Get returned an expense by it's id
    """

    return get_expense(expense_id=expense_id)


@router.delete("/delete_expenses")
def delete_expenses_route(expense_ids: list[int]) -> JSONResponse:
    """
    Receive a list of expense IDs and repeat for all of them, deleting them
    """

    return delete_expenses(expense_ids=expense_ids)


@router.delete("/delete_expense")
def delete_expense_route(expense_id: int) -> JSONResponse:
    """
    Receive an expense id and delete it.
    """

    return delete_expense(expense_id=expense_id)


@router.put("/update_expense", response_model=ExpenseRead)
def update_expense_route(expense_data: ExpenseUpdate):
    """
    Update an expense by its id.
    """

    return update_expense(expense_data=expense_data)


@router.get("/monthly_status", response_model=ExpensesStatus)
def get_monthly_status_route(user_id: int):
    """
    Get the monthly status.
    """

    return get_monthly_status(user_id=user_id)

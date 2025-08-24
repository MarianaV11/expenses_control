from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from schemas.expense_schema import (
    ExpenseCreate,
    ExpenseRead,
    ExpensesList,
    ExpenseUpdate,
)
from services.expense_service import (
    create_expense,
    delete_expense,
    delete_expenses,
    get_expense,
    get_expenses,
    update_expense,
)
from utils.auth import require_token_valid

router = APIRouter()


@router.post("/expenses/create", response_model=ExpenseRead)
def create_expense_route(
    expense: ExpenseCreate, _: None = Depends(require_token_valid)
):
    """
    Create a new expense for a user.
    """

    return create_expense(expense=expense)


@router.get("/expenses/user_expenses", response_model=ExpensesList)
def get_expenses_route(
    user_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    _: None = Depends(require_token_valid),
):
    """
    Get all the expenses of a specific user.
    """

    return get_expenses(user_id=user_id, page=page, per_page=per_page)


@router.get("/expenses/user_expense", response_model=ExpenseRead)
def get_expense_route(expense_id: int, _: None = Depends(require_token_valid)):
    """
    Get returned an expense by it's id
    """

    return get_expense(expense_id=expense_id)


@router.delete("/expenses/delete_expenses")
def delete_expenses_route(
    expense_ids: list[int], _: None = Depends(require_token_valid)
) -> JSONResponse:
    """
    Receive a list of expense IDs and repeat for all of them, deleting them
    """

    return delete_expenses(expense_ids=expense_ids)


@router.delete("/expenses/delete_expense")
def delete_expense_route(
    expense_id: int, _: None = Depends(require_token_valid)
) -> JSONResponse:
    """
    Receive an expense id and delete it.
    """

    return delete_expense(expense_id=expense_id)


@router.put("/expenses/update_expense", response_model=ExpenseRead)
def update_expense_route(
    expense_data: ExpenseUpdate, _: None = Depends(require_token_valid)
):
    """
    Update an expense by its id.
    """

    return update_expense(expense_data=expense_data)

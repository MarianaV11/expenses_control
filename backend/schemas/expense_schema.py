from datetime import date, datetime

from pydantic import BaseModel


class ExpenseBase(BaseModel):
    name: str
    value: float
    day: date
    card: str
    payment_type: str


class ExpenseCreate(ExpenseBase):
    user_id: int


class ExpenseRead(ExpenseBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ExpensesList(BaseModel):
    page: int
    total_page: int
    total_expenses: int
    expenses: list[ExpenseRead]

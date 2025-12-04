from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class ExpenseBase(BaseModel):
    name: str
    value: float
    day: date
    card: str
    payment_type: str
    label_id: Optional[int]
    label_name: Optional[str]
    label_color: Optional[str]


class ExpenseCreate(BaseModel):
    user_id: int
    name: str
    value: float
    day: date
    card: str
    payment_type: str
    label_id: Optional[int]


class ExpenseUpdate(BaseModel):
    id: int
    name: str
    value: float
    day: date
    card: str
    payment_type: str
    label_id: Optional[int]


class ExpenseRead(ExpenseBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ExpensesList(BaseModel):
    page: int
    total_page: int
    total_expenses: int
    expenses: list[ExpenseRead]


class ExpensesStatus(BaseModel):
    monthly_revenue: Decimal
    remaining_value: Decimal
    total_expenses: Decimal

    model_config = {"from_attributes": True}

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Optional

from pydantic import BaseModel, model_validator


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


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class ExpenseSortField(str, Enum):
    name = "name"
    value = "value"
    day = "day"
    card = "card"
    payment_type = "payment_type"
    card_name = "card_name"
    created_at = "created_at"
    label = "label"


class ExpenseFilter(BaseModel):
    user_id: int

    sort_by: ExpenseSortField = ExpenseSortField.day
    order: SortOrder
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    label_id: Optional[int] = None
    card_name: Optional[str] = None
    payment_type: Optional[str] = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date:
            if self.start_date > self.end_date:
                raise ValueError("start_date cannot be greater than end_date")
        return self

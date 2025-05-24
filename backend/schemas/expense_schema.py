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

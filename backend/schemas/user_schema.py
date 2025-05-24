from datetime import date, datetime
from typing import List

from pydantic import BaseModel

from .expense_schema import ExpenseRead


class UserBase(BaseModel):
    name: str
    email: str
    birthday: date
    is_restricted: bool
    is_admin: bool


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserLoginReturn(BaseModel):
    id: int
    token_type: str
    access_token: str


class UserRead(UserBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserExpenses(UserRead):
    expenses: List[ExpenseRead] = []

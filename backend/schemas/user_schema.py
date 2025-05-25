from datetime import date, datetime
from typing import List

from pydantic import BaseModel

from .expense_schema import ExpenseRead


class UserIdentifier(BaseModel):
    id: int


class UserBase(UserIdentifier):
    name: str
    email: str
    birthday: date
    is_restricted: bool
    is_admin: bool

    model_config = {"from_attributes": True}


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserLoginReturn(UserIdentifier):
    token_type: str
    access_token: str


class UserRead(UserIdentifier):
    created_at: datetime

    model_config = {"from_attributes": True}


class UserExpenses(UserRead):
    expenses: List[ExpenseRead] = []

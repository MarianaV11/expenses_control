from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel

from .expense_schema import ExpenseRead


class UserAuth(BaseModel):
    token_type: str
    access_token: str


class UserIdentifier(BaseModel):
    id: int


class UserBase(UserIdentifier):
    name: str
    email: str
    birthday: date
    is_restricted: bool
    is_admin: bool
    monthly_revenue: Optional[Decimal] = 0.0

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    name: str
    email: str
    birthday: date
    password: str
    is_restricted: bool = False
    is_admin: bool = False

    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    email: str
    password: str


class UserLoginReturn(UserIdentifier):
    auth: UserAuth


class UserRead(UserIdentifier):
    created_at: datetime

    model_config = {"from_attributes": True}


class UserExpenses(UserRead):
    expenses: List[ExpenseRead] = []


class UserUpdatePassword(UserIdentifier):
    new_password: str
    old_password: str

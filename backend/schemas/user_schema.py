from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    birthday: date
    is_restricted: bool
    is_admin: bool

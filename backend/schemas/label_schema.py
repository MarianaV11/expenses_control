from datetime import datetime

from pydantic import BaseModel


class LabelBase(BaseModel):
    id: int


class LabelCreate(BaseModel):
    name: str
    user_id: int


class LabelUpdate(LabelBase):
    name: str


class LabelRead(LabelBase):
    name: str
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class LabelUserList(BaseModel):
    page: int
    total_page: int
    total_labels: int
    labels: list[LabelRead]

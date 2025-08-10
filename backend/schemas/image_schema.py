from datetime import datetime

from pydantic import BaseModel


class ImageBase(BaseModel):
    name: str
    mime_type: str


class ImageCreate(ImageBase):
    data: bytes
    user_id: int


class ImageRead(ImageBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

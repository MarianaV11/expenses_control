from sqlalchemy import LargeBinary, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models import BASE


class Image(BASE):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    mime_type = Column(String, nullable=False)
    data = Column(LargeBinary, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="images")
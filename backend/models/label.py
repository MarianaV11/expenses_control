from sqlalchemy import Column, DateTime, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models import BASE


class Label(BASE):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="labels")

    expenses = relationship("Expense", back_populates="label")

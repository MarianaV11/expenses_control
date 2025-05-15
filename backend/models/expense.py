from sqlalchemy import Column, DateTime, Float, String, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models import BASE

class Expense(BASE):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    day = Column(Date, nullable=False)
    value = Column(Float, nullable=False)
    card = Column(String, nullable=False)
    payment_type = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False    )

    user = relationship("User", back_populates="expenses")
    
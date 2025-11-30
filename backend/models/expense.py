from sqlalchemy import Column, DateTime, String, Integer, Date, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models import BASE


class Expense(BASE):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    day = Column(Date, nullable=False)
    value = Column(Numeric, nullable=False)
    card = Column(String, nullable=False)
    payment_type = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="expenses")

    label_id = Column(Integer, ForeignKey("labels.id"), nullable=True)
    label = relationship("Label", back_populates="expenses")

    @property
    def label_name(self):
        return self.label.name if self.label else None

    @property
    def label_color(self):
        return self.label.color if self.label else None

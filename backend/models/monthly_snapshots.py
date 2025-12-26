from sqlalchemy import JSON, Column, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from models import BASE


class MonthlySnapshot(BASE):
    __tablename__ = "monthly_snapshots"

    id = Column(Integer, primary_key=True, index=True)

    current_revenue = Column(Numeric, nullable=False)
    year_month = Column(String, nullable=False, index=True)
    total_spent = Column(Numeric, nullable=False)
    total_by_label = Column(JSON, nullable=False)
    percentage_by_label = Column(JSON, nullable=False)
    total_by_payment_type = Column(JSON, nullable=False)
    total_by_card = Column(JSON, nullable=False)

    started_at = Column(Date, nullable=False)
    ended_at = Column(Date, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="monthly_snapshots")

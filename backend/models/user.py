from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from models import BASE


class User(BASE):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    birthday = Column(Date, nullable=False)
    is_restricted = Column(Boolean, nullable=False)
    is_admin = Column(Boolean, nullable=False)
    monthly_revenue = Column(Numeric, nullable=True, default=0.0)

    images = relationship("Image", back_populates="user", cascade="all, delete-orphan")
    expenses = relationship(
        "Expense", back_populates="user", cascade="all, delete-orphan"
    )
    labels = relationship("Label", back_populates="user", cascade="all, delete-orphan")

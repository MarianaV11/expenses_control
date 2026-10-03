from datetime import datetime

from pydantic import BaseModel



class MonthlySnapshotRead(BaseModel):
    current_revenue: float
    year_month: str
    total_spent: float
    total_by_label: dict
    percentage_by_label: dict
    total_by_payment_type: dict
    total_by_card: dict
    started_at: datetime
    ended_at: datetime
    user_id: int

    model_config = {"from_attributes": True}


class MonthlySnapshotsList(BaseModel):
    page: int
    total_page: int
    total_snapshots: int
    snapshots: list[MonthlySnapshotRead]

    model_config = {"from_attributes": True}

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from schemas.monthly_snapshots_schema import MonthlySnapshotsList
from services.monthly_snapshots_service import (
    get_monthly_snapshots,
)
from utils.auth import require_token_valid
from database import get_db

router = APIRouter(
    prefix="/api/monthly_snapshots",
    tags=["Monthly Snapshots"],
    dependencies=[Depends(require_token_valid)],
)




@router.get("/snapshots", response_model=MonthlySnapshotsList)
def get_monthly_snapshots_route(
    user_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get a list of monthly snapshots."""

    return get_monthly_snapshots(page=page, per_page=per_page, user_id=user_id, db=db)

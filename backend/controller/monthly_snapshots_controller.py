from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from schemas.monthly_snapshots_schema import MonthlySnapshotRead, MonthlySnapshotsList
from services.monthly_snapshots_service import (
    get_monthly_snapshot_by_id,
    get_monthly_snapshots,
)
from utils.auth import require_token_valid
from database import get_db

router = APIRouter(
    prefix="/api/monthly_snapshots",
    tags=["Monthly Snapshots"],
    dependencies=[Depends(require_token_valid)],
)


@router.get("/snapshot", response_model=MonthlySnapshotRead)
def get_monthly_snapshot_by_id_route(
    snapshot_id: int, user_id: int, db: Session = Depends(get_db)
):
    """Get a specific monthly snapshot by id."""

    return get_monthly_snapshot_by_id(snapshot_id=snapshot_id, user_id=user_id, db=db)


@router.get("/snapshots", response_model=MonthlySnapshotsList)
def get_monthly_snapshots_route(
    user_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get a list of monthly snapshots."""

    return get_monthly_snapshots(page=page, per_page=per_page, user_id=user_id, db=db)

from fastapi import APIRouter, Depends, Query
from schemas.monthly_snapshots_schema import MonthlySnapshotRead, MonthlySnapshotsList
from services.monthly_snapshots_service import (
    get_monthly_snapshots,
    get_monthly_snapshots_by_id,
)
from utils.auth import require_token_valid

router = APIRouter()


@router.get("/monthly_snapshots/snapshot", response_model=MonthlySnapshotRead)
def get_monthly_snapshots_by_id_route(
    snapshot_Id: int, user_id: int, _: None = Depends(require_token_valid)
):
    """
    Get a specific monthly snapshot by id.
    """

    return get_monthly_snapshots_by_id(snapshot_Id=snapshot_Id, user_id=user_id)


@router.get("/monthly_snapshots/snapshots", response_model=MonthlySnapshotsList)
def get_monthly_snapshots_route(
    user_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    _: None = Depends(require_token_valid),
):
    """
    Get a list of monthly snapshots.
    """

    return get_monthly_snapshots(page=page, per_page=per_page, user_id=user_id)

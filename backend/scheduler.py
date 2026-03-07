"""
scheduler.py

Configures APScheduler to fire run_monthly_snapshot_job
at 00:05 on the 1st of every month.

Call start_scheduler() once from main.py on app startup.
"""

import calendar
import logging
from datetime import date

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from services.monthly_snapshots_service import create_monthly_snapshot

logger = logging.getLogger(__name__)

_scheduler = BackgroundScheduler()


def run_monthly_snapshot_job() -> None:
    today = date.today()
    start = date(today.year, today.month, 1)
    end = date(today.year, today.month, calendar.monthrange(today.year, today.month)[1])

    logger.info(f"[monthly_snapshot_job] Starting — period: {start} → {end}")
    create_monthly_snapshot(start=start, end=end)


def start_scheduler() -> None:
    _scheduler.add_job(
        run_monthly_snapshot_job,
        trigger=CronTrigger(day=1, hour=0, minute=5),
        id="monthly_snapshot",
        replace_existing=True,
        misfire_grace_time=3600,
    )
    _scheduler.start()

    today = date.today()
    if today.day == 1:
        run_monthly_snapshot_job()


def stop_scheduler() -> None:
    _scheduler.shutdown()
    logger.info("[scheduler] APScheduler stopped.")

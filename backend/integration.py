import calendar
from datetime import date

from services.monthly_snapshots_service import create_monthly_snapshot

today = date.today()

year = today.year
month = today.month

start_date = date(year, month, 1)
end_date = date(year, month, calendar.monthrange(year, month)[1])


create_monthly_snapshot(start=start_date, end=end_date)

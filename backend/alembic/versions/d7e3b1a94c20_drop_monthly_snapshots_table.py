"""drop monthly_snapshots table

Revision ID: d7e3b1a94c20
Revises: a0d8262613f4
Create Date: 2026-10-03 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d7e3b1a94c20"
down_revision: Union[str, None] = "a0d8262613f4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index(
        op.f("ix_monthly_snapshots_year_month"), table_name="monthly_snapshots"
    )
    op.drop_index(op.f("ix_monthly_snapshots_id"), table_name="monthly_snapshots")
    op.drop_table("monthly_snapshots")


def downgrade() -> None:
    op.create_table(
        "monthly_snapshots",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("current_revenue", sa.Numeric(), nullable=False),
        sa.Column("year_month", sa.String(), nullable=False),
        sa.Column("total_spent", sa.Numeric(), nullable=False),
        sa.Column("total_by_label", sa.JSON(), nullable=False),
        sa.Column("percentage_by_label", sa.JSON(), nullable=False),
        sa.Column("total_by_payment_type", sa.JSON(), nullable=False),
        sa.Column("total_by_card", sa.JSON(), nullable=False),
        sa.Column("started_at", sa.Date(), nullable=False),
        sa.Column("ended_at", sa.Date(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_monthly_snapshots_id"), "monthly_snapshots", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_monthly_snapshots_year_month"),
        "monthly_snapshots",
        ["year_month"],
        unique=False,
    )

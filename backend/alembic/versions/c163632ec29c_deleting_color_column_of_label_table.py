"""deleting color column of label table

Revision ID: c163632ec29c
Revises: 963df197cbd4
Create Date: 2025-08-23 21:28:41.410897

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c163632ec29c'
down_revision: Union[str, None] = '963df197cbd4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column("labels", "color")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column("labels", sa.Column("color", sa.String(), nullable=True))

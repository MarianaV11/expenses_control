FROM python:3.12-alpine

WORKDIR /app

# Create a group and a non-root user
RUN addgroup expenses_control && adduser -D -G expenses_control dev

# Copy dependency file first to leverage Docker layer caching
COPY pyproject.toml .

# Install system dependencies (as ROOT)
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    libffi-dev \
    openssl-dev \
    curl \
    postgresql-client

# Install UV (as ROOT)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && cp /root/.local/bin/uv /usr/local/bin/uv \
    && chmod +x /usr/local/bin/uv

# Copy the rest of the application source code
COPY . .

# Install project dependencies (as ROOT)
RUN uv sync --no-dev

# Switch to non-root user for runtime
USER dev

EXPOSE 8000

CMD ["sh", "-c", "until pg_isready -h db -p 5432; do sleep 2; done && uv run alembic upgrade head && uv run uvicorn main:app --host 0.0.0.0 --port 8000"]
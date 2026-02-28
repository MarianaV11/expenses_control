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
    curl

# Install UV (as ROOT)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# Copy the rest of the application source code
COPY . .

# Install project dependencies (as ROOT)
RUN uv sync --no-dev

# Switch to non-root user for runtime
USER dev

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
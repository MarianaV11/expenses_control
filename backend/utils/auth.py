from datetime import datetime, timedelta, timezone

import jwt
from config import Config


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(days=15)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)
    return token

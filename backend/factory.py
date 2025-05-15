from fastapi import FastAPI

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from config import Config

BASE = declarative_base()

config = Config()
engine = create_engine(config.SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_app():
    app = FastAPI()
    return app

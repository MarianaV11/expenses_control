from contextlib import asynccontextmanager

from controller.auth_controller import router as auth_router
from controller.expense_controller import router as expense_router
from controller.image_controller import router as image_router
from controller.label_controller import router as label_controller
from controller.monthly_snapshots_controller import router as monthly_snapshots_router
from controller.user_controller import router as user_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scheduler import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    stop_scheduler()


def create_app():
    app = FastAPI(
        title="Expenses Control",
        version="0.1.0",
        docs_url="/api/docs",
        description="""
            This is the backend of my personal Expenses Control application. 
            The project was developed for my portfolio, is freely available, and is licensed under the MIT license.
        """,
        lifespan=lifespan,
    )

    origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(expense_router)
    app.include_router(image_router)
    app.include_router(label_controller)
    app.include_router(user_router)
    app.include_router(monthly_snapshots_router)
    app.include_router(auth_router)

    return app

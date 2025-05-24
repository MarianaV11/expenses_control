from controller.user_controller import router as user_router
from fastapi import FastAPI


def create_app():
    app = FastAPI()

    app.include_router(user_router, prefix="/api", tags=["Users"])

    return app

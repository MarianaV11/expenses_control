from controller.expense_controller import router as expense_router
from controller.image_controller import router as image_router
from controller.label_controller import router as label_controller
from controller.user_controller import router as user_router
from fastapi import FastAPI


def create_app():
    app = FastAPI(
        title="Finance Control",
        version="0.1.0",
        docs_url="/api/docs",
        description="This is the backend of my personal finance control application. The project was developed for my portfolio, is freely available, and is licensed under the MIT license.",
    )

    app.include_router(expense_router, prefix="/api", tags=["Expenses"])
    app.include_router(image_router, prefix="/api", tags=["Images"])
    app.include_router(label_controller, prefix="/api", tags=["Labels"])
    app.include_router(user_router, prefix="/api", tags=["Users"])

    return app

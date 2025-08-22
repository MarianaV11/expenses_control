import uvicorn
from factory import create_app

app = create_app()

# uvicorn main:app --reload --host 127.0.0.1 --port 9000

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9000)

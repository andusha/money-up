import os

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from api.database import create_db_and_tables
from api.balance.router import router as balance_router
from api.category.router import router as category_router
from api.auth.router import router as auth_router
from config import ORIGINS


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

origins = []
for o in ORIGINS.split(","):
    origins.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    balance_router,
    tags=["balance"],
)
app.include_router(
    category_router,
    tags=["categories"],
)
app.include_router(
    auth_router,
    tags=["auth"],
)

@app.get("/")
def docs():
    """
    # Redirect
    to documentation (`/docs/`).
    """
    return RedirectResponse(url="/docs/")

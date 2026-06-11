import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.init_db import get_document_models
from app.db.mongodb import (
    close_mongo_connection,
    connect_to_mongo,
    is_connected,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo(get_document_models())
    yield
    await close_mongo_connection()


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"status": "ok", "message": f"{settings.app_name} is running"}


@app.get("/health")
async def health():
    db_ok = await is_connected()
    return {
        "status": "healthy" if db_ok else "degraded",
        "env": settings.app_env,
        "mongodb": "connected" if db_ok else "disconnected",
    }

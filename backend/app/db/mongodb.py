"""MongoDB connection lifecycle using Motor + Beanie."""

import logging
from typing import Sequence, Type

from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

logger = logging.getLogger(__name__)


class MongoState:
    client: AsyncIOMotorClient | None = None


state = MongoState()


async def connect_to_mongo(document_models: Sequence[Type[Document]]) -> None:
    """Open Motor client and register Beanie document models."""
    logger.info("Connecting to MongoDB at %s", settings.mongodb_uri)
    state.client = AsyncIOMotorClient(settings.mongodb_uri)
    await init_beanie(
        database=state.client[settings.mongodb_db_name],
        document_models=list(document_models),
    )
    logger.info("MongoDB connected — db: %s", settings.mongodb_db_name)


async def close_mongo_connection() -> None:
    """Close the Motor client cleanly on shutdown."""
    if state.client is not None:
        state.client.close()
        state.client = None
        logger.info("MongoDB connection closed")


async def is_connected() -> bool:
    """Ping the server to confirm the connection is alive."""
    if state.client is None:
        return False
    try:
        await state.client.admin.command("ping")
        return True
    except Exception as exc:
        logger.warning("MongoDB ping failed: %s", exc)
        return False

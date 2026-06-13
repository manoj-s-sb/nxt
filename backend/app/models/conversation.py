"""Conversation Beanie Document model."""

from datetime import UTC, datetime

from beanie import Document, PydanticObjectId
from pydantic import Field


class Conversation(Document):
    user_id: PydanticObjectId
    title: str = "New Chat"
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "conversations"
        indexes = ["user_id"]

"""Message Beanie Document model."""

from datetime import UTC, datetime
from typing import Literal

from beanie import Document, PydanticObjectId
from pydantic import Field

MessageRole = Literal["user", "assistant", "system"]


class Message(Document):
    conversation_id: PydanticObjectId
    role: MessageRole
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    class Settings:
        name = "messages"
        indexes = ["conversation_id"]

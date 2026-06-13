"""Pydantic schemas for chat (message) requests/responses."""

from datetime import datetime

from pydantic import BaseModel


class MessageOut(BaseModel):
    id: str
    role: str
    content: str
    created_at: datetime

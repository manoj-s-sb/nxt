"""Pydantic schemas for conversation requests/responses."""

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.chat import MessageOut


class ConversationCreate(BaseModel):
    title: str | None = Field(default=None, max_length=120)


class ConversationUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=120)


class ConversationOut(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime


class ConversationDetailOut(ConversationOut):
    messages: list[MessageOut]

"""Registers every Beanie Document model used by the app."""

from collections.abc import Sequence

from beanie import Document

from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User


def get_document_models() -> Sequence[type[Document]]:
    return [User, Conversation, Message]

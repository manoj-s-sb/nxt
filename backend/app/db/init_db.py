"""Registers every Beanie Document model used by the app."""

from typing import Sequence, Type

from beanie import Document

from app.models.user import User


def get_document_models() -> Sequence[Type[Document]]:
    return [User]

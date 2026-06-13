"""Conversation CRUD business logic."""

from datetime import UTC, datetime

from beanie import PydanticObjectId
from beanie.operators import Set

from app.models.conversation import Conversation
from app.models.message import Message


class ConversationNotFoundError(Exception):
    pass


async def create_conversation(
    user_id: PydanticObjectId,
    title: str | None,
) -> Conversation:
    conversation = Conversation(
        user_id=user_id,
        title=title or "New Chat",
    )
    await conversation.insert()
    return conversation


async def list_user_conversations(
    user_id: PydanticObjectId,
) -> list[Conversation]:
    return await (
        Conversation.find(Conversation.user_id == user_id).sort(-Conversation.updated_at).to_list()
    )


async def get_conversation_for_user(
    conversation_id: PydanticObjectId,
    user_id: PydanticObjectId,
) -> Conversation:
    conversation = await Conversation.get(conversation_id)
    if conversation is None or conversation.user_id != user_id:
        raise ConversationNotFoundError(str(conversation_id))
    return conversation


async def list_messages(
    conversation_id: PydanticObjectId,
) -> list[Message]:
    return await (
        Message.find(Message.conversation_id == conversation_id).sort(+Message.created_at).to_list()
    )


async def update_conversation_title(
    conversation_id: PydanticObjectId,
    user_id: PydanticObjectId,
    title: str,
) -> Conversation:
    conversation = await get_conversation_for_user(conversation_id, user_id)
    await conversation.update(
        Set(
            {
                Conversation.title: title,
                Conversation.updated_at: datetime.now(UTC),
            }
        )
    )
    return conversation


async def delete_conversation(
    conversation_id: PydanticObjectId,
    user_id: PydanticObjectId,
) -> None:
    conversation = await get_conversation_for_user(conversation_id, user_id)
    await Message.find(Message.conversation_id == conversation.id).delete()
    await conversation.delete()

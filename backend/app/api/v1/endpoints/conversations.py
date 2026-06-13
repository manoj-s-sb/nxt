"""Conversation endpoints: list, get, create, rename, delete."""

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User
from app.schemas.chat import MessageOut
from app.schemas.conversation import (
    ConversationCreate,
    ConversationDetailOut,
    ConversationOut,
    ConversationUpdate,
)
from app.services import conversation_service
from app.services.conversation_service import ConversationNotFoundError

router = APIRouter(prefix="/conversations", tags=["conversations"])


def _to_conversation_out(conversation: Conversation) -> ConversationOut:
    return ConversationOut(
        id=str(conversation.id),
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
    )


def _to_message_out(message: Message) -> MessageOut:
    return MessageOut(
        id=str(message.id),
        role=message.role,
        content=message.content,
        created_at=message.created_at,
    )


def _raise_not_found() -> None:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Conversation not found",
    )


@router.post(
    "",
    response_model=ConversationOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_conversation_endpoint(
    payload: ConversationCreate,
    current_user: User = Depends(get_current_user),
) -> ConversationOut:
    conversation = await conversation_service.create_conversation(
        user_id=current_user.id,
        title=payload.title,
    )
    return _to_conversation_out(conversation)


@router.get("", response_model=list[ConversationOut])
async def list_conversations_endpoint(
    current_user: User = Depends(get_current_user),
) -> list[ConversationOut]:
    conversations = await conversation_service.list_user_conversations(
        user_id=current_user.id,
    )
    return [_to_conversation_out(c) for c in conversations]


@router.get("/{conversation_id}", response_model=ConversationDetailOut)
async def get_conversation_endpoint(
    conversation_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
) -> ConversationDetailOut:
    try:
        conversation = await conversation_service.get_conversation_for_user(
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
    except ConversationNotFoundError:
        _raise_not_found()

    messages = await conversation_service.list_messages(conversation.id)
    base = _to_conversation_out(conversation)
    return ConversationDetailOut(
        **base.model_dump(),
        messages=[_to_message_out(m) for m in messages],
    )


@router.patch("/{conversation_id}", response_model=ConversationOut)
async def update_conversation_endpoint(
    conversation_id: PydanticObjectId,
    payload: ConversationUpdate,
    current_user: User = Depends(get_current_user),
) -> ConversationOut:
    try:
        conversation = await conversation_service.update_conversation_title(
            conversation_id=conversation_id,
            user_id=current_user.id,
            title=payload.title,
        )
    except ConversationNotFoundError:
        _raise_not_found()
    return _to_conversation_out(conversation)


@router.delete(
    "/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_conversation_endpoint(
    conversation_id: PydanticObjectId,
    current_user: User = Depends(get_current_user),
) -> None:
    try:
        await conversation_service.delete_conversation(
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
    except ConversationNotFoundError:
        _raise_not_found()

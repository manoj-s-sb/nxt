# AI Chat App — Complete Architecture

The full picture: every component, every flow, every API.
Read top-to-bottom for the big picture, or jump to a section.

---

## 📑 Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [All API Endpoints](#4-all-api-endpoints)
5. [Auth Flow (Register / Login / Me)](#5-auth-flow)
6. [AI Chat Flow (With Memory)](#6-ai-chat-flow)
7. [Memory Architecture (Short + Long Term)](#7-memory-architecture)
8. [Data Models (MongoDB Collections)](#8-data-models)
9. [Frontend ↔ Backend Communication](#9-frontend--backend-communication)
10. [Build Status](#10-build-status)

---

## 1. System Overview

```
                           ┌─────────────────────────────┐
                           │      USER'S BROWSER         │
                           │   http://localhost:3000     │
                           └──────────────┬──────────────┘
                                          │
                                  HTTPS / JSON
                                          │
                           ┌──────────────▼──────────────┐
                           │   FRONTEND (Next.js 14)     │
                           │   - Pages (App Router)      │
                           │   - Tailwind CSS            │
                           │   - Zustand store           │
                           │   - Axios client            │
                           └──────────────┬──────────────┘
                                          │
                                 REST API + SSE stream
                                          │
                           ┌──────────────▼──────────────┐
                           │   BACKEND (FastAPI)         │
                           │   http://localhost:8000     │
                           │   - /api/v1/auth/*          │
                           │   - /api/v1/chat/*          │
                           │   - /api/v1/conversations/* │
                           │   - /api/v1/memory/*        │
                           └──┬──────────┬──────────┬────┘
                              │          │          │
              ┌───────────────┘          │          └────────────────┐
              │                          │                           │
              ▼                          ▼                           ▼
       ┌─────────────┐           ┌─────────────┐            ┌──────────────┐
       │   MongoDB   │           │    Redis    │            │ Google Gemini│
       │ (Beanie ODM)│           │ (short-term │            │   (API)      │
       │             │           │   memory)   │            │              │
       │ - users     │           │             │            │ - chat       │
       │ - convers.  │           │ Last 10 msg │            │ - embeddings │
       │ - messages  │           │ per chat    │            │              │
       │ - memories  │           │             │            │              │
       │ (vector idx)│           │             │            │              │
       └─────────────┘           └─────────────┘            └──────────────┘
```

---

## 2. Tech Stack

### Frontend
| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Styling | Tailwind CSS | 3.x |
| Language | TypeScript | 5.x |
| HTTP client | Axios | 1.x |
| State | Zustand | 5.x |
| Icons | Lucide React | latest |

### Backend
| Layer | Choice | Version |
|---|---|---|
| Framework | FastAPI | 0.115.6 |
| Server | Uvicorn | 0.34.0 |
| ODM | Beanie (Pydantic v2) | 1.29.0 |
| DB driver | Motor (async MongoDB) | 3.6.1 |
| Cache driver | redis-py | 5.2.1 |
| LLM | google-generativeai | 0.8.3 |
| JWT | python-jose | 3.3.0 |
| Password hash | passlib + bcrypt | 1.7.4 + 4.0.1 |
| Validation | Pydantic | 2.10.4 |

### Infrastructure
| Service | Port | Purpose |
|---|---|---|
| Next.js | 3000 | Frontend |
| FastAPI | 8000 | Backend API |
| MongoDB | 27017 | Persistent storage |
| Redis | 6379 | Short-term memory |
| Gemini API | (cloud) | LLM + embeddings |

---

## 3. Folder Structure

```
nxt/
├── ARCHITECTURE.md           ← This file
├── README.md
│
├── backend/                   ← Python / FastAPI
│   ├── app/
│   │   ├── api/v1/endpoints/   (auth, chat, conversations, memory)
│   │   ├── core/               (config, security, logging)
│   │   ├── db/                 (mongodb, init_db)
│   │   ├── models/             (User, Conversation, Message, Memory)
│   │   ├── schemas/            (Pydantic request/response)
│   │   ├── services/           (business logic)
│   │   ├── memory/             (short_term, long_term, retriever, summarizer)
│   │   ├── llm/                (gemini_client, embeddings)
│   │   ├── utils/
│   │   └── main.py
│   ├── tests/
│   ├── .env                    (gitignored — secrets here)
│   ├── .env.example
│   ├── requirements.txt
│   ├── README.md
│   ├── SETUP.md
│   ├── SECRETS.md
│   └── EXPLAIN.md              (beginner walkthrough)
│
└── frontend/                  ← Next.js / Tailwind
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/login/page.tsx
    │   │   ├── (auth)/register/page.tsx
    │   │   ├── chat/[id]/page.tsx
    │   │   ├── chat/page.tsx
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   ├── chat/        (ChatWindow, MessageBubble, MessageInput, TypingIndicator)
    │   │   ├── sidebar/     (ChatList, NewChatButton)
    │   │   └── ui/          (Button, Input, Modal)
    │   ├── hooks/           (useChat, useAuth, useMemory)
    │   ├── lib/             (api, auth, stream)
    │   ├── store/           (chatStore, userStore)
    │   ├── types/           (chat, user)
    │   └── utils/
    ├── public/
    ├── .env.local           (gitignored)
    └── package.json
```

---

## 4. All API Endpoints

Base URL: `http://localhost:8000/api/v1`

### 🔐 Auth (3 endpoints)

| Method | Path | Body | Returns | Auth? | Status |
|---|---|---|---|---|---|
| `POST` | `/auth/register` | `{email, password}` | User object | ❌ | ✅ Built |
| `POST` | `/auth/login` | `{email, password}` | `{access_token, token_type}` | ❌ | ✅ Built |
| `GET` | `/auth/me` | — | Current user | ✅ Bearer | ✅ Built |

### 💬 Conversations (5 endpoints — planned)

| Method | Path | Body | Returns | Auth? | Status |
|---|---|---|---|---|---|
| `GET` | `/conversations` | — | `[{id, title, updated_at}]` | ✅ | ⬜ Pending |
| `POST` | `/conversations` | `{title?}` | New conversation | ✅ | ⬜ Pending |
| `GET` | `/conversations/{id}` | — | Conversation + messages | ✅ | ⬜ Pending |
| `PATCH` | `/conversations/{id}` | `{title}` | Updated conversation | ✅ | ⬜ Pending |
| `DELETE` | `/conversations/{id}` | — | `204 No Content` | ✅ | ⬜ Pending |

### 🤖 Chat (1 streaming endpoint — planned)

| Method | Path | Body | Returns | Auth? | Status |
|---|---|---|---|---|---|
| `POST` | `/chat/{conversation_id}` | `{message}` | **SSE stream** of AI response tokens | ✅ | ⬜ Pending |

### 🧠 Memory (3 endpoints — planned)

| Method | Path | Body | Returns | Auth? | Status |
|---|---|---|---|---|---|
| `GET` | `/memory` | — | List user's stored memories | ✅ | ⬜ Pending |
| `GET` | `/memory/search?q=...` | — | Semantic search results | ✅ | ⬜ Pending |
| `DELETE` | `/memory` | — | Clear all memories | ✅ | ⬜ Pending |

### 🏥 System (2 endpoints)

| Method | Path | Returns | Status |
|---|---|---|---|
| `GET` | `/` | App info | ✅ Built |
| `GET` | `/health` | DB connectivity | ✅ Built |
| `GET` | `/docs` | Swagger UI | ✅ Built |

---

## 5. Auth Flow

### 5.1 Register Flow

```
🧑 User                  🖥️ Frontend             🐍 Backend              🍃 MongoDB
  │                         │                       │                       │
  │  Fill register form     │                       │                       │
  ├────────────────────────▶│                       │                       │
  │                         │                       │                       │
  │                         │ POST /auth/register   │                       │
  │                         │ {email, password}     │                       │
  │                         ├──────────────────────▶│                       │
  │                         │                       │                       │
  │                         │            Validate (Pydantic UserRegister)   │
  │                         │            - email format                     │
  │                         │            - password ≥ 8 chars               │
  │                         │                       │                       │
  │                         │                       │ Find user by email    │
  │                         │                       ├──────────────────────▶│
  │                         │                       │◀──────────────────────┤
  │                         │                       │   (none / existing)   │
  │                         │                       │                       │
  │                         │            If exists → 409 Conflict           │
  │                         │            Else → hash password (bcrypt)      │
  │                         │                       │                       │
  │                         │                       │ Insert new User       │
  │                         │                       ├──────────────────────▶│
  │                         │                       │◀──────────────────────┤
  │                         │                       │                       │
  │                         │ 201 Created           │                       │
  │                         │ {id, email, created}  │                       │
  │                         │◀──────────────────────┤                       │
  │  "Account created!"     │                       │                       │
  │◀────────────────────────┤                       │                       │
```

### 5.2 Login Flow

```
🧑 User                  🖥️ Frontend             🐍 Backend              🍃 MongoDB
  │                         │                       │                       │
  │  Fill login form        │                       │                       │
  ├────────────────────────▶│                       │                       │
  │                         │ POST /auth/login      │                       │
  │                         │ {email, password}     │                       │
  │                         ├──────────────────────▶│                       │
  │                         │                       │ Find user by email    │
  │                         │                       ├──────────────────────▶│
  │                         │                       │◀──────────────────────┤
  │                         │                       │                       │
  │                         │            Verify bcrypt(password, hash)      │
  │                         │            Fail → 401 Unauthorized            │
  │                         │            Pass → create_access_token()       │
  │                         │                                               │
  │                         │ 200 OK                                        │
  │                         │ {access_token: "eyJ..."}                      │
  │                         │◀──────────────────────┤                       │
  │                         │                                               │
  │                         │ Save token to                                 │
  │                         │ localStorage                                  │
  │                         │                                               │
  │  Redirect to /chat      │                                               │
  │◀────────────────────────┤                                               │
```

### 5.3 Authenticated Request Flow (e.g. /me)

```
🖥️ Frontend                                  🐍 Backend
   │                                            │
   │ GET /auth/me                               │
   │ Authorization: Bearer eyJ...               │
   ├───────────────────────────────────────────▶│
   │                                            │
   │     get_current_user dependency runs:      │
   │     1. Extract token from header           │
   │     2. decode_access_token(token)          │
   │        ├─ Verify signature                 │
   │        ├─ Check expiry                     │
   │        └─ Extract user_id from "sub"       │
   │     3. User.get(user_id) from MongoDB      │
   │     4. If any step fails → 401             │
   │                                            │
   │ 200 OK                                     │
   │ {id, email, created_at}                    │
   │◀───────────────────────────────────────────┤
```

### 5.4 JWT Token Anatomy

```
eyJhbGciOiJIUzI1NiIs.eyJzdWIiOiI2NTQiLCJleHAiOjE3MzN9.signature
└────── HEADER ─────┘└──────── PAYLOAD ──────────┘└─SIGNATURE─┘
   {alg:"HS256"}       {sub:"user_id", exp:...}    HMAC-SHA256
                                                   signed with JWT_SECRET
```

- **HEADER**: algorithm used (HS256)
- **PAYLOAD**: claims (user ID + expiration)
- **SIGNATURE**: proof the server signed it (untamperable)

Token lifetime: **7 days** (`JWT_EXPIRE_MINUTES=10080`)

---

## 6. AI Chat Flow

This is THE core feature. Here's exactly what happens when a user sends a message.

### 6.1 Full Chat Flow With Memory

```
🧑 User types: "What did I say about pizza last time?"
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                         │
│ - User in /chat/[conversation_id]                                │
│ - Send POST /chat/{id} with message                              │
│ - Open SSE stream to consume tokens as they arrive               │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND: chat endpoint                                           │
│                                                                  │
│ Step 1: Auth                                                     │
│   └─ get_current_user — verify token                             │
│                                                                  │
│ Step 2: Save user message                                        │
│   └─ Insert into messages collection                             │
│                                                                  │
│ Step 3: Retrieve short-term memory                               │
│   └─ Redis: GET conv:{id}:history → last 10 messages             │
│                                                                  │
│ Step 4: Retrieve long-term memory                                │
│   ├─ Embed user message with Gemini text-embedding-004           │
│   ├─ MongoDB vector search → top 5 relevant past memories        │
│   └─ Filter by user_id (each user has private memories)          │
│                                                                  │
│ Step 5: Assemble prompt                                          │
│   ┌──────────────────────────────────────────────────┐           │
│   │ SYSTEM: You are a helpful assistant. Use these   │           │
│   │ memories to inform your responses.               │           │
│   │                                                  │           │
│   │ MEMORIES:                                        │           │
│   │ - User loves pepperoni pizza (3 weeks ago)       │           │
│   │ - User is vegetarian on Tuesdays (1 week ago)    │           │
│   │                                                  │           │
│   │ RECENT MESSAGES:                                 │           │
│   │ assistant: How can I help today?                 │           │
│   │ user: Hi again!                                  │           │
│   │ assistant: Welcome back!                         │           │
│   │                                                  │           │
│   │ USER: What did I say about pizza last time?      │           │
│   └──────────────────────────────────────────────────┘           │
│                                                                  │
│ Step 6: Call Gemini API (streaming)                              │
│   └─ gemini-2.0-flash.generate_content(prompt, stream=True)      │
│                                                                  │
│ Step 7: Stream tokens back to frontend                           │
│   └─ For each chunk → SSE: data: {"token": "..."}                │
│                                                                  │
│ Step 8: After stream complete:                                   │
│   ├─ Save full assistant message to MongoDB                      │
│   ├─ Update Redis short-term memory                              │
│   ├─ Generate embedding for both user msg + assistant reply      │
│   └─ Store as new long-term memory entries                       │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
🖥️ Frontend renders streamed response word-by-word, like ChatGPT
```

### 6.2 Sequence Diagram (Single Message)

```
Frontend  Backend  Redis  MongoDB  Gemini
   │         │       │       │        │
   ├─POST───▶│       │       │        │
   │         │                                  Step 1: auth
   │         ├─get_user────▶│                   Step 2a: lookup user
   │         │              │
   │         ├─save msg────▶│                   Step 2b: save user msg
   │         │
   │         ├─get hist──▶│                     Step 3: short-term
   │         │◀──msgs─────┤
   │         │
   │         ├─embed query───────────▶│         Step 4a: embed
   │         │◀──vector──────────────┤
   │         │
   │         ├─vec search──▶│                   Step 4b: long-term
   │         │◀─memories────┤
   │         │
   │         ├─generate(stream=True)─▶│         Step 5+6: prompt + LLM
   │         │◀──tokens... ──────────┤
   │◀─SSE────┤              (loops)
   │         │
   │         ├─save reply───▶│                  Step 8a
   │         ├─update hist▶│                    Step 8b
   │         ├─embed both ──────────▶│          Step 8c: embed for memory
   │         │◀──vectors────────────┤
   │         ├─save memory──▶│                  Step 8d: long-term store
   │         │
   │◀─DONE───┤
```

### 6.3 Why This Architecture?

| Step | Why it matters |
|---|---|
| **Short-term in Redis** | Fast (sub-millisecond) — last 10 turns always read |
| **Long-term in MongoDB** | Semantic search across all history |
| **Vector embedding** | Find memories by **meaning**, not exact words |
| **Streaming SSE** | User sees response as it generates (no waiting for full reply) |
| **Save AFTER stream** | Don't store partial messages if Gemini errors mid-stream |

---

## 7. Memory Architecture

### 7.1 Two Memory Layers

```
                    ┌─────────────────────────────────┐
                    │       USER SENDS MESSAGE        │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
        ┌────────────────────┐            ┌────────────────────┐
        │  SHORT-TERM MEMORY │            │  LONG-TERM MEMORY  │
        │      (Redis)       │            │     (MongoDB +     │
        │                    │            │   Vector Search)   │
        │  Last 10 messages  │            │                    │
        │  of THIS chat      │            │  All important     │
        │                    │            │  memories across   │
        │  Key:              │            │  ALL chats         │
        │  conv:{id}:history │            │                    │
        │                    │            │  Indexed by:       │
        │  TTL: 24 hours     │            │  - user_id         │
        │                    │            │  - 768-dim vector  │
        │  Why fast?         │            │                    │
        │  In-memory         │            │  Why?              │
        │  data structure    │            │  Semantic search   │
        └────────────────────┘            └────────────────────┘
                    │                                 │
                    └────────────────┬────────────────┘
                                     ▼
                    ┌─────────────────────────────────┐
                    │  ASSEMBLE INTO LLM PROMPT       │
                    └─────────────────────────────────┘
```

### 7.2 What Gets Saved As Long-Term Memory?

Not every message. Only important ones. Two strategies (we'll pick one later):

**Strategy A — Save Everything (simple)**
- Every user message and assistant reply → embedded + stored
- Pro: Never miss anything
- Con: Lots of noise ("ok", "thanks", "what?")

**Strategy B — Summarize Periodically (smart)** ⭐
- Every 10 messages, call Gemini: "Summarize key facts from this conversation"
- Save the summary as one memory
- Pro: Dense, meaningful memories
- Con: More LLM calls

We'll start with **A** (simpler), upgrade to **B** later.

### 7.3 Embeddings — How Semantic Search Works

```
User message: "What did I say about pizza?"
                       │
                       ▼
         Gemini text-embedding-004
                       │
                       ▼
              [768 numbers]
        [0.12, -0.45, 0.89, 0.01, ...]
                       │
                       ▼
      MongoDB Atlas $vectorSearch
   "Find the 5 closest vectors in user's memories"
                       │
                       ▼
              Returns memories like:
   1. "User loves pepperoni pizza"  (similarity: 0.92)
   2. "User had pizza Friday"        (similarity: 0.87)
   3. "Vegetarian on Tuesdays"       (similarity: 0.45) ← not returned
```

Two pieces of text with **similar meaning** will have **similar vectors**, even with completely different words.

---

## 8. Data Models (MongoDB Collections)

### 8.1 `users`

```python
{
  "_id": ObjectId("..."),
  "email": "manoj@test.com",          # unique, indexed
  "hashed_password": "$2b$12$...",     # bcrypt hash
  "created_at": ISODate("...")
}
```

### 8.2 `conversations` (planned)

```python
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),          # FK to users
  "title": "Talking about pizza",      # auto-gen from first msg
  "created_at": ISODate("..."),
  "updated_at": ISODate("...")          # bumped on each new msg
}
```

### 8.3 `messages` (planned)

```python
{
  "_id": ObjectId("..."),
  "conversation_id": ObjectId("..."),  # FK to conversations
  "role": "user" | "assistant",
  "content": "What did I say about pizza?",
  "created_at": ISODate("...")
}
```

### 8.4 `memories` (planned — has vector index)

```python
{
  "_id": ObjectId("..."),
  "user_id": ObjectId("..."),          # private per-user
  "content": "User loves pepperoni pizza",
  "embedding": [0.12, -0.45, ...],    # 768 floats — Gemini embedding
  "source_conversation_id": ObjectId("..."),
  "created_at": ISODate("...")
}
```

**Index:**
```javascript
db.memories.createIndex({
  embedding: "vector",
  user_id: 1
})
```

---

## 9. Frontend ↔ Backend Communication

### 9.1 Request Patterns

| Endpoint Type | Protocol | Why |
|---|---|---|
| Auth, CRUD | REST (JSON) | Standard, simple |
| Chat message | **SSE (stream)** | Real-time token-by-token |
| Future: presence | WebSocket | Bidirectional |

### 9.2 Token Storage on Frontend

```
┌──────────────────────────────────────┐
│  After login:                        │
│  localStorage.setItem(               │
│    "auth_token",                     │
│    response.access_token             │
│  )                                   │
└──────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────┐
│  Axios request interceptor:          │
│  config.headers.Authorization =      │
│    `Bearer ${getToken()}`            │
└──────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────┐
│  Backend get_current_user reads      │
│  it on every protected request       │
└──────────────────────────────────────┘
```

### 9.3 Protecting Frontend Routes

```
User visits /chat
       │
       ▼
Check localStorage for token
       │
   ┌───┴───┐
   │       │
   ▼       ▼
 yes      no
   │       │
   │       └─▶ Redirect to /login
   │
   ▼
GET /api/v1/auth/me
       │
   ┌───┴───┐
   │       │
   ▼       ▼
 200     401
   │       │
   │       └─▶ Clear token, redirect to /login
   │
   ▼
Render /chat
```

---

## 10. Build Status

### Backend

| Component | Status |
|---|---|
| Folder structure | ✅ Done |
| FastAPI app + lifespan | ✅ Done |
| MongoDB connection | ✅ Done |
| User model | ✅ Done |
| JWT + bcrypt security | ✅ Done |
| Register endpoint | ✅ Done |
| Login endpoint | ✅ Done |
| `/me` endpoint | ✅ Done |
| CORS for frontend | ✅ Done |
| Conversation model | ⬜ Pending |
| Message model | ⬜ Pending |
| Conversations CRUD endpoints | ⬜ Pending |
| Gemini client | ⬜ Pending |
| Chat streaming endpoint | ⬜ Pending |
| Memory model + vector index | ⬜ Pending |
| Embeddings service | ⬜ Pending |
| Short-term Redis layer | ⬜ Pending |
| Long-term retrieval | ⬜ Pending |
| Conversation summarizer | ⬜ Pending |
| Tests | ⬜ Pending |

### Frontend

| Component | Status |
|---|---|
| Folder structure | ✅ Done |
| Tailwind + TS config | ✅ Done |
| Landing page | ✅ Done |
| API client (Axios) | ✅ Done |
| Types (Message, User) | ✅ Done |
| Login page UI | ⬜ Pending |
| Register page UI | ⬜ Pending |
| Auth store (Zustand) | ⬜ Pending |
| useAuth hook | ⬜ Pending |
| Token storage helpers | ⬜ Pending |
| Protected route logic | ⬜ Pending |
| Chat page UI | ⬜ Pending |
| Message components | ⬜ Pending |
| Streaming consumer | ⬜ Pending |
| Sidebar / chat list | ⬜ Pending |

---

## 🎯 Next Build Order

```
[Phase 1] AUTH UI                      ← Next steps
   ├─ Frontend register + login pages
   ├─ Token storage + axios interceptor
   └─ /me check + protected /chat route

[Phase 2] CONVERSATIONS API
   ├─ Conversation + Message models
   ├─ Conversations CRUD endpoints
   └─ Frontend sidebar + chat list

[Phase 3] CHAT WITHOUT MEMORY
   ├─ Gemini client (gemini-2.0-flash)
   ├─ Streaming chat endpoint
   ├─ Frontend chat window + streaming consumer
   └─ Save messages to MongoDB

[Phase 4] SHORT-TERM MEMORY
   ├─ Redis client
   ├─ Save last N msgs per conversation
   └─ Inject into prompt assembly

[Phase 5] LONG-TERM MEMORY
   ├─ Embeddings service (text-embedding-004)
   ├─ Memory model with vector index
   ├─ Save memories after each turn
   └─ Retrieve top-K for each new message

[Phase 6] POLISH
   ├─ Conversation summarizer
   ├─ Memory inspection UI
   ├─ Error handling polish
   └─ Tests
```

---

## 📍 You Are Here

```
✅ Phase 0: Foundation (folders, configs, MongoDB)
✅ Phase 1a: Backend Auth API
⬜ Phase 1b: Frontend Auth UI                ← NEXT
⬜ Phase 2: Conversations
⬜ Phase 3: Chat (without memory)
⬜ Phase 4: Short-term memory
⬜ Phase 5: Long-term memory
⬜ Phase 6: Polish
```

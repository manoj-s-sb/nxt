# `src/api/` — Endpoint layer

All HTTP calls to the FastAPI backend, organized **one folder per backend domain**.

## Structure

```
src/api/
├── README.md                          this file
│
├── auth/                              POST /api/v1/auth/*
│   ├── endpoints.ts                   registerUser, loginUser, fetchCurrentUser
│   ├── types.ts                       request + response shapes
│   └── index.ts                       barrel — re-exports endpoints + types
│
├── conversations/                     /api/v1/conversations/*
│   ├── endpoints.ts                   list, create, get, rename, delete
│   ├── types.ts
│   └── index.ts
│
├── chat/                              /api/v1/chat/{id}   (Phase 3 — SSE)
│   ├── endpoints.ts                   streamChatMessage
│   ├── types.ts
│   └── index.ts
│
└── memory/                            /api/v1/memory/*    (Phase 5)
    ├── endpoints.ts                   listMemories, searchMemories, clearMemories
    ├── types.ts
    └── index.ts
```

## Where Axios lives

The Axios client + auth-token interceptor + `extractErrorMessage` live in
`src/lib/api.ts`. Every endpoint imports them from there:

```ts
import { api, extractErrorMessage } from "@/lib/api";
```

Do **not** create another axios instance inside `src/api/`. There is one client.

## Rules

1. **Endpoints are pure async functions** — no React hooks, no Zustand, no `window`.
2. **One folder per backend domain** — mirrors `backend/app/api/v1/endpoints/`.
3. **Types co-located** in `types.ts` next to their endpoints.
4. **Throw `Error`** with a friendly message — UI catches and displays.
5. **Import via the barrel**:
   ```ts
   import { loginUser } from "@/api/auth";
   import { listConversations } from "@/api/conversations";
   ```

## Status

| Domain        | Endpoints                         | Backend Ready? | Frontend Wired? |
| ------------- | --------------------------------- | -------------- | --------------- |
| auth          | register, login, me               | ✅             | ✅              |
| conversations | list, create, get, rename, delete | ✅             | ✅              |
| chat          | streamChatMessage                 | ⬜             | ⬜ (stub)       |
| memory        | list, search, clear               | ⬜             | ⬜ (stub)       |

## Adding a new domain

Say you want `POST /api/v1/feedback`. Steps:

1. `mkdir src/api/feedback`
2. Create `types.ts` with `FeedbackPayload`
3. Create `endpoints.ts` with `submitFeedback(payload)`
4. Create `index.ts`:
   ```ts
   export * from "./endpoints";
   export * from "./types";
   ```
5. Use it anywhere: `import { submitFeedback } from "@/api/feedback";`

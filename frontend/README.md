# AI Chat Frontend

Next.js 14 (App Router) + Tailwind CSS + TypeScript.

## Tech Stack

- **Next.js 14** — React framework with App Router
- **Tailwind CSS** — utility-first styling
- **TypeScript** — type safety
- **Axios** — HTTP client (talks to FastAPI backend)
- **Zustand** — lightweight global state
- **Lucide React** — icon library

## Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── (auth)/              # Login + register
│   │   ├── chat/                # Chat pages
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing
│   │   └── globals.css
│   ├── components/
│   │   ├── chat/                # ChatWindow, MessageBubble, etc.
│   │   ├── sidebar/             # ChatList, NewChatButton
│   │   └── ui/                  # Reusable Button, Input, Modal
│   ├── hooks/                   # useChat, useAuth, useMemory
│   ├── lib/                     # api client, auth, stream helpers
│   ├── store/                   # Zustand stores
│   ├── types/                   # Shared TypeScript types
│   └── utils/                   # Pure helpers, constants
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Setup

See [SETUP.md](./SETUP.md) for step-by-step instructions.

Quick start:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

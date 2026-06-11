# Frontend Setup Guide

Step-by-step instructions to get the Next.js frontend running locally.

---

## Prerequisites (Already Installed ✅)

- Node.js v23.10.0
- npm v10.9.2

---

## Setup Steps

### 1. Move into the frontend folder

```bash
cd /Users/anikeshpathak/Documents/mk/nextjs/nxt/frontend
```

### 2. Install dependencies

```bash
npm install
```

This reads `package.json` and downloads everything into a `node_modules/` folder (gitignored). Takes 1–3 minutes.

### 3. Create your `.env.local` file

```bash
cp .env.example .env.local
```

This file is gitignored — safe to put real values in it.

Default contents:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This points the frontend at your FastAPI backend. Leave as-is for local dev.

### 4. Start the dev server

```bash
npm run dev
```

You should see:

```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 1.5s
```

### 5. Open it in your browser

→ **http://localhost:3000**

You should see a landing page that says **"AI Chat — Frontend is running ✅"** with a button.

---

## Daily Workflow (After Initial Setup)

Each time you come back to work:

```bash
cd /Users/anikeshpathak/Documents/mk/nextjs/nxt/frontend
npm run dev
```

Press `Ctrl+C` to stop the server.

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload (use this 99% of the time) |
| `npm run build` | Build for production |
| `npm start` | Start production build |
| `npm run lint` | Check code for issues |

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Cannot find module 'next'` | Dependencies not installed | Run `npm install` |
| `Port 3000 is already in use` | Another app is using 3000 | `lsof -ti:3000 \| xargs kill -9` then retry |
| `EACCES: permission denied` | npm cache issue | `sudo chown -R $(whoami) ~/.npm` |
| Backend calls return CORS error | Backend not running or wrong URL | Make sure FastAPI is running on 8000 |

---

## Where Are the Frontend Secrets?

- **`.env.local`** — your real values (gitignored)
- **`.env.example`** — template, committed

⚠️ **Important about `NEXT_PUBLIC_*` prefix:**

Any env var starting with `NEXT_PUBLIC_` is **embedded in the browser bundle** — anyone can read it via DevTools. Only put non-sensitive values there (like the backend URL).

| Variable | Public? | Why |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | It's just the backend URL |
| `NEXTAUTH_SECRET` | ❌ NO | Must stay server-side |
| `NEXTAUTH_URL` | ❌ NO | Server-only |

The Gemini API key is **NEVER** in the frontend. It stays in `backend/.env` only. The frontend asks the backend, the backend asks Gemini.

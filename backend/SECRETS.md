# Where to Keep Secrets & API Keys

A simple guide so you never leak a key.

---

## 🔑 The Golden Rules

1. **Secrets live in `.env` files** — never directly in code.
2. **`.env` files are gitignored** — they never get committed.
3. **`.env.example` is committed** — but contains only placeholder values, never real keys.
4. **Each app has its own `.env`** — backend has one, frontend has another.

---

## 📁 Where Each Type of Secret Lives

```
nxt/                          ← project root
├── backend/
│   ├── .env                  ← 🔐 REAL secrets (gitignored)
│   ├── .env.example          ← ✅ Template (committed, placeholders only)
│   └── ...
│
└── frontend/                 ← (created in a later step)
    ├── .env.local            ← 🔐 REAL frontend secrets (gitignored)
    ├── .env.example          ← ✅ Template (committed, placeholders only)
    └── ...
```

### Backend secrets — `backend/.env`

| Secret | Used For |
|---|---|
| `GEMINI_API_KEY` | Calling Google Gemini AI |
| `JWT_SECRET` | Signing login tokens |
| `MONGODB_URI` | DB connection (may contain password if using Atlas) |
| `REDIS_URL` | Cache connection (may contain password if remote) |

### Frontend secrets — `frontend/.env.local`

| Secret | Used For |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `http://localhost:8000`) |
| `NEXTAUTH_SECRET` | Login session encryption (if using NextAuth) |
| `NEXTAUTH_URL` | Frontend URL for auth callbacks |

> ⚠️ Anything prefixed `NEXT_PUBLIC_*` is exposed to the browser. **Never** put real secrets behind that prefix. Only public values like the API URL.

---

## 🚦 Step-by-Step: Adding a New Secret

Let's say you want to add a `SENDGRID_API_KEY` later.

### 1. Add it to `.env.example` with a placeholder

```
SENDGRID_API_KEY=your_sendgrid_key_here
```

This file IS committed so other developers know the key exists.

### 2. Add the real value to `.env`

```
SENDGRID_API_KEY=SG.abc123realkey...
```

This file is **NOT** committed.

### 3. Read it in your code via the config loader

In `app/core/config.py`:

```python
sendgrid_api_key: str = ""
```

Then anywhere in your code:

```python
from app.core.config import settings
client = SendGridClient(settings.sendgrid_api_key)
```

Never hardcode the key in the source file directly.

---

## ✅ Pre-Commit Safety Checklist

Before every `git commit`, ask:

- [ ] Is `.env` in `.gitignore`?  → Yes (already set up)
- [ ] Did I accidentally paste a real key into `.env.example`?
- [ ] Did I paste a key into a comment or string literal in code?
- [ ] Did I share a key in chat / Slack / a screenshot?

Quick check before committing:

```bash
git status
```

If you see `.env` in the list of files to commit, **STOP**. It should never appear there.

---

## 🆘 If You Accidentally Leaked a Key

1. **Revoke it immediately** — go to the provider dashboard and delete the key.
2. **Create a new one**.
3. **Update your `.env`** with the new key.
4. If it was pushed to GitHub, the key is in git history forever — treat it as permanently compromised.

For Gemini specifically:
- Go to https://aistudio.google.com/apikey
- Find the leaked key → Delete
- Click "Create API key" → Save the new one in `.env`

---

## 🏭 Production (Later, When Deploying)

When you deploy, you'll **not** use `.env` files. Instead:

- **Vercel / Netlify** (frontend) → set env vars in the dashboard
- **Railway / Render / Fly.io** (backend) → set env vars in the dashboard
- **AWS / GCP** → use Secrets Manager or Parameter Store

The same variable names, just stored in the platform instead of `.env`.

---

## TL;DR

| Question | Answer |
|---|---|
| Where do I put my Gemini key right now? | `backend/.env` |
| Can I commit `.env`? | **NO** — it's gitignored |
| What do I commit instead? | `.env.example` with placeholders |
| Frontend keys go where? | `frontend/.env.local` (later) |
| If I leak a key? | Revoke it immediately, create a new one |

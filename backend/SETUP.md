# Backend Setup Guide

Step-by-step instructions to get the FastAPI backend running locally.

---

## Prerequisites (Already Installed ✅)

- Python 3.13.5
- MongoDB 6.0.20
- Git 2.50.1

## Still Needed

- [ ] Redis → `brew install redis && brew services start redis`
- [ ] Gemini API key (from https://aistudio.google.com/apikey)

---

## Setup Steps

### 1. Move into the backend folder

```bash
cd /Users/anikeshpathak/Documents/mk/nextjs/nxt/backend
```

### 2. Create a Python virtual environment

A virtual environment ("venv") isolates this project's Python packages from your system Python.

```bash
python3 -m venv venv
```

You'll see a new `venv/` folder appear inside `backend/`. **Don't commit it** — it's already in `.gitignore`.

### 3. Activate the virtual environment

```bash
source venv/bin/activate
```

Your terminal prompt should now show `(venv)` at the start. This means the venv is active.

> To **deactivate** later, just run `deactivate`.

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

This installs FastAPI, MongoDB driver, Redis client, Gemini SDK, etc. Takes 1–2 minutes.

### 5. Create your `.env` file

```bash
cp .env.example .env
```

This copies the template into a real `.env` file. **`.env` is gitignored — it never gets committed.**

### 6. Add your Gemini API key

Open `.env` in VS Code:

```bash
code .env
```

Find this line:

```
GEMINI_API_KEY=paste_your_new_gemini_key_here
```

Replace `paste_your_new_gemini_key_here` with your actual key (starts with `AIzaSy...`).

Save the file.

### 7. Make sure MongoDB & Redis are running

```bash
brew services start mongodb-community
brew services start redis
```

Check they're up:

```bash
brew services list
```

Both should show `started`.

### 8. Run the dev server

```bash
uvicorn app.main:app --reload
```

You should see something like:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### 9. Test it in the browser

- **http://localhost:8000** → `{"status": "ok", "message": "AI Chat API is running"}`
- **http://localhost:8000/docs** → Interactive Swagger UI
- **http://localhost:8000/health** → `{"status": "healthy", "env": "development"}`

✅ If you see these, the backend is working.

---

## Daily Workflow (After Initial Setup)

Each time you come back to work:

```bash
cd /Users/anikeshpathak/Documents/mk/nextjs/nxt/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

Press `Ctrl+C` to stop the server.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `command not found: uvicorn` | venv not activated | Run `source venv/bin/activate` |
| `Import "fastapi" could not be resolved` (in editor) | Dependencies not installed | Run `pip install -r requirements.txt` |
| `Address already in use` | Port 8000 busy | `lsof -ti:8000 \| xargs kill -9` then retry |
| `MongoDB connection refused` | MongoDB not running | `brew services start mongodb-community` |
| `Redis connection refused` | Redis not running | `brew services start redis` |
| Pylance "X not accessed" | Editor false positive | Safe to ignore |

---

## Where Are All the Keys & Secrets Stored?

See [SECRETS.md](./SECRETS.md) for the full guide. Short version:

- **Backend secrets** → `backend/.env` (gitignored)
- **Frontend secrets** → `frontend/.env.local` (gitignored, created later)
- **Never commit secrets** to git
- **Never paste secrets** into chat, screenshots, or shared docs

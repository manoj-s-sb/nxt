# AI Chat Backend

FastAPI backend for an AI chat app with memory.

## Tech Stack

- **FastAPI** — web framework
- **MongoDB** (Beanie ODM) — persistent storage
- **Redis** — short-term conversation memory
- **Google Gemini** — LLM (`gemini-2.0-flash`) + embeddings (`text-embedding-004`)
- **JWT** — authentication

## Project Structure

```
backend/
├── app/
│   ├── api/v1/endpoints/   # Route handlers (auth, chat, conversations, memory)
│   ├── core/               # Config, security, logging
│   ├── db/                 # MongoDB connection & init
│   ├── models/             # Beanie Document models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── services/           # Business logic
│   ├── memory/             # Short-term + long-term memory
│   ├── llm/                # Gemini client + embeddings
│   ├── utils/              # Helpers
│   └── main.py             # FastAPI app entry
├── tests/                  # Pytest tests
├── .env.example            # Copy to .env and fill in
├── requirements.txt
└── README.md
```

## Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and paste your Gemini API key.

4. **Make sure MongoDB & Redis are running**
   ```bash
   brew services start mongodb-community
   brew services start redis
   ```

5. **Run dev server**
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Open the docs**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs

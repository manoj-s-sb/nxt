# Backend Explained — Like You're 5

A super-simple guide to **why** we picked these tools and **how** the login API works.

---

## 🍕 The Restaurant Analogy

Think of the backend as a **restaurant**. Different people have different jobs:

| Restaurant role | Backend role |
|---|---|
| 🚪 Door / waiter taking orders | **API endpoints** (`api/v1/endpoints/`) |
| 🧑‍🍳 Chef cooking the food | **Services** (`services/`) |
| 📋 Menu (what you can order) | **Schemas** (`schemas/`) |
| 🗃️ Fridge / pantry storing ingredients | **Database / Models** (`models/`, `db/`) |
| 🔑 Security guard at the door | **Auth dependency** (`api/deps.py`) |
| 📜 Rule book the staff follows | **Core / Config** (`core/`) |

Customers (the frontend / your browser) talk only to the **waiter**. The waiter goes to the kitchen, the kitchen goes to the fridge. Customers never go to the kitchen themselves.

---

## 🐍 Why Python?

We could have used JavaScript, Java, Go, or many others. We chose **Python** because:

1. **Easy to read** — looks like English (`if user exists: return user`)
2. **Best AI ecosystem** — every AI library (Gemini, OpenAI, etc.) has Python first
3. **Beginner-friendly** — fewer weird symbols than C++/Java

**Version we're using: Python 3.13.5** (your system).

---

## ⚡ Why FastAPI?

A "web framework" is a toolbox for building APIs. Python has 3 famous ones:

| Framework | Speed | Easy to learn? | Auto-docs? |
|---|---|---|---|
| **FastAPI** ⭐ | 🚀 Very fast | ✅ Yes | ✅ Built-in |
| Flask | 🐢 Slow | ✅ Yes | ❌ No |
| Django | 🚗 Medium | ⚠️ Complex | ❌ No |

**Why FastAPI wins for us:**
- It **auto-generates documentation** at `/docs` (the Swagger UI you used)
- It checks data **automatically** (e.g., "email must be a real email")
- It supports **async** (handles many users at once without lag)
- Modern Python features (type hints)

**Version: 0.115.6**

---

## 📦 Every Library We Use — In Plain English

| Library | Version | What it does | Why we need it |
|---|---|---|---|
| **fastapi** | 0.115.6 | Web framework | Builds the API |
| **uvicorn** | 0.34.0 | Server | Runs FastAPI (the engine) |
| **beanie** | 1.29.0 | MongoDB ODM | Talk to MongoDB using Python classes |
| **motor** | 3.6.1 | MongoDB async driver | The actual phone line to MongoDB |
| **redis** | 5.2.1 | Redis client | Talk to Redis (short-term memory) |
| **google-generativeai** | 0.8.3 | Gemini SDK | Talk to Google's AI |
| **python-jose** | 3.3.0 | JWT library | Create/verify login tokens |
| **passlib[bcrypt]** | 1.7.4 | Password hasher | Scramble passwords safely |
| **pydantic** | 2.10.4 | Data validator | Check that data has the right shape |
| **pydantic-settings** | 2.7.0 | Settings loader | Reads `.env` file |
| **email-validator** | 2.2.0 | Email checker | Is `bob@bob.com` a real email format? |
| **python-multipart** | 0.0.20 | Form data parser | Handles file uploads (used later) |
| **httpx** | 0.28.1 | HTTP client | Makes web requests from Python |

---

## 📁 Folder Structure — Each Folder's Job

```
backend/
├── app/
│   ├── api/          ← The "waiter" — talks to customers
│   ├── core/         ← The "rule book" — config & security
│   ├── db/           ← The "fridge" — database connection
│   ├── models/       ← What things look like in the fridge
│   ├── schemas/      ← The menu — what customers can order/receive
│   ├── services/     ← The "chef" — does the actual work
│   ├── memory/       ← The AI's brain (later)
│   ├── llm/          ← Talking to Gemini AI (later)
│   ├── utils/        ← Helper tools
│   └── main.py       ← The "front door" — first file that runs
├── tests/            ← Tests for everything
└── requirements.txt  ← Shopping list of libraries to install
```

### Why this separation matters

Imagine if the waiter also cooked the food **and** stored the ingredients. Chaos. With separated jobs:
- If we change the database (MongoDB → PostgreSQL), only `models/` and `db/` change.
- If we change the AI (Gemini → Claude), only `llm/` changes.
- If we change the API URL, only `api/` changes.

This is called **separation of concerns**. One folder = one job.

---

## 🔐 The Login API — Step by Step (How Files Talk)

When you call `POST /api/v1/auth/login` with email and password, here's the full journey:

```
   🧑 Browser
       │  sends { email, password }
       ▼
┌──────────────────────────────────────┐
│ 1. app/main.py                       │  Front door — receives the request
│    "Hey, FastAPI, route this!"       │
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 2. app/api/v1/router.py              │  Says "anything starting with
│    "Login? Send to auth endpoints"   │   /api/v1 goes to v1 routes"
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 3. app/api/v1/endpoints/auth.py      │  THE WAITER
│    "I got a login request!"          │
└──────────────────────────────────────┘
       │
       │  Step A: Validate input
       ▼
┌──────────────────────────────────────┐
│ 4. app/schemas/user.py               │  THE MENU
│    UserLogin checks:                 │
│    - Is email a real email?          │
│    - Is password a string?           │
│    ❌ If bad → 422 error             │
└──────────────────────────────────────┘
       │  ✅ Looks good
       │  Step B: Hand to chef
       ▼
┌──────────────────────────────────────┐
│ 5. app/services/auth_service.py      │  THE CHEF
│    authenticate_user(email, pwd):    │
│    - Find user in DB                 │
│    - Check password matches          │
└──────────────────────────────────────┘
       │
       ├──────────► 6. app/models/user.py     (THE FRIDGE LABEL)
       │            "Here's what a User looks like"
       │
       ├──────────► 7. app/db/mongodb.py      (THE FRIDGE)
       │            Goes into MongoDB and gets the user
       │
       └──────────► 8. app/core/security.py   (THE SECURITY GUARD)
                    "Does this password match the hashed one?"
                    Uses bcrypt to check
       │
       ▼ (if password is correct)
┌──────────────────────────────────────┐
│ 9. app/core/security.py              │  Creates a JWT TOKEN
│    create_access_token(user_id)      │  Like a signed wristband
└──────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ 10. Back to auth.py                  │
│     Sends back { access_token: "..." }│
└──────────────────────────────────────┘
       │
       ▼
   🧑 Browser saves the token
```

### When you call `GET /me` later

The browser sends the token in the `Authorization: Bearer XXX` header.

```
   🧑 Browser (with token)
       │
       ▼
┌──────────────────────────────────────┐
│ app/api/deps.py                      │  THE SECURITY GUARD AT THE DOOR
│ get_current_user(token):             │
│ - Decode token                       │
│ - Look up user_id in MongoDB         │
│ - Return user                        │
│ ❌ If invalid → 401 error            │
└──────────────────────────────────────┘
       │  ✅ Valid
       ▼
   /me endpoint returns user info
```

---

## 🔑 The 3 Big Concepts to Remember

### 1. Passwords are NEVER stored as text

When you register with password `test12345`:

```
"test12345"  ──[bcrypt scramble]──▶  "$2b$12$N9hT8kQwY1J..."
                                     (saved in MongoDB)
```

Even if a hacker steals the database, they can't read the password.

### 2. JWT tokens = signed wristbands

After login, the server gives you a long string like:

```
eyJhbGciOiJIUzI1NiIs.eyJzdWIiOiI2NTQ.signature
```

It contains:
- **WHO you are** (your user ID)
- **WHEN it expires** (7 days from now)
- **A signature** the server made (so it can't be faked)

You attach this token to every request. The server reads it and goes "OK, this is user X".

### 3. The 3 Layers

```
ENDPOINTS  →  SERVICES  →  MODELS+DB
(thin)        (logic)      (data)
```

Each file should do **one job only**. If the endpoint is doing math, that math belongs in the service. If the service is checking string formats, that belongs in the schema.

---

## 🧪 What Happens When You Hit Register?

Let's trace it for `POST /api/v1/auth/register`:

```json
{ "email": "test@test.com", "password": "test12345" }
```

1. **main.py** receives the HTTP request
2. **router.py** says "/auth/register → auth.py"
3. **auth.py register()** is called
4. **schemas/user.py UserRegister** checks: real email? password ≥ 8 chars?
5. **auth_service.register_user()** is called
6. It searches MongoDB via **models/user.py User**: does this email exist?
7. If yes → throw `EmailAlreadyRegisteredError` → endpoint returns **409 Conflict**
8. If no → **security.py hash_password()** scrambles the password
9. **models/user.py** creates a new User document
10. **mongodb.py** saves it (via Beanie's `.insert()`)
11. Endpoint returns **201 Created** with user info (no password!)

---

## 💡 Bottom Line

| Question | Answer |
|---|---|
| Why Python? | Best for AI + easy to read |
| Why FastAPI? | Fast, auto-docs, modern |
| Why MongoDB? | Flexible data, you chose it |
| Why so many folders? | One folder = one job (clean code) |
| Why JWT? | A signed wristband — proves you logged in |
| Why bcrypt? | Scrambles passwords so they can't be read |
| Why Beanie? | Lets us use Python classes instead of raw DB queries |
| Why .env file? | Keeps secrets (Gemini key, JWT secret) out of code |

Every folder has **one job**. Every file in that folder is a small worker doing that job. They pass data between each other like an assembly line.

That's it. That's the whole backend. 🎉

# 🧠 SlideMind AI

<div align="center">

**Transform Lecture Slides into Structured Knowledge**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen?style=for-the-badge&logo=google-cloud)](https://slidemind-ui-703383698921.us-central1.run.app)
[![API Status](https://img.shields.io/badge/API-Running-blue?style=for-the-badge&logo=fastapi)](https://slidemind-api-703383698921.us-central1.run.app)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)
[![Made with](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange?style=for-the-badge&logo=google)](https://aistudio.google.com)

*SlideMind AI is a production-grade, AI-powered smart learning platform that converts static lecture slides (PDF/PPTX) into dynamic, interactive study experiences — complete with summaries, topic breakdowns, AI chat tutoring, and custom practice exams.*

[**→ Try the Live App**](https://slidemind-ui-703383698921.us-central1.run.app) · [**→ View API Docs**](https://slidemind-api-703383698921.us-central1.run.app/docs)

</div>

---

## 📸 Overview

SlideMind AI takes your lecture materials and runs them through a pipeline of AI features — all accessible through a clean, focused light-theme interface built for long study sessions.

Upload once. Summarize instantly. Study smarter.

---

## ✨ Features

### 🤖 AI-Powered Learning
- **Executive Summaries** — instantly distills lecture content into a concise overview with key bullet points and exam-critical focus areas
- **Topic Extraction** — automatically identifies 3–7 distinct topics from your slides and builds a structured knowledge map
- **Deep-Dive Explanations** — click any topic to get a teacher-style breakdown with real-world examples, formatted in clean Markdown
- **AI Chat Tutor** — a contextual assistant that has "read" your slides and answers your specific questions 24/7
- **Smart Quiz Generator** — generates configurable MCQ practice exams (Easy / Medium / Hard, 5–15 questions) with explanations for every answer

### 💾 Smart Caching
- AI results (summaries, topics) are saved to the database after the first generation
- Reopening a lecture from history **never re-calls the AI** — results load instantly at zero token cost
- A **✓ AI cached** badge appears on history cards so you always know what's pre-processed

### 📂 Document Management
- Upload PDF and PowerPoint (PPTX/PPT) files up to 50MB
- Full upload history per user account, sorted by most recent
- One-click delete to remove any lecture from your history
- Session-based document state so your active lecture persists across tabs

### 🔐 Authentication
- Secure JWT-based signup and login
- All documents and AI cache are scoped to the authenticated user
- Demo mode available without login — try the full feature set with a sample lecture

### 🎨 UI/UX
- Premium light theme (Slate/White/Brand Blue) optimized for focus
- Smooth Framer Motion animations throughout
- Glassmorphism cards and custom scrollbar styling
- Fully responsive — works on desktop and mobile

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) (App Router) | React framework with SSR |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations and transitions |
| [Lucide React](https://lucide.dev/) | Icon library |
| [React Hot Toast](https://react-hot-toast.com/) | Notification toasts |
| [React Markdown](https://github.com/remarkjs/react-markdown) | Rendering AI Markdown output |
| [Axios](https://axios-http.com/) | HTTP client with interceptors |

### Backend
| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | Async Python API framework |
| [Google Gemini 2.5 Flash](https://ai.google.dev/) | AI summarization, chat, quiz |
| [SQLAlchemy 2.0](https://www.sqlalchemy.org/) | Async ORM |
| [SQLite + aiosqlite](https://docs.python.org/3/library/sqlite3.html) | Local database (dev) |
| [python-pptx](https://python-pptx.readthedocs.io/) | PowerPoint parsing |
| [pdfminer.six](https://pdfminersix.readthedocs.io/) | PDF text extraction |
| [python-jose](https://python-jose.readthedocs.io/) | JWT authentication |
| [passlib + bcrypt](https://passlib.readthedocs.io/) | Password hashing |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |

### Infrastructure
| Technology | Purpose |
|---|---|
| [Google Cloud Run](https://cloud.google.com/run) | Serverless container hosting |
| [Google Cloud Build](https://cloud.google.com/build) | Automated container builds |
| [Google Artifact Registry](https://cloud.google.com/artifact-registry) | Container image storage |
| [Docker](https://www.docker.com/) | Containerization |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│              Next.js 14 Frontend (App Router)            │
│         Tailwind CSS · Framer Motion · Axios             │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS REST API
┌──────────────────────▼──────────────────────────────────┐
│              FastAPI Backend (Cloud Run)                  │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  /upload │  │  /ai     │  │  /quiz   │  │ /auth  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│                       │                                   │
│            ┌──────────┴──────────┐                       │
│            │                     │                        │
│     ┌──────▼──────┐    ┌────────▼────────┐              │
│     │  SQLite DB   │    │  Gemini 2.5     │              │
│     │  (Users,     │    │  Flash API      │              │
│     │  Documents,  │    │  (Summarize,    │              │
│     │  AI Cache)   │    │  Chat, Quiz)    │              │
│     └─────────────┘    └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Create new account | ❌ |
| `POST` | `/api/auth/login` | Login, returns JWT | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |
| `POST` | `/api/upload/` | Upload and parse PDF/PPTX | ✅ |
| `GET` | `/api/upload/history` | Get user's document history | ✅ |
| `DELETE` | `/api/upload/{id}` | Delete a document | ✅ |
| `POST` | `/api/ai/summarize` | Generate AI summary (cached) | Optional |
| `POST` | `/api/ai/topics` | Extract topic structure (cached) | Optional |
| `POST` | `/api/ai/explain` | Deep-dive explanation | Optional |
| `POST` | `/api/ai/chat` | Chat with slide content | Optional |
| `POST` | `/api/quiz/generate` | Generate MCQ quiz | Optional |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- Python v3.10+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/Ahtisham992/slidemind-ai.git
cd slidemind-ai
```

### 2. Backend setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
echo "GOOGLE_API_KEY=your_gemini_api_key_here" > .env
echo "SECRET_KEY=your_jwt_secret_here" >> .env

# Start the server
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000` · API docs at `http://localhost:8000/docs`

### 3. Frontend setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start dev server
npm run dev
```
Frontend runs at `http://localhost:3000`

---

## ☁️ Cloud Deployment (Google Cloud Run)

### Prerequisites
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
- A GCP project with billing enabled
- Gemini API enabled: `gcloud services enable generativelanguage.googleapis.com`

### Deploy Backend
```bash
cd backend
gcloud run deploy slidemind-api \
  --source . \
  --allow-unauthenticated \
  --region us-central1 \
  --set-env-vars GOOGLE_API_KEY=your_key,SECRET_KEY=your_secret
```

### Deploy Frontend
```bash
cd frontend
gcloud run deploy slidemind-ui \
  --source . \
  --allow-unauthenticated \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://your-backend-url.run.app
```

### Update environment variables (without rebuilding)
```bash
gcloud run services update slidemind-api \
  --region us-central1 \
  --update-env-vars GOOGLE_API_KEY=new_key_here
```

---

## ⚠️ Production Considerations

### Database Persistence
The current setup uses **SQLite stored inside the container**, which means data is wiped on every deployment or container restart. For production, migrate to a persistent database:

**Option A — Google Cloud SQL (PostgreSQL)**
```bash
gcloud sql instances create slidemind-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```
Then update `DATABASE_URL` in `backend/database.py` to use `postgresql+asyncpg://`.

**Option B — Supabase (Free tier)**
Sign up at [supabase.com](https://supabase.com), create a project, and use the provided PostgreSQL connection string.

### Token Usage & Cost
SlideMind AI uses **Gemini 2.5 Flash** which is highly cost-efficient:

| Operation | Est. tokens | Notes |
|---|---|---|
| Summarize | ~1,500 | Cached after first call |
| Topic extraction | ~2,000 | Cached after first call |
| Topic explanation | ~1,200 | Per topic click |
| Quiz (10 questions) | ~2,500 | Per quiz attempt |
| Chat message | ~800 | Always live |

At $0.15 / 1M input tokens, you can run approximately **80,000 summarizations for $1**. The DB caching system ensures AI is only called once per document for summaries and topics.

---

## 📁 Project Structure

```
slidemind-ai/
├── backend/
│   ├── models/
│   │   ├── db_models.py        # SQLAlchemy ORM models (User, Document)
│   │   └── schemas.py          # Pydantic request/response schemas
│   ├── routers/
│   │   ├── ai.py               # AI endpoints (summarize, topics, chat, explain)
│   │   ├── auth.py             # JWT authentication endpoints
│   │   ├── quiz.py             # Quiz generation endpoint
│   │   └── upload.py           # File upload, history, delete endpoints
│   ├── services/
│   │   ├── auth_service.py     # Password hashing, JWT encode/decode
│   │   ├── file_parser.py      # PDF and PPTX parsing logic
│   │   └── gemini_service.py   # All Gemini AI API calls
│   ├── database.py             # SQLAlchemy engine and session setup
│   ├── main.py                 # FastAPI app, middleware, router registration
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile              # Container definition
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.js         # Landing page with demo mode
│       │   ├── upload/         # Upload page with history and delete
│       │   ├── learn/          # Main study interface (tabs)
│       │   ├── login/          # Login page
│       │   └── signup/         # Signup page
│       ├── components/
│       │   ├── ChatAssistant.js    # AI chat sidebar
│       │   ├── SummaryPanel.js     # Summary + key points display
│       │   ├── TopicsPanel.js      # Topic cards + deep-dive view
│       │   ├── QuizPanel.js        # Interactive MCQ quiz
│       │   ├── UploadZone.js       # Drag-and-drop file upload
│       │   ├── Navbar.js           # Top navigation with auth state
│       │   └── Footer.js           # Site footer
│       ├── context/
│       │   └── AuthContext.js  # Global auth state (login, logout, user)
│       └── lib/
│           ├── api.js          # Axios API client with auth interceptor
│           └── demoData.js     # Static demo document for unauthenticated demo
│
├── docker-compose.yml          # Local multi-service development
├── DEPLOYMENT.md               # Step-by-step Cloud Run deployment guide
└── README.md                   # This file
```

---

## 🔧 Known Limitations & Roadmap

### Current Limitations
- SQLite database is ephemeral on Cloud Run (data lost on redeploy)
- Quiz results are not cached or saved to history
- No support for image-heavy slides (text extraction only)
- Single language support (English)

### Planned Features
- [ ] Persistent PostgreSQL database (Cloud SQL / Supabase)
- [ ] Quiz result history and score tracking
- [ ] Flashcard generation mode
- [ ] Multi-language support
- [ ] Slide image OCR for scanned PDFs
- [ ] Study session scheduling and reminders
- [ ] Export summaries as PDF or Word documents
- [ ] Collaborative study rooms

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Muhammad Ahtisham**

[![GitHub](https://img.shields.io/badge/GitHub-Ahtisham992-black?style=flat-square&logo=github)](https://github.com/Ahtisham992)

---

<div align="center">

Crafted with 🧠 and ☕ by Muhammad Ahtisham

*If this project helped you, consider giving it a ⭐ on GitHub!*

</div>
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, ai, quiz, auth
from dotenv import load_dotenv
from database import engine, Base

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="SlideMind AI API",
    description="AI-powered smart learning platform that transforms lecture slides into structured knowledge",
    version="1.0.0"
)

@app.on_event("startup")
async def startup():
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Processing"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])

@app.get("/")
async def root():
    return {"message": "SlideMind AI API is running 🚀", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
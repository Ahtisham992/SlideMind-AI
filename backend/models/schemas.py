from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
import datetime


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class SlideContent(BaseModel):
    slide_number: int
    title: Optional[str] = None
    content: str


class ParsedDocument(BaseModel):
    filename: str
    total_slides: int
    slides: List[SlideContent]
    raw_text: str


class SummarizeRequest(BaseModel):
    text: str
    mode: Optional[str] = "standard"  # standard | detailed | exam


class SummarizeResponse(BaseModel):
    summary: str
    key_points: List[str]
    topics: List[str]
    ai_recommended: Optional[List[str]] = []


class ExplainRequest(BaseModel):
    text: str
    topic: Optional[str] = None


class ExplainResponse(BaseModel):
    explanation: str
    examples: List[str]
    steps: Optional[List[str]] = None


class ChatRequest(BaseModel):
    question: str
    context: Optional[str] = None
    history: Optional[List[dict]] = []


class ChatResponse(BaseModel):
    answer: str
    suggestions: Optional[List[str]] = []


class QuizRequest(BaseModel):
    text: str
    difficulty: Difficulty = Difficulty.medium
    num_questions: int = 10


class MCQOption(BaseModel):
    label: str
    text: str


class MCQQuestion(BaseModel):
    question: str
    options: List[MCQOption]
    correct_answer: str
    explanation: str


class QuizResponse(BaseModel):
    questions: List[MCQQuestion]
    total: int
    difficulty: str


class TopicStructure(BaseModel):
    title: str
    slides: List[int]
    summary: str
    key_concepts: List[str]


class DocumentStructure(BaseModel):
    topics: List[TopicStructure]
    total_topics: int
# --- Auth Schemas ---

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class DocumentInfo(BaseModel):
    id: int
    filename: str
    raw_text: str
    total_slides: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

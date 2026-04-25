from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.db_models import Document
from models.schemas import (
    SummarizeRequest, SummarizeResponse,
    ExplainRequest, ExplainResponse,
    ChatRequest, ChatResponse,
    DocumentStructure
)
from services import gemini_service
import json
from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from services.auth_service import decode_access_token
from models.db_models import User

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

async def get_optional_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Returns user if token valid, None if no token (demo mode)."""
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    email = payload.get("sub")
    if not email:
        return None
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalars().first()


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(
    request: SummarizeRequest,
    doc_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text content is too short to summarize.")

    # Check DB cache first (only if logged in and doc_id provided)
    if doc_id and current_user:
        result = await db.execute(
            select(Document).filter(Document.id == doc_id, Document.user_id == current_user.id)
        )
        doc = result.scalars().first()
        if doc and doc.summary_cache:
            cached = json.loads(doc.summary_cache)
            return SummarizeResponse(**cached)

    try:
        result_data = gemini_service.summarize_content(request.text, request.mode or "standard")
        response = SummarizeResponse(
            summary=result_data.get("summary", ""),
            key_points=result_data.get("key_points", []),
            topics=result_data.get("topics", []),
            ai_recommended=result_data.get("ai_recommended", [])
        )

        # Save to DB cache
        if doc_id and current_user:
            db_result = await db.execute(
                select(Document).filter(Document.id == doc_id, Document.user_id == current_user.id)
            )
            doc = db_result.scalars().first()
            if doc:
                doc.summary_cache = json.dumps(response.dict())
                await db.commit()

        return response
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")


@router.post("/explain", response_model=ExplainResponse)
async def explain(request: ExplainRequest):
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text content is too short to explain.")
    try:
        result = gemini_service.explain_content(request.text, request.topic)
        return ExplainResponse(
            explanation=result.get("explanation", ""),
            examples=result.get("examples", []),
            steps=result.get("steps", [])
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.question or len(request.question.strip()) < 3:
        raise HTTPException(status_code=400, detail="Question is too short.")
    try:
        result = gemini_service.chat_with_content(
            request.question,
            request.context or "",
            request.history or []
        )
        return ChatResponse(
            answer=result.get("answer", ""),
            suggestions=result.get("suggestions", [])
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")


@router.post("/topics", response_model=DocumentStructure)
async def extract_topics(
    request: SummarizeRequest,
    doc_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    if not request.text or len(request.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Content is too short for topic extraction.")

    # Check DB cache first
    if doc_id and current_user:
        result = await db.execute(
            select(Document).filter(Document.id == doc_id, Document.user_id == current_user.id)
        )
        doc = result.scalars().first()
        if doc and doc.topics_cache:
            cached = json.loads(doc.topics_cache)
            from models.schemas import TopicStructure
            topics = [TopicStructure(**t) for t in cached.get("topics", [])]
            return DocumentStructure(topics=topics, total_topics=cached.get("total_topics", len(topics)))

    try:
        result_data = gemini_service.extract_topics(request.text)
        topics_data = result_data.get("topics", [])

        from models.schemas import TopicStructure
        topics = [
            TopicStructure(
                title=t.get("title", "Untitled"),
                slides=t.get("slides", []),
                summary=t.get("summary", ""),
                key_concepts=t.get("key_concepts", [])
            )
            for t in topics_data
        ]
        doc_structure = DocumentStructure(
            topics=topics,
            total_topics=result_data.get("total_topics", len(topics))
        )

        # Save to DB cache
        if doc_id and current_user:
            db_result = await db.execute(
                select(Document).filter(Document.id == doc_id, Document.user_id == current_user.id)
            )
            doc = db_result.scalars().first()
            if doc:
                doc.topics_cache = json.dumps(doc_structure.dict())
                await db.commit()

        return doc_structure
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
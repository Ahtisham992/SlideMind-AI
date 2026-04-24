from fastapi import APIRouter, HTTPException
from models.schemas import (
    SummarizeRequest, SummarizeResponse,
    ExplainRequest, ExplainResponse,
    ChatRequest, ChatResponse,
    DocumentStructure
)
from services import gemini_service

router = APIRouter()


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    """Generate AI summary from slide content."""
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text content is too short to summarize.")
    
    try:
        result = gemini_service.summarize_content(request.text, request.mode or "standard")
        return SummarizeResponse(
            summary=result.get("summary", ""),
            key_points=result.get("key_points", []),
            topics=result.get("topics", []),
            ai_recommended=result.get("ai_recommended", [])
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")


@router.post("/explain", response_model=ExplainResponse)
async def explain(request: ExplainRequest):
    """Generate teacher-style explanation of content."""
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
    """Answer student questions about slide content."""
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
async def extract_topics(request: SummarizeRequest):
    """Extract structured topics from slide content."""
    if not request.text or len(request.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Content is too short for topic extraction.")
    
    try:
        result = gemini_service.extract_topics(request.text)
        topics_data = result.get("topics", [])
        
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
        
        return DocumentStructure(
            topics=topics,
            total_topics=result.get("total_topics", len(topics))
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
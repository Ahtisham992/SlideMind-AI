from fastapi import APIRouter, HTTPException
from models.schemas import QuizRequest, QuizResponse, MCQQuestion, MCQOption
from services import gemini_service

router = APIRouter()


@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generate MCQ quiz from slide content."""
    if not request.text or len(request.text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Content is too short to generate a meaningful quiz."
        )
    
    if not 1 <= request.num_questions <= 20:
        raise HTTPException(
            status_code=400,
            detail="Number of questions must be between 1 and 20."
        )
    
    try:
        result = gemini_service.generate_quiz(
            request.text,
            request.difficulty.value,
            request.num_questions
        )
        
        questions = []
        for q in result.get("questions", []):
            options = [
                MCQOption(label=opt.get("label", ""), text=opt.get("text", ""))
                for opt in q.get("options", [])
            ]
            questions.append(MCQQuestion(
                question=q.get("question", ""),
                options=options,
                correct_answer=q.get("correct_answer", "A"),
                explanation=q.get("explanation", "")
            ))
        
        return QuizResponse(
            questions=questions,
            total=len(questions),
            difficulty=request.difficulty.value
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")
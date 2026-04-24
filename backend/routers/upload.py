from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.file_parser import parse_file
from models.schemas import ParsedDocument, DocumentInfo
from routers.auth import get_current_user
from models.db_models import User, Document
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from typing import List

router = APIRouter()

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


@router.post("/", response_model=ParsedDocument)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload, parse, and save a PDF or PPTX file to user history."""
    
    # Validate file type
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint"
    ]
    
    filename = file.filename or "document"
    filename_lower = filename.lower()
    
    if not (filename_lower.endswith('.pdf') or 
            filename_lower.endswith('.pptx') or 
            filename_lower.endswith('.ppt')):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload PDF or PowerPoint (PPTX/PPT) files only."
        )
    
    # Read file content
    file_bytes = await file.read()
    
    # Validate file size
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB."
        )
    
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")
    
    # Parse the file
    try:
        content_type = file.content_type or ""
        parsed = parse_file(file_bytes, filename, content_type)
        
        # Save to database
        db_doc = Document(
            filename=parsed.filename,
            raw_text=parsed.raw_text,
            total_slides=parsed.total_slides,
            user_id=current_user.id
        )
        db.add(db_doc)
        await db.commit()
        
        return parsed
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@router.get("/history", response_model=List[DocumentInfo])
async def get_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve history of uploaded documents for current user."""
    result = await db.execute(
        select(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
    )
    documents = result.scalars().all()
    return documents
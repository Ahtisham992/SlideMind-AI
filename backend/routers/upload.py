from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.file_parser import parse_file
from models.schemas import ParsedDocument, DocumentInfo, DeleteResponse
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
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload PDF or PowerPoint files only.")
    
    file_bytes = await file.read()
    
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB.")
    
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")
    
    try:
        content_type = file.content_type or ""
        parsed = parse_file(file_bytes, filename, content_type)
        
        db_doc = Document(
            filename=parsed.filename,
            raw_text=parsed.raw_text,
            total_slides=parsed.total_slides,
            user_id=current_user.id
        )
        db.add(db_doc)
        await db.commit()
        await db.refresh(db_doc)
        
        # Attach db id to response so frontend can use it
        parsed_dict = parsed.dict()
        parsed_dict['doc_id'] = db_doc.id
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
    result = await db.execute(
        select(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
    )
    documents = result.scalars().all()
    return documents


@router.delete("/{doc_id}", response_model=DeleteResponse)
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document).filter(
            Document.id == doc_id,
            Document.user_id == current_user.id
        )
    )
    doc = result.scalars().first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    await db.delete(doc)
    await db.commit()
    return DeleteResponse(message="Document deleted successfully.", id=doc_id)
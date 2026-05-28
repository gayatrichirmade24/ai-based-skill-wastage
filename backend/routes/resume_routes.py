from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from database import resume_collection
from resume_parser import extract_text

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(
    firebase_uid: str = Form(...),
    file: UploadFile = File(...)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted."
        )

    text = await extract_text(file)

    if not text or len(text.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF."
        )

    resume = {
        "firebase_uid": firebase_uid,
        "file_name": file.filename,
        "extracted_text": text,
        "text_length": len(text),
        "created_at": datetime.now(timezone.utc),
    }
    inserted = resume_collection.insert_one(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": str(inserted.inserted_id),
        "firebase_uid": firebase_uid,
        "file_name": file.filename,
        "extracted_text": text
    }


@router.delete("/resume/{resume_id}")
def delete_resume(resume_id: str):
    """Delete one uploaded resume by MongoDB document id."""
    try:
        object_id = ObjectId(resume_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid resume id.") from exc

    result = resume_collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found.")

    return {"message": "Resume deleted successfully", "resume_id": resume_id}

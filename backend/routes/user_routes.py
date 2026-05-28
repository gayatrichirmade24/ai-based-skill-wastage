from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from models import UserRegister
from database import users_collection

router = APIRouter()


@router.post("/register")
def register(data: UserRegister):
    """
    Called once after Firebase signup.
    Stores the user's name, email, and Firebase UID in MongoDB.
    """
    existing = users_collection.find_one({"firebase_uid": data.firebase_uid})
    if existing:
        return {"message": "User already registered"}

    users_collection.insert_one({
        "name": data.name,
        "email": data.email,
        "firebase_uid": data.firebase_uid,
        "created_at": datetime.now(timezone.utc),
    })
    return {"message": "User registered successfully"}


@router.get("/profile/{firebase_uid}")
def get_profile(firebase_uid: str):
    """Fetch user profile from MongoDB."""
    user = users_collection.find_one({"firebase_uid": firebase_uid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "name": user["name"],
        "email": user["email"],
        "firebase_uid": user["firebase_uid"],
    }

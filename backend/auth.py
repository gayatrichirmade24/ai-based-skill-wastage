from database import users_collection
from utils.hashing import hash_password, verify_password

def register_user(data):
    data["password"] = hash_password(data["password"])
    users_collection.insert_one(data)
    return {"message": "User registered"}

def login_user(data):
    user = users_collection.find_one({"email": data["email"]})
    if user and verify_password(data["password"], user["password"]):
        return {"message": "Login successful", "user_id": str(user["_id"])}
    return {"error": "Invalid credentials"}
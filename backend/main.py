from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes, resume_routes, analysis_routes

app = FastAPI(title="Skill Wastage Score API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router, tags=["Users"])
app.include_router(resume_routes.router, tags=["Resume"])
app.include_router(analysis_routes.router, tags=["Analysis"])


@app.get("/")
def home():
    return {"message": "Skill Wastage Score Backend Running"}

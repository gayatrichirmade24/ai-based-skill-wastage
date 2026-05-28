from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    firebase_uid: str


class UserLogin(BaseModel):
    firebase_uid: str


class ResumeUploadResponse(BaseModel):
    message: str
    resume_id: str


class AnalyzeRequest(BaseModel):
    firebase_uid: str
    resume_id: str
    resume_text: str
    job_description: str = ""
    current_role: str | None = None
    profile_text: str | None = None


class JobMatch(BaseModel):
    role: str
    match_percent: float
    matched_skills: list[str]
    missing_skills: list[str] = []


class AnalyzeResponse(BaseModel):
    resume_id: str
    resume_skills: list[str]
    job_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]
    unused_skills: list[str]
    skill_wastage_score: float
    job_fit_score: float
    confidence_level: str
    recommended_jobs: list[JobMatch]
    recommendations: list[str]


class ResultResponse(BaseModel):
    resume_id: str
    resume_skills: list[str]
    job_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]
    unused_skills: list[str]
    skill_wastage_score: float
    job_fit_score: float
    confidence_level: str
    recommended_jobs: list[dict]
    recommendations: list[str]

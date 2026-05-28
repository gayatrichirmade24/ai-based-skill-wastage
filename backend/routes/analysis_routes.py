from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from models import AnalyzeRequest
from ai_logic import (
    build_dashboard_report,
    calculate_job_fit,
    calculate_score,
    confidence_level,
    extract_skills,
    infer_role_skills,
    match_skills,
    missing_skills,
    recommend_improvements,
    recommend_jobs,
    unused_skills,
)
from database import result_collection

router = APIRouter()


def serialize_result(result):
    result = dict(result)
    result["_id"] = str(result["_id"])
    if "created_at" in result and hasattr(result["created_at"], "isoformat"):
        result["created_at"] = result["created_at"].isoformat()
    return result


@router.post("/analyze")
def analyze(data: AnalyzeRequest):
    """
    Core AI endpoint.
    - Extracts skills from profile + resume
    - Compares possessed skills with current occupation requirements
    - Matches them
    - Calculates Skill Wastage Score
    - Recommends top 3 job roles based on resume skills
    - Stores resume_id so RESUMES can be directly linked to RESULTS
    """
    profile_text = data.profile_text or ""
    resume_skills = extract_skills(f"{profile_text}\n{data.resume_text}")
    described_role_skills = extract_skills(data.job_description)
    inferred_role_skills = infer_role_skills(data.current_role)
    job_skills = sorted(set(described_role_skills) | set(inferred_role_skills))

    if not resume_skills:
        raise HTTPException(status_code=400, detail="No skills found in profile or resume. Please check your profile and uploaded PDF.")
    if not job_skills:
        raise HTTPException(status_code=400, detail="No current occupation skills found. Please complete current role in profile or add responsibility details.")

    matched = match_skills(resume_skills, job_skills)
    missing = missing_skills(resume_skills, job_skills)
    unused = unused_skills(resume_skills, job_skills)
    score = calculate_score(resume_skills, matched)
    job_fit_score = calculate_job_fit(job_skills, matched)
    recommended = recommend_jobs(resume_skills)
    recommendations = recommend_improvements(missing, unused, job_fit_score)
    dashboard_report = build_dashboard_report(
        "Uploaded Resume",
        resume_skills,
        matched,
        recommended,
        recommendations,
    )

    result = {
        "firebase_uid": data.firebase_uid,
        "resume_id": data.resume_id,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "current_role": data.current_role,
        "described_role_skills": described_role_skills,
        "inferred_role_skills": inferred_role_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "unused_skills": unused,
        "skill_wastage_score": score,
        "job_fit_score": job_fit_score,
        "confidence_level": confidence_level(job_fit_score),
        "recommended_jobs": recommended,
        "recommendations": recommendations,
        "dashboard_report": dashboard_report,
        "created_at": datetime.now(timezone.utc),
    }

    inserted = result_collection.insert_one(result)

    return {
        "result_id": str(inserted.inserted_id),
        "resume_id": data.resume_id,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "current_role": data.current_role,
        "described_role_skills": described_role_skills,
        "inferred_role_skills": inferred_role_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "unused_skills": unused,
        "skill_wastage_score": score,
        "job_fit_score": job_fit_score,
        "confidence_level": confidence_level(job_fit_score),
        "recommended_jobs": recommended,
        "recommendations": recommendations,
        "dashboard_report": dashboard_report,
    }


@router.get("/results/{firebase_uid}")
def get_results(firebase_uid: str):
    """Fetch the latest analysis result for a user."""
    result = result_collection.find_one(
        {"firebase_uid": firebase_uid},
        sort=[("_id", -1)]   # most recent first
    )
    if not result:
        raise HTTPException(status_code=404, detail="No results found for this user.")

    return serialize_result(result)


@router.get("/history/{firebase_uid}")
def get_history(firebase_uid: str):
    """Fetch recent analysis history for a user."""
    results = result_collection.find_many(
        {"firebase_uid": firebase_uid},
        sort=[("_id", -1)],
        limit=25,
    )

    return {
        "count": len(results),
        "results": [serialize_result(result) for result in results],
    }


@router.get("/recommendations/{firebase_uid}")
def get_recommendations(firebase_uid: str):
    """Fetch just the recommended jobs for a user."""
    result = result_collection.find_one(
        {"firebase_uid": firebase_uid},
        sort=[("_id", -1)]
    )
    if not result:
        raise HTTPException(status_code=404, detail="No results found.")

    return {
        "recommended_jobs": result.get("recommended_jobs", []),
        "recommendations": result.get("recommendations", []),
        "missing_skills": result.get("missing_skills", []),
    }

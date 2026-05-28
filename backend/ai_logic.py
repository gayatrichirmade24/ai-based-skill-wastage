import re


SKILL_ALIASES = {
    "python": ["python", "python3"],
    "java": ["java"],
    "javascript": ["javascript", "java script", "js"],
    "typescript": ["typescript", "type script", "ts"],
    "c++": ["c++", "cpp"],
    "c#": ["c#", "c sharp"],
    "go": ["golang", "go language"],
    "rust": ["rust"],
    "kotlin": ["kotlin"],
    "swift": ["swift"],
    "ruby": ["ruby"],
    "php": ["php"],
    "scala": ["scala"],
    "r": ["r programming", "r language"],
    "matlab": ["matlab"],
    "react": ["react", "react.js", "reactjs"],
    "angular": ["angular", "angular.js"],
    "vue": ["vue", "vue.js", "vuejs"],
    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "tailwind": ["tailwind", "tailwind css"],
    "bootstrap": ["bootstrap"],
    "next.js": ["next.js", "nextjs", "next js"],
    "svelte": ["svelte"],
    "jquery": ["jquery", "j query"],
    "redux": ["redux", "redux toolkit"],
    "node.js": ["node.js", "nodejs", "node js"],
    "express": ["express", "express.js", "expressjs"],
    "fastapi": ["fastapi", "fast api"],
    "django": ["django"],
    "flask": ["flask"],
    "spring boot": ["spring boot", "springboot"],
    "graphql": ["graphql", "graph ql"],
    "rest api": ["rest api", "restful api", "api development", "apis"],
    "machine learning": ["machine learning", "ml"],
    "deep learning": ["deep learning", "dl"],
    "nlp": ["nlp", "natural language processing"],
    "computer vision": ["computer vision", "cv"],
    "tensorflow": ["tensorflow", "tensor flow"],
    "pytorch": ["pytorch", "py torch"],
    "keras": ["keras"],
    "scikit-learn": ["scikit-learn", "scikit learn", "sklearn"],
    "pandas": ["pandas"],
    "numpy": ["numpy", "num py"],
    "data analysis": ["data analysis", "data analytics", "analytics"],
    "data visualization": ["data visualization", "data visualisation", "visualization", "visualisation"],
    "power bi": ["power bi", "powerbi"],
    "tableau": ["tableau"],
    "excel": ["excel", "ms excel", "microsoft excel"],
    "statistics": ["statistics", "statistical analysis"],
    "opencv": ["opencv", "open cv"],
    "sql": ["sql", "structured query language"],
    "mysql": ["mysql", "my sql"],
    "postgresql": ["postgresql", "postgres", "postgre sql"],
    "mongodb": ["mongodb", "mongo db"],
    "redis": ["redis"],
    "sqlite": ["sqlite", "sqlite3"],
    "firebase": ["firebase", "firestore"],
    "aws": ["aws", "amazon web services"],
    "azure": ["azure", "microsoft azure"],
    "gcp": ["gcp", "google cloud", "google cloud platform"],
    "docker": ["docker", "containerization", "containers"],
    "kubernetes": ["kubernetes", "k8s"],
    "ci/cd": ["ci/cd", "cicd", "continuous integration", "continuous deployment"],
    "jenkins": ["jenkins"],
    "terraform": ["terraform"],
    "linux": ["linux", "ubuntu"],
    "git": ["git", "version control"],
    "github": ["github", "git hub"],
    "gitlab": ["gitlab", "git lab"],
    "android": ["android"],
    "ios": ["ios"],
    "react native": ["react native"],
    "flutter": ["flutter"],
    "communication": ["communication", "presentation", "public speaking"],
    "teamwork": ["teamwork", "collaboration", "team collaboration"],
    "problem solving": ["problem solving", "analytical thinking", "debugging"],
    "leadership": ["leadership", "team lead"],
    "project management": ["project management", "planning"],
    "agile": ["agile"],
    "scrum": ["scrum"],
}

SKILL_WEIGHTS = {
    "python": 1.4,
    "java": 1.3,
    "javascript": 1.3,
    "typescript": 1.3,
    "react": 1.4,
    "node.js": 1.3,
    "fastapi": 1.2,
    "django": 1.2,
    "rest api": 1.2,
    "machine learning": 1.6,
    "deep learning": 1.6,
    "nlp": 1.4,
    "pandas": 1.2,
    "numpy": 1.2,
    "sql": 1.4,
    "mongodb": 1.3,
    "postgresql": 1.2,
    "aws": 1.4,
    "docker": 1.3,
    "kubernetes": 1.5,
    "git": 1.1,
    "communication": 0.8,
    "teamwork": 0.8,
    "leadership": 0.9,
}

JOB_ROLES = {
    "Backend Developer": ["python", "java", "sql", "rest api", "mongodb", "postgresql", "docker", "git"],
    "Frontend Developer": ["react", "javascript", "typescript", "html", "css", "redux", "git"],
    "Full Stack Developer": ["react", "node.js", "python", "sql", "mongodb", "rest api", "docker"],
    "Data Scientist": ["python", "machine learning", "deep learning", "pandas", "numpy", "scikit-learn", "sql", "statistics"],
    "ML Engineer": ["python", "tensorflow", "pytorch", "machine learning", "deep learning", "docker", "aws"],
    "Data Analyst": ["sql", "python", "data analysis", "power bi", "tableau", "excel", "statistics"],
    "DevOps Engineer": ["docker", "kubernetes", "aws", "linux", "ci/cd", "terraform", "git"],
    "Mobile Developer": ["android", "ios", "react native", "flutter", "kotlin", "swift"],
    "Cloud Engineer": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux"],
    "NLP Engineer": ["python", "nlp", "machine learning", "deep learning", "tensorflow", "pytorch"],
}

CURRENT_ROLE_SKILLS = {
    "support": ["communication", "excel", "sql", "problem solving"],
    "customer support": ["communication", "excel", "problem solving"],
    "frontend": ["react", "javascript", "html", "css", "git"],
    "backend": ["python", "java", "sql", "rest api", "mongodb", "git"],
    "full stack": ["react", "node.js", "python", "sql", "mongodb", "rest api"],
    "data analyst": ["sql", "excel", "python", "data analysis", "power bi", "tableau"],
    "data scientist": ["python", "machine learning", "pandas", "numpy", "sql", "statistics"],
    "devops": ["docker", "kubernetes", "aws", "linux", "ci/cd", "git"],
    "cloud": ["aws", "azure", "gcp", "docker", "linux"],
    "mobile": ["android", "ios", "react native", "flutter"],
    "teacher": ["communication", "leadership", "problem solving"],
    "manager": ["leadership", "project management", "communication", "agile"],
}

COURSE_MAP = {
    "react": "Build two React projects with API calls, routing, forms, and deployment.",
    "javascript": "Practice ES6, async requests, DOM concepts, and frontend problem solving.",
    "python": "Create a Python automation or FastAPI project and publish it on GitHub.",
    "sql": "Practice joins, grouping, subqueries, and build one analytics mini-project.",
    "mongodb": "Practice CRUD, schema design, indexing, and MongoDB Atlas deployment.",
    "docker": "Learn Dockerfiles, images, containers, and deploy one containerized API.",
    "aws": "Start with IAM, EC2, S3, and deploy one small backend project.",
    "machine learning": "Build a supervised learning project with evaluation metrics.",
    "power bi": "Create an interactive dashboard from real CSV data.",
    "communication": "Prepare project explanations using problem, action, result format.",
}


def _skill_weight(skill: str) -> float:
    return SKILL_WEIGHTS.get(skill, 1.0)


def _contains_alias(text: str, alias: str) -> bool:
    escaped = re.escape(alias.lower())
    return re.search(rf"(?<![a-z0-9+#.]){escaped}(?![a-z0-9+#.])", text) is not None


def extract_skills(text: str) -> list[str]:
    """Extract skills using aliases and word-safe matching."""
    clean_text = re.sub(r"\s+", " ", (text or "").lower())
    found = []

    for skill, aliases in SKILL_ALIASES.items():
        if any(_contains_alias(clean_text, alias) for alias in aliases):
            found.append(skill)

    return sorted(set(found))


def match_skills(user_skills: list[str], job_skills: list[str]) -> list[str]:
    return sorted(set(user_skills) & set(job_skills))


def missing_skills(user_skills: list[str], job_skills: list[str]) -> list[str]:
    missing = sorted(set(job_skills) - set(user_skills))
    return sorted(missing, key=_skill_weight, reverse=True)


def unused_skills(user_skills: list[str], job_skills: list[str]) -> list[str]:
    unused = sorted(set(user_skills) - set(job_skills))
    return sorted(unused, key=_skill_weight, reverse=True)


def weighted_percent(skills: list[str], matched: list[str]) -> float:
    if not skills:
        return 0.0

    total_weight = sum(_skill_weight(skill) for skill in skills)
    matched_weight = sum(_skill_weight(skill) for skill in matched)
    return round((matched_weight / total_weight) * 100, 2) if total_weight else 0.0


def calculate_score(resume_skills: list[str], matched: list[str]) -> float:
    """Weighted percentage of possessed skills not used by the current occupation."""
    return round(100 - weighted_percent(resume_skills, matched), 2)


def calculate_job_fit(job_skills: list[str], matched: list[str]) -> float:
    """Weighted percentage of current occupation skills found in the user profile/resume."""
    return weighted_percent(job_skills, matched)


def confidence_level(score: float) -> str:
    if score >= 80:
        return "High"
    if score >= 55:
        return "Medium"
    return "Low"


def recommend_jobs(user_skills: list[str]) -> list[dict]:
    if not user_skills:
        return [{"role": "General Role", "match_percent": 0, "matched_skills": [], "missing_skills": []}]

    scored = []
    user_set = set(user_skills)

    for role, required in JOB_ROLES.items():
        matched = sorted(user_set & set(required))
        missing = sorted(set(required) - user_set, key=_skill_weight, reverse=True)
        match_pct = weighted_percent(required, matched)
        scored.append({
            "role": role,
            "match_percent": match_pct,
            "matched_skills": matched,
            "missing_skills": missing[:3],
        })

    scored.sort(key=lambda item: item["match_percent"], reverse=True)
    return scored[:3]


def infer_role_skills(current_role: str | None) -> list[str]:
    """Infer expected skills from the employee's current role title."""
    if not current_role:
        return []

    role_text = current_role.lower()
    inferred = set()

    for keyword, skills in CURRENT_ROLE_SKILLS.items():
        if keyword in role_text:
            inferred.update(skills)

    return sorted(inferred)


def recommend_improvements(missing: list[str], unused: list[str], job_fit_score: float) -> list[dict]:
    recommendations = []

    if job_fit_score < 50:
        recommendations.append({
            "type": "Career Direction",
            "priority": "High",
            "title": "Explore a better-fit role",
            "action": "Your current occupation is using less than half of your visible skill profile. Compare your top role matches and shortlist one role where your unused skills are required.",
            "why": "A lower utilization score usually means the role is not aligned with your strongest skills.",
            "impact": "High",
        })
    elif job_fit_score < 75:
        recommendations.append({
            "type": "Role Alignment",
            "priority": "Medium",
            "title": "Improve role alignment",
            "action": "Your current occupation uses some skills, but several valuable skills remain underused. Build one proof project around your strongest unused skill.",
            "why": "A focused project makes hidden skills visible and improves transition chances.",
            "impact": "Medium",
        })
    else:
        recommendations.append({
            "type": "Career Growth",
            "priority": "Medium",
            "title": "Strengthen your current path",
            "action": "Your current occupation uses many of your skills. Add measurable achievements to your resume and ask for responsibilities that use your advanced skills.",
            "why": "Strong utilization can still improve through higher-impact responsibilities.",
            "impact": "Medium",
        })

    for skill in missing[:3]:
        recommendations.append({
            "type": "Upskilling",
            "priority": "High",
            "title": f"Close the {skill} gap",
            "action": COURSE_MAP.get(skill, "Build a small project that proves this skill clearly."),
            "why": f"{skill} is useful for improving fit with nearby career paths.",
            "impact": "High",
        })

    for skill in unused[:2]:
        recommendations.append({
            "type": "Skill Utilization",
            "priority": "High",
            "title": f"Use or showcase {skill}",
            "action": f"Create a visible project, GitHub repo, or resume bullet that proves {skill}. Also consider roles where {skill} is a core requirement.",
            "why": f"{skill} is already in your profile but is not clearly used in your current occupation.",
            "impact": "High",
        })

    return recommendations[:5]


def build_dashboard_report(
    file_name: str,
    resume_skills: list[str],
    matched: list[str],
    recommended_jobs: list[dict],
    recommendations: list[str],
) -> dict:
    skills = []
    matched_set = set(matched)

    for skill in sorted(resume_skills, key=_skill_weight, reverse=True):
        is_matched = skill in matched_set
        importance = _skill_weight(skill)

        if is_matched:
            wastage = 15 if importance >= 1.3 else 25
            status = "active"
            reason = "This skill appears to be used in your current occupation."
        else:
            wastage = 85 if importance >= 1.3 else 65
            status = "wasted" if wastage >= 70 else "underused"
            reason = "This skill appears in your profile/resume but is not clearly used in your current occupation."

        skills.append({
            "name": skill,
            "proficiency": min(95, round(68 + importance * 12)),
            "wastage": wastage,
            "status": status,
            "importance": importance,
            "reason": reason,
        })

    active_count = len([skill for skill in skills if skill["status"] == "active"])
    underused_count = len([skill for skill in skills if skill["status"] == "underused"])
    wasted_count = len([skill for skill in skills if skill["status"] == "wasted"])

    return {
        "fileName": file_name,
        "skills": skills,
        "totalSkills": len(skills),
        "activeCount": active_count,
        "underusedCount": underused_count,
        "wastedCount": wasted_count,
        "wastageIndex": calculate_score(resume_skills, matched),
        "roleMatches": [
            {
                "title": job["role"],
                "match": job["match_percent"],
                "companies": max(250, 1200 - index * 225),
                "missingSkills": job.get("missing_skills", []),
            }
            for index, job in enumerate(recommended_jobs)
        ],
        "recommendations": recommendations,
    }

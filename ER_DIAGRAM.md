# ER Diagram - AI Skill Wastage Detection System

This ER diagram matches the strict relationship design requested for the project.

## Correct ER Diagram

```mermaid
erDiagram
    USERS ||--o{ RESUMES : uploads
    RESUMES ||--|| RESULTS : generates

    USERS {
        ObjectId _id PK
        string name
        string email
        string firebase_uid UK
        datetime created_at
    }

    RESUMES {
        ObjectId _id PK
        string firebase_uid FK
        string file_name
        string extracted_text
        number text_length
        datetime created_at
    }

    RESULTS {
        ObjectId _id PK
        string resume_id FK
        string firebase_uid FK
        string current_role
        array resume_skills
        array job_skills
        array described_role_skills
        array inferred_role_skills
        array matched_skills
        array missing_skills
        array unused_skills
        number skill_wastage_score
        number job_fit_score
        string confidence_level
        array recommended_jobs
        array recommendations
        object dashboard_report
        datetime created_at
    }
```

## Relationship Explanation

```text
USERS 1 -> M RESUMES
RESUMES 1 -> 1 RESULTS
```

Explanation:

- One user can upload many resumes.
- Each resume belongs to one user using `firebase_uid`.
- Each uploaded resume generates one analysis result.
- Each result stores `resume_id` as a foreign key to the `resumes` collection.
- The result also stores `firebase_uid` for easy history lookup by user.

## Collections

Database name:

```text
skill_wastage
```

Collections:

```text
users
resumes
results
```


# Project Report

## Title

AI System to Detect Invisible Skill Wastage in India

## Abstract

The AI Skill Wastage Detection System is a web-based application designed to detect, analyze, and explain invisible skill wastage among students and working professionals. The system collects user profile details such as education, current role, experience, skills, and professional background. It also accepts a PDF resume and extracts text from it. Using skill extraction and matching logic, the system compares the user's possessed skills with the skills required in their current occupation.

The system calculates a Skill Wastage Score, identifies active and underutilized skills, recommends better-fit career roles, and suggests reskilling or upskilling actions. The final output is shown through an interactive dashboard, history page, and downloadable report.

## Introduction

In India, many students and professionals acquire multiple technical and soft skills through education, internships, online courses, and personal projects. However, due to job mismatch, lack of career guidance, or role limitations, many of these skills remain unused in their current occupation. This creates invisible skill wastage, where a person has useful abilities but does not get an opportunity to apply them.

This project provides an AI-based system that helps users understand whether their current role is properly utilizing their skills. It also guides users toward better career paths and improvement areas.

## Problem Statement

Many individuals possess skills that are not fully used in their current jobs or occupations. This mismatch leads to reduced productivity, lower job satisfaction, slow career growth, and poor utilization of human resources. There is a need for a system that can analyze a person's profile and resume, detect underutilized skills, calculate skill wastage, and recommend suitable career paths.

## Objectives

- To collect user profile information such as education, skills, current role, experience, and background.
- To allow users to upload a PDF resume.
- To extract resume text and identify skills from the resume.
- To compare possessed skills with current occupation requirements.
- To detect active, underused, and wasted skills.
- To calculate a Skill Wastage Score.
- To recommend better-fit roles and alternative career paths.
- To suggest reskilling, upskilling, and resume improvement actions.
- To store users, resumes, and results in MongoDB.
- To display analysis through dashboard, history, and downloadable report.

## Scope Of The Project

The project focuses on individual-level skill wastage analysis. It is useful for students, freshers, employees, job seekers, and career counselors. The current system analyzes profile and resume data, compares skills with current occupation requirements, and provides recommendations. In the future, the system can be improved by using live job market datasets and advanced machine learning models.

## System Flow

```text
User Profile + Resume
->
Extract education, skills, and current role
->
Analyze skills possessed by user
->
Compare with current occupation requirements
->
Find underutilized skills
->
Calculate Skill Wastage Score
->
Match full skill set with better career roles
->
Recommend reskilling, upskilling, and alternative career paths
->
Display dashboard + history + downloadable report
```

## System Architecture

```text
React Frontend
  |
  | User profile, resume upload, dashboard, history
  v
FastAPI Backend
  |
  | Resume parsing, skill extraction, scoring, recommendations
  v
MongoDB Database
  |
  | Users, resumes, analysis results
```

## Modules

### 1. Authentication Module

The authentication module allows users to sign up and log in using Firebase Authentication. Each user is identified using a Firebase UID, which is also used to connect the frontend user with backend database records.

### 2. Profile Module

The profile module collects required user information:

- Full name
- Profession
- Current role
- Education
- Years of experience
- Skills
- Location
- About section

The resume upload and analysis process remains locked until the profile is complete.

### 3. Resume Upload Module

The resume module allows only PDF files. It validates the selected file and sends it to the backend. The backend extracts text from the resume using `pdfplumber` and stores the resume record in MongoDB.

### 4. Skill Extraction Module

The system extracts skills from both the saved profile and resume text. It uses a skill dictionary and alias matching logic to identify skills written in different formats, such as:

```text
JavaScript / JS
React / React.js
MongoDB / Mongo DB
Power BI / PowerBI
Machine Learning / ML
```

### 5. Skill Wastage Analysis Module

The analysis module compares possessed skills with skills needed in the user's current role. It identifies:

- Matched skills
- Missing skills
- Underutilized skills
- Unused skills

It then calculates the Skill Wastage Score.

### 6. Recommendation Module

The recommendation module suggests:

- Better-fit career roles
- Resume improvement actions
- Reskilling suggestions
- Upskilling suggestions
- Alternative career paths

### 7. Dashboard Module

The dashboard displays:

- Skill Wastage Score
- Job Fit Score
- Active skills
- Underused skills
- Wasted skills
- Skill utilization split
- Role recommendations
- AI recommendations
- Score explanation labels

### 8. History Module

The history page shows previous analysis results stored in MongoDB. Users can open older reports and compare their progress.

### 9. Report Module

The report module allows users to download or print their analysis report from the dashboard using the browser's Save as PDF feature.

## Technology Used

Frontend:

- React
- Vite
- React Router
- Firebase Authentication
- Recharts

Backend:

- Python
- FastAPI
- Uvicorn
- pdfplumber

Database:

- MongoDB
- MongoDB Compass

## Database Design

Database name:

```text
skill_wastage
```

Collections:

### users

Stores registered user data.

Important fields:

- name
- email
- firebase_uid

### resumes

Stores uploaded resume data.

Important fields:

- firebase_uid
- file_name
- extracted_text
- uploaded_at

### results

Stores analysis output.

Important fields:

- firebase_uid
- resume_id
- resume_skills
- current_role
- matched_skills
- missing_skills
- unused_skills
- skill_wastage_score
- job_fit_score
- recommendations
- dashboard_report
- created_at

Main relationship:

```text
USERS 1 -> M RESUMES
RESUMES 1 -> 1 RESULTS
```

## Algorithm Overview

1. Read profile data from the frontend.
2. Upload and parse PDF resume.
3. Extract skills from profile and resume.
4. Infer current occupation skill requirements.
5. Compare user skills with occupation skills.
6. Classify skills as active, underused, or wasted.
7. Calculate Skill Wastage Score.
8. Calculate Job Fit Score.
9. Generate recommendations.
10. Store final result in MongoDB.
11. Display results on dashboard.

## Score Explanation

Skill Wastage Score:

```text
0-30%    = Good
31-60%   = Moderate
61-100%  = High wastage
```

Job Fit Score:

```text
80%+      = Strong match
55-79%    = Medium match
Below 55% = Weak match
```

## Testing

The following tests were performed:

- Backend server starts successfully on `http://127.0.0.1:8000`
- Swagger documentation opens at `/docs`
- MongoDB service runs locally
- MongoDB Compass connects to `localhost:27017`
- Frontend starts using Vite
- User signup and login works
- Profile page saves required information
- Resume upload remains locked until profile is complete
- PDF resume upload works after profile completion
- Resume text extraction works
- Analysis result is generated
- Dashboard displays score and recommendations
- History page shows previous analyses
- Report can be saved as PDF
- Production build completes successfully

## Advantages

- Helps users understand whether their skills are being fully used.
- Provides explainable score labels instead of only numbers.
- Suggests realistic career improvement paths.
- Stores analysis history for future comparison.
- Uses a simple and understandable dashboard.
- Can be extended with real labor market data.

## Limitations

- Current skill extraction is dictionary and alias based.
- Recommendations are based on predefined role and skill mapping.
- Real-time job market demand data is not yet integrated.
- Advanced NLP embeddings are not yet used.

## Future Enhancements

- Deploy frontend and backend online.
- Use MongoDB Atlas for cloud database.
- Add real job market datasets.
- Add advanced AI/NLP models for semantic skill extraction.
- Add career roadmap generation.
- Add admin dashboard for institution-level analysis.
- Add automatic resume improvement PDF generation.

## Conclusion

The AI Skill Wastage Detection System successfully detects invisible skill wastage by combining profile data and resume analysis. It compares the user's skills with their current occupation, calculates a meaningful Skill Wastage Score, and provides recommendations for better role alignment, upskilling, and career improvement. The system supports authentication, resume upload, MongoDB storage, dashboard visualization, history, and downloadable report generation, making it suitable as a complete mini-project.

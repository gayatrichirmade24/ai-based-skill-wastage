# AI Skill Wastage Detection System

# Overview

The AI Skill Wastage Detection System is a web-based platform developed to identify invisible skill wastage among students and professionals. The system analyzes a user's profile and uploaded resume to determine whether their current occupation fully utilizes their actual skills.

By comparing possessed skills with the skills required for the user's current role, the system calculates a Skill Wastage Score and provides recommendations for:

Better career opportunities
Resume improvement
Reskilling and upskilling paths
Alternative career roles

The project helps users understand how effectively their skills are being utilized and guides them toward improved career growth.

## Project Idea

Many students and employees learn technical and soft skills through education, certifications, internships, and self-learning. However, their current job role may use only a limited portion of those skills.

This mismatch between possessed skills and utilized skills leads to:

Underemployment
Reduced productivity
Career dissatisfaction
Hidden talent wastage

This hidden mismatch is known as Invisible Skill Wastage.

The AI Skill Wastage Detection System is designed to detect these hidden gaps and provide intelligent recommendations for better career alignment.

# Objectives

Detect invisible skill wastage among users
Analyze resumes and user profiles
Identify active, underused, and wasted skills
Calculate a Skill Wastage Score
Recommend suitable alternative career roles
Suggest reskilling and upskilling paths
Improve resume quality and job-fit alignment
Store analysis history and downloadable reports

## Final System Flow

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

## Main Features

- User signup and login using Firebase Authentication
- Profile page for name, profession, current role, education, experience, skills, location, and about
- Resume upload page with PDF validation
- Resume text extraction using `pdfplumber`
- Skill extraction from profile and resume
- Current occupation skill comparison
- Skill Wastage Score calculation
- Active, underused, and wasted skill classification
- Better career role recommendations
- Resume improvement suggestions
- Explainable dashboard score labels
- Analysis history page
- Downloadable/printable report from dashboard
- MongoDB storage for users, resumes, and analysis results
- Swagger API documentation using FastAPI

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

## Technology Stack

Frontend:

- React
- Vite
- React Router
- Recharts
- Firebase Authentication

Backend:

- Python
- FastAPI
- Uvicorn
- pdfplumber

Database:

- MongoDB
- MongoDB Compass

## Project Structure

```text
skill-wastage-project/
  backend/
    main.py
    database.py
    ai_logic.py
    resume_parser.py
    models.py
    routes/
      user_routes.py
      resume_routes.py
      analysis_routes.py
  src/
    components/
      Navbar.jsx
      ProtectedRoute.jsx
      ErrorBoundary.jsx
    context/
      AuthContext.jsx
    pages/
      Homepage.jsx
      Login.jsx
      Signup.jsx
      Profile.jsx
      ResumeUpload.jsx
      Dashboard.jsx
      History.jsx
  README.md
  PROJECT_REPORT.md
  package.json
```

## How To Run The Project

### 1. Start MongoDB

Make sure MongoDB is installed and running. In PowerShell:

```powershell
Get-Service MongoDB
```

Open MongoDB Compass and connect to:

```text
mongodb://localhost:27017
```

Database used by the project:

```text
skill_wastage
```

Collections:

```text
users
resumes
results
```

Main database relationship:

```text
USERS 1 -> M RESUMES
RESUMES 1 -> 1 RESULTS
```

### 2. Start Backend

```powershell
cd C:\Users\ADMIN\skill-wastage-project\backend
python -m uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Start Frontend

Open another terminal:

```powershell
cd C:\Users\ADMIN\skill-wastage-project
npm run dev
```

Frontend usually runs at:

```text
http://localhost:5173/
```

## How To Use The Website

1. Open the website.
2. Sign up or log in.
3. Go to Profile.
4. Fill all profile fields and save:
   - Name
   - Profession
   - Current role
   - Education
   - Experience
   - Skills
   - Location
   - About yourself
5. Go to Resume page.
6. Upload a PDF resume.
7. Click Analyze Skill Wastage.
8. View dashboard results.
9. Open History to see previous analyses.
10. Download or print the report from the Dashboard.

## Main API Endpoints

```text
POST   /register
GET    /profile/{firebase_uid}
POST   /upload-resume
POST   /analyze
GET    /results/{firebase_uid}
GET    /history/{firebase_uid}
GET    /recommendations/{firebase_uid}
DELETE /resume/{resume_id}
```

## Example Profile For Demo

```text
Name: Nisha Kuvalekar
Profession: Engineer
Current Role: Frontend Developer
Education: B.Tech in Information Technology
Experience: 1 year
Skills: React, JavaScript, HTML, CSS, TypeScript, Git, Firebase, Bootstrap, Tailwind, Python, SQL, Communication, Teamwork, Problem Solving
Location: India
About: I work on frontend UI development, responsive web pages, API integration, Firebase authentication, dashboard design, and improving user experience for web applications.
```
## Screenshots

Add project screenshots here.

Example:

![Homepage](screenshots/homepage.png)
![Dashboard](screenshots/dashboard.png)

## Future Scope

- Deploy frontend on Vercel or Netlify
- Deploy backend on Render or Railway
- Use MongoDB Atlas for production database
- Add real job-market datasets for demand-based recommendations
- Add advanced NLP models or embeddings for deeper skill matching
- Add organization-level skill wastage analytics

## Contributors
Purvi Panwalkar
Nisha Kuvalekar
Gayatri Chirmade

## License

This project is developed for educational, academic, and research purposes only.

## Recommended .gitignore
node_modules/
dist/
__pycache__/
.env
*.pyc

## GitHub Commands
git add .
git commit -m "Updated project documentation"
git push

## Acknowledgements

Special thanks to mentors, faculty members, and team members for their continuous guidance, encouragement, and support throughout the development of this project.

## Conclusion

The AI Skill Wastage Detection System provides an innovative solution for identifying hidden skill underutilization among students and professionals. By combining resume analysis, skill comparison, and intelligent recommendation systems, the platform helps users align their abilities with suitable career opportunities.

The project contributes toward improved employability, better career planning, and more effective utilization of human potential in the modern workforce.

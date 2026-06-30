# VISL Screening — AI-Powered Screening Platform
This is an end-to-end AI recruitment platform. It automates the entire candidate screening workflow — from bulk CSV upload and resume parsing, through Claude-powered AI evaluation and GitHub profile analysis, to automated assessment dispatch and interview scheduling with Google Meet. Recruiters get a single dashboard to upload candidates, define job requirements and get a ranked shortlist in minutes instead of hours of manual review.

## Live App: 
- Frontend: https://visl-screening.vercel.app
- Backend API: https://visl-screening-backend.onrender.com

## Dashboard Preview
<img width="1430" height="820" alt="image" src="https://github.com/user-attachments/assets/f4e76518-6c38-4e97-810e-93483f9ea8bd" />
<img width="1430" height="816" alt="image" src="https://github.com/user-attachments/assets/776cf529-bd1f-4c6f-96c4-12f1772f6091" />

## Tech Stack
- Backend: FastAPI + Python
- Frontend: React + TailwindCSS
- Database: Supabase (PostgreSQL)
- AI: Claude API (Anthropic)
- Email: SendGrid
- Calendar: Google Calendar API + Meet
  
## System Architecture
<div align="center">

```
                    ┌─────────────────────────────────────┐
                    │       React Frontend (Vercel)        │
                    │  CSV Upload → JD Input → Pipeline   │
                    │       → Candidate Dashboard          │
                    └──────────────┬──────────────────────┘
                                   │
                            REST API (HTTPS)
                                   │
                    ┌──────────────▼──────────────────────┐
                    │      FastAPI Backend (Railway)       │
                    │                                      │
                    │  POST /upload-candidates             │
                    │       → Parse CSV, store to DB       │
                    │  POST /process-resumes               │
                    │       → Download + extract PDF       │
                    │  POST /add-job-description           │
                    │       → Save JD to DB                │
                    │  POST /evaluate/{job_id}             │
                    │       → AI scoring pipeline          │
                    │  POST /shortlist                     │
                    │       → Rank and filter candidates   │
                    │  POST /send-test-links               │
                    │       → Email via SendGrid           │
                    │  POST /upload-test-results           │
                    │       → Parse test scores CSV        │
                    │  POST /schedule-interviews           │
                    │       → Google Calendar + Meet       │
                    │  GET  /candidates                    │
                    │       → Fetch all candidates         │
                    └──────┬─────────────┬────────┬───────┘
                           │             │        │
              ┌────────────▼──┐  ┌───────▼──┐  ┌─▼────────────┐
              │   Supabase    │  │  Claude  │  │ Google APIs  │
              │  DB + Storage │  │   API    │  │Calendar+Meet │
              └───────────────┘  └──────────┘  └──────────────┘
                           │             │
              ┌────────────▼──┐  ┌───────▼──┐
              │  GitHub API   │  │ SendGrid │
              │               │  │  Email   │
              └───────────────┘  └──────────┘
```
 </div>           
              
            

    

## AI Evaluation Approach
Each candidate is scored on a 100-point scale using three weighted components:

| Component | Weight | Description |
|---|---|---|
| AI Resume Score | 50% | Claude evaluates resume against JD across 4 dimensions |
| GitHub Score | 30% | Top 5 repos analyzed for AI/ML presence, stars, activity |
| Academic Score | 20% | CGPA normalized to 0–100 scale |





## Recruitment Pipeline
```
  1. Upload Candidate CSV
          ↓
  2. Enter Job Description
          ↓
  3. Download & Process Resumes
     (PDF extraction via PyMuPDF)
          ↓
  4. AI Evaluation
     (Claude API scores resume + GitHub)
          ↓
  5. Score & Rank Candidates
     (weighted formula)
          ↓
  6. Shortlist Above Threshold
          ↓
  7. Send Test Links via Email
     (SendGrid)
          ↓
  8. Upload Test Results CSV
          ↓
  9. Schedule Interviews
     (Google Calendar + Meet auto-generated)
          ↓
 10. Send Interview Invitations to Candidates
```



## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

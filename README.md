# VISL Screening — AI-Powered Screening Platform
Automate candidate screening end-to-end: resume parsing, AI scoring, GitHub analysis, test dispatch, and interview scheduling — all in one pipeline.

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



## Recruitment Pipeline
Upload Candidate CSV
        ↓
Enter Job Description
        ↓
Download & Process Resumes
(PDF extraction via PyMuPDF)
        ↓
AI Evaluation
(Claude API scores resume + GitHub)
        ↓
Score & Rank Candidates
(weighted formula)
        ↓
Shortlist Above Threshold
        ↓
Send Test Links via Email
(SendGrid)
        ↓
Upload Test Results CSV
        ↓
Schedule Interviews
(Google Calendar + Meet auto-generated)
        ↓
Send Interview Invitations to Candidates


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

# Visl AI Screening Platform

AI-powered candidate screening platform built for Visl AI Labs assignment.

## Tech Stack
- Backend: FastAPI + Python
- Frontend: React + TailwindCSS
- Database: Supabase (PostgreSQL)
- AI: Claude API (Anthropic)
- Email: SendGrid
- Calendar: Google Calendar API + Meet

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

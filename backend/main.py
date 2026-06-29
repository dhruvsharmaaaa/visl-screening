from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv
import pandas as pd
import os, io

load_dotenv()

from services.resume import download_and_extract_resume
from services.ai_eval import evaluate_candidate
from services.github import analyze_github
from services.email_service import send_test_email
from services.calendar_service import schedule_interview

app = FastAPI(title='Visl AI Screening Platform')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

@app.post('/upload-candidates')
async def upload_candidates(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    df.columns = [c.lower().strip().replace(' ', '_') for c in df.columns]
    inserted = 0
    for _, row in df.iterrows():
        data = {
            'name': str(row.get('name', '')),
            'email': str(row.get('email', '')),
            'college': str(row.get('college', '')),
            'branch': str(row.get('branch', '')),
            'cgpa': float(row.get('cgpa', 0) or 0),
            'best_ai_project': str(row.get('best_ai_project', '')),
            'research_work': str(row.get('research_work', '')),
            'github_profile': str(row.get('github_profile', '')),
            'resume_link': str(row.get('resume_link', '')),
        }
        supabase.table('candidates').insert(data).execute()
        inserted += 1
    return {'message': f'{inserted} candidates uploaded successfully'}

@app.post('/process-resumes')
async def process_resumes():
    result = supabase.table('candidates').select('*').eq('status', 'pending').execute()
    candidates = result.data
    processed = 0
    for c in candidates:
        try:
            text = download_and_extract_resume(c['resume_link'])
            supabase.table('candidates').update({'resume_text': text}).eq('id', c['id']).execute()
            processed += 1
        except Exception as e:
            print(f'Resume failed for {c["name"]}: {e}')
    return {'message': f'{processed} resumes processed'}

class JobDescriptionInput(BaseModel):
    title: str
    description: str

@app.post('/add-job-description')
async def add_job_description(jd: JobDescriptionInput):
    result = supabase.table('job_descriptions').insert({
        'title': jd.title,
        'description': jd.description
    }).execute()
    return {'id': result.data[0]['id'], 'message': 'Job description saved'}

@app.post('/evaluate/{job_id}')
async def run_evaluation(job_id: str):
    jd_result = supabase.table('job_descriptions').select('*').eq('id', job_id).execute()
    if not jd_result.data:
        raise HTTPException(status_code=404, detail='Job description not found')
    jd = jd_result.data[0]['description']
    candidates = supabase.table('candidates').select('*').execute().data
    evaluated = 0
    for c in candidates:
        if not c.get('resume_text'):
            continue
        scores = evaluate_candidate(c, jd)
        github_score = analyze_github(c.get('github_profile', ''))
        cgpa_score = (float(c.get('cgpa', 0)) / 10) * 100
        total = scores['total'] * 0.5 + github_score * 0.3 + cgpa_score * 0.2
        supabase.table('candidates').update({
            'ai_score': scores['total'],
            'github_score': github_score,
            'total_score': round(total, 2),
            'ai_reasoning': scores['reasoning'],
        }).eq('id', c['id']).execute()
        evaluated += 1
    return {'message': f'{evaluated} candidates evaluated'}

@app.post('/shortlist')
async def shortlist_candidates(threshold: float = 60.0):
    all_c = supabase.table('candidates').select('*').order('total_score', desc=True).execute().data
    shortlisted = 0
    for c in all_c:
        status = 'shortlisted' if c.get('total_score', 0) >= threshold else 'rejected'
        supabase.table('candidates').update({'status': status}).eq('id', c['id']).execute()
        if status == 'shortlisted':
            shortlisted += 1
    return {'shortlisted': shortlisted, 'total': len(all_c)}

class TestLinkInput(BaseModel):
    test_link: str

@app.post('/send-test-links')
async def send_test_links(body: TestLinkInput):
    shortlisted = supabase.table('candidates').select('*').eq('status', 'shortlisted').execute().data
    sent = 0
    for c in shortlisted:
        try:
            send_test_email(c['email'], c['name'], body.test_link)
            sent += 1
        except Exception as e:
            print(f'Email failed for {c["name"]}: {e}')
    return {'message': f'Test links sent to {sent} candidates'}

@app.post('/upload-test-results')
async def upload_test_results(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    df.columns = [c.lower().strip().replace(' ', '_') for c in df.columns]
    updated = 0
    for _, row in df.iterrows():
        email = str(row.get('email', ''))
        la = float(row.get('test_la', 0) or 0)
        code = float(row.get('test_code', 0) or 0)
        status = 'interview_ready' if (la + code) / 2 >= 50 else 'rejected'
        supabase.table('candidates').update({
            'test_la_score': la, 'test_code_score': code, 'status': status
        }).eq('email', email).execute()
        updated += 1
    return {'message': f'{updated} test results updated'}

@app.post('/schedule-interviews')
async def schedule_interviews():
    ready = supabase.table('candidates').select('*').eq('status', 'interview_ready').execute().data
    scheduled = 0
    for i, c in enumerate(ready):
        try:
            result = schedule_interview(c['email'], c['name'], slot_offset_hours=i)
            supabase.table('candidates').update({
                'meet_link': result['meet_link'],
                'interview_scheduled_at': result['start_time'],
                'status': 'interviewed'
            }).eq('id', c['id']).execute()
            scheduled += 1
        except Exception as e:
            print(f'Calendar failed for {c["name"]}: {e}')
    return {'message': f'{scheduled} interviews scheduled'}

@app.get('/candidates')
async def get_candidates():
    result = supabase.table('candidates').select('*').order('total_score', desc=True).execute()
    return result.data

@app.get('/')
async def root():
    return {'status': 'Visl Screening API is running'}

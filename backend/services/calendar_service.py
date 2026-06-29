from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import uuid, os, pickle

SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_google_credentials():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as f:
            creds = pickle.load(f)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as f:
            pickle.dump(creds, f)
    return creds

def schedule_interview(candidate_email: str, candidate_name: str, slot_offset_hours: int = 0):
    creds = get_google_credentials()
    service = build('calendar', 'v3', credentials=creds)
    tomorrow = datetime.now() + timedelta(days=1)
    start_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
    start_time = start_time + timedelta(hours=slot_offset_hours)
    end_time = start_time + timedelta(hours=1)
    event = {
        'summary': f'Interview — {candidate_name} | Visl AI Labs',
        'description': f'Technical interview for {candidate_name}',
        'start': {'dateTime': start_time.isoformat(), 'timeZone': 'Asia/Kolkata'},
        'end': {'dateTime': end_time.isoformat(), 'timeZone': 'Asia/Kolkata'},
        'attendees': [{'email': candidate_email}],
        'conferenceData': {
            'createRequest': {
                'requestId': str(uuid.uuid4()),
                'conferenceSolutionKey': {'type': 'hangoutsMeet'}
            }
        }
    }
    created_event = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1,
        sendUpdates='all'
    ).execute()
    meet_link = ''
    if 'conferenceData' in created_event:
        for ep in created_event['conferenceData'].get('entryPoints', []):
            if ep.get('entryPointType') == 'video':
                meet_link = ep.get('uri', '')
                break
    return {'meet_link': meet_link, 'start_time': start_time.isoformat()}

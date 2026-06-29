import sendgrid
from sendgrid.helpers.mail import Mail
import os

def send_test_email(to_email: str, candidate_name: str, test_link: str):
    sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
    message = Mail(
        from_email=os.getenv('SENDER_EMAIL'),
        to_emails=to_email,
        subject='Next Step: Technical Assessment — Visl AI Labs',
        html_content=f'<div style="font-family:Arial"><h2>Hi {candidate_name},</h2><p>You have been shortlisted for Visl AI Labs.</p><p><a href="{test_link}">Take Assessment</a></p></div>'
    )
    sg.send(message)

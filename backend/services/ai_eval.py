import anthropic
import json
import os

client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

def evaluate_candidate(candidate: dict, job_description: str) -> dict:
    name = candidate.get('name', 'Unknown')
    cgpa = candidate.get('cgpa', 0)
    project = candidate.get('best_ai_project', '')
    research = candidate.get('research_work', '')
    resume_text = candidate.get('resume_text', '')[:3000]
    prompt = f'''You are a technical recruiter evaluating a candidate.
Respond ONLY with valid JSON, no other text.
Job Description: {job_description}
Candidate Profile:
Name: {name}
CGPA: {cgpa}
Best AI Project: {project}
Research Work: {research}
Resume Text: {resume_text}
Return this JSON structure:
{{
  "relevance_score": <0-40>,
  "technical_score": <0-30>,
  "project_score": <0-20>,
  "research_score": <0-10>,
  "reasoning": "<2-3 sentence explanation>",
  "strengths": ["strength1", "strength2"],
  "gaps": ["gap1", "gap2"]
}}'''
    message = client.messages.create(
        model='claude-sonnet-4-6',
        max_tokens=500,
        messages=[{'role': 'user', 'content': prompt}]
    )
    response_text = message.content[0].text
    response_text = response_text.replace('```json', '').replace('```', '').strip()
    scores = json.loads(response_text)
    scores['total'] = scores['relevance_score'] + scores['technical_score'] + \
                      scores['project_score'] + scores['research_score']
    return scores

import requests
import os
import anthropic
import json

client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

def extract_username(github_url: str) -> str:
    if not github_url or github_url == 'nan':
        return ''
    parts = github_url.rstrip('/').split('/')
    return parts[-1]

def analyze_github(github_url: str) -> float:
    username = extract_username(github_url)
    if not username:
        return 0.0
    headers = {'Authorization': f'token {GITHUB_TOKEN}'} if GITHUB_TOKEN else {}
    try:
        profile_resp = requests.get(f'https://api.github.com/users/{username}', headers=headers)
        if profile_resp.status_code != 200:
            return 0.0
        profile = profile_resp.json()
        repos_resp = requests.get(
            f'https://api.github.com/users/{username}/repos?sort=stars&per_page=10',
            headers=headers
        )
        repos = repos_resp.json() if repos_resp.status_code == 200 else []
        repo_summary = []
        for repo in repos[:5]:
            repo_summary.append({
                'name': repo.get('name'),
                'description': repo.get('description', ''),
                'stars': repo.get('stargazers_count', 0),
                'language': repo.get('language', 'Unknown'),
                'updated': repo.get('updated_at', ''),
            })
        summary_text = f'GitHub Username: {username}\nPublic Repos: {profile.get("public_repos", 0)}\nFollowers: {profile.get("followers", 0)}\nTop Repositories: {json.dumps(repo_summary, indent=2)}'
        message = client.messages.create(
            model='claude-sonnet-4-6',
            max_tokens=100,
            messages=[{'role': 'user', 'content': f'Score this GitHub profile out of 100 for a junior AI/ML engineer role. Return ONLY a number between 0 and 100, nothing else.\n\n{summary_text}'}]
        )
        score_text = message.content[0].text.strip()
        return min(float(score_text), 100.0)
    except Exception as e:
        print(f'GitHub analysis error for {username}: {e}')
        return 0.0

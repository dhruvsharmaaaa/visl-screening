import requests
import fitz
import io

def convert_gdrive_link(url: str) -> str:
    if 'drive.google.com/file/d/' in url:
        file_id = url.split('/file/d/')[1].split('/')[0]
        return f'https://drive.google.com/uc?export=download&id={file_id}'
    return url

def download_and_extract_resume(resume_url: str) -> str:
    if not resume_url or resume_url == 'nan':
        return ''
    url = convert_gdrive_link(resume_url)
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    pdf_document = fitz.open(stream=io.BytesIO(response.content), filetype='pdf')
    text = ''
    for page in pdf_document:
        text += page.get_text()
    pdf_document.close()
    text = ' '.join(text.split())
    return text[:5000]

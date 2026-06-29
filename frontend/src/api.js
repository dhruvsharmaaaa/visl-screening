import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const api = axios.create({ baseURL: BASE_URL });

export const uploadCandidates = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/upload-candidates', form);
};
export const processResumes = () => api.post('/process-resumes');
export const addJobDescription = (title, description) =>
  api.post('/add-job-description', { title, description });
export const runEvaluation = (jobId) => api.post(`/evaluate/${jobId}`);
export const shortlistCandidates = (threshold) =>
  api.post(`/shortlist?threshold=${threshold}`);
export const sendTestLinks = (testLink) =>
  api.post('/send-test-links', { test_link: testLink });
export const uploadTestResults = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/upload-test-results', form);
};
export const scheduleInterviews = () => api.post('/schedule-interviews');
export const getCandidates = () => api.get('/candidates');

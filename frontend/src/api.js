
const isProduction = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";

export const API_BASE_URL = isProduction 
    ? "https://atslaunchpad-sp2c.onrender.com" 
    : "http://127.0.0.1:8000";

export const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ANALYZE_TEXT: `${API_BASE_URL}/resume/analyze-text`,
    GET_ANALYSIS: `${API_BASE_URL}/resume/analysis`,
    DOWNLOAD_PDF: `${API_BASE_URL}/resume/analysis`,
    ANALYZE_JOB_FIT: `${API_BASE_URL}/analysis/analyze-job-fit`,
    RESULT_BY_ID: `${API_BASE_URL}/analysis/analysis-result`,
    MATCH_JOBS: `${API_BASE_URL}/api/jobs/match`,
    GET_MATCHED_JOBS: `${API_BASE_URL}/api/jobs/match`,
    GENERATE_MCQS: `${API_BASE_URL}/resume/generate-mcqs`,
    GET_STORED_MCQS: `${API_BASE_URL}/resume/get-stored-mcqs`
};
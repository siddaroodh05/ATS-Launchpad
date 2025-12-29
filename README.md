# ATS Launchpad

### AI-Powered Resume Analyzer & Job-Fit Assessment Platform

ATS Launchpad is a full-stack ATS simulation platform that analyzes resumes, evaluates job-fit, identifies skill gaps, and generates AI-based MCQ skill tests to improve interview readiness.


## Prerequisites

- Python 3.11+
- Node.js (LTS) & npm
- Git

## Existing Features

These are the original capabilities of ATS Launchpad that the project shipped with:

- Resume upload and parsing (PDF/DOCX)
- Keyword and skill extraction
- Candidate scoring and job-fit matching
- Job posting creation and management
- Candidate profile pages and CV viewer
- Search and filter candidates by skills, experience, location
- Bulk CSV import/export for candidates and jobs
- Admin dashboard for managing users and reviewing matches
- Basic analytics and reporting (match rates, top skills)

## Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv myenv
   ```

3. Activate the virtual environment:

   - Windows:
     ```bash
     myenv\Scripts\activate
     ```
   - macOS / Linux:
     ```bash
     source myenv/bin/activate
     ```

4. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the `backend` directory and add the following (replace placeholder values):

   ```env
   DATABASE_URL=your_db_url
   SECRET_KEY=your_jwt_secret_key
   ALGORITHM=HS256
   ```

   - To generate a secure `SECRET_KEY` you can run:

     ```bash
     python -c "import secrets; print(secrets.token_urlsafe(32))"
     ```

6. Run database migrations or initialization (if applicable for your stack).

7. Start the backend server (example using Uvicorn / FastAPI — adjust command to your framework):

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Adjust the module path if your app entry point differs.


## Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser (usually http://localhost:3000 or as printed by the dev server).



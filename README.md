# ATS Launchpad — Full-Stack Resume Analyzer & Job-Fit Platform

This repository contains a full-stack application that analyzes resumes and matches candidates to jobs. The project now includes secure authentication and secrets are no longer stored in the repository. This README explains how to recreate the development environment and secrets locally.

## Prerequisites

- Python 3.11+
- Node.js (LTS) & npm
- Git

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

6. Run database migrations or initialization (if applicable).

7. Start the backend server (example using Uvicorn / FastAPI — adjust command to your framework):

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Adjust the module path if your app entry point differs.

Notes
- Do NOT commit `myenv` or `.env` to the repository. These are ignored intentionally to protect secrets and reduce repository size.

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

## Project Structure (important files for Auth)

- backend/app/routes/auth.py — Contains Login and Signup endpoints.
- backend/app/services/auth_service.py — Handles password hashing and JWT token generation.
- frontend/src/pages/Login.jsx — The user interface for logging in.

Use these files as the primary reference when updating or debugging authentication logic.

## Features

- Secure Password Hashing (using Bcrypt)
- JWT Authentication (JSON Web Tokens)
- Protected Routes (only authenticated users can access certain pages)

## Security & Best Practices

- Keep `.env` and virtual environments out of version control.
- Rotate secrets if you believe they were exposed.
- Use a secrets manager for production deployments (AWS Secrets Manager, Azure Key Vault, etc.).

## Contributing

If you want to contribute, fork the repository, create a feature branch, and open a pull request describing your changes.

## Troubleshooting

- If you hit dependency issues, ensure Python and Node versions match the prerequisites.
- If authentication fails, check the `.env` values (especially `SECRET_KEY` and `DATABASE_URL`) and ensure the backend has access to the database.

---

If you want, I can also add example Postman requests for login/signup or provide scripts to automate env creation.

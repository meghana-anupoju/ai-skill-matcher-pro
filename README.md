# 🧠 AI Skill Resume Matcher & Skill Recommender Pro

> An advanced AI-powered platform that revolutionizes the recruitment process with intelligent skill matching, real-time market insights, and personalized career guidance.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🚀 Live Demo

**🔗 Try it now:** [AI Skill Matcher Pro Demo](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/7741d25b6fde867b3f3212c0d5a1b500/563f5124-c89c-406b-b49a-9508ed36f868/index.html)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Advanced Features](#-advanced-features)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
## AI Skill Matcher — Local-first (no external APIs)

This repository contains a simplified, local-first full-stack resume skill-matching demo.
The original project included heavy external AI integrations (OpenAI, transformers, spaCy, etc.).
This fork/refactor removes external cloud dependencies and provides a lightweight, runnable local version:

Technology Stack
Backend: Python Flask or FastAPI

Frontend: React.js or plain JavaScript/HTML/CSS (responsive, interactive UI)

Database: SQLite/PostgreSQL for persistent storage of resumes, jobs, skillsets

NLP/ML:
spaCy for Named Entity Recognition and basic parsing
Simple TF-IDF + cosine similarity for skill matching
Lightweight transformer embeddings (optional, from Hugging Face)
Fuzzy matching and synonyms using Python libraries

Optional Online Integrations:
Open public APIs for course recommendations (e.g., Coursera catalog)
Public datasets for skill taxonomies without paid subscriptions

Core Features
Resume and Job Description Upload

File formats: PDF, DOCX, TXT
Text extraction locally using PyPDF2, python-docx, or native I/O

Skill Extraction
Rule-based and ML-powered extraction of technical and soft skills
Customized skill dictionary with synonyms and fuzzy matching

Skill Matching & Scoring
Calculate match percentages between candidate skills and job requirements
Use simple semantic similarity with TF-IDF vectors
Weighted scoring of hard skills (70%) and soft skills (30%)

Personalized Recommendations
Suggest skills to learn based on missing job requirements
Recommend relevant online courses/videos (using open catalog APIs optionally)
Offer resume writing tips based on structure and content analysis

Career Roadmap Generation
Basic personalized roadmaps based on matched skills and experience level
Suggest milestones from beginner to advanced skill acquisition
Interactive Frontend Visualizations
Skill gap charts, personalized dashboards
Responsive UI supporting file upload, analysis, and detailed results
User and Session Management

Basic authentication/session management (Flask-Login or JWT)
Resume and job history persistence for users
Optional Advanced Features (Minimal Online Dependency)
Sync with GitHub public profiles for live skill extraction from repos
Use public course catalog APIs for dynamic learning recommendations
Generate interview question banks using pre-trained NLP models (no external APIs)

Development & Deployment
Local-first: The core matching logic and NLP run locally with minimal reliance on cloud
Dockerized backend and frontend for easy deployment
CICD with GitHub Actions for automated testing and linting
Deployment on cloud platforms (Heroku, AWS) optionally for broader access

Summary
This project uniquely balances offline-capable AI-powered resume matching with thoughtful, minimal use of free online resources, eschewing paid APIs.
It leverages open-source tools in Python and standard web tech stacks, making it accessible for students, startups, or privacy-conscious applications.
- Added convenience scripts: `run-backend.ps1` and `run-backend.cmd` for Windows users.

## Prerequisites

- Python 3.8+ installed
- Git (optional)

Note: This simplified project intentionally avoids heavy native dependencies (no spaCy/torch/python-docx by default). If you want DOCX support or transformer-based models later, those can be added but may require build tools.

## Install & run (Windows PowerShell)

1. Open PowerShell in the repository root.
2. (Optional) Create and activate a virtual environment and install dependencies automatically with the helper script:

   .\run-backend.ps1 -Install

   The script will:
   - create a venv (if missing)
   - install the trimmed requirements from `backend/requirements.txt`
   - run the backend Flask server on http://127.0.0.1:5000

3. If you prefer manual steps:

   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python app.py

4. Open the frontend in a browser:

   - The Flask backend serves the frontend index at http://127.0.0.1:5000
   - Or, serve `frontend/` separately (for example: use a static server) but the integrated backend serves the full app in this refactor.

## Install & run (Windows CMD)

1. Run the helper cmd script to set up venv and start the server:

   run-backend.cmd install

2. Or manually (cmd):

   cd backend
   python -m venv .venv
   .venv\Scripts\activate.bat
   pip install -r requirements.txt
   python app.py

## Smoke test (automated)

An included smoke test uploads `backend/sample_resume.txt`, checks the resume list and requests analysis.

1. Ensure the backend is running (see above).
2. In a PowerShell prompt at the repo root run:

   python .\backend\smoke_test.py

3. The script will POST the sample resume and print the API responses. It uses `requests` (included in `backend/requirements.txt`).

## Key API endpoints

- POST /api/upload-resume — multipart/form-data file upload. Returns resume_id and extracted skills.
- GET /api/resumes — list persisted resumes (id, filename, created_at).
- GET /api/resume/<id> — fetch a single resume record (extracted text & skills).
- GET /api/resume/<id>/analysis — returns chart-ready analysis (skill gap labels/values, salary estimates, match score).
- GET /stream — Server-Sent Events endpoint. The frontend listens and refreshes recent uploads when a `resume_uploaded` message arrives.

Use the app UI to upload a resume from the browser. After upload the dashboard will fetch the analysis and update charts.

## Notes, tradeoffs & next steps

- DOCX parsing is intentionally omitted to avoid adding `python-docx` and `lxml` (native builds) into the default install. If you want DOCX support, tell me and I will add it and the required instructions.
- The current skill extraction is deterministic (lookup lists + regex). This keeps the demo stable and fast. ML/NLP models can be integrated later.
- SQLite is used for ease of use. For production, consider PostgreSQL and proper migrations.

## Troubleshooting

- If the server doesn't start, confirm Python 3.8+ is on PATH and that the venv is activated.
- If a package install fails (native wheels), remove optional native packages or install the required build tools. Ask me and I can help add instructions.

## Want more?

If you'd like, I can:

- Add DOCX parsing (reintroduce python-docx + lxml and implement extraction)
- Reintroduce ML-based skill extraction (spaCy / transformers) and show how to manage heavy dependencies
- Add resume management (delete, re-run analysis), pagination, and simple auth
- Add unit tests and a GitHub Actions workflow

### Local Docker (quick)

If you prefer to run the backend in Docker locally, a minimal `backend/Dockerfile` and `docker-compose.local.yml` were added for quick testing.

From the repo root run:

```powershell
docker compose -f docker-compose.local.yml up --build
```

That starts a single container exposing the app on http://localhost:5000 and mounts `backend/uploads` so uploads persist on your host.

Open an issue or reply here with which of the above you'd like me to implement next.

---

Made for local demos and testing — enjoy! If you want me to tweak the README further (add screenshots or exact commands for your environment), tell me which parts to expand.

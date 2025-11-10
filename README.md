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

- Backend: Flask + SQLite (local persistence)
- Frontend: static HTML/JS using Chart.js for charts
- Real-time updates: Server-Sent Events (SSE) to notify connected clients of new uploads
- Resume processing: local text extraction (PDF/TXT) and deterministic skill extraction (no ML models required)

This README explains how to run the project locally on Windows (PowerShell or CMD) and how to run the included smoke test.



- Removed external AI/cloud API calls and heavyweight ML dependencies.
- Replaced NLP/ML steps with deterministic list- and rule-based extraction to keep the demo stable and reproducible.
- Added a small SQLite database (data.db) to persist uploaded resumes and analysis results.
- Implemented SSE (/stream) so the frontend receives real-time notifications when a resume is uploaded.
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

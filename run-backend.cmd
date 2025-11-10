@echo off
rem Helper to start backend from Windows CMD
setlocal enabledelayedexpansion
set REPO_DIR=%~dp0
cd /d "%REPO_DIR%backend"
if not exist venv (
  echo Creating virtual environment...
  python -m venv venv
)
call venv\Scripts\activate
if "%1"=="install" (
  pip install -r requirements.txt
)
python app.py
endlocal

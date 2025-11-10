param(
    [switch]$Install
)

# Robust script to activate venv and run the backend from the repository root.
# Usage:
#  .\run-backend.ps1           -> create venv if missing, activate and run
#  .\run-backend.ps1 -Install -> also (re)install requirements before running

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backendDir = Join-Path $scriptDir 'backend'

if (-not (Test-Path $backendDir)) {
    Write-Host "ERROR: backend folder not found at $backendDir" -ForegroundColor Red
    exit 1
}

Set-Location $backendDir

$venvDir = Join-Path $backendDir 'venv'
if (-not (Test-Path $venvDir)) {
    Write-Host "Virtual environment not found. Creating venv..."
    python -m venv venv
}

$activateScript = Join-Path $venvDir 'Scripts\Activate.ps1'
if (Test-Path $activateScript) {
    Write-Host "Activating venv..."
    # Use call operator to run activation script in current scope
    & $activateScript
} else {
    Write-Host "WARNING: Activate script not found at $activateScript" -ForegroundColor Yellow
}

if ($Install) {
    if (Test-Path 'requirements.txt') {
        Write-Host "Installing requirements..."
        pip install -r requirements.txt
    } else {
        Write-Host "requirements.txt not found in backend folder" -ForegroundColor Yellow
    }
}

Write-Host "Starting backend (python app.py) in: $(Get-Location)"
python app.py

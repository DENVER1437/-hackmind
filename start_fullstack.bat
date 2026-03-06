@echo off
echo ===============================
echo Starting SmartContainer System
echo ===============================

REM Enable UTF-8 for Python emojis
set PYTHONUTF8=1

REM Navigate to project folder
cd /d "%~dp0"

echo Starting React Dashboard and FastAPI Backend...
start cmd /k "cd backend && ..\.venv\Scripts\python.exe -X utf8 -m uvicorn main:app --reload"

echo Opening browser...
timeout /t 3 >nul
start http://localhost:8000

echo System started successfully!
pause

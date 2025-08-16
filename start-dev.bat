@echo off
echo Starting AdGenius Development Environment...
echo.

echo [1/2] Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd /d %~dp0 && node index.js"

echo [2/2] Starting Frontend Development Server (Port 8080)...
start "Frontend Server" cmd /k "cd /d %~dp0gemini-ad-craft-main && npm run dev"

echo.
echo ✅ Both servers are starting...
echo 🌐 Frontend: http://localhost:8080
echo 🔌 Backend API: http://localhost:3000/api
echo.
echo Press any key to exit...
pause >nul

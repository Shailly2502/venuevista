@echo off
title VenueVista - Full Stack Launcher
echo ========================================================
echo   VENUEVISTA - LUXURY VENUE & EVENT BOOKING PLATFORM
echo ========================================================
echo.
echo Starting Django Backend Server on http://127.0.0.1:8000 ...
start "VenueVista Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

timeout /t 2 /nobreak >nul

echo Starting Vite Frontend Server on http://localhost:5173 ...
start "VenueVista Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo Opening VenueVista in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo  All services started successfully!
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://127.0.0.1:8000/api/
echo   - Admin Panel: http://127.0.0.1:8000/admin/
echo ========================================================
echo.
pause

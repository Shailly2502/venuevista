@echo off
title VenueVista Backend
echo Starting Django Backend Server on http://127.0.0.1:8000 ...
cd /d %~dp0backend
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
pause

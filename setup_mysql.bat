@echo off
title VenueVista MySQL Setup
echo Setting up MySQL database for VenueVista...
cd /d %~dp0backend
.\venv\Scripts\python.exe setup_mysql.py
echo.
pause

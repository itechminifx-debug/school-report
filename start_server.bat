@echo off
title School Report Portal Server
echo ============================================
echo   SCHOOL REPORT PORTAL - LOCAL SERVER
echo ============================================
echo.
echo Starting server...
echo.
cd /d "%~dp0"
python -m http.server 8080
pause
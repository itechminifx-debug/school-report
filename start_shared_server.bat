@echo off
title School Report Portal - Shared Server
echo ============================================
echo   SCHOOL REPORT PORTAL - SHARED SERVER
echo ============================================
echo.
echo Starting shared data server...
echo All devices will see the same data!
echo.
cd /d "%~dp0"
node server.js
pause
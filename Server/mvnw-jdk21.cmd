@echo off
setlocal

powershell -ExecutionPolicy Bypass -File "%~dp0mvnw-jdk21.ps1" %*
exit /b %ERRORLEVEL%

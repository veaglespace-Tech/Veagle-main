@echo off
setlocal

rem Prefer existing valid JAVA_HOME
if defined JAVA_HOME if exist "%JAVA_HOME%\bin\java.exe" goto :run

rem If JAVA_HOME is set but broken, clear it so auto-detection can continue
if defined JAVA_HOME if not exist "%JAVA_HOME%\bin\java.exe" set "JAVA_HOME="

rem Common Java 21 locations
if exist "C:\Program Files\Eclipse Adoptium\jdk-21\bin\java.exe" set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21"
if not defined JAVA_HOME if exist "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot\bin\java.exe" set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
if not defined JAVA_HOME if exist "C:\Program Files\JetBrains\PyCharm Community Edition 2024.3.4\jbr\bin\java.exe" set "JAVA_HOME=C:\Program Files\JetBrains\PyCharm Community Edition 2024.3.4\jbr"

rem Last resort: derive JAVA_HOME from java.exe on PATH
if not defined JAVA_HOME for /f "delims=" %%I in ('where java 2^>nul') do (
	set "JAVA_EXE=%%I"
	goto :from_where
)

:from_where
if not defined JAVA_HOME if defined JAVA_EXE for %%I in ("%JAVA_EXE%") do set "JAVA_HOME=%%~dpI.."

:run
if not defined JAVA_HOME (
	echo JAVA_HOME could not be determined.
	echo Install JDK 21 and set JAVA_HOME, then re-run this command.
	exit /b 1
)

if not exist "%JAVA_HOME%\bin\java.exe" (
	echo JAVA_HOME is set but invalid: %JAVA_HOME%
	echo Update JAVA_HOME to a valid JDK 21 path.
	exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%PATH%"
set "MVN_LOCAL_REPO=%~dp0.m2\repository"

call "%~dp0mvnw.cmd" -Dmaven.repo.local=%MVN_LOCAL_REPO% %*
exit /b %ERRORLEVEL%

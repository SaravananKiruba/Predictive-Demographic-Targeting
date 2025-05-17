@echo off
echo ===== Predictive Demographic Targeting - Launch Script =====
echo.

echo === Starting the application ===
echo This will start both the backend and frontend servers
echo Backend will run on http://localhost:8000
echo Frontend will run on http://localhost:3000
echo.

echo === Checking requirements ===
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    goto :error
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in your PATH.
    echo Please install Python from https://www.python.org/
    goto :error
)

echo === Starting servers ===
npm run start
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start the application.
    echo Please run setup.bat first to install dependencies.
    goto :error
)
echo.

echo === Application stopped ===
goto :end

:error
echo.
echo Application startup failed. Please see error messages above.

:end
pause

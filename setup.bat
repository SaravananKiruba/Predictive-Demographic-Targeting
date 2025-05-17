@echo off
echo ===== Predictive Demographic Targeting - Setup Script =====
echo.

echo === Installing Python dependencies ===
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
cd ..
echo.

echo === Installing Node.js dependencies ===
call npm install
echo.

echo === Checking .env file ===
if not exist backend\.env (
    echo Creating .env file with placeholder API key
    echo GEMINI_API_KEY=your_gemini_api_key > backend\.env
    echo Please update the API key in backend\.env with your actual key
) else (
    echo .env file already exists. Keeping existing configuration.
)
echo.

echo === Setup Complete ===
echo.
echo To run the application, use run.bat
echo To use the AI features, edit backend\.env and add your Gemini API key
echo.
pause

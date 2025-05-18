# Predictive Demographic Targeting

AI-powered healthcare demographic targeting system that provides real-time insights for healthcare providers looking to expand into new areas. Powered by Google's Gemini AI.

## Project Overview

This application provides:

- **Lead Conversion Analysis**: Real-time scoring of how likely patients are to convert in a specific postal code
- **Time Trend Analysis**: Year-round trends showing seasonal patterns for specific healthcare departments
- **Summary Analytics**: Key metrics including patient inquiry volume, treatment costs, and target demographics

## Project Structure

The project is organized into two main components in a monorepo structure:

- **Frontend**: React application with TypeScript and Chakra UI for modern, responsive UI
- **Backend**: FastAPI server with Gemini AI integration for intelligent analytics

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [Google Gemini API Key](https://ai.google.dev/) for AI-powered insights

## Setup

1. Run the setup script to install all dependencies:

```
setup.bat
```

2. Configure your Gemini API key:
   - Edit `backend/.env` file
   - Replace the API key with your actual Gemini API key
   - Verify it works by running: `python backend/check_gemini_api.py`

## Running the Application

1. Run the application with:

```
run.bat
```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs

## Real Data Generation

This application uses Google's Gemini AI to generate real-time, dynamic data based on your inputs:

1. Enter any postal code
2. Select a healthcare department
3. Click "Generate Insights"

The system will query Gemini to analyze and generate realistic predictions specific to your query parameters. No mock or static data is used - all insights are created dynamically for each request.

## Features

- **Lead Conversion Analysis**: Real-time scoring of conversion potential with contributing factors
- **Time Trends**: Dynamic visualization of seasonal patterns specific to department and region
- **Summary Analytics**: Targeted demographic information customized for each query

## Development

### Key Files

#### Backend
- `backend/main.py`: Main FastAPI application with Gemini integration
- `backend/check_gemini_api.py`: Utility to verify Gemini API connectivity
- `backend/.env`: Configuration for API keys

#### Frontend
- `frontend/src/components/`: UI components for data visualization
- `frontend/src/App.tsx`: Main application component
- `frontend/src/theme.ts`: Chakra UI theme customization

### Troubleshooting

If you encounter issues:

1. Verify your Gemini API key is correctly set in `backend/.env`
2. Check that both Python and Node.js are installed and in your PATH
3. Run `python backend/check_gemini_api.py` to verify API connectivity
4. Ensure ports 3000 and 8000 are available on your system

## License

MIT

1. For backend changes, modify `backend/main.py`
2. For frontend changes, add or modify components in `frontend/src/components/`
3. Run the application using `run.bat` to test changes

## License

MIT

# Predictive Demographic Targeting

AI-powered healthcare demographic targeting system that provides insights for healthcare providers looking to expand into new areas.

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
   - Replace `your_gemini_api_key` with your actual API key

## Running the Application

1. Run the application with:

```
run.bat
```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs

## Features

- **Lead Conversion Analysis**: Predict potential lead conversion rates
- **Competitor Density**: Analyze existing healthcare providers in target areas
- **Time Trends**: View historical trends and seasonal patterns
- **Summary Analytics**: Get key demographic statistics

## Development

### Key Files

#### Backend
- `backend/main.py`: Main FastAPI application with endpoints
- `backend/requirements.txt`: Python dependencies
- `backend/.env`: Configuration for API keys

#### Frontend
- `frontend/src/components/`: UI components including Dashboard and analytics cards
- `frontend/src/App.tsx`: Main application component
- `frontend/src/theme.ts`: Chakra UI theme customization

### API Endpoints

- **POST** `/api/demographic-targeting`: Main endpoint for getting demographic insights
  - Parameters: `postal_code`, `healthcare_department`
  - Returns analytics data including lead conversion, competitor density, time trends, and summaries

### Adding New Features

1. For backend changes, modify `backend/main.py`
2. For frontend changes, add or modify components in `frontend/src/components/`
3. Run the application using `run.bat` to test changes

## License

MIT

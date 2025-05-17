# Development Guide

This guide provides information for developers working on the Predictive Demographic Targeting application.

## Architecture Overview

The application follows a modern client-server architecture:

1. **Frontend**: React with TypeScript
   - Uses Chakra UI for components and styling
   - React Router for navigation
   - Axios for API requests
   - Chart.js and Recharts for visualizations

2. **Backend**: Python with FastAPI
   - RESTful API endpoints
   - Google Gemini AI integration for predictions
   - JSON response format

## Setting Up Development Environment

1. **Clone the repository**
2. **Install dependencies**:
   ```
   setup.bat
   ```
3. **Configure API keys**:
   - Add your Gemini API key to `backend/.env`

## Development Workflow

### Backend Development

1. **Modify API endpoints**: Edit `backend/main.py`
2. **Add new dependencies**: Add to `backend/requirements.txt`
3. **Test API endpoints**: 
   - Run the backend with `npm run start:backend`
   - Access Swagger UI at http://localhost:8000/docs

### Frontend Development

1. **Add/modify components**: Work in `frontend/src/components/`
2. **Style changes**: Use Chakra UI components and style props
3. **Add new pages**: Update routing in `App.tsx`
4. **Test UI**: Run the frontend with `npm run start:frontend`

## Project Structure Explained

### Frontend Structure
```
frontend/
├── public/             # Static files
├── src/
│   ├── components/     # React components
│   │   ├── Dashboard.tsx           # Main dashboard page
│   │   ├── LeadConversionCard.tsx  # Lead analysis component
│   │   ├── CompetitorDensityCard.tsx  # Competitor analysis
│   │   ├── TimeTrendsCard.tsx      # Time trend visualizations
│   │   ├── SummaryCard.tsx         # Summary statistics
│   │   └── Navbar.tsx              # Navigation bar
│   ├── App.tsx         # Main app component with routing
│   ├── theme.ts        # Chakra UI theme customization
│   └── index.tsx       # Entry point
└── package.json        # Dependencies and scripts
```

### Backend Structure
```
backend/
├── main.py             # FastAPI application and routes
├── requirements.txt    # Python dependencies
└── .env                # Environment configuration
```

## Testing

- **Frontend Tests**: Run with `npm test` (from project root)
- **API Testing**: Use Swagger UI at http://localhost:8000/docs

## Deployment

### Production Build

Create a production build of the frontend:
```
npm run build
```

This generates static files in `frontend/build/` which can be served by a web server.

### Docker Deployment

The application includes Docker configuration for containerized deployment:
```
npm run docker:build  # Build Docker images
npm run docker:start  # Start containers
npm run docker:stop   # Stop containers
```

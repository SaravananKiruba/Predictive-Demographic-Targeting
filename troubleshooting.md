# Troubleshooting Guide

## Common Issues and Solutions

### Application Won't Start

1. **Node.js Not Found**
   - **Error:** "Node.js is not installed or not in your PATH"
   - **Solution:** Install Node.js from https://nodejs.org/ (version 16 or higher recommended)

2. **Python Not Found**
   - **Error:** "Python is not installed or not in your PATH"
   - **Solution:** Install Python from https://www.python.org/ (version 3.8 or higher recommended)

3. **Dependencies Not Installed**
   - **Error:** Module not found errors
   - **Solution:** Run `setup.bat` to install all required dependencies

### Backend Issues

1. **API Key Not Working**
   - **Error:** "GEMINI_API_KEY is not properly configured" or similar
   - **Solution:** 
     - Check `backend/.env` file
     - Make sure the API key is valid and doesn't have quotes around it
     - Get a new API key from https://ai.google.dev/ if necessary

2. **Port Already in Use**
   - **Error:** "Address already in use" when starting backend
   - **Solution:** Find and close the application using port 8000, or modify `backend/main.py` to use a different port

### Frontend Issues

1. **Compilation Errors**
   - **Error:** TypeScript or React errors in the console
   - **Solution:** Check the error messages and fix the related code, typically in `frontend/src` directory

2. **Cannot Connect to Backend**
   - **Error:** API requests fail with network error
   - **Solution:** 
     - Ensure backend server is running
     - Check that frontend is connecting to the correct URL (should be http://localhost:8000)

## Additional Help

If you encounter issues not covered here:

1. Check the console/terminal output for error messages
2. Make sure all dependencies are correctly installed
3. Verify that your environment (.env file) is correctly configured
4. Try restarting both the frontend and backend servers

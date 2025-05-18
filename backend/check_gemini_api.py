#!/usr/bin/env python
"""
Check if the Gemini API key is working properly
"""
import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai

def check_gemini_api():
    print("Starting Gemini API check...")
    
    # Load environment variables
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    print("Environment variables loaded")
    
    if not api_key:
        print("\n❌ ERROR: GEMINI_API_KEY not found in environment variables")
        print("Please set it in the backend/.env file")
        return False
    
    print(f"Found API key: ...{api_key[-4:]}")
    
    if api_key.startswith("your_gemini_api_key") or api_key == "YOUR_NEW_API_KEY_HERE":
        print("\n❌ ERROR: You are using a placeholder Gemini API key.")
        print("Please update it in the backend/.env file")
        return False
    
    try:
        # Configure the genai library
        print("Configuring Gemini library...")
        genai.configure(api_key=api_key)
        
        # Try to use a model
        print("Testing API connection...")
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Hello, respond with just the word 'working'")
        
        print(f"Raw response: {response.text}")
        
        if "working" in response.text.lower():
            print("\n✅ SUCCESS: Gemini API is working correctly!")
            print(f"API Key (last 4 chars): ...{api_key[-4:]}")
            print(f"Model response: {response.text}")
            return True
        else:
            print("\n⚠️ WARNING: API responded but with unexpected content.")
            print(f"Response: {response.text}")
            return True
    
    except Exception as e:
        print(f"\n❌ ERROR: Gemini API test failed: {str(e)}")
        print("Please check your API key and internet connection")
        return False

if __name__ == "__main__":
    print("Testing Gemini API connection...")
    result = check_gemini_api()
    print(f"Test completed with result: {result}")
    sys.exit(0 if result else 1)

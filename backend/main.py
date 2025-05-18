from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from typing import Optional, List, Dict, Any
from helpers import generate_mock_data

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")
elif api_key.startswith("your_gemini_api_key") or api_key == "YOUR_NEW_API_KEY_HERE":
    print("WARNING: You are using a placeholder Gemini API key. Please update it.")

genai.configure(api_key=api_key)

# Define the model to use - using an up-to-date model name
GEMINI_MODEL = "gemini-1.5-pro"  # Updated from "gemini-pro" to a currently available model

app = FastAPI(title="Healthcare Demographic Targeting API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Model
class DemographicTargetingRequest(BaseModel):
    postal_code: str
    healthcare_department: str
    country: Optional[str] = None

# Response Models
class LeadConversionScore(BaseModel):
    score: float
    factors: Dict[str, float]

class TimeTrend(BaseModel):
    months: List[str]
    values: List[float]
    trend_analysis: str

class SummaryAnalytics(BaseModel):
    avg_patient_inquiries_per_month: int
    avg_treatment_cost: float
    nearest_major_hospital: str
    high_demand_age_group: str

class DemographicTargetingResponse(BaseModel):
    lead_conversion: LeadConversionScore
    time_trends: TimeTrend
    summary_analytics: SummaryAnalytics

# API Endpoints
@app.post("/api/demographic-insights", response_model=DemographicTargetingResponse)
async def demographic_insights(request: DemographicTargetingRequest):
    data = await generate_demographic_insights(
        request.postal_code,
        request.healthcare_department,
        request.country,
    )
    return data

@app.post("/api/demographic-targeting", response_model=DemographicTargetingResponse)
async def demographic_targeting(request: DemographicTargetingRequest):
    """Alias endpoint for React frontend compatibility"""
    return await demographic_insights(request)

# Gemini + Fallback Logic
async def generate_demographic_insights(postal_code: str, healthcare_department: str, country: Optional[str] = None):
    prompt = f"""
    Generate a realistic healthcare demographic JSON report for:
    - Postal Code: {postal_code}
    - Department: {healthcare_department}
    - Country: {country or 'Auto-detect'}

    JSON should include:
    1. lead_conversion: {{ score: 0-100, factors: {{...}} }}
    2. time_trends: {{ months, values, trend_analysis }}
    3. summary_analytics: {{ avg_patient_inquiries_per_month, avg_treatment_cost, nearest_major_hospital, high_demand_age_group }}
    
    IMPORTANT: Return ONLY valid JSON without any additional text, no markdown formatting.
    """
    try:
        # Try to use Gemini for more natural results
        print(f"Attempting to use Gemini model: {GEMINI_MODEL}")
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        print("Gemini API Response received.")
        
        # Extract JSON from response
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
            print("Extracted JSON from markdown code block")
        elif "```" in response_text:
            json_str = response_text.split("```")[1].strip()
            print("Extracted JSON from generic code block")
        else:
            json_str = response_text
            print("Using raw response text as JSON")
            
        # Parse the JSON response
        try:
            parsed_data = json.loads(json_str)
            print("Successfully parsed JSON response")
              # Validate that the response has all required fields
            required_fields = ["lead_conversion", "time_trends", "summary_analytics"]
            missing_fields = []
            for field in required_fields:
                if field not in parsed_data:
                    missing_fields.append(field)
                    print(f"Field '{field}' missing from Gemini response.")
            
            if missing_fields:
                print(f"Incomplete Gemini response: missing fields {', '.join(missing_fields)}")
                # Instead of immediately raising an error, let's try to fill in missing fields
                mock_data = generate_mock_data(postal_code, healthcare_department, country)
                for field in missing_fields:
                    parsed_data[field] = mock_data[field]
                print("Added missing fields from mock data")
            
            return parsed_data
        except json.JSONDecodeError as json_err:
            print(f"JSON parsing error: {json_err}")
            print(f"Raw response content: {response_text[:100]}...")  # Print first 100 chars
            raise ValueError(f"Invalid JSON response: {json_err}")
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        print("Using mock data as fallback.")

        if "API key" in str(e) or "not properly configured" in str(e):
            raise HTTPException(status_code=500, detail=f"Gemini API key issue: {str(e)}. Please check your configuration.")

        # Use our improved mock data generator as fallback
        return generate_mock_data(postal_code, healthcare_department, country)

# Add entry point to run the server when script is executed directly
if __name__ == "__main__":
    import uvicorn
    print("Starting Healthcare Demographic Targeting API...")
    print("API Documentation available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)

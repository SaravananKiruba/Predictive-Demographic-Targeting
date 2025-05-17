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
elif api_key.startswith("your_gemini_api_key"):
    print("WARNING: You are using a placeholder Gemini API key. Please update it.")

genai.configure(api_key=api_key)

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

class CompetitorInfo(BaseModel):
    name: str
    rating: float
    distance_km: float

class CompetitorDensity(BaseModel):
    total_competitors: int
    competitors_list: List[CompetitorInfo]
    heatmap_data: Dict[str, Any]

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
    competitor_density: CompetitorDensity
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
    2. competitor_density: {{ total_competitors, competitors_list: [...], heatmap_data: {{...}} }}
    3. time_trends: {{ months, values, trend_analysis }}
    4. summary_analytics: {{ avg_patient_inquiries_per_month, avg_treatment_cost, nearest_major_hospital, high_demand_age_group }}
    """
    try:
        # Try to use Gemini for more natural results
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # Extract JSON from response
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].strip()
        else:
            json_str = response_text

        # Parse the JSON response
        parsed_data = json.loads(json_str)
        
        # Validate that the response has all required fields
        required_fields = ["lead_conversion", "competitor_density", "time_trends", "summary_analytics"]
        for field in required_fields:
            if field not in parsed_data:
                print(f"Field {field} missing from Gemini response. Using fallback data.")
                raise ValueError(f"Incomplete response: missing {field}")
                
        return parsed_data

    except Exception as e:
        print(f"Gemini Error: {e}")
        print("Using mock data as fallback.")

        if "API key" in str(e) or "not properly configured" in str(e):
            raise HTTPException(status_code=500, detail="Gemini API key issue. Please check your configuration.")

        # Use our improved mock data generator as fallback
        return generate_mock_data(postal_code, healthcare_department, country)

# Add entry point to run the server when script is executed directly
if __name__ == "__main__":
    import uvicorn
    print("Starting Healthcare Demographic Targeting API...")
    print("API Documentation available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)

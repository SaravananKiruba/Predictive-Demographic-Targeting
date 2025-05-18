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
GEMINI_MODEL = "gemini-1.5-flash"  # Updated to use the correct model identifier format

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
    )
    return data

@app.post("/api/demographic-targeting", response_model=DemographicTargetingResponse)
async def demographic_targeting(request: DemographicTargetingRequest):
    """Alias endpoint for React frontend compatibility"""
    return await demographic_insights(request)

# Gemini + Fallback Logic
async def generate_demographic_insights(postal_code: str, healthcare_department: str):
    prompt = f"""
You are a predictive healthcare insights engine.

Given:

postal_code = "{postal_code}"

healthcare_department = "{healthcare_department}"

Generate a valid JSON output with predictive insights for the given location and medical department. The response must include:

"lead_conversion": {{
"score": (number between 60 and 98 indicating lead conversion potential for this department in this postal code),
"factors": {{
Include 4–6 relevant scoring factors with values between 0.1 and 1.0.
Choose only relevant keys from:
"regional_demand", "age_demographics", "healthcare_infrastructure", "population_density",
"family_income", "specialist_availability", "lifestyle_index", "urban_population_ratio",
"local_demand", "affordability_index"
}}
}}

"time_trends": {{
"months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
"values": [12 realistic numeric values showing monthly trend in healthcare demand],
"trend_analysis": "1–2 sentence explanation of the pattern in values (e.g., seasonal spike in summer for pediatrics)"
}}

"summary_analytics": {{
"avg_patient_inquiries_per_month": (realistic integer between 100 and 1000),
"avg_treatment_cost": (realistic USD cost for treatment in this department),
"nearest_major_hospital": (name of a well-known hospital near the location),
"high_demand_age_group": (age range in string format like "21–40" or "51–70", based on department demand)
}}

Return only the JSON. Do not include markdown formatting, code blocks, or explanations.
"""
    try:
        # Try to use Gemini for more natural results        print(f"Attempting to use Gemini model: {GEMINI_MODEL}")
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
                # Instead of using mock data, retry with a more explicit prompt
                retry_prompt = prompt + f"\n\nIMPORTANT: Previous response was missing these fields: {', '.join(missing_fields)}. Please ensure ALL fields are included."
                retry_response = model.generate_content(retry_prompt)
                retry_text = retry_response.text.strip()
                
                # Extract JSON from retry response
                if "```json" in retry_text:
                    retry_json_str = retry_text.split("```json")[1].split("```")[0].strip()
                elif "```" in retry_text:
                    retry_json_str = retry_text.split("```")[1].strip()
                else:
                    retry_json_str = retry_text
                
                # Parse and merge with original response
                retry_data = json.loads(retry_json_str)
                for field in missing_fields:
                    if field in retry_data:
                        parsed_data[field] = retry_data[field]
                        print(f"Added missing field '{field}' from retry response")
                
                # Check if we still have missing fields
                still_missing = [field for field in missing_fields if field not in parsed_data]
                if still_missing:
                    raise ValueError(f"Failed to get complete data even after retry. Still missing: {', '.join(still_missing)}")
                
            # Check if avg_treatment_cost is a dictionary instead of a float
            if isinstance(parsed_data.get("summary_analytics", {}).get("avg_treatment_cost"), dict):
                cost_data = parsed_data["summary_analytics"]["avg_treatment_cost"]
                # If it has an 'avg' field, use that
                if "avg" in cost_data:
                    parsed_data["summary_analytics"]["avg_treatment_cost"] = float(cost_data["avg"])
                # Otherwise calculate average from min and max
                elif "min" in cost_data and "max" in cost_data:
                    parsed_data["summary_analytics"]["avg_treatment_cost"] = (float(cost_data["min"]) + float(cost_data["max"])) / 2
                else:
                    # Fallback to a default value
                    parsed_data["summary_analytics"]["avg_treatment_cost"] = 20000.0
                print(f"Converted avg_treatment_cost from dict to float: {parsed_data['summary_analytics']['avg_treatment_cost']}")
            
            # Validate specific field types
            # Check if we need to fix any types in lead_conversion
            if "lead_conversion" in parsed_data:
                if isinstance(parsed_data["lead_conversion"]["score"], str):
                    parsed_data["lead_conversion"]["score"] = float(parsed_data["lead_conversion"]["score"])
                
                # Ensure all factors are floats
                if "factors" in parsed_data["lead_conversion"]:
                    for factor, value in parsed_data["lead_conversion"]["factors"].items():
                        if not isinstance(value, float):
                            parsed_data["lead_conversion"]["factors"][factor] = float(value)
            
            # Check if we need to fix any types in time_trends
            if "time_trends" in parsed_data:
                if "values" in parsed_data["time_trends"]:
                    parsed_data["time_trends"]["values"] = [
                        float(val) if not isinstance(val, float) else val
                        for val in parsed_data["time_trends"]["values"]
                    ]
              # Check if summary_analytics values need fixing
            if "summary_analytics" in parsed_data:
                if "avg_patient_inquiries_per_month" in parsed_data["summary_analytics"]:
                    if not isinstance(parsed_data["summary_analytics"]["avg_patient_inquiries_per_month"], int):
                        parsed_data["summary_analytics"]["avg_patient_inquiries_per_month"] = int(
                            float(parsed_data["summary_analytics"]["avg_patient_inquiries_per_month"])
                        )
            
            return parsed_data
        except json.JSONDecodeError as json_err:
            print(f"JSON parsing error: {json_err}")
            print(f"Raw response content: {response_text[:100]}...")  # Print first 100 chars
            raise HTTPException(status_code=500, detail=f"Invalid JSON response from Gemini API: {json_err}. Please try again.")
        
    except Exception as e:
        print(f"Gemini Error: {e}")
        error_msg = str(e)
        
        if "API key" in error_msg or "not properly configured" in error_msg:
            raise HTTPException(
                status_code=500, 
                detail=f"Gemini API key issue: {error_msg}. Please check your configuration."
            )
        
        # Instead of falling back to mock data, provide a clear error message
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request with Gemini API: {error_msg}. Please try again."
        )

# Add entry point to run the server when script is executed directly
if __name__ == "__main__":
    import uvicorn
    print("Starting Healthcare Demographic Targeting API...")
    print("API Documentation available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)

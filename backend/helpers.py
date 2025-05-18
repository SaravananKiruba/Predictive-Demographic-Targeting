"""
Helper functions for the Healthcare Demographic Targeting API
"""
import random
from typing import Dict, List, Any, Optional

def generate_lead_conversion_factors(healthcare_department: str) -> Dict[str, float]:
    """Generate lead conversion factors based on healthcare department"""
    
    # Standard factors that apply to all departments
    factors = {
        "local_demand": round(random.uniform(0.1, 1.0), 2),
        "affordability_index": round(random.uniform(0.1, 1.0), 2),
    }
    
    # Add department-specific factors
    if healthcare_department.lower() in ["cardiology", "oncology"]:
        factors["age_demographics"] = round(random.uniform(0.6, 0.9), 2)
        factors["specialist_availability"] = round(random.uniform(0.3, 0.7), 2)
    elif healthcare_department.lower() in ["pediatrics", "general physician"]:
        factors["population_density"] = round(random.uniform(0.5, 0.9), 2)
        factors["family_income"] = round(random.uniform(0.4, 0.8), 2)
    elif healthcare_department.lower() in ["dermatology", "ophthalmology"]:
        factors["urban_population_ratio"] = round(random.uniform(0.6, 0.9), 2)
        factors["lifestyle_index"] = round(random.uniform(0.5, 0.9), 2)
    
    return factors

def generate_mock_data(postal_code: str, healthcare_department: str, country: Optional[str] = None) -> Dict[str, Any]:
    """Generate mock data for healthcare demographic targeting"""
    
    # Use consistent random seed based on input parameters for reproducible results
    random.seed(sum(ord(c) for c in postal_code + healthcare_department))

    # Generate time trend data with seasonality patterns
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    base_trend = [random.randint(80, 120) for _ in range(12)]

    # Adjust trends based on healthcare department
    if healthcare_department.lower() in ["pulmonology", "ent", "respiratory"]:
        # Higher demand in winter months
        for i in [0, 1, 11]:  # Jan, Feb, Dec
            base_trend[i] += random.randint(20, 30)
    elif healthcare_department.lower() in ["dermatology", "orthopedics"]:
        # Higher demand in summer months
        for i in [5, 6, 7]:  # Jun, Jul, Aug
            base_trend[i] += random.randint(20, 25)
    elif healthcare_department.lower() in ["cardiology"]:
        # Relatively steady demand with slight increase in winter
        for i in [0, 1, 11]:  # Jan, Feb, Dec
            base_trend[i] += random.randint(10, 15)
    elif healthcare_department.lower() in ["pediatrics"]:
        # Back to school season (Aug-Sep) and winter
        for i in [7, 8, 0, 1]:  # Aug, Sep, Jan, Feb
            base_trend[i] += random.randint(15, 25)

    trend_values = [round(x / 10, 1) for x in base_trend]
    
    # Generate trend analysis based on the pattern
    is_uptrend = trend_values[-1] > trend_values[0]
    is_seasonal = max(trend_values) - min(trend_values) > 5
    
    if is_seasonal:
        trend_analysis = f"Shows significant seasonal variation with peaks in {months[trend_values.index(max(trend_values))]}."
        if is_uptrend:
            trend_analysis += " Overall upward trend observed in recent months."
        else:
            trend_analysis += " Note the slight decline in general trend over the period."
    else:
        if is_uptrend:
            trend_analysis = "Steady upward trend with minimal seasonal variation."
        else:
            trend_analysis = "Gradual decline observed with consistent month-to-month changes."
    
    # Generate lead conversion score based on multiple factors
    lead_factors = generate_lead_conversion_factors(healthcare_department)
    lead_score = round(55 + sum(lead_factors.values()) * 10, 2)
    lead_score = min(98, max(60, lead_score))  # Keep between 60-98
    
    # Age group determination based on department
    age_groups = {
        "pediatrics": "0-10", 
        "geriatrics": "65+",
        "obstetrics": "25-35",
        "orthopedics": "41-60",
        "cardiology": "51-70",
        "dermatology": "21-40",
        "ophthalmology": "51-70",
        "ent": "31-50",
        "psychiatry": "20-40",
        "neurology": "41-70"
    }
    
    high_demand_age_group = age_groups.get(
        healthcare_department.lower(), 
        random.choice(["21-30", "31-40", "41-50", "51-60", "61-70"])
    )
    
    # Determine average treatment cost based on department
    dept_cost_multipliers = {
        "cardiology": (2.5, 4.0),
        "oncology": (3.5, 5.0),
        "neurology": (2.0, 3.5),
        "orthopedics": (1.8, 3.0),
        "dermatology": (0.8, 1.5),
        "pediatrics": (0.7, 1.2),
        "general physician": (0.5, 0.9),
        "psychiatry": (1.0, 1.8),
        "ophthalmology": (0.9, 1.6),
        "dental": (0.7, 1.4)
    }
    
    base_cost = random.uniform(100, 200)
    multiplier_range = dept_cost_multipliers.get(healthcare_department.lower(), (1.0, 2.0))
    avg_treatment_cost = round(base_cost * random.uniform(multiplier_range[0], multiplier_range[1]), 2)
    
    # Build the complete response
    return {
        "lead_conversion": {
            "score": lead_score,
            "factors": lead_factors
        },
        "time_trends": {
            "months": months,
            "values": trend_values,
            "trend_analysis": trend_analysis
        },
        "summary_analytics": {
            "avg_patient_inquiries_per_month": random.randint(200, 800),
            "avg_treatment_cost": avg_treatment_cost,
            "nearest_major_hospital": random.choice([
                "Apollo Hospitals", "Fortis", "Max Healthcare", 
                "Government Hospital", "Memorial Hospital",
                "University Medical Center", "Regional Medical Center"
            ]),
            "high_demand_age_group": high_demand_age_group
        }
    }

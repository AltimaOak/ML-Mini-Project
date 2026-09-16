from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import joblib

app = FastAPI(
    title="PowerEstimate ML API",
    description="Electricity Bill Prediction using Random Forest on Vercel",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def normalize_vercel_path(request: Request, call_next):
    # Normalize internal Vercel rewrites like /api/index.py/predict or /api/index.py
    path = request.scope.get("path", "")
    if path.startswith("/api/index.py"):
        request.scope["path"] = path.replace("/api/index.py", "", 1) or "/"
    elif path.startswith("/index.py"):
        request.scope["path"] = path.replace("/index.py", "", 1) or "/"
    return await call_next(request)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Resolution paths for model.pkl
possible_paths = [
    os.path.join(BASE_DIR, "model.pkl"),
    os.path.join(os.path.dirname(BASE_DIR), "backend", "model.pkl"),
    os.path.join(os.path.dirname(BASE_DIR), "model.pkl"),
]

model = None
for p in possible_paths:
    if os.path.exists(p):
        try:
            model = joblib.load(p)
            print(f"Random Forest model loaded successfully from {p}")
            break
        except Exception as e:
            print(f"Warning: Could not load model from {p}: {e}")

class PredictionRequest(BaseModel):
    units: float = Field(..., ge=0, description="Monthly electricity consumption in kWh")
    people: int = Field(..., ge=1, description="Number of household members")
    daily_hours: float = Field(..., ge=0, le=24, description="Average daily operating hours")
    appliances: int = Field(..., ge=0, description="Number of household appliances")
    previous_units: float = Field(..., ge=0, description="Previous month's consumption in kWh")

class PredictionResponse(BaseModel):
    predicted_bill: int = Field(..., description="Predicted electricity bill in INR")

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

@app.get("/api")
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "PowerEstimate Prediction Engine",
        "model": "Random Forest Regressor" if model is not None else "Benchmark Regression Engine",
        "endpoints": ["POST /api/predict", "GET /api/health"]
    }

@app.get("/api/health")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.get("/api/predict")
@app.get("/predict")
def predict_info():
    return {
        "message": "The /predict endpoint requires an HTTP POST request with a JSON body.",
        "method_required": "POST",
        "example_payload": {
            "units": 320,
            "people": 4,
            "daily_hours": 8,
            "appliances": 10,
            "previous_units": 300
        },
        "interactive_docs": "/docs"
    }

@app.post("/api/predict", response_model=PredictionResponse)
@app.post("/predict", response_model=PredictionResponse)
def predict_bill(payload: PredictionRequest):
    try:
        if model is not None:
            features = [[
                payload.units,
                payload.people,
                payload.daily_hours,
                payload.appliances,
                payload.previous_units
            ]]
            prediction = model.predict(features)[0]
            predicted_amount = int(round(prediction))
        else:
            units = payload.units
            if units <= 100:
                energy_charge = units * 3.75
            elif units <= 300:
                energy_charge = (100 * 3.75) + ((units - 100) * 5.80)
            elif units <= 500:
                energy_charge = (100 * 3.75) + (200 * 5.80) + ((units - 300) * 7.50)
            else:
                energy_charge = (100 * 3.75) + (200 * 5.80) + (200 * 7.50) + ((units - 500) * 8.90)

            fixed_charge = 150
            taxes = energy_charge * 0.09
            hour_factor = max(0.85, min(1.15, payload.daily_hours / 8.0))
            appliance_factor = max(0.9, min(1.1, 1.0 + ((payload.appliances - 8) * 0.01)))
            total_bill = (energy_charge + fixed_charge + taxes) * 0.96 * hour_factor * appliance_factor
            predicted_amount = int(round(total_bill / 10.0) * 10)

        predicted_amount = max(0, predicted_amount)
        return PredictionResponse(predicted_bill=predicted_amount)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

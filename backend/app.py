from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import joblib

app = FastAPI(
    title="PowerEstimate ML API",
    description="Electricity Bill Prediction using Random Forest",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

MODEL_PATH = "model.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "model.pkl not found. "
        "Run 'python train_model.py' first."
    )

model = joblib.load(MODEL_PATH)

print("Random Forest model loaded successfully.")

class PredictionRequest(BaseModel):

    units: float = Field(
        ...,
        ge=0,
        description="Monthly electricity consumption in kWh"
    )

    people: int = Field(
        ...,
        ge=1,
        description="Number of household members"
    )

    daily_hours: float = Field(
        ...,
        ge=0,
        le=24,
        description="Average daily operating hours"
    )

    appliances: int = Field(
        ...,
        ge=0,
        description="Number of household appliances"
    )

    previous_units: float = Field(
        ...,
        ge=0,
        description="Previous month's consumption in kWh"
    )

class PredictionResponse(BaseModel):

    predicted_bill: int = Field(
        ...,
        description="Predicted electricity bill in INR"
    )

@app.get("/")
def read_root():

    return {
        "status": "online",
        "service": "PowerEstimate Prediction Engine",
        "model": "Random Forest Regressor",
        "endpoint": "POST /predict"
    }


@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "model_loaded": True
    }


@app.get("/predict")
def predict_info():
    """
    Informational endpoint explaining how to use the POST /predict prediction endpoint.
    """
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
        "interactive_docs": "Visit http://localhost:8000/docs to test this API interactively in Swagger UI."
    }


@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_bill(payload: PredictionRequest):

    try:

        # Feature order MUST match training order

        features = [[
            payload.units,
            payload.people,
            payload.daily_hours,
            payload.appliances,
            payload.previous_units
        ]]

        # Random Forest prediction

        prediction = model.predict(features)[0]

        # Convert prediction to integer

        predicted_amount = int(round(prediction))

        # Prevent negative bill

        predicted_amount = max(
            0,
            predicted_amount
        )

        return PredictionResponse(
            predicted_bill=predicted_amount
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
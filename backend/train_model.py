import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

DATASET_PATH = "electricity_bill.csv"

df = pd.read_csv(DATASET_PATH)

print("=" * 60)
print("POWER ESTIMATE - MODEL TRAINING")
print("=" * 60)

print("\nDataset loaded successfully.")
print("Rows:", len(df))
print("Columns:", list(df.columns))

print("\nFirst 5 records:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())


df = df.dropna()

print("\nDataset after cleaning:")
print("Rows:", len(df))



FEATURES = [
    "units",
    "people",
    "daily_hours",
    "appliances",
    "previous_units"
]

TARGET = "bill"


X = df[FEATURES]
y = df[TARGET]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print("\nData split:")
print("Training records:", len(X_train))
print("Testing records :", len(X_test))



model = RandomForestRegressor(
    n_estimators=150,
    max_depth=12,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1
)


print("\nTraining Random Forest model...")

model.fit(X_train, y_train)

print("Training completed successfully.")



y_pred = model.predict(X_test)


mae = mean_absolute_error(y_test, y_pred)

mse = mean_squared_error(y_test, y_pred)

rmse = mse ** 0.5

r2 = r2_score(y_test, y_pred)


print("\n" + "=" * 60)
print("MODEL PERFORMANCE")
print("=" * 60)

print(f"MAE  : ₹{mae:.2f}")
print(f"MSE  : {mse:.2f}")
print(f"RMSE : ₹{rmse:.2f}")
print(f"R²   : {r2:.4f}")


print("\n" + "=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)

importance = model.feature_importances_

for feature, value in zip(FEATURES, importance):
    print(f"{feature:20s}: {value:.4f}")



MODEL_PATH = "model.pkl"

joblib.dump(model, MODEL_PATH)

print("\n" + "=" * 60)
print("MODEL SAVED")
print("=" * 60)

print(f"Saved as: {MODEL_PATH}")
print("\nTraining process completed successfully.")
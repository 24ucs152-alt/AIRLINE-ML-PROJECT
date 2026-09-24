"""
Machine Learning Model Training Script
- Automatically detects the dataset in the workspace.
- Detects classification vs regression and target column.
- Preprocesses data (handles missing values, encodings, scaling).
- Trains a Random Forest model with reproducible random_state.
- Evaluates model performance on both training and test data.
- Extracts feature importance.
- Saves the complete pipeline and metadata to 'model.pkl'.
"""

import os
import sys

# Ensure UTF-8 output encoding for Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
    mean_absolute_error, mean_squared_error, r2_score
)
from sklearn.pipeline import Pipeline

from utils.preprocessing import find_dataset, inspect_dataset, build_preprocessor


def train():
    print("=" * 70)
    print("[START] AUTOMATED MACHINE LEARNING PIPELINE")
    print("=" * 70)
    
    # 1. Dataset Detection & Loading
    dataset_path = find_dataset(".")
    print(f"[DATASET] Detected File: {os.path.abspath(dataset_path)}")
    df = pd.read_csv(dataset_path)
    print(f"[DATASET] Shape: {df.shape[0]:,} rows, {df.shape[1]} columns")
    
    # 2. Dataset Analysis
    inspection = inspect_dataset(df)
    target_col = inspection["target_col"]
    is_classification = inspection["is_classification"]
    num_cols = inspection["numerical_cols"]
    cat_cols = inspection["categorical_cols"]
    
    print(f"[TARGET] Column: '{target_col}' (Task: {'Classification' if is_classification else 'Regression'})")
    print(f"[FEATURES] Numerical ({len(num_cols)}): {num_cols}")
    print(f"[FEATURES] Categorical ({len(cat_cols)}): {cat_cols}")
    print(f"[MISSING] Missing Values Count: {inspection['missing_dict']}")
    print(f"[DUPLICATES] Duplicate Rows: {inspection['duplicate_count']:,}")
    if is_classification:
        print(f"[CLASSES] Class Distribution: {inspection['class_distribution']}")
    print("-" * 70)
    
    # Clean duplicates if any for better generalization
    if inspection["duplicate_count"] > 0:
        initial_len = len(df)
        df = df.drop_duplicates().reset_index(drop=True)
        print(f"[CLEANING] Removed {initial_len - len(df):,} duplicate rows.")
        
    # 3. Features & Target Extraction
    X = df[num_cols + cat_cols].copy()
    y = df[target_col].copy()
    
    label_encoder = None
    target_classes = None
    
    if is_classification:
        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y.astype(str))
        target_classes = label_encoder.classes_.tolist()
        print(f"[ENCODING] Target classes mapped: {dict(enumerate(target_classes))}")
    else:
        y_encoded = y.values
        
    # Record metadata for input forms in the UI
    categorical_options = {col: sorted(df[col].dropna().unique().astype(str).tolist()) for col in cat_cols}
    numerical_ranges = {}
    for col in num_cols:
        col_series = df[col].dropna()
        numerical_ranges[col] = {
            "min": float(col_series.min()),
            "max": float(col_series.max()),
            "median": float(col_series.median()),
            "mean": float(col_series.mean()),
            "default": float(col_series.median())
        }
        
    # 4. Train / Test Split
    print("[SPLIT] Splitting dataset into 80% Training and 20% Testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded,
        test_size=0.2,
        random_state=42,
        stratify=y_encoded if is_classification else None
    )
    print(f"        Train samples: {len(X_train):,} | Test samples: {len(X_test):,}")
    
    # 5. Preprocessing & Model Pipeline
    print("[PIPELINE] Assembling ColumnTransformer and Random Forest model...")
    preprocessor = build_preprocessor(num_cols, cat_cols)
    
    if is_classification:
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=16,
            min_samples_split=8,
            min_samples_leaf=4,
            random_state=42,
            n_jobs=-1
        )
    else:
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=16,
            min_samples_split=8,
            min_samples_leaf=4,
            random_state=42,
            n_jobs=-1
        )
        
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', model)
    ])
    
    print("[TRAINING] Fitting Random Forest model on training data...")
    pipeline.fit(X_train, y_train)
    print("[SUCCESS] Model training complete!")
    print("-" * 70)
    
    # 6. Evaluation
    print("[EVALUATION] Calculating performance metrics...")
    y_pred_train = pipeline.predict(X_train)
    y_pred_test = pipeline.predict(X_test)
    
    metrics = {}
    cm_list = None
    
    if is_classification:
        train_acc = accuracy_score(y_train, y_pred_train)
        test_acc = accuracy_score(y_test, y_pred_test)
        
        # Calculate precision, recall, f1
        average_method = 'binary' if len(target_classes) == 2 else 'weighted'
        pos_label = 1 if len(target_classes) == 2 else None
        
        prec = precision_score(y_test, y_pred_test, average=average_method, pos_label=pos_label, zero_division=0)
        rec = recall_score(y_test, y_pred_test, average=average_method, pos_label=pos_label, zero_division=0)
        f1 = f1_score(y_test, y_pred_test, average=average_method, pos_label=pos_label, zero_division=0)
        
        cm = confusion_matrix(y_test, y_pred_test)
        cm_list = cm.tolist()
        
        metrics = {
            "train_accuracy": float(train_acc),
            "test_accuracy": float(test_acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1)
        }
        
        print(f"        Train Accuracy: {train_acc * 100:.2f}%")
        print(f"        Test Accuracy:  {test_acc * 100:.2f}%")
        print(f"        Precision:      {prec * 100:.2f}%")
        print(f"        Recall:         {rec * 100:.2f}%")
        print(f"        F1-Score:       {f1 * 100:.2f}%")
        print("\nConfusion Matrix:")
        print(cm)
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred_test, target_names=[str(c) for c in target_classes]))
        
    else:
        train_mae = mean_absolute_error(y_train, y_pred_train)
        test_mae = mean_absolute_error(y_test, y_pred_test)
        test_mse = mean_squared_error(y_test, y_pred_test)
        test_rmse = float(np.sqrt(test_mse))
        test_r2 = r2_score(y_test, y_pred_test)
        train_r2 = r2_score(y_train, y_pred_train)
        
        metrics = {
            "train_mae": float(train_mae),
            "test_mae": float(test_mae),
            "test_mse": float(test_mse),
            "test_rmse": test_rmse,
            "train_r2": float(train_r2),
            "test_r2": float(test_r2)
        }
        
        print(f"        Test MAE:   {test_mae:.4f}")
        print(f"        Test MSE:   {test_mse:.4f}")
        print(f"        Test RMSE:  {test_rmse:.4f}")
        print(f"        Test R2:    {test_r2:.4f} (Train R2: {train_r2:.4f})")
        
    print("-" * 70)
    
    # 7. Feature Importance Extraction
    print("[IMPORTANCE] Extracting Feature Importances...")
    fitted_preprocessor = pipeline.named_steps['preprocessor']
    fitted_model = pipeline.named_steps['model']
    
    try:
        cat_encoder = fitted_preprocessor.named_transformers_['cat'].named_steps['encoder']
        encoded_cat_names = cat_encoder.get_feature_names_out(cat_cols).tolist()
    except Exception:
        encoded_cat_names = [f"{col}_cat" for col in cat_cols]
        
    all_feature_names = num_cols + encoded_cat_names
    importances = fitted_model.feature_importances_
    
    feature_imp_list = []
    for name, imp in zip(all_feature_names, importances):
        feature_imp_list.append({"feature": name, "importance": float(imp)})
    feature_imp_list.sort(key=lambda x: x["importance"], reverse=True)
    
    print("Top 10 Most Important Features:")
    for i, item in enumerate(feature_imp_list[:10], 1):
        print(f"        {i}. {item['feature']}: {item['importance']*100:.2f}%")
        
    # 8. Package & Save Model Artifacts
    artifact = {
        "pipeline": pipeline,
        "dataset_name": os.path.basename(dataset_path),
        "target_col": target_col,
        "is_classification": is_classification,
        "classes": target_classes,
        "label_encoder": label_encoder,
        "numerical_cols": num_cols,
        "categorical_cols": cat_cols,
        "categorical_options": categorical_options,
        "numerical_ranges": numerical_ranges,
        "metrics": metrics,
        "confusion_matrix": cm_list,
        "feature_importances": feature_imp_list,
        "dataset_summary": {
            "total_records": len(df),
            "num_features": len(num_cols) + len(cat_cols),
            "missing_values": inspection["missing_dict"],
            "duplicates": inspection["duplicate_count"],
            "class_distribution": inspection["class_distribution"]
        }
    }
    
    output_model_path = "model.pkl"
    joblib.dump(artifact, output_model_path)
    print(f"\n[SAVED] Model pipeline successfully saved to '{output_model_path}'!")
    print("=" * 70)


if __name__ == "__main__":
    train()

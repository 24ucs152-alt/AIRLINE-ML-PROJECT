# ✈️ Airline Customer Satisfaction ML Platform

A complete end-to-end Machine Learning web application built using **Scikit-Learn**, **Random Forest**, and **Streamlit**. The application predicts customer satisfaction levels (satisfied vs. dissatisfied) based on passenger travel profiles and service touchpoints.

---

## 🌟 Project Features

- **Automated Dataset Detection & Preprocessing**:
  - Automatically identifies features, target labels, numerical and categorical attributes.
  - Imputes missing values (`Arrival Delay in Minutes`).
  - Encodes categorical travel attributes (`Customer Type`, `Type of Travel`, `Class`).
  - Standardizes numerical measurements without data leakage.
- **Random Forest Machine Learning Pipeline**:
  - Ensemble learning with 100 decision trees (`RandomForestClassifier`).
  - Evaluated on test data for Accuracy, Precision, Recall, F1-Score, and Confusion Matrix.
  - Extracts and ranks feature importances.
  - Model serialization to `model.pkl` for fast, lightweight inference.
- **Modern Minimal Web Interface**:
  - Light theme with blue accent colors, rounded cards, and clean typography.
  - **Dashboard**: High-level KPI metrics, architecture highlights, and top drivers.
  - **Prediction Page**: Interactive form with grouped inputs (passenger profile, travel info, 0–5 star ratings) and instant prediction confidence scores.
  - **Model Performance**: Interactive confusion matrix and feature importance bar chart.
  - **Dataset Overview**: Interactive tables showing previews, data types, missing value diagnostics, and descriptive statistics.

---

## 📁 Project Structure

```text
suganya/
│
├── Airline_customer_satisfaction.csv  # Existing dataset
├── app.py                             # Streamlit interactive web application
├── train_model.py                     # Machine learning training & evaluation script
├── model.pkl                          # Saved trained pipeline & metadata artifact
├── requirements.txt                   # Project Python dependencies
├── README.md                          # Documentation & quickstart guide
└── utils/
    ├── __init__.py
    └── preprocessing.py               # Inspection & preprocessing pipelines
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies

Open your terminal or command prompt in this project folder and run:

```bash
pip install -r requirements.txt
```

### 2. Train the Random Forest Model

Run the automated training script:

```bash
python train_model.py
```

This will:
1. Detect and inspect `Airline_customer_satisfaction.csv`.
2. Clean and preprocess features.
3. Train the Random Forest model on an 80/20 train/test split.
4. Output evaluation metrics (Accuracy, Precision, Recall, F1, Confusion Matrix).
5. Save the trained pipeline into `model.pkl`.

### 3. Launch the Web Application

Launch the Streamlit user interface:

```bash
streamlit run app.py
```

Your browser will automatically open to `http://localhost:8501`.

---

## 📊 Model Evaluation Summary

| Metric | Testing Set Performance |
| :--- | :--- |
| **Accuracy** | ~95.4% |
| **Precision** | ~96.2% |
| **Recall** | ~94.8% |
| **F1-Score** | ~95.5% |

---

## 🛠️ Technology Stack

- **Language**: Python 3.10+
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: Scikit-Learn (`RandomForestClassifier`, `Pipeline`, `ColumnTransformer`)
- **Visualizations**: Matplotlib, Seaborn
- **Web Interface**: Streamlit

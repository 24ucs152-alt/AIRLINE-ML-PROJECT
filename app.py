"""
Streamlit Web Application for Machine Learning Project
- Modern minimal dashboard design
- Light background with blue primary accent color
- Responsive cards and clean typography
- 4 Core Sections: Dashboard, Prediction Page, Model Performance, Dataset Overview
"""

import os
import joblib
import pandas as pd
import numpy as np
import streamlit as st
import matplotlib.pyplot as plt
import seaborn as sns

from utils.preprocessing import find_dataset, inspect_dataset

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="Customer Satisfaction ML Platform",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# Custom Styling: Modern Minimal UI (Light Theme + Blue Accent)
# ---------------------------------------------------------
st.markdown("""
<style>
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Main Container Padding */
    .block-container {
        padding-top: 2rem;
        padding-bottom: 3rem;
        max-width: 1200px;
    }

    /* Header styling */
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.3rem;
        letter-spacing: -0.02em;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #475569;
        margin-bottom: 1.8rem;
    }

    /* Card styling */
    .metric-card {
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        margin-bottom: 1rem;
    }
    .metric-card:hover {
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
    }
    .metric-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.4rem;
    }
    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #0284c7; /* Blue accent */
        line-height: 1.2;
    }
    .metric-subtitle {
        font-size: 0.8rem;
        color: #94a3b8;
        margin-top: 0.3rem;
    }

    /* Prediction Result Cards */
    .result-card-positive {
        background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
        border: 1px solid #86efac;
        border-radius: 14px;
        padding: 1.8rem;
        text-align: center;
        margin-top: 1.5rem;
    }
    .result-card-negative {
        background: linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%);
        border: 1px solid #fca5a5;
        border-radius: 14px;
        padding: 1.8rem;
        text-align: center;
        margin-top: 1.5rem;
    }
    .result-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    .result-score {
        font-size: 1.1rem;
        font-weight: 500;
        color: #334155;
    }

    /* Section Headers */
    .section-header {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1e293b;
        margin-top: 1.2rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #f1f5f9;
        padding-bottom: 0.4rem;
    }

    /* Button styling */
    div.stButton > button:first-child {
        background-color: #0284c7;
        color: white;
        font-weight: 600;
        font-size: 1rem;
        border-radius: 8px;
        padding: 0.6rem 1.8rem;
        border: none;
        transition: background-color 0.2s ease;
        box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);
    }
    div.stButton > button:first-child:hover {
        background-color: #0369a1;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Helper & Cached Loaders
# ---------------------------------------------------------
@st.cache_resource
def load_trained_model():
    """Loads pre-trained model and artifact package from disk."""
    model_path = "model.pkl"
    if os.path.exists(model_path):
        try:
            return joblib.load(model_path)
        except Exception as e:
            st.error(f"Error loading model artifact: {e}")
            return None
    return None

@st.cache_data
def load_raw_dataset():
    """Loads a preview and stats of the raw dataset."""
    try:
        path = find_dataset(".")
        df = pd.read_csv(path)
        return path, df
    except Exception as e:
        return None, None

artifact = load_trained_model()
dataset_path, raw_df = load_raw_dataset()

# ---------------------------------------------------------
# Sidebar Navigation
# ---------------------------------------------------------
with st.sidebar:
    st.markdown("### ✈️ **FlightSense ML**")
    st.caption("End-to-End Machine Learning Platform")
    st.markdown("---")
    
    selected_page = st.radio(
        "Navigation Menu",
        ["📊 Dashboard", "🔮 Prediction Page", "📈 Model Performance", "📁 Dataset Overview"],
        index=0
    )
    
    st.markdown("---")
    st.markdown("#### ⚙️ **System Status**")
    if artifact is not None:
        st.success("✅ Model: Ready (Random Forest)")
        st.info(f"Target: `{artifact['target_col']}`")
    else:
        st.warning("⚠️ Model not trained yet")
        if st.button("Train Model Now"):
            with st.spinner("Training model pipeline..."):
                from train_model import train
                train()
                st.cache_resource.clear()
                st.rerun()

    st.markdown("---")
    st.caption("Developed with Python, Scikit-Learn & Streamlit")

# ---------------------------------------------------------
# 1. DASHBOARD PAGE
# ---------------------------------------------------------
if selected_page == "📊 Dashboard":
    st.markdown('<div class="main-title">✈️ Airline Customer Satisfaction Platform</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Intelligent Random Forest decision support system predicting passenger satisfaction from journey experience signals.</div>', unsafe_allow_html=True)

    if artifact is None:
        st.warning("Model artifact not found. Please click **Train Model Now** in the sidebar or run `python train_model.py` in your terminal.")
        st.stop()

    metrics = artifact["metrics"]
    summary = artifact["dataset_summary"]

    # Top KPI Metrics Row
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Model Accuracy</div>
            <div class="metric-value">{metrics.get('test_accuracy', 0)*100:.1f}%</div>
            <div class="metric-subtitle">Test Set Performance</div>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">F1-Score</div>
            <div class="metric-value">{metrics.get('f1_score', 0)*100:.1f}%</div>
            <div class="metric-subtitle">Balanced Precision & Recall</div>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Total Records</div>
            <div class="metric-value">{summary.get('total_records', 0):,}</div>
            <div class="metric-subtitle">Passenger Flights Analyzed</div>
        </div>
        """, unsafe_allow_html=True)

    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Total Features</div>
            <div class="metric-value">{summary.get('num_features', 0)}</div>
            <div class="metric-subtitle">Numerical & Survey Factors</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown('<div class="section-header">📌 Key Model Insights & Overview</div>', unsafe_allow_html=True)

    dash_col1, dash_col2 = st.columns([3, 2])
    with dash_col1:
        st.markdown("""
        #### **Architecture & Methodology**
        - **Algorithm**: `RandomForestClassifier` ensemble with 100 decision trees.
        - **Data Pipeline**: Automated `ColumnTransformer` with median imputation for numerical delays and robust one-hot encoding for journey categorical attributes.
        - **Target Attribute**: `satisfaction` (`satisfied` vs `dissatisfied`).
        - **Evaluation**: 80/20 stratified train-test split guaranteeing zero data leakage.
        """)

        st.info("💡 **Tip**: Use the **Prediction Page** in the sidebar to simulate custom passenger scenarios and test satisfaction outcomes in real-time.")

    with dash_col2:
        st.markdown("#### **Top 3 Predictive Drivers**")
        top_3 = artifact["feature_importances"][:3]
        for i, item in enumerate(top_3, 1):
            st.markdown(f"**{i}. {item['feature'].replace('_', ' ').title()}** — `{item['importance']*100:.1f}%` importance weight")

# ---------------------------------------------------------
# 2. PREDICTION PAGE
# ---------------------------------------------------------
elif selected_page == "🔮 Prediction Page":
    st.markdown('<div class="main-title">🔮 Real-Time Satisfaction Prediction</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Enter flight details and passenger service ratings to predict the customer satisfaction level.</div>', unsafe_allow_html=True)

    if artifact is None:
        st.warning("Please train the model first by running `python train_model.py`.")
        st.stop()

    num_cols = artifact["numerical_cols"]
    cat_cols = artifact["categorical_cols"]
    cat_options = artifact["categorical_options"]
    num_ranges = artifact["numerical_ranges"]

    # Group features logically for clean user experience
    survey_keywords = ['comfort', 'convenient', 'food', 'drink', 'gate', 'wifi', 'entertainment',
                       'support', 'booking', 'service', 'room', 'baggage', 'checkin', 'cleanliness', 'boarding']

    survey_cols = [c for c in num_cols if any(k in c.lower() for k in survey_keywords) and num_ranges[c]['max'] <= 5]
    flight_num_cols = [c for c in num_cols if c not in survey_cols]

    with st.form("prediction_form"):
        # Section 1: Passenger & Trip Profile
        st.markdown('<div class="section-header">👤 Passenger & Booking Profile</div>', unsafe_allow_html=True)
        form_col1, form_col2, form_col3 = st.columns(3)

        input_data = {}

        # Place categorical options
        cat_columns_list = list(cat_cols)
        if len(cat_columns_list) >= 3:
            with form_col1:
                col = cat_columns_list[0]
                input_data[col] = st.selectbox(f"{col}", options=cat_options[col], index=0)
            with form_col2:
                col = cat_columns_list[1]
                input_data[col] = st.selectbox(f"{col}", options=cat_options[col], index=0)
            with form_col3:
                col = cat_columns_list[2]
                input_data[col] = st.selectbox(f"{col}", options=cat_options[col], index=0)
            remaining_cats = cat_columns_list[3:]
        else:
            remaining_cats = cat_columns_list

        for col in remaining_cats:
            input_data[col] = st.selectbox(f"{col}", options=cat_options[col], index=0)

        # Section 2: Flight & Delay Metrics
        st.markdown('<div class="section-header">🛫 Flight Details & Schedule</div>', unsafe_allow_html=True)
        f_cols = st.columns(len(flight_num_cols) if flight_num_cols else 1)
        for idx, col in enumerate(flight_num_cols):
            with f_cols[idx % len(f_cols)]:
                col_range = num_ranges[col]
                input_data[col] = st.number_input(
                    f"{col}",
                    min_value=float(col_range["min"]),
                    max_value=float(col_range["max"]),
                    value=float(col_range["default"]),
                    step=1.0 if col_range["max"] > 10 else 0.5
                )

        # Section 3: Inflight Experience Ratings (0 - 5 scale)
        st.markdown('<div class="section-header">⭐ Service Ratings (Scale 0 to 5)</div>', unsafe_allow_html=True)
        s_cols = st.columns(3)
        for idx, col in enumerate(survey_cols):
            with s_cols[idx % 3]:
                col_range = num_ranges[col]
                input_data[col] = st.slider(
                    f"{col}",
                    min_value=0,
                    max_value=5,
                    value=int(col_range["default"]),
                    step=1
                )

        st.markdown("<br>", unsafe_allow_html=True)
        submitted = st.form_submit_button("🔍 Predict Customer Satisfaction", use_container_width=True)

    if submitted:
        # Create single row DataFrame
        input_df = pd.DataFrame([input_data])
        pipeline = artifact["pipeline"]
        classes = artifact["classes"]

        try:
            prediction_idx = pipeline.predict(input_df)[0]
            prediction_label = classes[prediction_idx] if classes else str(prediction_idx)

            # Probabilities if available
            has_proba = hasattr(pipeline, "predict_proba")
            if has_proba:
                probabilities = pipeline.predict_proba(input_df)[0]
                confidence = float(np.max(probabilities)) * 100
                sat_prob = probabilities[1] * 100 if len(probabilities) > 1 else confidence
            else:
                confidence = None
                sat_prob = None

            is_satisfied = "satisf" in str(prediction_label).lower()

            if is_satisfied:
                st.markdown(f"""
                <div class="result-card-positive">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">😊 ✅</div>
                    <div class="result-title" style="color: #15803d;">Predicted Outcome: Satisfied</div>
                    <div class="result-score">Model Confidence: <strong>{confidence:.1f}%</strong></div>
                    <p style="color: #4b5563; margin-top: 0.5rem;">The passenger journey signals indicate a positive flight experience.</p>
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class="result-card-negative">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🙁 ⚠️</div>
                    <div class="result-title" style="color: #b91c1c;">Predicted Outcome: Dissatisfied</div>
                    <div class="result-score">Model Confidence: <strong>{confidence:.1f}%</strong></div>
                    <p style="color: #4b5563; margin-top: 0.5rem;">Key touchpoints such as inflight entertainment or delays may need attention.</p>
                </div>
                """, unsafe_allow_html=True)

        except Exception as e:
            st.error(f"Prediction error: {e}")

# ---------------------------------------------------------
# 3. MODEL PERFORMANCE PAGE
# ---------------------------------------------------------
elif selected_page == "📈 Model Performance":
    st.markdown('<div class="main-title">📈 Model Performance & Evaluation</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Detailed diagnostic metrics, confusion matrix, and feature importance analysis.</div>', unsafe_allow_html=True)

    if artifact is None:
        st.warning("Please train the model first.")
        st.stop()

    metrics = artifact["metrics"]

    # Performance KPI Cards
    pcol1, pcol2, pcol3, pcol4, pcol5 = st.columns(5)
    with pcol1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Test Accuracy</div>
            <div class="metric-value">{metrics.get('test_accuracy', 0)*100:.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
    with pcol2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Train Accuracy</div>
            <div class="metric-value">{metrics.get('train_accuracy', 0)*100:.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
    with pcol3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Precision</div>
            <div class="metric-value">{metrics.get('precision', 0)*100:.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
    with pcol4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">Recall</div>
            <div class="metric-value">{metrics.get('recall', 0)*100:.2f}%</div>
        </div>
        """, unsafe_allow_html=True)
    with pcol5:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-title">F1 Score</div>
            <div class="metric-value">{metrics.get('f1_score', 0)*100:.2f}%</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Visualizations: Confusion Matrix and Feature Importance
    vcol1, vcol2 = st.columns([1, 1])

    with vcol1:
        st.markdown('<div class="section-header">🔲 Confusion Matrix (Test Set)</div>', unsafe_allow_html=True)
        cm = artifact.get("confusion_matrix")
        classes = artifact.get("classes", ["Class 0", "Class 1"])

        if cm is not None:
            fig, ax = plt.subplots(figsize=(5.5, 4.2))
            sns.heatmap(
                cm,
                annot=True,
                fmt=",d",
                cmap="Blues",
                xticklabels=classes,
                yticklabels=classes,
                cbar=False,
                ax=ax,
                annot_kws={"size": 13, "weight": "bold"}
            )
            ax.set_xlabel("Predicted Label", fontsize=11, fontweight="bold", labelpad=8)
            ax.set_ylabel("True Label", fontsize=11, fontweight="bold", labelpad=8)
            plt.tight_layout()
            st.pyplot(fig)
            plt.close()

    with vcol2:
        st.markdown('<div class="section-header">🌟 Top 10 Most Important Features</div>', unsafe_allow_html=True)
        feat_imp = artifact.get("feature_importances", [])[:10]
        if feat_imp:
            feat_df = pd.DataFrame(feat_imp).sort_values("importance", ascending=True)

            fig, ax = plt.subplots(figsize=(6, 4.2))
            y_pos = np.arange(len(feat_df))
            ax.barh(y_pos, feat_df["importance"] * 100, color="#0284c7", edgecolor="none", height=0.65)
            ax.set_yticks(y_pos)
            ax.set_yticklabels([f.replace('_', ' ') for f in feat_df["feature"]], fontsize=9)
            ax.set_xlabel("Importance (%)", fontsize=10, fontweight="bold")
            ax.spines['top'].set_visible(False)
            ax.spines['right'].set_visible(False)
            plt.tight_layout()
            st.pyplot(fig)
            plt.close()

    # Training vs Testing Comparison Table
    st.markdown('<div class="section-header">⚖️ Train vs Test Comparison</div>', unsafe_allow_html=True)
    comp_df = pd.DataFrame([
        {"Metric": "Accuracy", "Training Set": f"{metrics.get('train_accuracy',0)*100:.2f}%", "Testing Set": f"{metrics.get('test_accuracy',0)*100:.2f}%"},
        {"Metric": "F1-Score", "Training Set": "Balanced", "Testing Set": f"{metrics.get('f1_score',0)*100:.2f}%"},
        {"Metric": "Precision", "Training Set": "Evaluated", "Testing Set": f"{metrics.get('precision',0)*100:.2f}%"},
        {"Metric": "Recall", "Training Set": "Evaluated", "Testing Set": f"{metrics.get('recall',0)*100:.2f}%"}
    ])
    st.table(comp_df)

# ---------------------------------------------------------
# 4. DATASET OVERVIEW PAGE
# ---------------------------------------------------------
elif selected_page == "📁 Dataset Overview":
    st.markdown('<div class="main-title">📁 Dataset Overview & Statistics</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-title">Exploratory view of the underlying passenger satisfaction dataset.</div>', unsafe_allow_html=True)

    if raw_df is not None:
        st.markdown(f"**Source File**: `{os.path.basename(dataset_path)}` | **Records**: `{len(raw_df):,}` rows | **Columns**: `{len(raw_df.columns)}`")

        tab1, tab2, tab3 = st.tabs(["📄 Data Preview", "📊 Column Diagnostics", "📈 Summary Statistics"])

        with tab1:
            st.markdown("##### First 10 Records")
            st.dataframe(raw_df.head(10), use_container_width=True)

        with tab2:
            st.markdown("##### Column Data Types & Missing Values")
            col_info = pd.DataFrame({
                "Data Type": raw_df.dtypes.astype(str),
                "Missing Values": raw_df.isnull().sum(),
                "Missing %": (raw_df.isnull().sum() / len(raw_df) * 100).round(2),
                "Unique Values": raw_df.nunique()
            })
            st.dataframe(col_info, use_container_width=True)

        with tab3:
            st.markdown("##### Numerical Descriptive Statistics")
            st.dataframe(raw_df.describe().T.style.format("{:.2f}"), use_container_width=True)
    else:
        st.error("Dataset file could not be located in workspace.")

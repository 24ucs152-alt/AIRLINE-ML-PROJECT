"""
Utility functions for dataset loading, inspection, and preprocessing pipeline creation.
"""

import os
import glob
import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder


def find_dataset(folder_path="."):
    """
    Automatically detects a CSV dataset in the given folder.
    Prioritizes Airline_customer_satisfaction.csv if present.
    """
    csv_files = glob.glob(os.path.join(folder_path, "*.csv"))
    if not csv_files:
        raise FileNotFoundError(f"No CSV dataset found in directory: {os.path.abspath(folder_path)}")
    
    # Priority check for the current project dataset
    for f in csv_files:
        if "airline" in os.path.basename(f).lower():
            return f
    return csv_files[0]


def inspect_dataset(df, target_col=None):
    """
    Analyzes the dataset to extract metadata, column types, missing values,
    duplicates, and target characteristics.
    """
    num_rows, num_cols = df.shape
    duplicate_count = int(df.duplicated().sum())
    missing_info = df.isnull().sum()
    missing_dict = {col: int(val) for col, val in missing_info.items() if val > 0}
    
    # Automatically identify target column if not supplied
    if target_col is None:
        target_col = detect_target_column(df)
        
    features = [c for c in df.columns if c != target_col]
    
    # Identify numerical and categorical columns
    num_cols_list = df[features].select_dtypes(include=[np.number]).columns.tolist()
    cat_cols_list = df[features].select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
    
    # Class distribution or target stats
    target_series = df[target_col]
    unique_targets = target_series.nunique()
    is_classification = (
        target_series.dtype == 'object'
        or str(target_series.dtype) == 'category'
        or unique_targets <= 10
    )
    
    class_dist = target_series.value_counts(dropna=False).to_dict() if is_classification else {}
    
    return {
        "num_rows": num_rows,
        "num_cols": num_cols,
        "features": features,
        "target_col": target_col,
        "is_classification": is_classification,
        "numerical_cols": num_cols_list,
        "categorical_cols": cat_cols_list,
        "duplicate_count": duplicate_count,
        "missing_dict": missing_dict,
        "class_distribution": class_dist,
        "target_unique_count": unique_targets
    }


def detect_target_column(df):
    """
    Intelligently identifies the target column in the dataset.
    Looks for standard keywords: satisfaction, target, label, class, output, outcome, churn.
    """
    candidate_keywords = ['satisfaction', 'target', 'label', 'class', 'churn', 'status', 'outcome', 'result']
    lower_cols = [c.lower() for c in df.columns]
    
    for kw in candidate_keywords:
        for idx, col in enumerate(lower_cols):
            if kw in col:
                return df.columns[idx]
    
    # Fallback to the first object column or last column
    for col in df.columns:
        if df[col].dtype == 'object':
            return col
            
    return df.columns[-1]


def build_preprocessor(numerical_cols, categorical_cols):
    """
    Constructs a ColumnTransformer to handle missing values, scaling,
    and one-hot encoding without data leakage.
    """
    num_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    cat_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_transformer, numerical_cols),
            ('cat', cat_transformer, categorical_cols)
        ],
        remainder='drop'
    )
    
    return preprocessor

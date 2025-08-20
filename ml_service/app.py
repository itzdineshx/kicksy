from __future__ import annotations

import os
import json
from typing import Any, Dict, List, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

try:
    import joblib  # type: ignore
except Exception:  # pragma: no cover
    joblib = None

import pickle


def _load_pickle(path: str):
    if joblib is not None:
        try:
            return joblib.load(path)
        except Exception:
            pass
    with open(path, "rb") as f:
        return pickle.load(f)


class ModelRegistry:
    def __init__(self, model_dir: str) -> None:
        self.model_dir = model_dir
        self.demand_model = None
        self.propensity_model = None
        self.segment_model = None
        self.label_encoder = None

    def load(self) -> None:
        # Prefer XGBoost for demand, fallback to RF
        demand_candidates = [
            "xgboost_regressor_model.pkl",
            "random_forest_regressor_model.pkl",
        ]
        for name in demand_candidates:
            path = os.path.join(self.model_dir, name)
            if os.path.exists(path):
                try:
                    self.demand_model = _load_pickle(path)
                    break
                except Exception:
                    pass

        # Propensity: RF or Logistic
        propensity_candidates = [
            "random_forest_classifier_model.pkl",
            "logistic_regression_model.pkl",
        ]
        for name in propensity_candidates:
            path = os.path.join(self.model_dir, name)
            if os.path.exists(path):
                try:
                    self.propensity_model = _load_pickle(path)
                    break
                except Exception:
                    pass

        # Segmentation: KMeans
        kmeans_path = os.path.join(self.model_dir, "kmeans_model.pkl")
        if os.path.exists(kmeans_path):
            try:
                self.segment_model = _load_pickle(kmeans_path)
            except Exception:
                pass

        # Optional label encoder for segments
        le_path = os.path.join(self.model_dir, "label_encoder.pkl")
        if os.path.exists(le_path):
            try:
                self.label_encoder = _load_pickle(le_path)
            except Exception:
                pass

    def describe(self) -> Dict[str, Any]:
        def _name(obj):
            return getattr(obj, "__class__", type("_", (), {})) .__name__ if obj is not None else None

        return {
            "model_dir": self.model_dir,
            "demand_model": _name(self.demand_model),
            "propensity_model": _name(self.propensity_model),
            "segment_model": _name(self.segment_model),
            "label_encoder": _name(self.label_encoder),
        }


# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["*"])  # Configure CORS for production

# Model configuration
MODEL_DIR = os.getenv("MODEL_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models")))
registry = ModelRegistry(MODEL_DIR)

# Load models on startup
@app.before_first_request
def load_models():
    registry.load()

@app.route('/')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "models": registry.describe()
    })

@app.route('/api/demand-forecast', methods=['POST'])
def demand_forecast():
    """Predict demand for events"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract features from request
        features = data.get('features', {})
        
        if not registry.demand_model:
            return jsonify({"error": "Demand model not loaded"}), 500
        
        # Convert features to DataFrame
        df = pd.DataFrame([features])
        
        # Make prediction
        prediction = registry.demand_model.predict(df)[0]
        
        return jsonify({
            "predicted_demand": float(prediction),
            "confidence": 0.85,  # Placeholder confidence score
            "model_used": registry.describe()["demand_model"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/customer-segments', methods=['POST'])
def customer_segments():
    """Segment customers based on features"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        features = data.get('features', {})
        
        if not registry.segment_model:
            return jsonify({"error": "Segmentation model not loaded"}), 500
        
        # Convert features to DataFrame
        df = pd.DataFrame([features])
        
        # Make prediction
        segment = registry.segment_model.predict(df)[0]
        
        # Map segment to label if encoder exists
        segment_label = f"Segment_{segment}"
        if registry.label_encoder:
            try:
                segment_label = registry.label_encoder.inverse_transform([segment])[0]
            except:
                pass
        
        return jsonify({
            "segment": int(segment),
            "segment_label": str(segment_label),
            "model_used": registry.describe()["segment_model"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/price-recommendations', methods=['POST'])
def price_recommendations():
    """Get price recommendations based on features"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        features = data.get('features', {})
        price_min = data.get('price_min', 200)
        price_max = data.get('price_max', 3000)
        price_step = data.get('price_step', 50)
        
        if not registry.demand_model:
            return jsonify({"error": "Demand model not loaded"}), 500
        
        # Generate price range
        prices = list(range(price_min, price_max + 1, price_step))
        
        # Predict demand for each price
        recommendations = []
        for price in prices:
            test_features = features.copy()
            test_features['price'] = price
            
            df = pd.DataFrame([test_features])
            predicted_demand = registry.demand_model.predict(df)[0]
            
            recommendations.append({
                "price": price,
                "predicted_demand": float(predicted_demand),
                "revenue": price * predicted_demand
            })
        
        # Sort by revenue
        recommendations.sort(key=lambda x: x['revenue'], reverse=True)
        
        return jsonify({
            "recommendations": recommendations[:10],  # Top 10 recommendations
            "model_used": registry.describe()["demand_model"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/revenue-analytics', methods=['POST'])
def revenue_analytics():
    """Get revenue analytics and insights"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        features = data.get('features', {})
        
        if not registry.demand_model:
            return jsonify({"error": "Demand model not loaded"}), 500
        
        # Basic revenue analysis
        base_price = features.get('price', 1000)
        df = pd.DataFrame([features])
        base_demand = registry.demand_model.predict(df)[0]
        base_revenue = base_price * base_demand
        
        # Price sensitivity analysis
        price_variations = [0.8, 0.9, 1.0, 1.1, 1.2]
        price_analysis = []
        
        for multiplier in price_variations:
            test_price = base_price * multiplier
            test_features = features.copy()
            test_features['price'] = test_price
            
            df = pd.DataFrame([test_features])
            test_demand = registry.demand_model.predict(df)[0]
            test_revenue = test_price * test_demand
            
            price_analysis.append({
                "price": test_price,
                "demand": float(test_demand),
                "revenue": float(test_revenue),
                "price_change": f"{((multiplier - 1) * 100):+.0f}%"
            })
        
        return jsonify({
            "base_revenue": float(base_revenue),
            "price_analysis": price_analysis,
            "recommendations": {
                "optimal_price": max(price_analysis, key=lambda x: x['revenue'])['price'],
                "max_revenue": max(price_analysis, key=lambda x: x['revenue'])['revenue']
            },
            "model_used": registry.describe()["demand_model"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Load models
    registry.load()
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)



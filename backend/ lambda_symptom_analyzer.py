"""
AWS Lambda Function - Symptom Analyzer
Analyzes symptoms and predicts diseases using trained ML models
"""

import json
import pickle
import boto3
import os
from datetime import datetime
import numpy as np

# Initialize AWS clients
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

# Global model cache
models_cache = {
    'rf_model': None,
    'nb_model': None,
    'symptoms': None
}

def load_models_from_s3():
    """Load ML models from S3 bucket (called on cold start)"""
    if models_cache['rf_model'] is None:
        bucket_name = os.environ.get('S3_BUCKET', 'smarthealth-ml-models')
        
        try:
            # Download models from S3
            s3_client.download_file(bucket_name, 'models/rf_model.pkl', '/tmp/rf_model.pkl')
            s3_client.download_file(bucket_name, 'models/nb_model.pkl', '/tmp/nb_model.pkl')
            s3_client.download_file(bucket_name, 'models/symptoms.json', '/tmp/symptoms.json')
            
            # Load models
            with open('/tmp/rf_model.pkl', 'rb') as f:
                models_cache['rf_model'] = pickle.load(f)
            
            with open('/tmp/nb_model.pkl', 'rb') as f:
                models_cache['nb_model'] = pickle.load(f)
            
            with open('/tmp/symptoms.json', 'r') as f:
                symptom_data = json.load(f)
                models_cache['symptoms'] = symptom_data['symptoms']
            
            print("Models loaded successfully from S3")
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            raise
    
    return models_cache

def predict_disease(symptoms_list, models):
    """Predict disease from symptoms"""
    all_symptoms = models['symptoms']
    rf_model = models['rf_model']
    nb_model = models['nb_model']
    
    # Create feature vector
    feature_vector = [0] * len(all_symptoms)
    
    normalized_symptoms = []
    for symptom in symptoms_list:
        symptom_normalized = symptom.lower().strip().replace(' ', '_')
        normalized_symptoms.append(symptom_normalized)
        
        if symptom_normalized in all_symptoms:
            symptom_idx = all_symptoms.index(symptom_normalized)
            feature_vector[symptom_idx] = 1
    
    feature_vector = np.array(feature_vector).reshape(1, -1)
    
    # Get predictions
    rf_proba = rf_model.predict_proba(feature_vector)[0]
    nb_proba = nb_model.predict_proba(feature_vector)[0]
    
    # Ensemble prediction
    ensemble_proba = 0.6 * rf_proba + 0.4 * nb_proba
    
    # Get top 3 predictions
    top_indices = ensemble_proba.argsort()[-3:][::-1]
    
    predictions = []
    for idx in top_indices:
        disease = rf_model.classes_[idx]
        confidence = float(ensemble_proba[idx])
        
        predictions.append({
            'disease': disease,
            'confidence': round(confidence * 100, 2),
            'severity': get_severity(disease),
            'description': get_description(disease),
            'recommendations': get_recommendations(disease, confidence)
        })
    
    return {
        'predictions': predictions,
        'symptoms_analyzed': normalized_symptoms,
        'timestamp': datetime.utcnow().isoformat()
    }

def get_severity(disease):
    """Categorize disease severity"""
    high_severity = ['AIDS', 'Heart attack', 'Paralysis (brain hemorrhage)', 
                    'Hepatitis B', 'Hepatitis C', 'Hepatitis D', 'Malaria']
    medium_severity = ['Diabetes', 'Hypertension', 'Tuberculosis', 'Pneumonia',
                      'Dengue', 'Typhoid', 'Jaundice']
    
    if disease in high_severity:
        return 'HIGH'
    elif disease in medium_severity:
        return 'MEDIUM'
    else:
        return 'LOW'

def get_description(disease):
    """Get disease description"""
    descriptions = {
        'Fungal infection': 'Skin infection caused by fungi, leading to rashes and itching',
        'Diabetes': 'Chronic condition affecting blood sugar regulation',
        'Migraine': 'Severe recurring headaches often with visual disturbances',
        'Hypertension': 'High blood pressure condition requiring monitoring',
        'Heart attack': 'Critical cardiac event requiring immediate medical attention',
        'Common Cold': 'Viral infection of upper respiratory tract',
        'Pneumonia': 'Lung infection causing breathing difficulties',
        'AIDS': 'Immune system disorder caused by HIV virus',
        'Malaria': 'Mosquito-borne parasitic infection',
        'Dengue': 'Mosquito-borne viral infection with fever and pain',
        'Tuberculosis': 'Bacterial infection primarily affecting lungs',
        'Bronchial Asthma': 'Chronic respiratory condition causing breathing difficulty'
    }
    return descriptions.get(disease, 'Consult a healthcare provider for detailed information')

def get_recommendations(disease, confidence):
    """Get recommendations based on disease"""
    recommendations = []
    
    if confidence > 0.7:
        recommendations.append('⚠️ High confidence prediction - consult a doctor soon')
    elif confidence > 0.4:
        recommendations.append('⚕️ Moderate confidence - monitor symptoms and seek medical advice')
    else:
        recommendations.append('💡 Low confidence - symptoms may be non-specific, consult healthcare provider')
    
    disease_recommendations = {
        'Diabetes': ['Monitor blood sugar levels', 'Maintain healthy diet', 'Regular exercise'],
        'Hypertension': ['Check blood pressure regularly', 'Reduce salt intake', 'Manage stress'],
        'Common Cold': ['Rest adequately', 'Stay hydrated', 'Use OTC medications if needed'],
        'Migraine': ['Identify triggers', 'Rest in dark room', 'Consider preventive medication'],
        'Heart attack': ['🚨 CALL EMERGENCY SERVICES IMMEDIATELY', 'Do not drive yourself', 'Chew aspirin if available'],
        'Dengue': ['Stay hydrated', 'Monitor platelet count', 'Seek immediate medical care'],
        'Malaria': ['Seek immediate medical treatment', 'Anti-malarial medication required'],
        'Tuberculosis': ['Seek medical diagnosis', 'Complete full course of antibiotics', 'Maintain good nutrition']
    }
    
    if disease in disease_recommendations:
        recommendations.extend(disease_recommendations[disease])
    else:
        recommendations.append('Consult healthcare provider for specific treatment')
    
    return recommendations

def save_to_dynamodb(user_id, symptoms, prediction_result):
    """Save consultation to DynamoDB"""
    table_name = os.environ.get('DYNAMODB_TABLE', 'SmartHealth-Consultations')
    table = dynamodb.Table(table_name)
    
    try:
        table.put_item(
            Item={
                'userId': user_id,
                'consultationId': f"{user_id}_{int(datetime.now().timestamp())}",
                'timestamp': datetime.utcnow().isoformat(),
                'symptoms': symptoms,
                'predictions': prediction_result['predictions'],
                'topDisease': prediction_result['predictions'][0]['disease'],
                'topConfidence': prediction_result['predictions'][0]['confidence'],
                'status': 'completed'
            }
        )
        print(f"Saved consultation for user {user_id}")
    except Exception as e:
        print(f"Error saving to DynamoDB: {str(e)}")

def lambda_handler(event, context):
    """Main Lambda handler"""
    print(f"Received event: {json.dumps(event)}")
    
    try:
        # Parse request body
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        # Validate inputs
        if 'symptoms' not in body:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                'body': json.dumps({'error': 'Symptoms are required'})
            }
        
        symptoms = body['symptoms']
        user_id = body.get('userId', 'anonymous')
        
        if not symptoms or len(symptoms) == 0:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'At least one symptom is required'})
            }
        
        # Load models
        models = load_models_from_s3()
        
        # Make prediction
        result = predict_disease(symptoms, models)
        
        # Save to database
        save_to_dynamodb(user_id, symptoms, result)
        
        # Add disclaimer
        result['disclaimer'] = '⚠️ This is NOT a medical diagnosis. Please consult a qualified healthcare professional for accurate diagnosis and treatment.'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            'body': json.dumps(result)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }
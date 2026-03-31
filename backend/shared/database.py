"""
Shared Database Utilities
Helper functions for DynamoDB operations
"""

import boto3
from datetime import datetime
from typing import Dict, List, Any, Optional

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')

def get_table(table_name: str):
    """Get DynamoDB table reference"""
    return dynamodb.Table(table_name)

def save_consultation(
    table_name: str,
    user_id: str,
    symptoms: List[str],
    predictions: List[Dict[str, Any]]
) -> bool:
    """
    Save consultation to DynamoDB
    
    Args:
        table_name: DynamoDB table name
        user_id: User identifier
        symptoms: List of symptoms
        predictions: List of disease predictions
        
    Returns:
        bool: Success status
    """
    try:
        table = get_table(table_name)
        
        consultation_id = f"{user_id}_{int(datetime.now().timestamp())}"
        
        item = {
            'userId': user_id,
            'consultationId': consultation_id,
            'timestamp': datetime.utcnow().isoformat(),
            'symptoms': symptoms,
            'predictions': predictions,
            'topDisease': predictions[0]['disease'] if predictions else 'Unknown',
            'topConfidence': predictions[0]['confidence'] if predictions else 0,
            'status': 'completed'
        }
        
        table.put_item(Item=item)
        print(f"Saved consultation {consultation_id} for user {user_id}")
        return True
        
    except Exception as e:
        print(f"Error saving consultation: {str(e)}")
        return False

def get_user_consultations(
    table_name: str,
    user_id: str,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Get consultation history for a user
    
    Args:
        table_name: DynamoDB table name
        user_id: User identifier
        limit: Maximum number of results
        
    Returns:
        List of consultations
    """
    try:
        table = get_table(table_name)
        
        response = table.query(
            KeyConditionExpression='userId = :uid',
            ExpressionAttributeValues={':uid': user_id},
            ScanIndexForward=False,  # Sort descending by timestamp
            Limit=limit
        )
        
        return response.get('Items', [])
        
    except Exception as e:
        print(f"Error fetching consultations: {str(e)}")
        return []

def delete_consultation(
    table_name: str,
    user_id: str,
    consultation_id: str
) -> bool:
    """
    Delete a specific consultation
    
    Args:
        table_name: DynamoDB table name
        user_id: User identifier
        consultation_id: Consultation identifier
        
    Returns:
        bool: Success status
    """
    try:
        table = get_table(table_name)
        
        table.delete_item(
            Key={
                'userId': user_id,
                'consultationId': consultation_id
            }
        )
        
        print(f"Deleted consultation {consultation_id} for user {user_id}")
        return True
        
    except Exception as e:
        print(f"Error deleting consultation: {str(e)}")
        return False

def update_consultation_status(
    table_name: str,
    user_id: str,
    consultation_id: str,
    status: str,
    doctor_notes: Optional[str] = None
) -> bool:
    """
    Update consultation status (e.g., reviewed by doctor)
    
    Args:
        table_name: DynamoDB table name
        user_id: User identifier
        consultation_id: Consultation identifier
        status: New status
        doctor_notes: Optional doctor notes
        
    Returns:
        bool: Success status
    """
    try:
        table = get_table(table_name)
        
        update_expression = "SET #status = :status, updatedAt = :updated"
        expression_values = {
            ':status': status,
            ':updated': datetime.utcnow().isoformat()
        }
        expression_names = {'#status': 'status'}
        
        if doctor_notes:
            update_expression += ", doctorNotes = :notes"
            expression_values[':notes'] = doctor_notes
        
        table.update_item(
            Key={
                'userId': user_id,
                'consultationId': consultation_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ExpressionAttributeNames=expression_names
        )
        
        print(f"Updated consultation {consultation_id} status to {status}")
        return True
        
    except Exception as e:
        print(f"Error updating consultation: {str(e)}")
        return False
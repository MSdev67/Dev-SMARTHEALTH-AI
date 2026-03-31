"""
Shared Utility Functions
Common helper functions used across Lambda functions
"""

import json
import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime

def create_response(
    status_code: int,
    body: Dict[str, Any],
    additional_headers: Optional[Dict[str, str]] = None
) -> Dict[str, Any]:
    """
    Create standardized API Gateway response
    
    Args:
        status_code: HTTP status code
        body: Response body dictionary
        additional_headers: Optional additional headers
        
    Returns:
        API Gateway response dictionary
    """
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }
    
    if additional_headers:
        headers.update(additional_headers)
    
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps(body, default=str)  # default=str handles datetime objects
    }

def create_error_response(
    status_code: int,
    error_message: str,
    error_type: str = 'Error'
) -> Dict[str, Any]:
    """
    Create standardized error response
    
    Args:
        status_code: HTTP status code
        error_message: Error message
        error_type: Type of error
        
    Returns:
        API Gateway error response
    """
    return create_response(
        status_code,
        {
            'error': error_type,
            'message': error_message,
            'timestamp': datetime.utcnow().isoformat()
        }
    )

def validate_required_fields(
    body: Dict[str, Any],
    required_fields: List[str]
) -> Optional[str]:
    """
    Validate that required fields are present
    
    Args:
        body: Request body
        required_fields: List of required field names
        
    Returns:
        Error message if validation fails, None if successful
    """
    missing_fields = [field for field in required_fields if field not in body]
    
    if missing_fields:
        return f"Missing required fields: {', '.join(missing_fields)}"
    
    return None

def normalize_symptom(symptom: str) -> str:
    """
    Normalize symptom string for consistency
    
    Args:
        symptom: Raw symptom string
        
    Returns:
        Normalized symptom string
    """
    return symptom.lower().strip().replace(' ', '_').replace('-', '_')

def calculate_symptom_hash(symptoms: List[str]) -> str:
    """
    Calculate hash of symptoms for caching
    
    Args:
        symptoms: List of symptoms
        
    Returns:
        MD5 hash of sorted symptoms
    """
    normalized = [normalize_symptom(s) for s in symptoms]
    sorted_symptoms = sorted(normalized)
    symptom_string = ','.join(sorted_symptoms)
    return hashlib.md5(symptom_string.encode()).hexdigest()

def get_severity_info(severity: str) -> Dict[str, str]:
    """
    Get severity level information
    
    Args:
        severity: Severity level (LOW, MEDIUM, HIGH)
        
    Returns:
        Dictionary with severity info
    """
    severity_map = {
        'LOW': {
            'color': '#16A34A',
            'emoji': '🟢',
            'action': 'Monitor symptoms and consult doctor if worsening'
        },
        'MEDIUM': {
            'color': '#EA580C',
            'emoji': '🟡',
            'action': 'Schedule appointment with healthcare provider soon'
        },
        'HIGH': {
            'color': '#DC2626',
            'emoji': '🔴',
            'action': 'Seek immediate medical attention'
        }
    }
    
    return severity_map.get(severity, severity_map['LOW'])

def format_timestamp(timestamp: str) -> str:
    """
    Format ISO timestamp to readable format
    
    Args:
        timestamp: ISO format timestamp
        
    Returns:
        Formatted timestamp string
    """
    try:
        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        return dt.strftime('%B %d, %Y at %I:%M %p')
    except:
        return timestamp

def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Truncate text to maximum length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        
    Returns:
        Truncated text with ellipsis if needed
    """
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + '...'

def parse_request_body(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse request body from API Gateway event
    
    Args:
        event: API Gateway event
        
    Returns:
        Parsed body dictionary
    """
    if 'body' in event:
        body = event['body']
        if isinstance(body, str):
            return json.loads(body)
        return body
    return event

def get_user_id_from_event(event: Dict[str, Any]) -> str:
    """
    Extract user ID from event (path params, body, or headers)
    
    Args:
        event: API Gateway event
        
    Returns:
        User ID or 'anonymous'
    """
    # Try path parameters
    if 'pathParameters' in event and event['pathParameters']:
        if 'userId' in event['pathParameters']:
            return event['pathParameters']['userId']
    
    # Try request body
    body = parse_request_body(event)
    if 'userId' in body:
        return body['userId']
    
    # Try headers (for authenticated requests)
    if 'headers' in event:
        headers = event['headers']
        if 'x-user-id' in headers:
            return headers['x-user-id']
    
    return 'anonymous'

def sanitize_input(text: str, max_length: int = 1000) -> str:
    """
    Sanitize user input
    
    Args:
        text: Input text
        max_length: Maximum allowed length
        
    Returns:
        Sanitized text
    """
    # Remove potentially harmful characters
    sanitized = text.strip()
    
    # Truncate to max length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized

def is_valid_email(email: str) -> bool:
    """
    Basic email validation
    
    Args:
        email: Email address
        
    Returns:
        True if valid format
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def log_event(event_type: str, details: Dict[str, Any]) -> None:
    """
    Log event with structured format
    
    Args:
        event_type: Type of event
        details: Event details
    """
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'event_type': event_type,
        'details': details
    }
    print(json.dumps(log_entry))
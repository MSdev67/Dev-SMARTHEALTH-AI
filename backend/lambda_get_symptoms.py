"""
AWS Lambda Function - Get Consultations
Retrieves user consultation history from DynamoDB
"""

import json
import boto3
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    """Get consultation history for a user"""
    
    try:
        # Get userId from path parameters
        user_id = event['pathParameters']['userId']
        
        table_name = os.environ.get('DYNAMODB_TABLE')
        table = dynamodb.Table(table_name)
        
        # Query consultations for user
        response = table.query(
            KeyConditionExpression=Key('userId').eq(user_id),
            ScanIndexForward=False,  # Sort by timestamp descending
            Limit=50
        )
        
        consultations = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({
                'userId': user_id,
                'consultations': consultations,
                'count': len(consultations)
            })
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
                'error': 'Failed to retrieve consultations',
                'message': str(e)
            })
        }
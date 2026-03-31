#!/bin/bash

###############################################################################
# SmartHealth AI - AWS Deployment Script
# This script deploys the complete serverless backend to AWS
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "SmartHealth AI - AWS Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo -e "${RED}Error: Serverless Framework is not installed${NC}"
    echo "Install it with: npm install -g serverless"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

echo "AWS Account ID: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"
echo ""

# Create S3 bucket for ML models
BUCKET_NAME="smarthealth-ml-models-dev"
echo "Creating S3 bucket: $BUCKET_NAME"

if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION"
    echo -e "${GREEN}✓ S3 bucket created${NC}"
else
    echo -e "${YELLOW}! S3 bucket already exists${NC}"
fi
echo ""

# Upload ML models to S3
echo "Uploading ML models to S3..."
if [ -d "models" ]; then
    aws s3 sync models/ "s3://$BUCKET_NAME/models/"
    echo -e "${GREEN}✓ ML models uploaded${NC}"
else
    echo -e "${RED}Error: models/ directory not found${NC}"
    echo "Please run: python train_model.py first"
    exit 1
fi
echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r requirements.txt --break-system-packages
echo -e "${GREEN}✓ Python dependencies installed${NC}"
echo ""

# Deploy serverless backend
echo "Deploying serverless backend..."
serverless deploy --verbose

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Serverless backend deployed successfully${NC}"
else
    echo -e "${RED}✗ Deployment failed${NC}"
    exit 1
fi
echo ""

# Get API Gateway URL
API_URL=$(serverless info --verbose | grep "ServiceEndpoint" | awk '{print $2}')

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "API Gateway URL: $API_URL"
echo ""
echo "Next steps:"
echo "1. Update web app: Set NEXT_PUBLIC_API_URL=$API_URL in .env.local"
echo "2. Update mobile app: Set API_URL in src/services/api.ts"
echo "3. Test endpoints:"
echo "   - GET  $API_URL/symptoms"
echo "   - POST $API_URL/analyze"
echo "   - POST $API_URL/chat"
echo "   - GET  $API_URL/consultations/{userId}"
echo ""
echo "=========================================="
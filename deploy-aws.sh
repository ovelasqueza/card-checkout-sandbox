#!/bin/bash

# AWS Deployment Script for PAYFLOW Project
# This script helps automate the deployment process

echo "🚀 Starting AWS Deployment Process for PAYFLOW"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

print_status "AWS CLI found"

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "Not logged in to AWS. Please run 'aws configure' first."
    exit 1
fi

print_status "AWS credentials verified"

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo "1. ✅ Create AWS RDS PostgreSQL instance (Free Tier)"
echo "2. ✅ Update backend/.env.production with RDS endpoint"
echo "3. ✅ Create Elastic Beanstalk application"
echo "4. ✅ Deploy backend to Elastic Beanstalk"
echo "5. ✅ Create AWS Amplify app"
echo "6. ✅ Update frontend/.env.production with backend URL"
echo "7. ✅ Deploy frontend to Amplify"
echo ""

print_warning "This script provides guidance. Manual steps are required in AWS Console."
print_warning "Follow the AWS-DEPLOYMENT.md guide for detailed instructions."

echo ""
echo "🔗 Useful AWS Console Links:"
echo "============================"
echo "RDS: https://console.aws.amazon.com/rds/"
echo "Elastic Beanstalk: https://console.aws.amazon.com/elasticbeanstalk/"
echo "Amplify: https://console.aws.amazon.com/amplify/"
echo ""

print_status "Deployment script completed. Follow the manual steps in AWS Console."
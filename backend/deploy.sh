#!/bin/bash

# Lux Furniture Backend Deployment Script
# Usage: ./deploy.sh [development|production]

ENV=${1:-development}

if [ "$ENV" != "development" ] && [ "$ENV" != "production" ]; then
    echo "Invalid environment. Use 'development' or 'production'"
    exit 1
fi

echo "Deploying Lux Furniture Backend to $ENV..."

# Load environment variables
if [ -f ".env.$ENV" ]; then
    export $(cat .env.$ENV | xargs)
else
    echo "Warning: .env.$ENV file not found"
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build
echo "Building application..."
npm run build

# Run migrations if needed
echo "Checking for database migrations..."
# Add migration script here if needed

if [ "$ENV" = "production" ]; then
    echo "Deploying to production..."
    docker-compose -f docker-compose.prod.yml up -d
    echo "Production deployment complete!"
else
    echo "Deploying to development..."
    docker-compose up -d
    echo "Development deployment complete!"
fi

echo "Backend is running at http://localhost:5000"

#!/bin/bash

# BVS Setup Script
echo "Setting up Biological Verification System..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

# Create database directory
echo "Creating database directory..."
mkdir -p database

# Initialize database
echo "Initializing database..."
node src/seed/initDB.js

# Seed initial data
echo "Seeding initial data..."
node src/seed/seedData.js

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

echo "Setup completed successfully!"
echo "Run 'npm run dev' to start the development server"

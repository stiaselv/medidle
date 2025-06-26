#!/bin/bash
echo "Building backend server..."
cd server
npm ci
npm run build
echo "Backend build completed!" 
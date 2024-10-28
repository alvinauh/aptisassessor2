#!/bin/bash
# Deploy script for APTIS Practice App

# Initialize Cloudflare resources
echo "Initializing Cloudflare resources..."

# Create D1 database
npx wrangler d1 create aptis_db
npx wrangler d1 execute aptis_db --file=./schema.sql

# Create R2 bucket
npx wrangler r2 bucket create aptis-audio

# Create KV namespace
npx wrangler kv:namespace create CACHE

# Build the application
echo "Building application..."
npm run build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist
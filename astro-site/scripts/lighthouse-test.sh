#!/bin/bash

# Lighthouse Performance Test Script
# Runs Lighthouse audits on local server

echo "🔍 Starting Lighthouse Performance Tests..."
echo "=========================================="

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "❌ Lighthouse CLI not found. Installing..."
    npm install -g lighthouse
fi

# Start preview server in background
echo "🚀 Starting preview server..."
npm run preview &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Run Lighthouse tests
echo ""
echo "📊 Running Lighthouse audit on homepage..."
lighthouse http://localhost:4321 \
  --output=html \
  --output=json \
  --output-path=./lighthouse-reports/homepage \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless" \
  --quiet

echo ""
echo "📊 Running Lighthouse audit on gallery page..."
lighthouse http://localhost:4321/gallery \
  --output=html \
  --output=json \
  --output-path=./lighthouse-reports/gallery \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless" \
  --quiet

# Kill preview server
kill $SERVER_PID

echo ""
echo "✅ Lighthouse tests complete!"
echo "Reports saved to ./lighthouse-reports/"
echo ""
echo "📈 Summary:"
echo "  - Homepage: ./lighthouse-reports/homepage.report.html"
echo "  - Gallery:  ./lighthouse-reports/gallery.report.html"

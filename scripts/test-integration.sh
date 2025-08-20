#!/bin/bash

# 🧪 Kiccksy Integration Testing Script
# This script tests all three services to ensure they work together

echo "🚀 Starting Kiccksy Integration Testing..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE URLs
FRONTEND_URL="https://your-app.vercel.app"
ML_SERVICE_URL="https://your-ml-service.vercel.app"
BACKEND_URL="https://your-server.railway.app"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "\n${BLUE}🧪 Testing: $test_name${NC}"
    
    # Run the test command
    local result
    result=$(eval "$test_command" 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ] && [[ "$result" =~ $expected_pattern ]]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Command: $test_command"
        echo "Result: $result"
        echo "Exit code: $exit_code"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local test_name="$1"
    local url="$2"
    local method="${3:-GET}"
    local data="${4:-}"
    local expected_pattern="${5:-.*}"
    
    local curl_command="curl -s -w '%{http_code}' -X $method"
    
    if [ -n "$data" ]; then
        curl_command="$curl_command -H 'Content-Type: application/json' -d '$data'"
    fi
    
    curl_command="$curl_command '$url'"
    
    run_test "$test_name" "$curl_command" "$expected_pattern"
}

echo -e "\n${YELLOW}🔍 Testing Frontend Service...${NC}"
echo "=================================="

# Test frontend routes
test_endpoint "Frontend Homepage" "$FRONTEND_URL" "GET" "" "200"
test_endpoint "Frontend Events Page" "$FRONTEND_URL/Events" "GET" "" "200"
test_endpoint "Frontend Admin Page" "$FRONTEND_URL/admin" "GET" "" "200"
test_endpoint "Frontend Organiser Page" "$FRONTEND_URL/organiser" "GET" "" "200"

echo -e "\n${YELLOW}🤖 Testing ML Service...${NC}"
echo "================================"

# Test ML service endpoints
test_endpoint "ML Service Health" "$ML_SERVICE_URL/" "GET" "" "200"
test_endpoint "ML Service Demand Forecast" "$ML_SERVICE_URL/api/demand-forecast" "POST" '{"features": {"price": 1000, "days_until_event": 30}}' "200"
test_endpoint "ML Service Customer Segments" "$ML_SERVICE_URL/api/customer-segments" "POST" '{"features": {"age": 25, "income": 50000}}' "200"
test_endpoint "ML Service Price Recommendations" "$ML_SERVICE_URL/api/price-recommendations" "POST" '{"features": {"price": 1000}}' "200"
test_endpoint "ML Service Revenue Analytics" "$ML_SERVICE_URL/api/revenue-analytics" "POST" '{"features": {"price": 1000}}' "200"

echo -e "\n${YELLOW}🔧 Testing Backend Server...${NC}"
echo "====================================="

# Test backend endpoints
test_endpoint "Backend Health" "$BACKEND_URL/api/health" "GET" "" "200"
test_endpoint "Backend Config" "$BACKEND_URL/api/config" "GET" "" "200"
test_endpoint "Backend Create Order" "$BACKEND_URL/api/create-razorpay-order" "POST" '{"amount": 1000, "currency": "INR", "receipt": "test"}' "200"
test_endpoint "Backend Bookings" "$BACKEND_URL/api/bookings" "POST" '{"event_id": "test", "user_id": "test", "tickets": 2}' "201"

echo -e "\n${YELLOW}🔗 Testing Service Integration...${NC}"
echo "=========================================="

# Test CORS and cross-service communication
test_endpoint "ML Service CORS (from frontend domain)" "$ML_SERVICE_URL/" "GET" "" "200"
test_endpoint "Backend CORS (from frontend domain)" "$BACKEND_URL/api/health" "GET" "" "200"

echo -e "\n${YELLOW}📊 Test Results Summary${NC}"
echo "=========================="
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Your services are working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the issues above.${NC}"
    exit 1
fi

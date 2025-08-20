#!/bin/bash

# 🚀 Kiccksy Deployment Status Checker
# Quick script to verify all services are accessible

echo "🔍 Checking Kiccksy Deployment Status..."
echo "======================================="

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

# Function to check service status
check_service() {
    local service_name="$1"
    local url="$2"
    local endpoint="$3"
    
    echo -e "\n${BLUE}🔍 Checking $service_name...${NC}"
    
    # Check if service is accessible
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url$endpoint")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ $service_name is accessible (Status: $response)${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not accessible (Status: $response)${NC}"
        return 1
    fi
}

# Function to check environment variables
check_env_vars() {
    echo -e "\n${YELLOW}🔧 Environment Variables Check${NC}"
    echo "================================"
    
    # Check if URLs are configured
    if [[ "$FRONTEND_URL" == *"your-app"* ]]; then
        echo -e "${RED}❌ Frontend URL not configured${NC}"
    else
        echo -e "${GREEN}✅ Frontend URL configured${NC}"
    fi
    
    if [[ "$ML_SERVICE_URL" == *"your-ml-service"* ]]; then
        echo -e "${RED}❌ ML Service URL not configured${NC}"
    else
        echo -e "${GREEN}✅ ML Service URL configured${NC}"
    fi
    
    if [[ "$BACKEND_URL" == *"your-server"* ]]; then
        echo -e "${RED}❌ Backend URL not configured${NC}"
    else
        echo -e "${GREEN}✅ Backend URL configured${NC}"
    fi
}

# Check all services
echo -e "\n${YELLOW}🌐 Service Accessibility Check${NC}"
echo "=================================="

FRONTEND_OK=false
ML_SERVICE_OK=false
BACKEND_OK=false

# Check Frontend
if check_service "Frontend" "$FRONTEND_URL" ""; then
    FRONTEND_OK=true
fi

# Check ML Service
if check_service "ML Service" "$ML_SERVICE_URL" ""; then
    ML_SERVICE_OK=true
fi

# Check Backend Server
if check_service "Backend Server" "$BACKEND_URL" "/api/health"; then
    BACKEND_OK=true
fi

# Check environment variables
check_env_vars

# Summary
echo -e "\n${YELLOW}📊 Deployment Status Summary${NC}"
echo "=================================="

if [ "$FRONTEND_OK" = true ] && [ "$ML_SERVICE_OK" = true ] && [ "$BACKEND_OK" = true ]; then
    echo -e "${GREEN}🎉 All services are deployed and accessible!${NC}"
    echo -e "${GREEN}✅ Frontend: $FRONTEND_URL${NC}"
    echo -e "${GREEN}✅ ML Service: $ML_SERVICE_URL${NC}"
    echo -e "${GREEN}✅ Backend: $BACKEND_URL${NC}"
    echo -e "\n${BLUE}Next steps:${NC}"
    echo "1. Test individual features in each service"
    echo "2. Verify environment variables are set correctly"
    echo "3. Run integration tests"
    echo "4. Test complete user journey"
else
    echo -e "${RED}❌ Some services are not accessible${NC}"
    echo -e "\n${YELLOW}Troubleshooting:${NC}"
    
    if [ "$FRONTEND_OK" = false ]; then
        echo "- Check Frontend deployment in Vercel dashboard"
        echo "- Verify build success and deployment status"
    fi
    
    if [ "$ML_SERVICE_OK" = false ]; then
        echo "- Check ML Service deployment in Vercel dashboard"
        echo "- Verify Python app deployment and models loading"
    fi
    
    if [ "$BACKEND_OK" = false ]; then
        echo "- Check Backend deployment in Railway dashboard"
        echo "- Verify Node.js app deployment and environment variables"
    fi
    
    echo -e "\n${BLUE}Common issues:${NC}"
    echo "- Environment variables not set correctly"
    echo "- CORS configuration issues"
    echo "- Build failures during deployment"
    echo "- Service not started or crashed"
fi

echo -e "\n${BLUE}For detailed testing, run:${NC}"
echo "bash scripts/test-integration.sh"
echo -e "\n${BLUE}For verification checklist, see:${NC}"
echo "DEPLOYMENT_VERIFICATION.md"

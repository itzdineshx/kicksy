# 🚀 ML Service Deployment Guide

This guide explains how to deploy your Kiccksy ML service to various platforms.

## 📋 **Deployment Options**

### 1. **Vercel (Recommended for ML Service)**
- ✅ Serverless functions
- ✅ Automatic scaling
- ✅ Easy integration with frontend
- ✅ Free tier available

### 2. **Railway**
- ✅ Great for Python services
- ✅ Easy deployment
- ✅ Good for ML workloads
- ✅ Reasonable pricing

### 3. **Render**
- ✅ Python support
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Good for ML services

## 🎯 **Vercel Deployment (Recommended)**

### **Step 1: Prepare ML Service**
```bash
cd ml_service
# Ensure vercel.json is present
# Ensure requirements.txt is updated
```

### **Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Create new project
3. Import your Git repository
4. **Important**: Set root directory to `ml_service`
5. Framework preset: Other
6. Build command: Leave empty
7. Output directory: Leave empty

### **Step 3: Configure Environment Variables**
In Vercel dashboard, add:
```bash
MODEL_DIR=./models
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
```

### **Step 4: Deploy**
- Click "Deploy"
- Wait for build completion
- Note your ML service URL

## 🔧 **Railway Deployment**

### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

### **Step 2: Deploy**
```bash
cd ml_service
railway login
railway init
railway up
```

### **Step 3: Get URL**
```bash
railway status
# Note the URL for your frontend configuration
```

## 🌐 **Render Deployment**

### **Step 1: Connect Repository**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Select the `ml_service` directory

### **Step 2: Configure Service**
- **Name**: kiccksy-ml-service
- **Environment**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`

### **Step 3: Deploy**
- Click "Create Web Service"
- Wait for deployment
- Note your service URL

## 🔗 **Update Frontend Configuration**

After deploying your ML service, update your frontend environment:

```bash
# In your Vercel frontend dashboard
VITE_ML_SERVICE_URL=https://your-ml-service.vercel.app
# or
VITE_ML_SERVICE_URL=https://your-ml-service.railway.app
# or
VITE_ML_SERVICE_URL=https://your-ml-service.onrender.com
```

## 🚨 **Important Notes**

### **Model Files**
- Ensure your ML models are in the `models/` directory
- Models should be committed to Git (if small) or stored externally
- For large models, consider using cloud storage

### **CORS Configuration**
- The ML service is configured to accept requests from any origin
- For production, restrict to your frontend domain

### **Environment Variables**
- `MODEL_DIR`: Path to your ML models
- `CLIENT_ORIGIN`: Your frontend domain for CORS

## 📊 **Testing Your ML Service**

### **Health Check**
```bash
curl https://your-ml-service.vercel.app/
```

### **Test API Endpoints**
```bash
# Demand forecast
curl -X POST https://your-ml-service.vercel.app/api/demand-forecast \
  -H "Content-Type: application/json" \
  -d '{"features": {"price": 1000, "days_until_event": 30}}'

# Customer segments
curl -X POST https://your-ml-service.vercel.app/api/customer-segments \
  -H "Content-Type: application/json" \
  -d '{"features": {"age": 25, "income": 50000}}'
```

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Models Not Loading**
   - Check `MODEL_DIR` environment variable
   - Ensure models are in the correct location
   - Check file permissions

2. **CORS Errors**
   - Verify `CLIENT_ORIGIN` is set correctly
   - Check frontend domain matches

3. **Memory Issues**
   - ML models can be memory-intensive
   - Consider using smaller models for Vercel
   - Use Railway/Render for larger models

### **Performance Optimization**

1. **Model Loading**
   - Models are loaded once on startup
   - Consider lazy loading for large models

2. **Caching**
   - Implement response caching for repeated requests
   - Use Redis or similar for production

## 🎉 **Success!**

Once deployed:
1. ✅ Your ML service is accessible via HTTPS
2. ✅ Frontend can make API calls to ML service
3. ✅ All ML endpoints are working
4. ✅ CORS is properly configured

**Next**: Update your frontend environment variables and test the integration!

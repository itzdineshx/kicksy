# 🚀 Server Deployment Guide

This guide explains how to deploy your Kiccksy Node.js server to various platforms.

## 📋 **Deployment Options**

### 1. **Railway (Recommended)**
- ✅ Great for Node.js services
- ✅ Easy deployment
- ✅ Good for backend APIs
- ✅ Reasonable pricing

### 2. **Render**
- ✅ Node.js support
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Good for backend services

### 3. **Heroku**
- ✅ Excellent Node.js support
- ✅ Easy deployment
- ✅ Good ecosystem
- ✅ Free tier available

## 🎯 **Railway Deployment (Recommended)**

### **Step 1: Install Railway CLI**
```bash
npm install -g @railway/cli
```

### **Step 2: Deploy**
```bash
cd server
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
3. Select the `server` directory

### **Step 2: Configure Service**
- **Name**: kiccksy-server
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### **Step 3: Deploy**
- Click "Create Web Service"
- Wait for deployment
- Note your service URL

## 🚀 **Heroku Deployment**

### **Step 1: Install Heroku CLI**
```bash
# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# macOS
brew tap heroku/brew && brew install heroku
```

### **Step 2: Deploy**
```bash
cd server
heroku create your-app-name
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### **Step 3: Get URL**
```bash
heroku info
# Note the URL for your frontend configuration
```

## 🔧 **Server Configuration**

### **Environment Variables**
Set these in your deployment platform:

```bash
# Database
DATABASE_URL=your_database_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
JWT_SECRET=your_jwt_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# CORS
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
```

### **CORS Configuration**
Ensure your server allows requests from your frontend domain:

```javascript
// In your server code
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "https://your-app.vercel.app",
  credentials: true
}));
```

## 🔗 **Update Frontend Configuration**

After deploying your server, update your frontend environment:

```bash
# In your Vercel frontend dashboard
VITE_API_URL=https://your-server.railway.app
# or
VITE_API_URL=https://your-server.onrender.com
# or
VITE_API_URL=https://your-server.herokuapp.com
```

## 📊 **Testing Your Server**

### **Health Check**
```bash
curl https://your-server.railway.app/health
```

### **Test API Endpoints**
```bash
# Test a protected endpoint
curl -X GET https://your-server.railway.app/api/events \
  -H "Authorization: Bearer your_jwt_token"
```

## 🚨 **Important Notes**

### **Database Connection**
- Ensure your database is accessible from your deployment platform
- Use connection pooling for production
- Set up proper database backups

### **Environment Variables**
- Never commit sensitive data to Git
- Use your deployment platform's environment variable system
- Test with production values

### **CORS Configuration**
- Restrict origins to your frontend domain
- Handle preflight requests properly
- Test CORS with your frontend

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   - Check database URL format
   - Verify database is accessible
   - Check firewall settings

2. **CORS Errors**
   - Verify `CLIENT_ORIGIN` is set correctly
   - Check frontend domain matches
   - Test preflight requests

3. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values
   - Restart service after changes

### **Performance Optimization**

1. **Database Queries**
   - Use connection pooling
   - Implement query caching
   - Optimize database indexes

2. **API Response**
   - Implement response caching
   - Use compression middleware
   - Optimize JSON responses

## 📈 **Monitoring & Scaling**

### **Health Checks**
- Implement `/health` endpoint
- Monitor response times
- Set up uptime monitoring

### **Logging**
- Use structured logging
- Monitor error rates
- Set up log aggregation

### **Scaling**
- Monitor resource usage
- Set up auto-scaling rules
- Use load balancing if needed

## 🎉 **Success!**

Once deployed:
1. ✅ Your server is accessible via HTTPS
2. ✅ Frontend can make API calls to server
3. ✅ All API endpoints are working
4. ✅ CORS is properly configured
5. ✅ Database connections are working

**Next**: Update your frontend environment variables and test the integration!

## 🔄 **Continuous Deployment**

### **Automatic Deploys**
- Connect your GitHub repository
- Enable automatic deployments
- Set up deployment notifications

### **Environment Management**
- Use different environments for staging/production
- Test changes in staging first
- Implement blue-green deployments

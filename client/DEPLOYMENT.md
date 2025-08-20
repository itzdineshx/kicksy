# Vercel Deployment Guide

This guide will walk you through deploying your Kiccksy application to Vercel.

## 🚀 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab Repository**: Your code should be in a Git repository
3. **Environment Variables**: All required environment variables should be ready

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are documented in `env.example`
- [ ] `.gitignore` is properly configured
- [ ] `vercel.json` is present and configured
- [ ] `package.json` has correct build scripts
- [ ] No sensitive data in the codebase

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your repository is clean and ready:

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Push to remote
git push origin main
```

### 2. Connect to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Git Repository**
   - Choose "Import Git Repository"
   - Select your Kiccksy repository
   - Click "Import"

### 3. Configure Project Settings

1. **Project Name**: Choose a name for your project (e.g., "kiccksy-app")
2. **Framework Preset**: Select "Vite"
3. **Root Directory**: Set to `client` (since your app is in the client folder)
4. **Build Command**: Should auto-detect as `npm run build`
5. **Output Directory**: Should auto-detect as `dist`

### 4. Set Environment Variables

In the Vercel project settings, add these environment variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Razorpay Payment
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# ML Service URL (Production)
VITE_ML_SERVICE_URL=https://your-ml-service-domain.com
```

**Important**: Make sure to use production URLs for all services.

### 5. Deploy

1. **Click "Deploy"**
2. **Wait for Build**: Vercel will build your project
3. **Check Build Logs**: Monitor for any errors

### 6. Post-Deployment

1. **Verify Deployment**: Check your live URL
2. **Test Functionality**: Ensure all features work
3. **Set Custom Domain** (Optional): Configure your custom domain

## 🔍 Troubleshooting

### Common Build Errors

1. **Environment Variables Missing**
   ```
   Error: Add your Clerk Publishable Key to the .env file
   ```
   **Solution**: Add all required environment variables in Vercel dashboard

2. **Build Command Failed**
   ```
   Error: Command "npm run build" exited with code 1
   ```
   **Solution**: Check build logs for specific errors, ensure all dependencies are in `package.json`

3. **Module Not Found**
   ```
   Error: Cannot find module 'react'
   ```
   **Solution**: Ensure `node_modules` is not in `.gitignore`, Vercel will install dependencies

### Performance Issues

1. **Large Bundle Size**
   - Check Vite build output
   - Verify code splitting is working
   - Use bundle analyzer if needed

2. **Slow Loading**
   - Enable asset caching in `vercel.json`
   - Optimize images and assets
   - Use CDN for static assets

## 📱 Environment-Specific Configurations

### Development vs Production

- **Development**: Uses local ML service (`http://localhost:5000`)
- **Production**: Uses deployed ML service (`https://your-ml-service.vercel.app`)

### CORS Configuration

Ensure your ML service allows requests from your Vercel domain:

```python
# In your ML service
CORS_ORIGINS = [
    "https://your-app.vercel.app",
    "https://your-custom-domain.com"
]
```

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to your main branch. To disable:

1. Go to Project Settings
2. Git section
3. Disable "Auto Deploy"

## 📊 Monitoring

1. **Analytics**: Enable Vercel Analytics in project settings
2. **Performance**: Monitor Core Web Vitals
3. **Errors**: Check Function Logs for any runtime errors

## 🚨 Security Considerations

1. **Environment Variables**: Never expose sensitive keys in client-side code
2. **API Keys**: Use environment variables for all external service keys
3. **CORS**: Properly configure CORS in your ML service
4. **HTTPS**: Vercel provides automatic HTTPS

## 📞 Support

If you encounter issues:

1. Check Vercel documentation
2. Review build logs for specific errors
3. Check environment variable configuration
4. Verify all dependencies are properly installed

## 🎉 Success!

Once deployed, your app will be available at:
- **Vercel URL**: `https://your-project.vercel.app`
- **Custom Domain** (if configured): `https://yourdomain.com`

Remember to update your ML service CORS settings to allow requests from your new Vercel domain!

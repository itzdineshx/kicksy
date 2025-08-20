# Kiccksy - Sports Ticket Booking Platform

A modern sports ticket booking platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Event Management**: Browse and book tickets for various sports events
- **Venue Information**: Detailed venue layouts and information
- **Smart Pricing**: AI-powered dynamic pricing recommendations
- **User Authentication**: Secure login and registration with Clerk
- **Payment Integration**: Razorpay payment gateway integration
- **Admin Dashboard**: Advanced analytics and pricing management
- **Organiser Portal**: Event creation and management tools

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase
- **Payments**: Razorpay
- **AI/ML**: Custom ML service for pricing optimization
- **Deployment**: Vercel

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API clients and utilities
│   ├── data/               # Static data and assets
│   └── utils/              # Utility functions
├── public/                 # Static assets
├── vercel.json            # Vercel deployment configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kiccksy/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `VITE_ML_SERVICE_URL`: Your ML service URL

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
   - Push your code to GitHub/GitLab
   - Connect your repository in Vercel dashboard

2. **Set environment variables in Vercel**
   - Go to your project settings in Vercel
   - Add all the environment variables from your `.env` file

3. **Deploy**
   - Vercel will automatically build and deploy your app
   - The build command is: `npm run build`
   - Output directory is: `dist`

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

```bash
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
VITE_RAZORPAY_KEY_ID=your_production_razorpay_key
VITE_ML_SERVICE_URL=your_production_ml_service_url
```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run type checking

## 🔧 Configuration

### Vite Configuration
The project uses Vite with React plugin and Tailwind CSS. The configuration is optimized for production builds with code splitting.

### Vercel Configuration
The `vercel.json` file includes:
- Build configuration
- SPA routing (all routes redirect to index.html)
- Asset caching headers
- Environment variable mapping

## 🚨 Important Notes

1. **ML Service**: Ensure your ML service is deployed and accessible from your production domain
2. **CORS**: Configure CORS settings in your ML service to allow requests from your Vercel domain
3. **Environment Variables**: Never commit sensitive environment variables to version control
4. **Build Optimization**: The build process includes code splitting for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

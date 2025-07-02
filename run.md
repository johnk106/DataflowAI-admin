# DataFlow Owner Console - Local Development Setup

## Quick Start Guide

Follow these steps to run the DataFlow Owner Console on your local machine.

### Prerequisites

1. **Node.js 20+** - Download from [nodejs.org](https://nodejs.org/)
2. **Git** - For cloning the repository

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repository-url>
cd dataflow-owner-console

# Install dependencies
npm install
```

### Step 2: Environment Setup (Optional)

The app works out of the box in development mode, but you can customize settings:

```bash
# Create a .env file (optional)
cp env.txt .env

# Edit the .env file if needed
# For local development, defaults work fine
```

### Step 3: Start the Development Server

```bash
# Start the development server
npm run dev
```

This command will:
- Start the Express backend server on port 5000
- Start the Vite frontend development server
- Enable hot module replacement for instant updates

### Step 4: Access the Application

1. Open your browser and go to: **http://localhost:5000**
2. You'll see the login page

### Step 5: Login

The app uses simple authentication in development mode. Use these demo accounts:

**Owner Account:**
- Email: `owner@dataflow.local`
- Password: `password123`

**Admin Account:**
- Email: `admin@dataflow.local`
- Password: `admin123`

**Support Account:**
- Email: `support@dataflow.local`  
- Password: `support123`

### Step 6: Explore the Dashboard

After logging in, you'll have access to:
- **Dashboard** - System overview and metrics
- **Tenants** - Manage customer organizations
- **Pipelines** - Data pipeline management
- **Analytics** - System performance metrics
- **Billing** - Plans and invoices
- **Configuration** - System settings

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations (if using PostgreSQL)
npm run db:push
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, the server will fail to start. Kill the process using that port:

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### Dependencies Issues
If you encounter dependency problems:

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser Cache Issues
If changes aren't appearing:
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Open browser developer tools and disable cache

## Architecture Overview

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript  
- **Database**: In-memory storage (development) / PostgreSQL (production)
- **Authentication**: Simple session-based (development) / Replit OIDC (production)
- **UI**: shadcn/ui components + Tailwind CSS

## Need Help?

- Check the browser console for frontend errors
- Check the terminal for backend errors
- All API calls are logged in the terminal
- The app automatically restarts when you make changes

## Production Deployment

For production deployment on Replit:
1. Set up the required environment variables from `env.txt`
2. Configure PostgreSQL database
3. Set up Replit OIDC authentication
4. Use `npm run build` and `npm start` for production mode
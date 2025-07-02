import type { Express, RequestHandler } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";

const MemoryStoreSession = MemoryStore(session);

// Simple authentication middleware
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (req.session?.user) {
    // User is authenticated via session
    req.user = req.session.user;
    next();
  } else {
    // Not authenticated
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// Authentication setup
export function setupAuth(app: Express) {
  // Setup session middleware
  app.use(session({
    store: new MemoryStoreSession({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));
  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Simple demo authentication - in production, use proper password hashing
    const validUsers = [
      { email: "owner@dataflow.local", password: "password123", role: "owner" },
      { email: "admin@dataflow.local", password: "admin123", role: "admin" },
      { email: "support@dataflow.local", password: "support123", role: "support" }
    ];
    
    const validUser = validUsers.find(u => u.email === email && u.password === password);
    
    if (validUser) {
      // Create or get user from storage
      let user = await storage.getUser(`${validUser.role}-1`);
      
      if (!user) {
        user = await storage.upsertUser({
          id: `${validUser.role}-1`,
          email: validUser.email,
          firstName: validUser.role === 'owner' ? 'Owner' : validUser.role === 'admin' ? 'Admin' : 'Support',
          lastName: 'User',
          profileImageUrl: null,
          role: validUser.role,
          status: 'active'
        });
      }
      
      req.session.user = user;
      res.json({ success: true, user });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if (req.session?.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  // Logout endpoint
  app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  });

  // Forgot password endpoint (mock implementation)
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    
    // In a real app, you would send an actual email
    console.log(`Password reset requested for: ${email}`);
    
    // Simulate success for demo purposes
    res.json({ success: true, message: 'Password reset email sent' });
  });
}
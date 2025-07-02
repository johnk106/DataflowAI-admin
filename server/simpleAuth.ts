import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Simple authentication middleware for local development
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For local development, we'll create a default user if none exists
  let user = await storage.getUser("owner-1");
  
  if (!user) {
    // Create default owner user for local development
    user = await storage.upsertUser({
      id: "owner-1",
      email: "owner@dataflow.local",
      firstName: "Owner",
      lastName: "User",
      profileImageUrl: null,
      role: "owner",
      status: "active"
    });
  }

  // Attach user to request
  (req as any).user = user;
  next();
};

// Simple endpoint to get current user
export function setupAuth(app: Express) {
  // Get current user endpoint
  app.get("/api/user", isAuthenticated, (req, res) => {
    res.json((req as any).user);
  });

  // Simple logout (for consistency with frontend)
  app.get("/api/logout", (req, res) => {
    res.redirect("/");
  });

  // Simple login (for consistency with frontend)
  app.get("/api/login", (req, res) => {
    res.redirect("/");
  });
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTenantSchema, insertPipelineSchema, insertAuditLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Tenants management
  app.get("/api/tenants", isAuthenticated, async (req, res) => {
    try {
      const tenants = await storage.getAllTenants();
      res.json(tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });

  app.get("/api/tenants/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tenant = await storage.getTenant(id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      console.error("Error fetching tenant:", error);
      res.status(500).json({ message: "Failed to fetch tenant" });
    }
  });

  app.post("/api/tenants", isAuthenticated, async (req, res) => {
    try {
      const tenantData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(tenantData);
      
      // Log the action
      await storage.createAuditLog({
        actor: req.user.claims.email,
        action: "Tenant Created",
        details: `Created tenant "${tenant.name}"`,
        ipAddress: req.ip,
      });
      
      res.status(201).json(tenant);
    } catch (error) {
      console.error("Error creating tenant:", error);
      res.status(500).json({ message: "Failed to create tenant" });
    }
  });

  app.patch("/api/tenants/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const tenant = await storage.updateTenant(id, updates);
      
      // Log the action
      await storage.createAuditLog({
        actor: req.user.claims.email,
        action: "Tenant Updated",
        details: `Updated tenant "${tenant.name}" - ${JSON.stringify(updates)}`,
        ipAddress: req.ip,
      });
      
      res.json(tenant);
    } catch (error) {
      console.error("Error updating tenant:", error);
      res.status(500).json({ message: "Failed to update tenant" });
    }
  });

  app.delete("/api/tenants/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tenant = await storage.getTenant(id);
      await storage.deleteTenant(id);
      
      // Log the action
      await storage.createAuditLog({
        actor: req.user.claims.email,
        action: "Tenant Deleted",
        details: `Deleted tenant "${tenant?.name}"`,
        ipAddress: req.ip,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tenant:", error);
      res.status(500).json({ message: "Failed to delete tenant" });
    }
  });

  // Pipelines management
  app.get("/api/pipelines", isAuthenticated, async (req, res) => {
    try {
      const pipelines = await storage.getAllPipelines();
      res.json(pipelines);
    } catch (error) {
      console.error("Error fetching pipelines:", error);
      res.status(500).json({ message: "Failed to fetch pipelines" });
    }
  });

  app.get("/api/pipelines/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pipeline = await storage.getPipeline(id);
      if (!pipeline) {
        return res.status(404).json({ message: "Pipeline not found" });
      }
      res.json(pipeline);
    } catch (error) {
      console.error("Error fetching pipeline:", error);
      res.status(500).json({ message: "Failed to fetch pipeline" });
    }
  });

  app.get("/api/tenants/:tenantId/pipelines", isAuthenticated, async (req, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const pipelines = await storage.getPipelinesByTenant(tenantId);
      res.json(pipelines);
    } catch (error) {
      console.error("Error fetching tenant pipelines:", error);
      res.status(500).json({ message: "Failed to fetch tenant pipelines" });
    }
  });

  app.post("/api/pipelines", isAuthenticated, async (req, res) => {
    try {
      const pipelineData = insertPipelineSchema.parse(req.body);
      const pipeline = await storage.createPipeline(pipelineData);
      
      // Log the action
      await storage.createAuditLog({
        actor: req.user.claims.email,
        action: "Pipeline Created",
        details: `Created pipeline "${pipeline.name}"`,
        ipAddress: req.ip,
      });
      
      res.status(201).json(pipeline);
    } catch (error) {
      console.error("Error creating pipeline:", error);
      res.status(500).json({ message: "Failed to create pipeline" });
    }
  });

  app.patch("/api/pipelines/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const pipeline = await storage.updatePipeline(id, updates);
      
      // Log the action
      await storage.createAuditLog({
        actor: req.user.claims.email,
        action: "Pipeline Updated",
        details: `Updated pipeline "${pipeline.name}" - ${JSON.stringify(updates)}`,
        ipAddress: req.ip,
      });
      
      res.json(pipeline);
    } catch (error) {
      console.error("Error updating pipeline:", error);
      res.status(500).json({ message: "Failed to update pipeline" });
    }
  });

  app.delete("/api/pipelines/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pipeline = await storage.getPipeline(id);
      await storage.deletePipeline(id);
      
      // Log the action
      await storage.createAuditLog({
        actor: req.user.claims.email,
        action: "Pipeline Deleted",
        details: `Deleted pipeline "${pipeline?.name}"`,
        ipAddress: req.ip,
      });
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting pipeline:", error);
      res.status(500).json({ message: "Failed to delete pipeline" });
    }
  });

  // System analytics
  app.get("/api/analytics/metrics", isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getLatestSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching system metrics:", error);
      res.status(500).json({ message: "Failed to fetch system metrics" });
    }
  });

  // Security & audit
  app.get("/api/users", isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAdminUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { role, status } = req.body;
      const user = await storage.updateUserRole(id, role, status);
      
      // Log the action
      await storage.createAuditLog({
        actor: req.user.claims.email,
        action: "User Role Updated",
        details: `Updated user ${user.email} role to ${role}, status to ${status}`,
        ipAddress: req.ip,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.get("/api/audit-logs", isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const logs = await storage.getAuditLogs(limit, offset);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/audit-logs/export", isAuthenticated, async (req, res) => {
    try {
      const logs = await storage.getAuditLogs(1000); // Get more logs for export
      
      // Convert to CSV
      const headers = ["Timestamp", "Actor", "Action", "Details", "IP Address"];
      const csvContent = [
        headers.join(","),
        ...logs.map(log => [
          log.timestamp?.toISOString() || "",
          log.actor,
          log.action,
          `"${log.details?.replace(/"/g, '""') || ""}"`,
          log.ipAddress || "",
        ].join(","))
      ].join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=audit-logs.csv");
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting audit logs:", error);
      res.status(500).json({ message: "Failed to export audit logs" });
    }
  });

  // Billing & plans
  app.get("/api/invoices", isAuthenticated, async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/plans", isAuthenticated, async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

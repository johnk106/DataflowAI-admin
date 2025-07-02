import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User storage table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("support"), // owner, admin, support
  status: text("status").notNull().default("active"), // active, disabled
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Tenants table
export const tenants = sqliteTable("tenants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  tenantId: text("tenant_id").notNull().unique(),
  email: text("email").notNull(),
  plan: text("plan").notNull(), // starter, professional, enterprise
  status: text("status").notNull().default("active"), // active, suspended, trial
  signupDate: integer("signup_date", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  nextBillingDate: integer("next_billing_date", { mode: 'timestamp' }),
  monthlyUsage: real("monthly_usage").default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Pipelines table
export const pipelines = sqliteTable("pipelines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pipelineId: text("pipeline_id").notNull().unique(),
  name: text("name").notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  owner: text("owner").notNull(),
  status: text("status").notNull(), // running, paused, failed, completed
  lastRunStatus: text("last_run_status"), // success, failed, pending
  nextScheduledRun: integer("next_scheduled_run", { mode: 'timestamp' }),
  definition: text("definition"), // JSON string
  version: integer("version").default(1),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// System metrics table
export const systemMetrics = sqliteTable("system_metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  service: text("service").notNull(), // orchestrator, nifi, beam, airflow
  cpuUsage: real("cpu_usage"),
  memoryUsage: real("memory_usage"),
  errorRate: real("error_rate"),
  status: text("status").notNull(), // healthy, warning, critical
  timestamp: integer("timestamp", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Audit logs table
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  timestamp: integer("timestamp", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Invoices table
export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: text("invoice_id").notNull().unique(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  amount: real("amount").notNull(),
  status: text("status").notNull(), // paid, pending, overdue
  dueDate: integer("due_date", { mode: 'timestamp' }).notNull(),
  paidDate: integer("paid_date", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Plans table
export const plans = sqliteTable("plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  price: real("price").notNull(),
  pipelineLimit: integer("pipeline_limit"),
  storageLimit: text("storage_limit"),
  features: text("features"), // JSON string
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPipelineSchema = createInsertSchema(pipelines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;
export type InsertPipeline = z.infer<typeof insertPipelineSchema>;
export type Pipeline = typeof pipelines.$inferSelect;
export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

// Dashboard metrics type
export type DashboardMetrics = {
  totalTenants: number;
  totalPipelines: number;
  activePipelines: number;
  failedRuns: number;
  monthlyVolume: string;
  pipelineRunsData: Array<{ date: string; runs: number }>;
  tenantSignupsData: Array<{ month: string; signups: number }>;
  alerts: Array<{
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
  }>;
};
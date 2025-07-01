import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("support"), // owner, admin, support
  status: varchar("status").notNull().default("active"), // active, disabled
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tenants table
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  tenantId: varchar("tenant_id").notNull().unique(),
  email: varchar("email").notNull(),
  plan: varchar("plan").notNull(), // starter, professional, enterprise
  status: varchar("status").notNull().default("active"), // active, suspended, trial
  signupDate: timestamp("signup_date").defaultNow(),
  nextBillingDate: timestamp("next_billing_date"),
  monthlyUsage: decimal("monthly_usage", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pipelines table
export const pipelines = pgTable("pipelines", {
  id: serial("id").primaryKey(),
  pipelineId: varchar("pipeline_id").notNull().unique(),
  name: varchar("name").notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  owner: varchar("owner").notNull(),
  status: varchar("status").notNull(), // running, paused, failed, completed
  lastRunStatus: varchar("last_run_status"), // success, failed, pending
  nextScheduledRun: timestamp("next_scheduled_run"),
  definition: jsonb("definition"),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System metrics table
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  service: varchar("service").notNull(), // orchestrator, nifi, beam, airflow
  cpuUsage: decimal("cpu_usage", { precision: 5, scale: 2 }),
  memoryUsage: decimal("memory_usage", { precision: 5, scale: 2 }),
  errorRate: decimal("error_rate", { precision: 5, scale: 2 }),
  status: varchar("status").notNull(), // healthy, warning, critical
  timestamp: timestamp("timestamp").defaultNow(),
});

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  actor: varchar("actor").notNull(),
  action: varchar("action").notNull(),
  details: text("details"),
  ipAddress: varchar("ip_address"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceId: varchar("invoice_id").notNull().unique(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull(), // paid, pending, overdue
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Plans table
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  pipelineLimit: integer("pipeline_limit"),
  storageLimit: varchar("storage_limit"),
  features: jsonb("features"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
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

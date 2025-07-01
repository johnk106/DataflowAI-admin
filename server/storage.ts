import {
  users,
  tenants,
  pipelines,
  systemMetrics,
  auditLogs,
  invoices,
  plans,
  type User,
  type UpsertUser,
  type Tenant,
  type InsertTenant,
  type Pipeline,
  type InsertPipeline,
  type SystemMetric,
  type AuditLog,
  type InsertAuditLog,
  type Invoice,
  type InsertInvoice,
  type Plan,
  type InsertPlan,
  type DashboardMetrics,
} from "@shared/schema";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tenant operations
  getAllTenants(): Promise<Tenant[]>;
  getTenant(id: number): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, updates: Partial<Tenant>): Promise<Tenant>;
  deleteTenant(id: number): Promise<void>;
  
  // Pipeline operations
  getAllPipelines(): Promise<Pipeline[]>;
  getPipeline(id: number): Promise<Pipeline | undefined>;
  getPipelinesByTenant(tenantId: number): Promise<Pipeline[]>;
  createPipeline(pipeline: InsertPipeline): Promise<Pipeline>;
  updatePipeline(id: number, updates: Partial<Pipeline>): Promise<Pipeline>;
  deletePipeline(id: number): Promise<void>;
  
  // System metrics
  getSystemMetrics(): Promise<SystemMetric[]>;
  getLatestSystemMetrics(): Promise<SystemMetric[]>;
  
  // Audit logs
  getAuditLogs(limit?: number, offset?: number): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  
  // Invoices
  getAllInvoices(): Promise<Invoice[]>;
  getInvoicesByTenant(tenantId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  
  // Plans
  getAllPlans(): Promise<Plan[]>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, updates: Partial<Plan>): Promise<Plan>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<DashboardMetrics>;
  
  // Admin users
  getAdminUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string, status: string): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tenants: Map<number, Tenant> = new Map();
  private pipelines: Map<number, Pipeline> = new Map();
  private systemMetrics: SystemMetric[] = [];
  private auditLogs: AuditLog[] = [];
  private invoices: Map<number, Invoice> = new Map();
  private plans: Map<number, Plan> = new Map();
  
  private currentTenantId = 1;
  private currentPipelineId = 1;
  private currentInvoiceId = 1;
  private currentPlanId = 1;
  private currentAuditId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize some sample data for development
    const sampleTenants: Tenant[] = [
      {
        id: 1,
        name: "Acme Corporation",
        tenantId: "tenant_001",
        email: "admin@acme.com",
        plan: "enterprise",
        status: "active",
        signupDate: new Date("2024-01-15"),
        nextBillingDate: new Date("2024-04-15"),
        monthlyUsage: "847.50",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: 2,
        name: "Global Tech Inc",
        tenantId: "tenant_002",
        email: "admin@globaltech.com",
        plan: "professional",
        status: "active",
        signupDate: new Date("2024-02-03"),
        nextBillingDate: new Date("2024-05-03"),
        monthlyUsage: "245.20",
        createdAt: new Date("2024-02-03"),
        updatedAt: new Date("2024-02-03"),
      },
      {
        id: 3,
        name: "DataSync Solutions",
        tenantId: "tenant_003",
        email: "admin@datasync.io",
        plan: "starter",
        status: "trial",
        signupDate: new Date("2024-03-12"),
        nextBillingDate: new Date("2024-04-12"),
        monthlyUsage: "45.80",
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-12"),
      },
    ];

    sampleTenants.forEach(tenant => {
      this.tenants.set(tenant.id, tenant);
    });

    const samplePipelines: Pipeline[] = [
      {
        id: 1,
        pipelineId: "pipe_001_acme",
        name: "Data Ingestion Pipeline",
        tenantId: 1,
        owner: "john.doe@acme.com",
        status: "running",
        lastRunStatus: "success",
        nextScheduledRun: new Date(Date.now() + 2 * 60 * 60 * 1000),
        definition: { type: "ingestion", sources: ["s3", "api"] },
        version: 1,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
      {
        id: 2,
        pipelineId: "pipe_002_global",
        name: "ETL Processing",
        tenantId: 2,
        owner: "sarah.tech@globaltech.com",
        status: "failed",
        lastRunStatus: "failed",
        nextScheduledRun: null,
        definition: { type: "etl", transformations: ["normalize", "aggregate"] },
        version: 2,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
      },
      {
        id: 3,
        pipelineId: "pipe_003_datasync",
        name: "Analytics Workflow",
        tenantId: 3,
        owner: "mike.data@datasync.io",
        status: "paused",
        lastRunStatus: "success",
        nextScheduledRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
        definition: { type: "analytics", models: ["regression", "clustering"] },
        version: 1,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
    ];

    samplePipelines.forEach(pipeline => {
      this.pipelines.set(pipeline.id, pipeline);
    });

    const samplePlans: Plan[] = [
      {
        id: 1,
        name: "starter",
        price: "99.00",
        pipelineLimit: 10,
        storageLimit: "5GB",
        features: ["Email support", "Basic analytics"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "professional",
        price: "299.00",
        pipelineLimit: 50,
        storageLimit: "100GB",
        features: ["Priority support", "Custom connectors", "Advanced analytics"],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "enterprise",
        price: "999.00",
        pipelineLimit: null,
        storageLimit: "1TB",
        features: ["24/7 phone support", "Advanced features", "Custom development"],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    samplePlans.forEach(plan => {
      this.plans.set(plan.id, plan);
    });

    this.currentTenantId = 4;
    this.currentPipelineId = 4;
    this.currentPlanId = 4;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      ...userData,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Tenant operations
  async getAllTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async getTenant(id: number): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async createTenant(tenantData: InsertTenant): Promise<Tenant> {
    const id = this.currentTenantId++;
    const tenant: Tenant = {
      ...tenantData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async updateTenant(id: number, updates: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenants.get(id);
    if (!tenant) throw new Error("Tenant not found");
    
    const updated = { ...tenant, ...updates, updatedAt: new Date() };
    this.tenants.set(id, updated);
    return updated;
  }

  async deleteTenant(id: number): Promise<void> {
    this.tenants.delete(id);
  }

  // Pipeline operations
  async getAllPipelines(): Promise<Pipeline[]> {
    return Array.from(this.pipelines.values());
  }

  async getPipeline(id: number): Promise<Pipeline | undefined> {
    return this.pipelines.get(id);
  }

  async getPipelinesByTenant(tenantId: number): Promise<Pipeline[]> {
    return Array.from(this.pipelines.values()).filter(p => p.tenantId === tenantId);
  }

  async createPipeline(pipelineData: InsertPipeline): Promise<Pipeline> {
    const id = this.currentPipelineId++;
    const pipeline: Pipeline = {
      ...pipelineData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pipelines.set(id, pipeline);
    return pipeline;
  }

  async updatePipeline(id: number, updates: Partial<Pipeline>): Promise<Pipeline> {
    const pipeline = this.pipelines.get(id);
    if (!pipeline) throw new Error("Pipeline not found");
    
    const updated = { ...pipeline, ...updates, updatedAt: new Date() };
    this.pipelines.set(id, updated);
    return updated;
  }

  async deletePipeline(id: number): Promise<void> {
    this.pipelines.delete(id);
  }

  // System metrics
  async getSystemMetrics(): Promise<SystemMetric[]> {
    return this.systemMetrics;
  }

  async getLatestSystemMetrics(): Promise<SystemMetric[]> {
    const services = ["orchestrator", "nifi", "beam", "airflow"];
    return services.map(service => ({
      id: Math.floor(Math.random() * 1000),
      service,
      cpuUsage: service === "nifi" ? "78.00" : service === "airflow" ? "95.00" : service === "beam" ? "45.00" : "23.00",
      memoryUsage: service === "nifi" ? "76.00" : service === "airflow" ? "98.00" : service === "beam" ? "47.00" : "30.00",
      errorRate: service === "nifi" ? "15.00" : "2.30",
      status: service === "airflow" ? "critical" : service === "nifi" ? "warning" : "healthy",
      timestamp: new Date(),
    }));
  }

  // Audit logs
  async getAuditLogs(limit = 50, offset = 0): Promise<AuditLog[]> {
    const sampleLogs: AuditLog[] = [
      {
        id: 1,
        actor: "john.smith@company.com",
        action: "Pipeline Created",
        details: 'Created pipeline "Data Ingestion v2" for tenant Acme Corporation',
        ipAddress: "192.168.1.100",
        timestamp: new Date("2024-03-15T14:23:45Z"),
      },
      {
        id: 2,
        actor: "sarah.johnson@company.com",
        action: "Tenant Suspended",
        details: 'Suspended tenant "BadCompany Inc" due to payment failure',
        ipAddress: "10.0.0.50",
        timestamp: new Date("2024-03-15T14:20:12Z"),
      },
      {
        id: 3,
        actor: "mike.davis@company.com",
        action: "User Login",
        details: "Successful login to owner console",
        ipAddress: "203.0.113.45",
        timestamp: new Date("2024-03-15T14:15:33Z"),
      },
    ];
    
    return sampleLogs.slice(offset, offset + limit);
  }

  async createAuditLog(logData: InsertAuditLog): Promise<AuditLog> {
    const id = this.currentAuditId++;
    const log: AuditLog = {
      ...logData,
      id,
      timestamp: new Date(),
    };
    this.auditLogs.push(log);
    return log;
  }

  // Invoices
  async getAllInvoices(): Promise<Invoice[]> {
    const sampleInvoices: Invoice[] = [
      {
        id: 1,
        invoiceId: "INV-2024-001",
        tenantId: 1,
        amount: "999.00",
        status: "paid",
        dueDate: new Date("2024-03-15"),
        paidDate: new Date("2024-03-10"),
        createdAt: new Date("2024-02-15"),
      },
      {
        id: 2,
        invoiceId: "INV-2024-002",
        tenantId: 2,
        amount: "299.00",
        status: "pending",
        dueDate: new Date("2024-04-15"),
        paidDate: null,
        createdAt: new Date("2024-03-15"),
      },
    ];
    
    return sampleInvoices;
  }

  async getInvoicesByTenant(tenantId: number): Promise<Invoice[]> {
    const allInvoices = await this.getAllInvoices();
    return allInvoices.filter(invoice => invoice.tenantId === tenantId);
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const id = this.currentInvoiceId++;
    const invoice: Invoice = {
      ...invoiceData,
      id,
      createdAt: new Date(),
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  // Plans
  async getAllPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }

  async createPlan(planData: InsertPlan): Promise<Plan> {
    const id = this.currentPlanId++;
    const plan: Plan = {
      ...planData,
      id,
      createdAt: new Date(),
    };
    this.plans.set(id, plan);
    return plan;
  }

  async updatePlan(id: number, updates: Partial<Plan>): Promise<Plan> {
    const plan = this.plans.get(id);
    if (!plan) throw new Error("Plan not found");
    
    const updated = { ...plan, ...updates };
    this.plans.set(id, updated);
    return updated;
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const tenants = await this.getAllTenants();
    const pipelines = await this.getAllPipelines();
    
    return {
      totalTenants: tenants.length,
      totalPipelines: pipelines.length,
      activePipelines: pipelines.filter(p => p.status === "running").length,
      failedRuns: pipelines.filter(p => p.lastRunStatus === "failed").length,
      monthlyVolume: "847GB",
      pipelineRunsData: [
        { date: "2024-01-01", runs: 120 },
        { date: "2024-01-02", runs: 150 },
        { date: "2024-01-03", runs: 90 },
        { date: "2024-01-04", runs: 200 },
        { date: "2024-01-05", runs: 160 },
        { date: "2024-01-06", runs: 180 },
        { date: "2024-01-07", runs: 220 },
      ],
      tenantSignupsData: [
        { month: "Jan", signups: 15 },
        { month: "Feb", signups: 18 },
        { month: "Mar", signups: 22 },
        { month: "Apr", signups: 20 },
        { month: "May", signups: 28 },
        { month: "Jun", signups: 24 },
      ],
      alerts: [
        {
          id: "1",
          type: "error",
          title: "High Error Rate",
          message: "NiFi cluster experiencing 15% error rate",
          timestamp: "2 minutes ago",
        },
        {
          id: "2",
          type: "warning",
          title: "Storage Warning",
          message: "S3 bucket at 85% capacity",
          timestamp: "15 minutes ago",
        },
        {
          id: "3",
          type: "info",
          title: "Maintenance Scheduled",
          message: "Orchestrator update at 2:00 AM UTC",
          timestamp: "1 hour ago",
        },
      ],
    };
  }

  // Admin users
  async getAdminUsers(): Promise<User[]> {
    const sampleUsers: User[] = [
      {
        id: "1",
        email: "john.smith@company.com",
        firstName: "John",
        lastName: "Smith",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        role: "owner",
        status: "active",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        email: "sarah.johnson@company.com",
        firstName: "Sarah",
        lastName: "Johnson",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b69b2de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        role: "admin",
        status: "active",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "3",
        email: "mike.davis@company.com",
        firstName: "Mike",
        lastName: "Davis",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        role: "support",
        status: "disabled",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01"),
      },
    ];
    
    return sampleUsers;
  }

  async updateUserRole(id: string, role: string, status: string): Promise<User> {
    const users = await this.getAdminUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error("User not found");
    
    const updated = { ...user, role, status, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

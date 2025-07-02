import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus,
  Database,
  Cloud,
  Server,
  Wifi,
  WifiOff,
  Edit,
  Trash2,
  TestTube,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink
} from "lucide-react";

const connectionSchema = z.object({
  name: z.string().min(1, "Connection name is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Connection type is required"),
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1, "Port is required"),
  database: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  ssl: z.boolean().default(false),
  connectionString: z.string().optional(),
  apiKey: z.string().optional(),
  region: z.string().optional(),
  bucket: z.string().optional(),
});

type ConnectionForm = z.infer<typeof connectionSchema>;

interface Connection {
  id: number;
  name: string;
  description?: string;
  type: string;
  host: string;
  port: number;
  database?: string;
  username: string;
  ssl: boolean;
  status: 'connected' | 'disconnected' | 'testing';
  lastTested: string;
  createdAt: string;
  usageCount: number;
}

const connectionTypes = [
  { value: "postgresql", label: "PostgreSQL", icon: Database },
  { value: "mysql", label: "MySQL", icon: Database },
  { value: "mongodb", label: "MongoDB", icon: Database },
  { value: "redis", label: "Redis", icon: Server },
  { value: "elasticsearch", label: "Elasticsearch", icon: Database },
  { value: "snowflake", label: "Snowflake", icon: Cloud },
  { value: "bigquery", label: "BigQuery", icon: Cloud },
  { value: "s3", label: "Amazon S3", icon: Cloud },
  { value: "gcs", label: "Google Cloud Storage", icon: Cloud },
  { value: "azure_blob", label: "Azure Blob Storage", icon: Cloud },
  { value: "sftp", label: "SFTP", icon: Server },
  { value: "ftp", label: "FTP", icon: Server },
  { value: "api", label: "REST API", icon: ExternalLink },
  { value: "webhook", label: "Webhook", icon: ExternalLink },
];

function ConnectionForm({ connection, onClose }: { connection?: Connection; onClose: () => void }) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedType, setSelectedType] = useState(connection?.type || "");

  const form = useForm<ConnectionForm>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      name: connection?.name || "",
      description: connection?.description || "",
      type: connection?.type || "",
      host: connection?.host || "",
      port: connection?.port || 5432,
      database: connection?.database || "",
      username: connection?.username || "",
      password: "",
      ssl: connection?.ssl || false,
      connectionString: "",
      apiKey: "",
      region: "",
      bucket: "",
    },
  });

  const createConnectionMutation = useMutation({
    mutationFn: (data: ConnectionForm) => apiRequest("/api/connections", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      toast({ title: "Success", description: "Connection created successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create connection", variant: "destructive" });
    }
  });

  const updateConnectionMutation = useMutation({
    mutationFn: (data: ConnectionForm) => apiRequest(`/api/connections/${connection?.id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      toast({ title: "Success", description: "Connection updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update connection", variant: "destructive" });
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: (data: ConnectionForm) => apiRequest("/api/connections/test", "POST", data),
    onSuccess: () => {
      toast({ title: "Success", description: "Connection test successful" });
    },
    onError: () => {
      toast({ title: "Error", description: "Connection test failed", variant: "destructive" });
    }
  });

  const handleSubmit = (data: ConnectionForm) => {
    if (connection) {
      updateConnectionMutation.mutate(data);
    } else {
      createConnectionMutation.mutate(data);
    }
  };

  const handleTestConnection = () => {
    const formData = form.getValues();
    testConnectionMutation.mutate(formData);
  };

  const renderConnectionFields = () => {
    const type = selectedType || form.watch("type");
    
    switch (type) {
      case "s3":
      case "gcs":
      case "azure_blob":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  {...form.register("region")}
                  placeholder="us-west-2"
                />
              </div>
              <div>
                <Label htmlFor="bucket">Bucket/Container</Label>
                <Input
                  id="bucket"
                  {...form.register("bucket")}
                  placeholder="my-data-bucket"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="apiKey">Access Key/API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showPassword ? "text" : "password"}
                  {...form.register("apiKey")}
                  placeholder="Enter access key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        );
      
      case "api":
      case "webhook":
        return (
          <>
            <div>
              <Label htmlFor="host">API Endpoint</Label>
              <Input
                id="host"
                {...form.register("host")}
                placeholder="https://api.example.com"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showPassword ? "text" : "password"}
                  {...form.register("apiKey")}
                  placeholder="Enter API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  {...form.register("host")}
                  placeholder="localhost"
                />
                {form.formState.errors.host && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.host.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  {...form.register("port", { valueAsNumber: true })}
                  placeholder="5432"
                />
                {form.formState.errors.port && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.port.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="database">Database</Label>
              <Input
                id="database"
                {...form.register("database")}
                placeholder="mydatabase"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.username.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Connection Name</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="My Database Connection"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="type">Connection Type</Label>
          <Select 
            value={form.watch("type")} 
            onValueChange={(value) => {
              form.setValue("type", value);
              setSelectedType(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select connection type" />
            </SelectTrigger>
            <SelectContent>
              {connectionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Optional description of this connection"
          rows={2}
        />
      </div>

      {renderConnectionFields()}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleTestConnection}
          disabled={testConnectionMutation.isPending}
        >
          <TestTube className="w-4 h-4 mr-2" />
          {testConnectionMutation.isPending ? "Testing..." : "Test Connection"}
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createConnectionMutation.isPending || updateConnectionMutation.isPending}
          >
            {connection ? "Update" : "Create"} Connection
          </Button>
        </div>
      </div>
    </form>
  );
}

function ConnectionsTable({ connections }: { connections: Connection[] }) {
  const { toast } = useToast();
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const deleteConnectionMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/connections/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      toast({ title: "Success", description: "Connection deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete connection", variant: "destructive" });
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/connections/${id}/test`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      toast({ title: "Success", description: "Connection test successful" });
    },
    onError: () => {
      toast({ title: "Error", description: "Connection test failed", variant: "destructive" });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800">
            <Wifi className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <WifiOff className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
      case "testing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <TestTube className="w-3 h-3 mr-1" />
            Testing
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Unknown
          </Badge>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    const connectionType = connectionTypes.find(t => t.value === type);
    if (connectionType) {
      const Icon = connectionType.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <Database className="w-4 h-4" />;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Host/Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Last Tested</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.map((connection) => (
            <TableRow key={connection.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{connection.name}</div>
                  {connection.description && (
                    <div className="text-sm text-gray-500">{connection.description}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getTypeIcon(connection.type)}
                  <span className="capitalize">{connection.type.replace('_', ' ')}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {connection.host}
                {connection.port && `:${connection.port}`}
              </TableCell>
              <TableCell>{getStatusBadge(connection.status)}</TableCell>
              <TableCell>
                <span className="text-sm">{connection.usageCount} pipelines</span>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {new Date(connection.lastTested).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testConnectionMutation.mutate(connection.id)}
                    disabled={testConnectionMutation.isPending}
                  >
                    <TestTube className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedConnection(connection);
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteConnectionMutation.mutate(connection.id)}
                    disabled={deleteConnectionMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Connection</DialogTitle>
            <DialogDescription>
              Update connection settings and test connectivity
            </DialogDescription>
          </DialogHeader>
          {selectedConnection && (
            <ConnectionForm
              connection={selectedConnection}
              onClose={() => {
                setShowEditDialog(false);
                setSelectedConnection(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Connections() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filter, setFilter] = useState("all");

  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ["/api/connections"],
    initialData: [
      {
        id: 1,
        name: "Production PostgreSQL",
        description: "Main production database",
        type: "postgresql",
        host: "prod-db.example.com",
        port: 5432,
        database: "dataflow_prod",
        username: "app_user",
        ssl: true,
        status: "connected" as const,
        lastTested: "2025-01-02T14:30:00Z",
        createdAt: "2024-12-01T10:00:00Z",
        usageCount: 12
      },
      {
        id: 2,
        name: "Analytics Warehouse",
        description: "Snowflake data warehouse",
        type: "snowflake",
        host: "account.snowflakecomputing.com",
        port: 443,
        database: "analytics",
        username: "analyst",
        ssl: true,
        status: "connected" as const,
        lastTested: "2025-01-02T13:45:00Z",
        createdAt: "2024-12-15T14:20:00Z",
        usageCount: 8
      },
      {
        id: 3,
        name: "S3 Data Lake",
        description: "Raw data storage bucket",
        type: "s3",
        host: "s3.amazonaws.com",
        port: 443,
        database: "raw-data-bucket",
        username: "aws-access-key",
        ssl: true,
        status: "disconnected" as const,
        lastTested: "2025-01-01T20:15:00Z",
        createdAt: "2024-11-30T09:30:00Z",
        usageCount: 5
      }
    ]
  });

  const filteredConnections = connections.filter(connection => {
    if (filter === "all") return true;
    return connection.status === filter;
  });

  const connectionStats = {
    total: connections.length,
    connected: connections.filter(c => c.status === "connected").length,
    disconnected: connections.filter(c => c.status === "disconnected").length,
    testing: connections.filter(c => c.status === "testing").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading connections...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Data Connections</h1>
          <p className="text-gray-600">Manage data sources and destinations for your pipelines</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{connectionStats.total}</p>
                </div>
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected</p>
                  <p className="text-2xl font-bold text-green-600">{connectionStats.connected}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disconnected</p>
                  <p className="text-2xl font-bold text-red-600">{connectionStats.disconnected}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Testing</p>
                  <p className="text-2xl font-bold text-yellow-600">{connectionStats.testing}</p>
                </div>
                <TestTube className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Connections</CardTitle>
                <CardDescription>Configure and manage your data source and destination connections</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Connections</SelectItem>
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="disconnected">Disconnected</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Connection
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Connection</DialogTitle>
                      <DialogDescription>
                        Configure a new data source or destination connection
                      </DialogDescription>
                    </DialogHeader>
                    <ConnectionForm onClose={() => setShowCreateDialog(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredConnections.length === 0 ? (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
                <p className="text-gray-600 mb-4">
                  {filter === "all" 
                    ? "Create your first data connection to get started" 
                    : `No connections with status "${filter}"`
                  }
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Connection
                </Button>
              </div>
            ) : (
              <ConnectionsTable connections={filteredConnections} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Download, 
  Filter,
  Search,
  Lock,
  User,
  Database,
  Activity,
  TrendingUp,
  XCircle,
  Info,
  FileText,
  Calendar,
  Globe,
  Settings,
  Plus,
  Edit,
  Trash
} from "lucide-react";

const riskLevels = {
  critical: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4 text-red-500" /> },
  high: { color: "bg-orange-100 text-orange-800", icon: <AlertTriangle className="w-4 h-4 text-orange-500" /> },
  medium: { color: "bg-yellow-100 text-yellow-800", icon: <Info className="w-4 h-4 text-yellow-500" /> },
  low: { color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="w-4 h-4 text-blue-500" /> }
};

const activityTypes = {
  login: { icon: <User className="w-4 h-4 text-blue-500" />, label: "User Login" },
  logout: { icon: <User className="w-4 h-4 text-gray-500" />, label: "User Logout" },
  create: { icon: <Plus className="w-4 h-4 text-green-500" />, label: "Created" },
  update: { icon: <Edit className="w-4 h-4 text-yellow-500" />, label: "Updated" },
  delete: { icon: <Trash className="w-4 h-4 text-red-500" />, label: "Deleted" },
  access: { icon: <Eye className="w-4 h-4 text-purple-500" />, label: "Accessed" },
  config: { icon: <Settings className="w-4 h-4 text-indigo-500" />, label: "Configuration" }
};

function SecurityOverview() {
  const securityMetrics = {
    overallScore: 87,
    criticalIssues: 2,
    resolvedThisWeek: 15,
    activeThreats: 0,
    lastScan: "2 hours ago",
    nextScan: "in 6 hours"
  };

  const securityChecks = [
    { name: "Authentication Security", status: "passed", score: 95 },
    { name: "Data Encryption", status: "passed", score: 92 },
    { name: "Access Control", status: "warning", score: 78 },
    { name: "Network Security", status: "passed", score: 89 },
    { name: "Backup Systems", status: "passed", score: 94 },
    { name: "Audit Logging", status: "passed", score: 91 }
  ];

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-green-600">{securityMetrics.overallScore}%</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={securityMetrics.overallScore} className="mt-3" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{securityMetrics.criticalIssues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved This Week</p>
                <p className="text-2xl font-bold text-blue-600">{securityMetrics.resolvedThisWeek}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold text-green-600">{securityMetrics.activeThreats}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Security Health Checks</CardTitle>
          <CardDescription>
            Last scan: {securityMetrics.lastScan} • Next scan: {securityMetrics.nextScan}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityChecks.map((check) => (
              <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status === 'passed' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="font-medium">{check.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{check.score}%</span>
                  <Badge className={check.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("7days");

  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["/api/audit-logs"],
  });

  const filteredLogs = (auditLogs || []).filter((log: any) => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resourceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs by action, user, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1day">Last 24 hours</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail ({filteredLogs?.length || 0} events)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading audit logs...</p>
            </div>
          ) : filteredLogs?.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No audit logs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs?.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm">{log.userId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {activityTypes[log.action as keyof typeof activityTypes]?.icon}
                        <span>{activityTypes[log.action as keyof typeof activityTypes]?.label || log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.resourceType}</p>
                        {log.resourceId && (
                          <p className="text-sm text-gray-500 font-mono">{log.resourceId}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm">{log.ipAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {log.success ? 'Success' : 'Failed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityIncidents() {
  const incidents = [
    {
      id: 1,
      title: "Unusual login pattern detected",
      description: "Multiple failed login attempts from different IP addresses",
      severity: "high",
      status: "investigating",
      createdAt: "2025-01-02T10:30:00Z",
      assignedTo: "Security Team",
      affectedResources: ["User Authentication", "Login System"]
    },
    {
      id: 2,
      title: "Privilege escalation attempt",
      description: "User attempted to access admin resources without proper permissions",
      severity: "critical",
      status: "resolved",
      createdAt: "2025-01-01T14:15:00Z",
      assignedTo: "Admin Team",
      affectedResources: ["Access Control", "Admin Panel"]
    },
    {
      id: 3,
      title: "Suspicious data access pattern",
      description: "Large volume of data accessed in short time period",
      severity: "medium",
      status: "monitoring",
      createdAt: "2025-01-01T09:45:00Z",
      assignedTo: "Data Security Team",
      affectedResources: ["Database", "Customer Data"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Security Incidents</h3>
          <p className="text-gray-600">Active security incidents and investigations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Report Incident
        </Button>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {riskLevels[incident.severity as keyof typeof riskLevels].icon}
                    <h4 className="font-semibold">{incident.title}</h4>
                    <Badge className={riskLevels[incident.severity as keyof typeof riskLevels].color}>
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline">
                      {incident.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{incident.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Created: {new Date(incident.createdAt).toLocaleDateString()}</span>
                    <span>Assigned to: {incident.assignedTo}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Affected Resources:</p>
                    <div className="flex gap-2">
                      {incident.affectedResources.map((resource) => (
                        <Badge key={resource} variant="secondary">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function SecurityAudit() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security & Audit</h1>
          <p className="text-gray-600">Monitor security events, audit logs, and system health</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            Run Security Scan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="incidents">Security Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <SecurityOverview />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="incidents">
          <SecurityIncidents />
        </TabsContent>
      </Tabs>
    </div>
  );
}
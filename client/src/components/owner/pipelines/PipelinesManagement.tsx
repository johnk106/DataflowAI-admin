import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Edit,
  Trash,
  MoreHorizontal,
  GitBranch,
  Database,
  Zap
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statusIcons = {
  active: <CheckCircle className="w-4 h-4 text-green-500" />,
  paused: <Pause className="w-4 h-4 text-yellow-500" />,
  failed: <AlertTriangle className="w-4 h-4 text-red-500" />,
  pending: <Clock className="w-4 h-4 text-blue-500" />
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800", 
  failed: "bg-red-100 text-red-800",
  pending: "bg-blue-100 text-blue-800"
};

function CreatePipelineDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tenantId: "",
    sourceType: "",
    targetType: "",
    schedule: ""
  });
  const { toast } = useToast();

  const { data: tenants } = useQuery({ queryKey: ["/api/tenants"] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/pipelines", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pipelines"] });
      toast({ title: "Success", description: "Pipeline created successfully" });
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        tenantId: "",
        sourceType: "",
        targetType: "",
        schedule: ""
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create pipeline", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      tenantId: parseInt(formData.tenantId),
      pipelineId: `pipe_${Date.now()}_${formData.name.toLowerCase().replace(/\s+/g, '_')}`,
      status: "pending",
      lastRun: null,
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      runsCount: 0,
      successRate: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Pipeline</DialogTitle>
          <DialogDescription>Add a new data pipeline to the system</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Pipeline Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Customer Data Sync"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Syncs customer data from source to target..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="tenantId">Tenant</Label>
            <Select value={formData.tenantId} onValueChange={(value) => setFormData(prev => ({ ...prev, tenantId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
              <SelectContent>
                {(tenants || []).map((tenant: any) => (
                  <SelectItem key={tenant.id} value={tenant.id.toString()}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sourceType">Source Type</Label>
              <Select value={formData.sourceType} onValueChange={(value) => setFormData(prev => ({ ...prev, sourceType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">REST API</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="stream">Data Stream</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetType">Target Type</Label>
              <Select value={formData.targetType} onValueChange={(value) => setFormData(prev => ({ ...prev, targetType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Data Warehouse</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">REST API</SelectItem>
                  <SelectItem value="storage">Cloud Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Select value={formData.schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Every Hour</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Pipeline"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PipelineDetailsDialog({ pipeline, open, onOpenChange }: { pipeline: any; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!pipeline) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            {pipeline.name}
          </DialogTitle>
          <DialogDescription>Pipeline Details and Configuration</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {statusIcons[pipeline.status as keyof typeof statusIcons]}
                  <Badge className={statusColors[pipeline.status as keyof typeof statusColors]}>
                    {pipeline.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {pipeline.successRate}%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Pipeline ID</Label>
              <p className="text-sm text-gray-600 font-mono">{pipeline.pipelineId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Total Runs</Label>
              <p className="text-sm text-gray-600">{pipeline.runsCount}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Schedule</Label>
              <p className="text-sm text-gray-600">{pipeline.schedule || 'Manual'}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="text-sm text-gray-600 mt-1">{pipeline.description || 'No description provided'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Last Run</Label>
              <p className="text-sm text-gray-600">
                {pipeline.lastRun ? new Date(pipeline.lastRun).toLocaleString() : 'Never'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Next Run</Label>
              <p className="text-sm text-gray-600">
                {pipeline.nextRun ? new Date(pipeline.nextRun).toLocaleString() : 'Not scheduled'}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-1" />
                Run Now
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <Button size="sm" variant="destructive">
              <Trash className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PipelinesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const { data: pipelines, isLoading } = useQuery({
    queryKey: ["/api/pipelines"],
  });

  const { data: tenants } = useQuery({
    queryKey: ["/api/tenants"],
  });

  const filteredPipelines = (pipelines || []).filter((pipeline: any) => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.pipelineId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pipeline.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTenantName = (tenantId: number) => {
    const tenant = (tenants || []).find((t: any) => t.id === tenantId);
    return tenant?.name || 'Unknown Tenant';
  };

  const showPipelineDetails = (pipeline: any) => {
    setSelectedPipeline(pipeline);
    setDetailsDialogOpen(true);
  };

  const pipelineStats = {
    total: (pipelines || []).length,
    active: (pipelines || []).filter((p: any) => p.status === 'active').length,
    failed: (pipelines || []).filter((p: any) => p.status === 'failed').length,
    paused: (pipelines || []).filter((p: any) => p.status === 'paused').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipelines Management</h1>
          <p className="text-gray-600">Manage data pipelines across all tenants</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Pipeline
        </Button>
      </div>

      {/* Pipeline Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pipelines</p>
                <p className="text-2xl font-bold">{pipelineStats.total}</p>
              </div>
              <GitBranch className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{pipelineStats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{pipelineStats.failed}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paused</p>
                <p className="text-2xl font-bold text-yellow-600">{pipelineStats.paused}</p>
              </div>
              <Pause className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search pipelines by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipelines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pipelines ({filteredPipelines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading pipelines...</p>
            </div>
          ) : filteredPipelines.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No pipelines found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPipelines.map((pipeline: any) => (
                  <TableRow key={pipeline.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{pipeline.name}</p>
                        <p className="text-sm text-gray-500 font-mono">{pipeline.pipelineId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTenantName(pipeline.tenantId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcons[pipeline.status as keyof typeof statusIcons]}
                        <Badge className={statusColors[pipeline.status as keyof typeof statusColors]}>
                          {pipeline.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pipeline.successRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${pipeline.successRate}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pipeline.lastRun ? new Date(pipeline.lastRun).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      {pipeline.nextRun ? new Date(pipeline.nextRun).toLocaleDateString() : 'Not scheduled'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => showPipelineDetails(pipeline)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Run Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreatePipelineDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
      
      <PipelineDetailsDialog 
        pipeline={selectedPipeline}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}
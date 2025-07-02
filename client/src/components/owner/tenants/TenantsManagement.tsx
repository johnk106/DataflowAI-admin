import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  Users, 
  Building, 
  Calendar,
  DollarSign,
  Activity,
  Eye,
  Edit,
  Trash,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const statusColors = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  trial: "bg-blue-100 text-blue-800",
  inactive: "bg-gray-100 text-gray-800"
};

function CreateTenantDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactPerson: "",
    phone: "",
    address: "",
    planType: "",
    notes: ""
  });
  const { toast } = useToast();

  const { data: plans } = useQuery({ queryKey: ["/api/plans"] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/tenants", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      toast({ title: "Success", description: "Tenant created successfully" });
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        contactPerson: "",
        phone: "",
        address: "",
        planType: "",
        notes: ""
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create tenant", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      tenantId: `tenant_${Date.now()}_${formData.name.toLowerCase().replace(/\s+/g, '_')}`,
      status: "trial",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      billingCycle: "monthly",
      totalSpent: "0.00"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>Add a new customer organization to the platform</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Acme Corporation"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Primary Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@acme.com"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 Business Street, City, State, ZIP"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="planType">Initial Plan</Label>
            <Select value={formData.planType} onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(plans) && plans.map((plan: any) => (
                  <SelectItem key={plan.id} value={plan.name}>
                    {plan.name} - ${plan.price}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes or requirements..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TenantDetailsDialog({ tenant, open, onOpenChange }: { tenant: any; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            {tenant.name}
          </DialogTitle>
          <DialogDescription>Complete tenant information and activity</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Organization</Label>
                    <p className="text-sm text-gray-600">{tenant.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tenant ID</Label>
                    <p className="text-sm text-gray-600 font-mono">{tenant.tenantId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <p className="text-sm text-gray-600">{tenant.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <p className="text-sm text-gray-600">{tenant.phone || 'Not provided'}</p>
                  </div>
                </div>
                {tenant.address && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Address
                    </Label>
                    <p className="text-sm text-gray-600">{tenant.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Created</Label>
                    <p className="text-sm text-gray-600">
                      {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Activity</Label>
                    <p className="text-sm text-gray-600">
                      {tenant.lastActivity ? new Date(tenant.lastActivity).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Spent</Label>
                    <p className="text-sm text-gray-600">${tenant.totalSpent || '0.00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status and Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={statusColors[tenant.status as keyof typeof statusColors]}>
                  {tenant.status}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Plan</Label>
                  <p className="text-sm text-gray-600">{tenant.planType || 'No plan assigned'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Billing Cycle</Label>
                  <p className="text-sm text-gray-600">{tenant.billingCycle || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Tenant
              </Button>
              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                View Billing
              </Button>
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                View Pipelines
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash className="w-4 h-4 mr-2" />
                Delete Tenant
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function TenantsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const { data: tenants, isLoading } = useQuery({
    queryKey: ["/api/tenants"],
  });

  const filteredTenants = Array.isArray(tenants) ? tenants.filter((tenant: any) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.tenantId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const showTenantDetails = (tenant: any) => {
    setSelectedTenant(tenant);
    setDetailsDialogOpen(true);
  };

  const tenantStats = {
    total: Array.isArray(tenants) ? tenants.length : 0,
    active: Array.isArray(tenants) ? tenants.filter((t: any) => t.status === 'active').length : 0,
    trial: Array.isArray(tenants) ? tenants.filter((t: any) => t.status === 'trial').length : 0,
    suspended: Array.isArray(tenants) ? tenants.filter((t: any) => t.status === 'suspended').length : 0
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants Management</h1>
          <p className="text-gray-600">Manage customer organizations and their subscriptions</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Tenant Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold">{tenantStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{tenantStats.active}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trial</p>
                <p className="text-2xl font-bold text-blue-600">{tenantStats.trial}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{tenantStats.suspended}</p>
              </div>
              <Building className="w-8 h-8 text-red-500" />
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
                  placeholder="Search tenants by name, email, or ID..."
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
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenants ({filteredTenants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading tenants...</p>
            </div>
          ) : filteredTenants.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No tenants found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant: any) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-gray-500 font-mono">{tenant.tenantId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{tenant.email}</p>
                        {tenant.contactPerson && (
                          <p className="text-sm text-gray-500">{tenant.contactPerson}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[tenant.status as keyof typeof statusColors]}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{tenant.planType || 'No plan'}</TableCell>
                    <TableCell>
                      {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>${tenant.totalSpent || '0.00'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => showTenantDetails(tenant)}
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
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="w-4 h-4 mr-2" />
                              Pipelines
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

      <CreateTenantDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
      
      <TenantDetailsDialog 
        tenant={selectedTenant}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}
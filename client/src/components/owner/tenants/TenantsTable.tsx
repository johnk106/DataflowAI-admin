import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TenantsTableProps {
  tenants: any[];
  isLoading: boolean;
}

function formatDate(date: any): string {
  if (!date) return "N/A";
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  } catch {
    return "N/A";
  }
}

function getStatusBadge(status: string) {
  const variants = {
    active: "default",
    suspended: "destructive",
    trial: "secondary",
  } as const;

  return (
    <Badge variant={variants[status as keyof typeof variants] || "default"}>
      {status}
    </Badge>
  );
}

function getPlanBadge(plan: string) {
  const variants = {
    starter: "secondary",
    professional: "default", 
    enterprise: "default",
  } as const;

  return (
    <Badge variant={variants[plan as keyof typeof variants] || "secondary"}>
      {plan}
    </Badge>
  );
}

export default function TenantsTable({ tenants, isLoading }: TenantsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenants ({tenants.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Monthly Usage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{tenant.name}</div>
                    <div className="text-sm text-gray-500">{tenant.tenantId}</div>
                  </div>
                </TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                <TableCell>{formatDate(tenant.signupDate)}</TableCell>
                <TableCell>${Number(tenant.monthlyUsage || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Tenant
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Tenant
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {tenants.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No tenants found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
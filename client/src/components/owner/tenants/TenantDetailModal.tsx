import { useQuery } from "@tanstack/react-query";
import { X, Mail, Calendar, CreditCard, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tenant, Pipeline } from "@shared/schema";

interface TenantDetailModalProps {
  tenant: Tenant;
  onClose: () => void;
}

export default function TenantDetailModal({ tenant, onClose }: TenantDetailModalProps) {
  const { data: pipelines, isLoading: pipelinesLoading } = useQuery<Pipeline[]>({
    queryKey: ["/api/tenants", tenant.id, "pipelines"],
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "trial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPipelineStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">{tenant.name} Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Tenant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tenant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-900">{tenant.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Tenant ID</p>
                  <p className="text-sm text-gray-900">{tenant.tenantId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Plan</p>
                  <p className="text-sm text-gray-900 capitalize">{tenant.plan}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Signup Date</p>
                  <p className="text-sm text-gray-900">
                    {tenant.signupDate?.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
                <Badge className={getStatusBadgeColor(tenant.status)}>
                  {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Usage Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Monthly Usage</p>
                <p className="text-2xl font-bold text-gray-900">${tenant.monthlyUsage}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Next Billing Date</p>
                <p className="text-sm text-gray-900">
                  {tenant.nextBillingDate?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) || 'Not set'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Total Pipelines</p>
                <p className="text-lg font-semibold text-gray-900">
                  {pipelinesLoading ? "Loading..." : pipelines?.length || 0}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Active Pipelines</p>
                <p className="text-lg font-semibold text-green-600">
                  {pipelinesLoading ? "Loading..." : pipelines?.filter(p => p.status === "running").length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipelines List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Pipelines</CardTitle>
          </CardHeader>
          <CardContent>
            {pipelinesLoading ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Loading pipelines...</p>
              </div>
            ) : pipelines && pipelines.length > 0 ? (
              <div className="space-y-3">
                {pipelines.map((pipeline) => (
                  <div
                    key={pipeline.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{pipeline.name}</p>
                      <p className="text-sm text-gray-500">{pipeline.pipelineId}</p>
                      <p className="text-xs text-gray-400">Owner: {pipeline.owner}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getPipelineStatusColor(pipeline.status)}>
                        {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Last run: {pipeline.lastRunStatus || 'Never'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No pipelines found for this tenant</p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

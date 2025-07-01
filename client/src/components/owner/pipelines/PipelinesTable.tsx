import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Play, Archive, Circle, AlertTriangle, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Pipeline, Tenant } from "@shared/schema";

interface PipelinesTableProps {
  pipelines: Pipeline[];
  tenants: Tenant[];
  onPipelineSelect: (pipeline: Pipeline) => void;
}

export default function PipelinesTable({ pipelines, tenants, onPipelineSelect }: PipelinesTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePipelineMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Pipeline> }) => {
      await apiRequest("PATCH", `/api/pipelines/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pipelines"] });
      toast({
        title: "Success",
        description: "Pipeline updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update pipeline",
        variant: "destructive",
      });
    },
  });

  const getTenantById = (tenantId: number | null) => {
    return tenants.find(t => t.id === tenantId);
  };

  const getTenantInitials = (tenant: Tenant) => {
    return tenant.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatusBadgeColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Circle className="w-3 h-3 fill-current" />;
      case "failed":
        return <AlertTriangle className="w-3 h-3" />;
      case "paused":
        return <Pause className="w-3 h-3" />;
      default:
        return <Circle className="w-3 h-3 fill-current" />;
    }
  };

  const handleRunPipeline = (pipeline: Pipeline) => {
    updatePipelineMutation.mutate({
      id: pipeline.id,
      updates: { status: "running", lastRunStatus: "pending" },
    });
  };

  const handleArchivePipeline = (pipeline: Pipeline) => {
    if (confirm(`Are you sure you want to archive pipeline "${pipeline.name}"?`)) {
      updatePipelineMutation.mutate({
        id: pipeline.id,
        updates: { status: "completed" },
      });
    }
  };

  const formatNextRun = (nextRun: Date | null) => {
    if (!nextRun) return "Manual trigger";
    
    const now = new Date();
    const diff = nextRun.getTime() - now.getTime();
    
    if (diff < 0) return "Overdue";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    return "Soon";
  };

  return (
    <Card className="border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pipeline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Run
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pipelines.map((pipeline) => {
              const tenant = getTenantById(pipeline.tenantId);
              
              return (
                <tr key={pipeline.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pipeline.name}</div>
                      <div className="text-sm text-gray-500">{pipeline.pipelineId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tenant ? (
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-blue-600">
                            {getTenantInitials(tenant)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{tenant.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unknown</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pipeline.owner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`inline-flex items-center ${getStatusBadgeColor(pipeline.status)}`}>
                      {getStatusIcon(pipeline.status)}
                      <span className="ml-1">
                        {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
                      </span>
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNextRun(pipeline.nextScheduledRun)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPipelineSelect(pipeline)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Inspect
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRunPipeline(pipeline)}
                        disabled={updatePipelineMutation.isPending}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Re-run
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchivePipeline(pipeline)}
                        disabled={updatePipelineMutation.isPending}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <Archive className="w-4 h-4 mr-1" />
                        Archive
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

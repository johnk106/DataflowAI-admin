import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Save, AlertCircle, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { SystemMetric } from "@shared/schema";

export default function SystemAnalytics() {
  const [cpuWarning, setCpuWarning] = useState("70");
  const [cpuCritical, setCpuCritical] = useState("90");
  const [memoryWarning, setMemoryWarning] = useState("80");
  const [errorThreshold, setErrorThreshold] = useState("5");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [pagerDutyAlerts, setPagerDutyAlerts] = useState(false);

  const { toast } = useToast();

  const { data: systemMetrics, isLoading } = useQuery<SystemMetric[]>({
    queryKey: ["/api/analytics/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "critical":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 border-green-200";
      case "warning":
        return "bg-yellow-100 border-yellow-200";
      case "critical":
        return "bg-red-100 border-red-200";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  const handleSaveAlertConfig = () => {
    toast({
      title: "Success",
      description: "Alert configuration saved successfully",
    });
  };

  const performanceMetrics = [
    { name: "Average Response Time", value: "245ms", percentage: 65, color: "bg-green-600" },
    { name: "Error Rate", value: "2.3%", percentage: 23, color: "bg-yellow-600" },
    { name: "Throughput", value: "1,247 req/min", percentage: 82, color: "bg-blue-600" },
    { name: "Uptime", value: "99.8%", percentage: 99.8, color: "bg-green-600" },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
        <p className="text-gray-600 mt-2">Real-time health metrics and service monitoring</p>
      </div>

      {/* Service Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemMetrics?.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {metric.service}
                </h3>
                <Badge className={`inline-flex items-center ${getStatusBadgeColor(metric.status)}`}>
                  {getStatusIcon(metric.status)}
                  <span className="ml-1 capitalize">{metric.status}</span>
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-medium">{metric.cpuUsage}%</span>
                </div>
                <Progress value={parseFloat(metric.cpuUsage || "0")} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Memory</span>
                  <span className="font-medium">{metric.memoryUsage}%</span>
                </div>
                <Progress value={parseFloat(metric.memoryUsage || "0")} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {performanceMetrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    <span className="text-sm text-gray-600">{metric.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.color}`}
                      style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Dependency Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Service Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {/* Load Balancer */}
              <div className="flex items-center justify-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getServiceStatusColor("healthy")}`}>
                  {getStatusIcon("healthy")}
                  <span className="text-sm font-medium">Load Balancer</span>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <div className="w-px h-6 bg-gray-300"></div>
              </div>

              {/* API Gateway */}
              <div className="flex items-center justify-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getServiceStatusColor("healthy")}`}>
                  {getStatusIcon("healthy")}
                  <span className="text-sm font-medium">API Gateway</span>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <div className="w-px h-6 bg-gray-300"></div>
              </div>

              {/* Services Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getServiceStatusColor("healthy")}`}>
                    {getStatusIcon("healthy")}
                    <span className="text-xs font-medium">Orchestrator</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getServiceStatusColor("warning")}`}>
                    {getStatusIcon("warning")}
                    <span className="text-xs font-medium">NiFi</span>
                  </div>
                </div>
              </div>

              {/* Bottom Services */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getServiceStatusColor("healthy")}`}>
                    {getStatusIcon("healthy")}
                    <span className="text-xs font-medium">Beam</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getServiceStatusColor("critical")}`}>
                    {getStatusIcon("critical")}
                    <span className="text-xs font-medium">Airflow</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alert Configuration</CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Alert Rule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Threshold Settings */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Threshold Settings</h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">CPU Usage Warning (%)</Label>
                  <Input
                    type="number"
                    value={cpuWarning}
                    onChange={(e) => setCpuWarning(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">CPU Usage Critical (%)</Label>
                  <Input
                    type="number"
                    value={cpuCritical}
                    onChange={(e) => setCpuCritical(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Memory Usage Warning (%)</Label>
                  <Input
                    type="number"
                    value={memoryWarning}
                    onChange={(e) => setMemoryWarning(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">Error Rate Threshold (%)</Label>
                  <Input
                    type="number"
                    value={errorThreshold}
                    onChange={(e) => setErrorThreshold(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notification Channels */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Notification Channels</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-sm">@</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Email Alerts</div>
                      <div className="text-xs text-gray-500">admin@company.com</div>
                    </div>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 text-sm">#</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Slack Integration</div>
                      <div className="text-xs text-gray-500">#alerts channel</div>
                    </div>
                  </div>
                  <Switch checked={slackAlerts} onCheckedChange={setSlackAlerts} />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                      <span className="text-orange-600 text-sm">P</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">PagerDuty</div>
                      <div className="text-xs text-gray-500">Critical alerts only</div>
                    </div>
                  </div>
                  <Switch checked={pagerDutyAlerts} onCheckedChange={setPagerDutyAlerts} />
                </div>

                <Button onClick={handleSaveAlertConfig} className="w-full mt-4">
                  <Save className="w-4 h-4 mr-2" />
                  Save Alert Configuration
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

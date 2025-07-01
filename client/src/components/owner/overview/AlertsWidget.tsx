import { AlertCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetrics } from "@shared/schema";

interface AlertsWidgetProps {
  alerts: DashboardMetrics['alerts'];
}

export default function AlertsWidget({ alerts }: AlertsWidgetProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getAlertTextColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  const getAlertSubTextColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">System Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No active alerts</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertBg(alert.type)}`}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${getAlertTextColor(alert.type)}`}>
                    {alert.title}
                  </p>
                  <p className={`text-xs mt-1 ${getAlertSubTextColor(alert.type)}`}>
                    {alert.message}
                  </p>
                  <div className="flex items-center mt-2">
                    <Clock className={`w-3 h-3 mr-1 ${getAlertSubTextColor(alert.type)}`} />
                    <span className={`text-xs ${getAlertSubTextColor(alert.type)}`}>
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

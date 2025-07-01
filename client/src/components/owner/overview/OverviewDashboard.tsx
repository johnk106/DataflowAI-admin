import { useQuery } from "@tanstack/react-query";
import MetricsCards from "./MetricsCards";
import Charts from "./Charts";
import AlertsWidget from "./AlertsWidget";
import type { DashboardMetrics } from "@shared/schema";

export default function OverviewDashboard() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <MetricsCards metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Charts metrics={metrics} />
        </div>
        <AlertsWidget alerts={metrics.alerts} />
      </div>
      
      {/* New Tenant Signups Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">New Tenant Sign-ups by Month</h3>
        <div className="h-64 flex items-end justify-between space-x-4">
          {metrics.tenantSignupsData.map((item, index) => (
            <div key={item.month} className="flex flex-col items-center">
              <div 
                className="w-12 bg-green-500 rounded-t mb-2" 
                style={{ height: `${(item.signups / 30) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Users, Activity, Play, AlertTriangle, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetrics } from "@shared/schema";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Total Tenants",
      value: metrics.totalTenants.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Pipelines",
      value: metrics.totalPipelines.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: Activity,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Active Pipelines",
      value: metrics.activePipelines.toString(),
      change: "+5%",
      changeType: "positive" as const,
      icon: Play,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Failed Runs Today",
      value: metrics.failedRuns.toString(),
      change: "-15%",
      changeType: "positive" as const,
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Monthly Volume",
      value: metrics.monthlyVolume,
      change: "+23%",
      changeType: "positive" as const,
      icon: Database,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`font-medium ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change}
                </span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

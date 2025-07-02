import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import type { DashboardMetrics } from "@/../../shared/schema";

interface ChartsProps {
  metrics: DashboardMetrics;
}

export default function Charts({ metrics }: ChartsProps) {
  return (
    <div className="space-y-6">
      {/* Pipeline Runs Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Runs Over Time</CardTitle>
          <CardDescription>Daily pipeline execution statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.pipelineRunsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="runs" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tenant Signups Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Signups</CardTitle>
          <CardDescription>Monthly tenant registration trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.tenantSignupsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="signups" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
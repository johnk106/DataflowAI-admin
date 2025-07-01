import { useState } from "react";
import { Code2, Clock, User, Settings, History, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Pipeline } from "@shared/schema";

interface PipelineInspectModalProps {
  pipeline: Pipeline;
  onClose: () => void;
}

export default function PipelineInspectModal({ pipeline, onClose }: PipelineInspectModalProps) {
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

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock data for demonstration
  const mockVersionHistory = [
    { version: 2, date: new Date(), author: pipeline.owner, changes: "Updated data source configuration" },
    { version: 1, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), author: pipeline.owner, changes: "Initial pipeline creation" },
  ];

  const mockRunLogs = [
    { timestamp: new Date(), level: "INFO", message: "Pipeline execution started" },
    { timestamp: new Date(Date.now() - 60000), level: "INFO", message: "Data source connected successfully" },
    { timestamp: new Date(Date.now() - 120000), level: "WARN", message: "Slow query detected in transformation step" },
    { timestamp: new Date(Date.now() - 180000), level: "INFO", message: "Processing 1,234 records" },
    { timestamp: new Date(Date.now() - 240000), level: "ERROR", message: "Connection timeout to external API" },
  ];

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-red-600";
      case "WARN":
        return "text-yellow-600";
      case "INFO":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{pipeline.name}</DialogTitle>
          <div className="flex items-center space-x-4 mt-2">
            <Badge className={getStatusBadgeColor(pipeline.status)}>
              {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">{pipeline.pipelineId}</span>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="definition">Definition</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
            <TabsTrigger value="logs">Run Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Pipeline Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Owner</p>
                      <p className="text-sm text-gray-900">{pipeline.owner}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Created</p>
                      <p className="text-sm text-gray-900">{formatDate(pipeline.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Updated</p>
                      <p className="text-sm text-gray-900">{formatDate(pipeline.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <History className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Version</p>
                      <p className="text-sm text-gray-900">v{pipeline.version}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Execution Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Run Status</p>
                    <Badge className={getStatusBadgeColor(pipeline.lastRunStatus || "unknown")}>
                      {pipeline.lastRunStatus?.charAt(0).toUpperCase() + (pipeline.lastRunStatus?.slice(1) || "Unknown")}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Next Scheduled Run</p>
                    <p className="text-sm text-gray-900">{formatDate(pipeline.nextScheduledRun)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Execution Mode</p>
                    <p className="text-sm text-gray-900">
                      {pipeline.nextScheduledRun ? "Scheduled" : "Manual"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="definition" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Code2 className="w-5 h-5 mr-2" />
                  Pipeline Definition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <pre className="text-sm">
                    <code>
                      {JSON.stringify(pipeline.definition || {
                        type: "data_pipeline",
                        version: "1.0",
                        sources: [
                          {
                            name: "source_database",
                            type: "postgresql",
                            connection: "prod_db",
                            query: "SELECT * FROM transactions WHERE created_at > ?",
                            parameters: ["${YESTERDAY}"]
                          }
                        ],
                        transformations: [
                          {
                            name: "data_cleansing",
                            type: "python",
                            script: "clean_data.py",
                            parameters: {
                              "remove_duplicates": true,
                              "fill_missing": "median"
                            }
                          },
                          {
                            name: "feature_engineering",
                            type: "sql",
                            query: "SELECT *, amount * 1.1 as adjusted_amount FROM input"
                          }
                        ],
                        destinations: [
                          {
                            name: "analytics_warehouse",
                            type: "snowflake",
                            table: "processed_transactions",
                            mode: "append"
                          }
                        ],
                        schedule: {
                          type: "cron",
                          expression: "0 2 * * *",
                          timezone: "UTC"
                        }
                      }, null, 2)}
                    </code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Version History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVersionHistory.map((version) => (
                    <div
                      key={version.version}
                      className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">v{version.version}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{version.changes}</p>
                          <span className="text-sm text-gray-500">{formatDate(version.date)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">by {version.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Run Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-2">
                    {mockRunLogs.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 py-2 px-3 rounded bg-gray-50 font-mono text-sm"
                      >
                        <span className="text-gray-500 whitespace-nowrap">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <span className={`font-semibold whitespace-nowrap ${getLogLevelColor(log.level)}`}>
                          [{log.level}]
                        </span>
                        <span className="text-gray-900">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

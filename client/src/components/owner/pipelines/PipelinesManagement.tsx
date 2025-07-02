import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function PipelinesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: pipelines, isLoading } = useQuery({
    queryKey: ["/api/pipelines"],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipelines Management</h1>
          <p className="text-gray-600">Manage data pipelines across all tenants</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Pipeline
        </Button>
      </div>

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
                  placeholder="Search pipelines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipelines ({Array.isArray(pipelines) ? pipelines.length : 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading pipelines...</p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Pipelines will be displayed here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
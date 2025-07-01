import { useState } from "react";
import { Save, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function ServiceConfiguration() {
  const [llmModel, setLlmModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState("2048");
  const [rawDataRetention, setRawDataRetention] = useState("90");
  const [logRetention, setLogRetention] = useState("180");
  const [auditLogRetention, setAuditLogRetention] = useState("365");
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [customConnectors, setCustomConnectors] = useState(false);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);

  const { toast } = useToast();

  const mockSchemaFiles = [
    "data_processing.json",
    "analytics_functions.json"
  ];

  const handleSaveLLMSettings = () => {
    toast({
      title: "Success",
      description: "LLM settings saved successfully",
    });
  };

  const handleSaveRetentionPolicies = () => {
    toast({
      title: "Success", 
      description: "Retention policies updated successfully",
    });
  };

  const handleSaveFeatureFlags = () => {
    toast({
      title: "Success",
      description: "Feature flags saved successfully",
    });
  };

  const handleFileUpload = () => {
    toast({
      title: "Info",
      description: "File upload functionality would be implemented here",
    });
  };

  const handleDeleteSchema = (filename: string) => {
    toast({
      title: "Success",
      description: `Schema file ${filename} deleted successfully`,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Service Configuration</h2>
        <p className="text-gray-600 mt-2">Manage global settings and configurations for the platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LLM Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>LLM Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Default Model</Label>
              <Select value={llmModel} onValueChange={setLlmModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5-turbo</SelectItem>
                  <SelectItem value="claude-3">Claude-3</SelectItem>
                  <SelectItem value="llama-2">Llama-2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Temperature: {temperature[0]}
              </Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 (Deterministic)</span>
                <span>1 (Creative)</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Max Tokens</Label>
              <Input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
              />
            </div>
            
            <Button onClick={handleSaveLLMSettings} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save LLM Settings
            </Button>
          </CardContent>
        </Card>

        {/* Function Schema Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Function Call Schemas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload new schema files</p>
              <Button variant="outline" onClick={handleFileUpload}>
                Choose Files
              </Button>
            </div>
            
            <div className="space-y-2">
              {mockSchemaFiles.map((filename) => (
                <div key={filename} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-xs">JS</span>
                    </div>
                    <span className="text-sm font-medium">{filename}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSchema(filename)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Retention Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Raw S3 Data Retention (days)</Label>
              <Input
                type="number"
                value={rawDataRetention}
                onChange={(e) => setRawDataRetention(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Raw pipeline data will be deleted after this period</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Log Retention (days)</Label>
              <Input
                type="number"
                value={logRetention}
                onChange={(e) => setLogRetention(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Pipeline execution logs will be deleted after this period</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Audit Log Retention (days)</Label>
              <Input
                type="number"
                value={auditLogRetention}
                onChange={(e) => setAuditLogRetention(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Security audit logs will be deleted after this period</p>
            </div>
            
            <Button onClick={handleSaveRetentionPolicies} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Update Retention Policies
            </Button>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700">Enable Streaming</Label>
                <p className="text-xs text-gray-500">Allow real-time data streaming in pipelines</p>
              </div>
              <Switch checked={enableStreaming} onCheckedChange={setEnableStreaming} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700">Custom Connectors</Label>
                <p className="text-xs text-gray-500">Allow tenants to create custom data connectors</p>
              </div>
              <Switch checked={customConnectors} onCheckedChange={setCustomConnectors} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700">Advanced Analytics</Label>
                <p className="text-xs text-gray-500">Enable advanced analytics and ML features</p>
              </div>
              <Switch checked={advancedAnalytics} onCheckedChange={setAdvancedAnalytics} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700">Beta Features</Label>
                <p className="text-xs text-gray-500">Allow access to experimental features</p>
              </div>
              <Switch checked={betaFeatures} onCheckedChange={setBetaFeatures} />
            </div>

            <Button onClick={handleSaveFeatureFlags} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Feature Flags
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

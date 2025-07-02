import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  DollarSign, 
  CheckCircle, 
  X,
  Save,
  ArrowLeft,
  Info,
  Zap,
  Shield,
  Database,
  Users
} from "lucide-react";

const planTiers = {
  starter: { name: "Starter", color: "bg-blue-100 text-blue-800", icon: <Users className="w-4 h-4" /> },
  professional: { name: "Professional", color: "bg-purple-100 text-purple-800", icon: <Zap className="w-4 h-4" /> },
  enterprise: { name: "Enterprise", color: "bg-orange-100 text-orange-800", icon: <Shield className="w-4 h-4" /> },
  custom: { name: "Custom", color: "bg-gray-100 text-gray-800", icon: <Database className="w-4 h-4" /> }
};

export default function NewPlanPage({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    billingPeriod: "monthly",
    tier: "starter",
    pipelineLimit: "",
    dataVolumeLimit: "",
    storageLimit: "",
    supportLevel: "email",
    features: [] as string[],
    isActive: true,
    isFeatured: false,
    customFeatures: ""
  });

  const [newFeature, setNewFeature] = useState("");
  const { toast } = useToast();

  const predefinedFeatures = [
    "Real-time data processing",
    "Advanced analytics dashboard",
    "API access",
    "Custom integrations",
    "24/7 monitoring",
    "Data backup & recovery",
    "Multi-tenant support",
    "Role-based access control",
    "Audit logging",
    "Custom reporting",
    "Priority support",
    "SLA guarantees",
    "White-label options",
    "Advanced security features",
    "Custom data retention"
  ];

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/plans", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      toast({ title: "Success", description: "Plan created successfully" });
      onBack();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create plan", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const allFeatures = [...formData.features];
    if (formData.customFeatures) {
      allFeatures.push(...formData.customFeatures.split('\n').filter(f => f.trim()));
    }

    createMutation.mutate({
      ...formData,
      price: parseFloat(formData.price).toFixed(2),
      pipelineLimit: parseInt(formData.pipelineLimit) || null,
      dataVolumeLimit: formData.dataVolumeLimit || null,
      storageLimit: formData.storageLimit || null,
      features: allFeatures,
      createdAt: new Date().toISOString()
    });
  };

  const addFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addCustomFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Plan</h1>
            <p className="text-gray-600">Design a new subscription plan for your customers</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Define the core details of your plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Professional Plan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tier">Plan Tier</Label>
                    <Select value={formData.tier} onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(planTiers).map(([key, tier]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {tier.icon}
                              {tier.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this plan offers..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="99.00"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="billingPeriod">Billing Period</Label>
                    <Select value={formData.billingPeriod} onValueChange={(value) => setFormData(prev => ({ ...prev, billingPeriod: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limits and Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Limits</CardTitle>
                <CardDescription>Set usage limits for this plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pipelineLimit">Pipeline Limit</Label>
                    <Input
                      id="pipelineLimit"
                      type="number"
                      value={formData.pipelineLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, pipelineLimit: e.target.value }))}
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
                  </div>
                  <div>
                    <Label htmlFor="dataVolumeLimit">Data Volume (GB/month)</Label>
                    <Input
                      id="dataVolumeLimit"
                      value={formData.dataVolumeLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataVolumeLimit: e.target.value }))}
                      placeholder="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
                  </div>
                  <div>
                    <Label htmlFor="storageLimit">Storage Limit (GB)</Label>
                    <Input
                      id="storageLimit"
                      value={formData.storageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, storageLimit: e.target.value }))}
                      placeholder="500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="supportLevel">Support Level</Label>
                  <Select value={formData.supportLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, supportLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Support</SelectItem>
                      <SelectItem value="chat">Chat Support</SelectItem>
                      <SelectItem value="phone">Phone Support</SelectItem>
                      <SelectItem value="dedicated">Dedicated Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
                <CardDescription>Select and customize features included in this plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Available Features</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {predefinedFeatures.map((feature) => (
                      <div
                        key={feature}
                        className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                          formData.features.includes(feature)
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => 
                          formData.features.includes(feature) 
                            ? removeFeature(feature)
                            : addFeature(feature)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{feature}</span>
                          {formData.features.includes(feature) && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Add Custom Feature</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Enter custom feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
                    />
                    <Button type="button" onClick={addCustomFeature}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Selected Features ({formData.features.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="customFeatures">Additional Features (one per line)</Label>
                  <Textarea
                    id="customFeatures"
                    value={formData.customFeatures}
                    onChange={(e) => setFormData(prev => ({ ...prev, customFeatures: e.target.value }))}
                    placeholder="Custom integration support&#10;Dedicated account manager&#10;Advanced analytics"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Preview and Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {planTiers[formData.tier as keyof typeof planTiers]?.icon}
                    <Badge className={planTiers[formData.tier as keyof typeof planTiers]?.color}>
                      {planTiers[formData.tier as keyof typeof planTiers]?.name}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{formData.name || 'Plan Name'}</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${formData.price || '0.00'}
                    <span className="text-sm font-normal text-gray-500">
                      /{formData.billingPeriod}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.description || 'Plan description will appear here...'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Resource Limits:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Pipelines: {formData.pipelineLimit || 'Unlimited'}</li>
                    <li>Data Volume: {formData.dataVolumeLimit ? `${formData.dataVolumeLimit} GB/month` : 'Unlimited'}</li>
                    <li>Storage: {formData.storageLimit ? `${formData.storageLimit} GB` : 'Unlimited'}</li>
                    <li>Support: {formData.supportLevel}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Active Plan</Label>
                    <p className="text-sm text-gray-500">Plan is available for purchase</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isFeatured">Featured Plan</Label>
                    <p className="text-sm text-gray-500">Highlight this plan</p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Creating..." : "Create Plan"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileText, DollarSign, CreditCard, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tenant, Invoice, Plan } from "@shared/schema";
import NewPlanPage from "./NewPlanPage";

export default function BillingPlans() {
  const [showNewPlan, setShowNewPlan] = useState(false);

  if (showNewPlan) {
    return <NewPlanPage onBack={() => setShowNewPlan(false)} />;
  }
  const { data: tenants } = useQuery<Tenant[]>({
    queryKey: ["/api/tenants"],
  });

  const { data: invoices } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  const { data: plans } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  // Calculate metrics
  const monthlyRevenue = invoices
    ?.filter(inv => inv.status === "paid")
    ?.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0;

  const activeSubscriptions = tenants?.filter(t => t.status === "active").length || 0;
  const pendingInvoices = invoices?.filter(inv => inv.status === "pending").length || 0;
  const overdueInvoices = invoices?.filter(inv => inv.status === "overdue").length || 0;

  // Group tenants by plan
  const tenantsByPlan = tenants?.reduce((acc, tenant) => {
    acc[tenant.plan] = (acc[tenant.plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "enterprise":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "professional":
        return "bg-purple-50 border-purple-200 text-purple-900";
      case "starter":
        return "bg-gray-50 border-gray-200 text-gray-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Billing & Plans</h2>
        <p className="text-gray-600 mt-2">Manage subscription tiers, invoicing, and billing</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-600">+8.2% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-600">+12 new this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{pendingInvoices}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-red-600">{overdueInvoices} overdue</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-gray-900">2.1%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-sm text-green-600">-0.3% improvement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tenants by Plan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Tenants by Plan
            </CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plans?.map((plan) => {
                const tenantCount = tenantsByPlan[plan.name] || 0;
                return (
                  <div
                    key={plan.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${getPlanColor(plan.name)}`}
                  >
                    <div>
                      <h4 className="font-medium">
                        {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                      </h4>
                      <p className="text-sm opacity-75">
                        ${plan.price}/month • {plan.pipelineLimit ? `Up to ${plan.pipelineLimit} pipelines` : 'Unlimited pipelines'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{tenantCount}</div>
                      <div className="text-sm opacity-75">tenants</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices?.slice(0, 4).map((invoice) => {
                const tenant = tenants?.find(t => t.id === invoice.tenantId);
                return (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{invoice.invoiceId}</div>
                      <div className="text-sm text-gray-500">{tenant?.name || 'Unknown Tenant'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${invoice.amount}</div>
                      <Badge className={getStatusBadgeColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configure Plans</CardTitle>
          <Button onClick={() => setShowNewPlan(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Plan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans?.map((plan, index) => (
              <div
                key={plan.id}
                className={`border rounded-lg p-6 ${index === 1 ? 'border-2 border-primary relative' : 'border-gray-200'}`}
              >
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-900 capitalize">
                    {plan.name}
                  </h4>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    ${plan.price}
                    <span className="text-lg text-gray-500">/mo</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.pipelineLimit ? `Up to ${plan.pipelineLimit} pipelines` : 'Unlimited pipelines'}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.storageLimit} storage
                  </li>
                  {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={index === 1 ? "default" : "outline"} 
                  className="w-full"
                >
                  Edit Plan
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

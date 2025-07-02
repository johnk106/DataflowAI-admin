import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import OwnerLayout from "@/components/owner/layout/OwnerLayout";
import OverviewDashboard from "@/components/owner/overview/OverviewDashboard";
import TenantsManagement from "@/components/owner/tenants/TenantsManagement";
import PipelinesManagement from "@/components/owner/pipelines/PipelinesManagement";
import ServiceConfiguration from "@/components/owner/config/ServiceConfiguration";
import SecurityAudit from "@/components/owner/security/SecurityAudit";
import BillingPlans from "@/components/owner/billing/BillingPlans";
import SystemAnalytics from "@/components/owner/analytics/SystemAnalytics";
import Connections from "@/pages/connections";

export default function OwnerConsolePage() {
  const [currentPage, setCurrentPage] = useState("overview");
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Handle authentication and authorization
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (user && !['owner', 'admin'].includes(user.role)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the owner console.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Handle URL-based navigation
  useEffect(() => {
    const path = location.replace("/owner", "").replace("/", "");
    if (path && ["overview", "tenants", "pipelines", "connections", "configuration", "security", "billing", "analytics"].includes(path)) {
      setCurrentPage(path);
    } else if (!path) {
      setCurrentPage("overview");
    }
  }, [location]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or authorized
  if (!isAuthenticated || !user || !['owner', 'admin'].includes(user.role)) {
    return null;
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // Update URL without full page reload
    window.history.pushState({}, '', `/owner/${page === 'overview' ? '' : page}`);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewDashboard />;
      case "tenants":
        return <TenantsManagement />;
      case "pipelines":
        return <PipelinesManagement />;
      case "connections":
        return <Connections />;
      case "configuration":
        return <ServiceConfiguration />;
      case "security":
        return <SecurityAudit />;
      case "billing":
        return <BillingPlans />;
      case "analytics":
        return <SystemAnalytics />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <OwnerLayout
      currentPage={currentPage}
      onPageChange={handlePageChange}
    >
      {renderCurrentPage()}
    </OwnerLayout>
  );
}

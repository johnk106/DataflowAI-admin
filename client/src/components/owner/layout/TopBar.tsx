import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  currentPage: string;
  onMenuToggle: () => void;
}

const pageTitles = {
  overview: "Overview",
  tenants: "Tenants Management",
  pipelines: "Pipelines Management",
  configuration: "Service Configuration",
  security: "Security & Audit",
  billing: "Billing & Plans",
  analytics: "System Analytics",
};

export default function TopBar({ currentPage, onMenuToggle }: TopBarProps) {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AU";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return "Admin User";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {pageTitles[currentPage as keyof typeof pageTitles] || "Dashboard"}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              {getUserDisplayName()}
            </span>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profileImageUrl} alt="Admin avatar" />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

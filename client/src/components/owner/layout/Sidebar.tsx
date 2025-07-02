import { Database, ChartPie, Users, Workflow, Settings, Shield, CreditCard, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { id: "overview", name: "Overview", icon: ChartPie },
  { id: "tenants", name: "Tenants", icon: Users },
  { id: "pipelines", name: "Pipelines", icon: Workflow },
  { id: "connections", name: "Connections", icon: Database },
  { id: "configuration", name: "Service Configuration", icon: Settings },
  { id: "security", name: "Security & Audit", icon: Shield },
  { id: "billing", name: "Billing & Plans", icon: CreditCard },
  { id: "analytics", name: "System Analytics", icon: BarChart3 },
];

export default function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gray-900">DataFlow</span>
        </div>
        <button 
          onClick={onToggle}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          ✕
        </button>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-primary bg-primary/10 border-r-2 border-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className="mr-3 w-4 h-4" />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

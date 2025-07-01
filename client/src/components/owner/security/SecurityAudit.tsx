import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserManagement from "./UserManagement";
import AuditLog from "./AuditLog";

export default function SecurityAudit() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Security & Audit</h2>
        <p className="text-gray-600 mt-2">Manage platform users, roles, and audit trails</p>
      </div>

      <div className="space-y-6">
        <UserManagement />
        <AuditLog />
      </div>
    </div>
  );
}

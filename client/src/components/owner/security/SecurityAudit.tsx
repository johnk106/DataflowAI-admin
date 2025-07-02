import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityAudit() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Audit</h1>
        <p className="text-gray-600">Monitor security events and audit logs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500">Security audit features will be available here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
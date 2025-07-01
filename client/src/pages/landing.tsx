import { Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">DataFlow</h1>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Owner Console</h2>
              <p className="text-gray-600">
                Enterprise dashboard for managing tenants, pipelines, and system analytics
              </p>
            </div>

            <Button 
              onClick={handleLogin}
              className="w-full"
              size="lg"
            >
              Sign In to Continue
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Secure authentication powered by enterprise SSO
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

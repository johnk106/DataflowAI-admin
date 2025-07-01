import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has owner or admin role to access owner console
      if (user.role === 'owner' || user.role === 'admin') {
        window.location.href = "/owner";
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the owner console.",
          variant: "destructive",
        });
      }
    }
  }, [isAuthenticated, user, toast]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to DataFlow</h1>
        <p className="text-gray-600">Redirecting to owner console...</p>
      </div>
    </div>
  );
}

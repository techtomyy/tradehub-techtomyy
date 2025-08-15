import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { ReactNode } from "react";

interface SignupCardProps {
  children: ReactNode;
}

/**
 * Signup Card Component
 * 
 * Displays the main signup card with header information
 * including logo, title, and description.
 */
export function SignupCard({ children }: SignupCardProps) {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
        <p className="text-gray-600">Join AssetVault and start trading digital assets</p>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

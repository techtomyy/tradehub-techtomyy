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
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-2xl rounded-3xl overflow-hidden relative">
      {/* Professional accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      <CardHeader className="text-center pb-8 pt-12 px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300 group">
            <Shield className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 mb-3">Create Account</CardTitle>
        <p className="text-slate-600 text-lg">Join AssetVault and start trading digital assets</p>
      </CardHeader>
      <CardContent className="px-8 pb-12 relative z-10">
        {children}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { authApi, ApiError } from "@/lib/api";
import supabase from "@/config/client";
import { 
  SignupHeader,
  SignupCard,
  SignupForm,
  GoogleSignupButton
} from "@/components/signup";

export default function Signup() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  // Handle Google OAuth
  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast({
          title: "❌ Google Sign-up Failed",
          description: error.message,
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      } else {
        toast({
          title: "🔐 Google Sign-up Initiated",
          description: "Redirecting to Google for authentication...",
          className: "bg-blue-50 border-blue-200 text-blue-800",
        });
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast({
        title: "❌ Sign-up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (data: any) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Make API call
      const response = await authApi.signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        conditionagree: data.conditionagree,
      });
      
      // Check if signup was successful - handle different API response structures
      const isSuccess = response && (
        response.success === true || 
        (response as any).status === "success" || 
        response.message?.includes("successful") ||
        response.message?.includes("✅") ||
        response.message?.includes("created") ||
        response.message?.includes("registered")
      );
      
      if (isSuccess) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', data.email);
        
        // Show success message
        toast({
          title: "🎉 Account Created Successfully!",
          description: "Welcome to AssetVault! Redirecting to home page...",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Redirect to home page
        setTimeout(() => {
          setLocation("/home");
        }, 1500);
        
      } else {
        // Signup failed
        const errorMessage = response?.message || response?.error || "Signup failed. Please try again.";
        
        toast({
          title: "❌ Signup Failed",
          description: errorMessage,
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
      
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "❌ Signup Failed",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle geometric shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl"></div>
        
        {/* Subtle accent lines */}
        <div className="absolute top-1/4 left-0 w-48 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
        <div className="absolute bottom-1/4 right-0 w-48 h-px bg-gradient-to-l from-transparent via-indigo-400/30 to-transparent"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Landing */}
        <SignupHeader />

        {/* Signup Card */}
        <SignupCard>
          <SignupForm onSubmit={handleSubmit} isLoading={isLoading} />
        </SignupCard>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-6 bg-slate-900/80 backdrop-blur-sm text-white/60 font-medium">or continue with</span>
          </div>
        </div>

        {/* Google Signup */}
        <GoogleSignupButton onClick={handleGoogleSignup} isLoading={isLoading} />

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/80">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:text-blue-300 underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 
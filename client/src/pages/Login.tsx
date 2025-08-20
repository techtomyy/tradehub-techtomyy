import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import supabase from "@/config/client";
import { authApi, ApiError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
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
          title: "❌ Google Sign-in Failed",
          description: error.message,
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      } else {
        // Show initiation message
        toast({
          title: "🔐 Google Sign-in Initiated",
          description: "Redirecting to Google for authentication...",
          className: "bg-blue-50 border-blue-200 text-blue-800",
        });
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "❌ Sign-in Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (data: LoginForm) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Make API call
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });
      
      // Check if login was successful - handle different API response structures
      const isSuccess = response && (
        response.success === true || 
        (response as any).status === "success" || 
        response.message?.includes("successful") ||
        response.message?.includes("✅")
      );
      
      if (isSuccess) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', data.email);
        
        // Show success message
        toast({
          title: "🎉 Login Successful!",
          description: "Welcome back! Redirecting to home page...",
          className: "bg-green-50 border-green-200 text-green-800",
        });
        
        // Redirect to home page
        setLocation("/home");
        
      } else {
        // Login failed
        const errorMessage = response?.message || "Login failed. Please check your credentials.";
        
        toast({
          title: "❌ Login Failed",
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
        title: "❌ Login Failed",
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
        <Link href="/">
          <Button 
            variant="ghost" 
            className="mb-8 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-full px-6 border border-white/20 hover:border-white/40 shadow-sm hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-2xl rounded-3xl overflow-hidden relative">
          {/* Professional accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <CardHeader className="text-center pb-8 pt-12 px-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300 group">
                <Shield className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900 mb-3">
              Welcome Back
            </CardTitle>
            <p className="text-slate-600 text-lg">Sign in to your AssetVault account</p>
          </CardHeader>

          <CardContent className="px-8 pb-12 relative z-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700 mb-3 block">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="h-14 px-5 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-blue-400 hover:shadow-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700 mb-3 block">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-14 px-5 pr-14 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-blue-400 hover:shadow-md"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-10 w-10 rounded-xl hover:bg-blue-50 transition-all duration-200 text-slate-500 hover:text-blue-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded-lg border-2 border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500 data-[state=checked]:border-blue-500"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Link href="/forgot-password">
                    <Button variant="link" className="text-sm px-0 text-blue-600 hover:text-blue-700 font-medium hover:underline">
                      Forgot password?
                    </Button>
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-6 bg-white/95 backdrop-blur-sm text-slate-500 font-medium">or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 border-2 border-slate-200 hover:border-blue-400 bg-white/90 backdrop-blur-sm text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <FcGoogle className="h-6 w-6" />
                  <span className="font-semibold text-lg">
                    {isLoading ? "Signing in..." : "Sign in with Google"}
                  </span>
                </Button>

                <div className="text-center pt-6">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link href="/signup">
                      <Button variant="link" className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700 hover:underline text-lg">
                        Sign up
                      </Button>
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional info card */}
        <div className="mt-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
            <p className="text-xs text-slate-600">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline font-medium">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
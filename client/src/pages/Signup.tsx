import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import supabase from "@/config/client";
import { authApi, ApiError } from "@/lib/api";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  conditionagree: z.boolean().refine((val) => val === true, "You must agree to the terms"),
  marketingEmails: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      conditionagree: false,
      marketingEmails: false,
    },
  });

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
  const handleSubmit = async (data: SignupForm) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log("Attempting signup with:", { 
        email: data.email, 
        firstName: data.firstName, 
        lastName: data.lastName 
      });
      
      // Make API call
      const response = await authApi.signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        conditionagree: data.conditionagree,
      });
      
      console.log("API Response:", response);
      
      // Check if signup was successful
      if (response && response.success === true) {
        console.log("Signup successful, setting auth state...");
        
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
        const errorMessage = response?.message || "Signup failed. Please try again.";
        console.log("Signup failed:", errorMessage);
        
        toast({
          title: "❌ Signup Failed",
          description: errorMessage,
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Landing */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Signup Card */}
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms and Marketing */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="conditionagree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I agree to the{" "}
                            <Link href="/terms">
                              <Button variant="link" className="p-0 h-auto text-sm">
                                Terms of Service
                              </Button>
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy">
                              <Button variant="link" className="p-0 h-auto text-sm">
                                Privacy Policy
                              </Button>
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Send me marketing emails about new features and offers
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                >
                  <FcGoogle className="h-5 w-5" />
                  <span>Sign up with Google</span>
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login">
                      <Button variant="link" className="p-0 h-auto font-semibold">
                        Sign in
                      </Button>
                    </Link>
                  </p>
                </div>
              </form>
            </Form>

            {/* Benefits */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                Secure escrow protection for all transactions
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                Verified asset listings only
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                24/7 customer support
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
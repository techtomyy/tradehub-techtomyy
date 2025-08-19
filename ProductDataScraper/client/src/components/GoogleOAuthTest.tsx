import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FcGoogle } from "react-icons/fc";

export function GoogleOAuthTest() {
  const { toast } = useToast();
  const { handleGoogleOAuth, validateAuthentication } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  // Test environment variables
  const testEnvironment = () => {
    const envVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY ? "present" : "missing"
    };
    
    setTestResults({ type: "environment", data: envVars });
    
    if (!envVars.VITE_SUPABASE_URL || !envVars.VITE_SUPABASE_KEY) {
      toast({
        title: "❌ Environment Check Failed",
        description: "Missing required Supabase environment variables",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } else {
      toast({
        title: "✅ Environment Check Passed",
        description: "All required environment variables are present",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
  };

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    try {
      setIsLoading(true);
      
      // Import supabase client dynamically to test connection
      const { default: supabase } = await import("@/config/client");
      
      const { data, error } = await supabase.auth.getSession();
      
      const result = {
        type: "connection",
        data: { hasSession: !!data.session, user: data.session?.user?.email || "none" },
        error: error?.message || null
      };
      
      setTestResults(result);
      
      if (error) {
        toast({
          title: "❌ Connection Test Failed",
          description: error.message,
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      } else {
        toast({
          title: "✅ Connection Test Passed",
          description: "Successfully connected to Supabase",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
    } catch (error) {
      console.error("Connection test error:", error);
      toast({
        title: "❌ Connection Test Error",
        description: "Failed to test Supabase connection",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test Google OAuth
  const testGoogleOAuth = async () => {
    try {
      setIsLoading(true);
      
      const result = await handleGoogleOAuth();
      
      const testResult = {
        type: "oauth",
        data: result,
        timestamp: new Date().toISOString()
      };
      
      setTestResults(testResult);
      
      if (result.success) {
        toast({
          title: "✅ OAuth Test Passed",
          description: "Google OAuth initiated successfully",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        toast({
          title: "❌ OAuth Test Failed",
          description: result.message || "Google OAuth failed",
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    } catch (error) {
      console.error("OAuth test error:", error);
      toast({
        title: "❌ OAuth Test Error",
        description: "Unexpected error during OAuth test",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test authentication validation
  const testAuthValidation = async () => {
    try {
      setIsLoading(true);
      
      const isValid = await validateAuthentication();
      
      const result = {
        type: "validation",
        data: { isValid },
        timestamp: new Date().toISOString()
      };
      
      setTestResults(result);
      
      if (isValid) {
        toast({
          title: "✅ Auth Validation Passed",
          description: "Authentication validation successful",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        toast({
          title: "❌ Auth Validation Failed",
          description: "Authentication validation failed",
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    } catch (error) {
      console.error("Auth validation test error:", error);
      toast({
        title: "❌ Auth Validation Error",
        description: "Error during authentication validation",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test direct Supabase OAuth
  const testDirectSupabaseOAuth = async () => {
    try {
      setIsLoading(true);
      
      // Import supabase client directly
      const { default: supabase } = await import("@/config/client");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      const result = {
        type: "direct_oauth",
        data: { success: !error, error: error?.message || null },
        timestamp: new Date().toISOString()
      };
      
      setTestResults(result);
      
      if (error) {
        toast({
          title: "❌ Direct OAuth Failed",
          description: error.message,
          variant: "destructive",
          className: "bg-red-50 border-red-200 text-red-800",
        });
      } else {
        toast({
          title: "✅ Direct OAuth Success",
          description: "Supabase OAuth initiated successfully",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
    } catch (error) {
      console.error("Direct OAuth test error:", error);
      toast({
        title: "❌ Direct OAuth Error",
        description: "Unexpected error during direct OAuth test",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Google OAuth Debug Tool
        </CardTitle>
        <p className="text-sm text-gray-600">
          Use this tool to test and debug Google OAuth configuration
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Test Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={testEnvironment}
            variant="outline"
            disabled={isLoading}
          >
            🔍 Test Environment
          </Button>
          
          <Button 
            onClick={testSupabaseConnection}
            variant="outline"
            disabled={isLoading}
          >
            🌐 Test Connection
          </Button>
          
          <Button 
            onClick={testGoogleOAuth}
            variant="outline"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FcGoogle className="h-4 w-4" />
            Test OAuth (useAuth)
          </Button>
          
          <Button 
            onClick={testDirectSupabaseOAuth}
            variant="outline"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FcGoogle className="h-4 w-4" />
            Test Direct OAuth
          </Button>
          
          <Button 
            onClick={testAuthValidation}
            variant="outline"
            disabled={isLoading}
          >
            🔐 Test Auth
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Running test...</p>
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-2">
              <div>
                <Badge variant="outline">{testResults.type}</Badge>
                <span className="ml-2 text-sm text-gray-600">
                  {testResults.timestamp}
                </span>
              </div>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(testResults.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-600 space-y-2">
          <h4 className="font-semibold">Debugging Steps:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Test Environment - Check if environment variables are loaded</li>
            <li>Test Connection - Verify Supabase connection</li>
            <li>Test OAuth (useAuth) - Test through your custom hook</li>
            <li>Test Direct OAuth - Test Supabase OAuth directly</li>
            <li>Test Auth - Validate authentication state</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Check the browser console for detailed logs. 
              If you see environment variable errors, create a <code>.env</code> file 
              with your Supabase credentials.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

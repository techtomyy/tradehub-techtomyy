import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service (optional)
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

// Error Fallback Component
function ErrorFallback({ error, errorInfo }: { error: Error | null; errorInfo: ErrorInfo | null }) {
  const [, setLocation] = useLocation();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="bg-gray-100 p-3 rounded-md">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                Error Details (Development)
              </summary>
              <div className="text-xs text-gray-600 space-y-2">
                <div>
                  <strong>Error:</strong> {error.message}
                </div>
                {errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-col space-y-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" onClick={handleGoBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button variant="outline" onClick={handleGoHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              If this problem persists, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Route Error Boundary - Specific for routing errors
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Route Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                There was a problem loading this page. This might be due to a routing issue or missing component.
              </p>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                
                <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Network Error Boundary - For API/network related errors
export function NetworkErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Connection Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                Unable to connect to our servers. Please check your internet connection and try again.
              </p>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Connection
                </Button>
                
                <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

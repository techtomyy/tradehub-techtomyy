import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';
import { ErrorBoundaryProps, ErrorBoundaryState } from '@/types/error';
import { ErrorActionButtons } from './error/ErrorActionButtons';
import { DevelopmentErrorDetails } from './error/DevelopmentErrorDetails';
import { RouteErrorFallback } from './error/RouteErrorFallback';
import { NetworkErrorFallback } from './error/NetworkErrorFallback';

/**
 * Main Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the
 * component tree that crashed.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Static method to update state when an error occurs
   * 
   * @param error - The error that was thrown
   * @returns {ErrorBoundaryState} New state indicating an error occurred
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  /**
   * Lifecycle method called after an error is caught
   * 
   * @param error - The error that was thrown
   * @param errorInfo - Additional error information
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log error to external service (optional)
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error} 
          errorInfo={this.state.errorInfo} 
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 * 
 * Displays a user-friendly error message with options to retry,
 * go back, or return home.
 */
function ErrorFallback({ 
  error, 
  errorInfo 
}: { 
  error: Error | null; 
  errorInfo: ErrorInfo | null; 
}) {
  const [, setLocation] = useLocation();

  const handleRetry = (): void => {
    window.location.reload();
  };

  const handleGoHome = (): void => {
    setLocation('/');
  };

  const handleGoBack = (): void => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Something went wrong
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
          
          {/* Development error details */}
          {process.env.NODE_ENV === 'development' && error && (
            <DevelopmentErrorDetails error={error} errorInfo={errorInfo} />
          )}

          {/* Action buttons */}
          <ErrorActionButtons 
            onRetry={handleRetry}
            onGoBack={handleGoBack}
            onGoHome={handleGoHome}
          />

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

/**
 * Route Error Boundary Component
 * 
 * Specialized error boundary for routing errors.
 * Provides a more specific error message and recovery options.
 */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<RouteErrorFallback />}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Network Error Boundary Component
 * 
 * Specialized error boundary for network/API related errors.
 * Provides specific messaging for connection issues.
 */
export function NetworkErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<NetworkErrorFallback />}
    >
      {children}
    </ErrorBoundary>
  );
}

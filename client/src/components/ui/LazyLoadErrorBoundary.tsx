import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorLoader } from './loading';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary specifically designed for handling lazy loading errors
 * and other component loading failures
 */
export class LazyLoadErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('LazyLoadErrorBoundary caught an error:', error, errorInfo);
    
    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorLoader 
          error={this.state.error} 
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to handle lazy loading errors with retry functionality
 */
export function useLazyLoadErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error('Lazy loading error:', error);
  }, []);

  const retry = React.useCallback(() => {
    setError(null);
    setRetryCount(prev => prev + 1);
  }, []);

  const reset = React.useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    error,
    retryCount,
    handleError,
    retry,
    reset,
    hasError: !!error
  };
}


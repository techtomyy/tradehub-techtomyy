import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';

export interface RouteError {
  message: string;
  code?: string;
  path?: string;
  timestamp: Date;
  componentStack?: string;
}

export function useRouteError() {
  const [errors, setErrors] = useState<RouteError[]>([]);
  const [, setLocation] = useLocation();

  const addError = useCallback((error: Omit<RouteError, 'timestamp'>) => {
    const newError: RouteError = {
      ...error,
      timestamp: new Date(),
    };
    
    setErrors(prev => [...prev, newError]);
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Route Error:', newError);
    }
    
    // Optionally send to error reporting service
    // logErrorToService(newError);
  }, []);

  const clearError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleRouteError = useCallback((error: Error, errorInfo?: any) => {
    const routeError: Omit<RouteError, 'timestamp'> = {
      message: error.message,
      code: error.name,
      path: window.location.pathname,
      componentStack: errorInfo?.componentStack,
    };
    
    addError(routeError);
  }, [addError]);

  const navigateWithErrorHandling = useCallback((path: string) => {
    try {
      setLocation(path);
    } catch (error) {
      handleRouteError(error as Error);
    }
  }, [setLocation, handleRouteError]);

  return {
    errors,
    addError,
    clearError,
    clearAllErrors,
    handleRouteError,
    navigateWithErrorHandling,
    hasErrors: errors.length > 0,
    latestError: errors[errors.length - 1],
  };
}

// Error context for components that need access to route errors
export const createRouteErrorContext = () => {
  const context = {
    errors: [] as RouteError[],
    addError: (error: Omit<RouteError, 'timestamp'>) => {},
    clearError: (index: number) => {},
    clearAllErrors: () => {},
    handleRouteError: (error: Error, errorInfo?: any) => {},
    navigateWithErrorHandling: (path: string) => {},
    hasErrors: false,
    latestError: null as RouteError | null,
  };
  
  return context;
};

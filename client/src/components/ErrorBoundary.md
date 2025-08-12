# Error Boundary System

This document explains how to use the Error Boundary system for handling routing and component errors in the AssetVault application.

## Overview

The Error Boundary system provides comprehensive error handling for:
- **Component Errors**: JavaScript errors in React components
- **Routing Errors**: Navigation and route loading issues
- **Network Errors**: API and connection problems
- **General Errors**: Unexpected application errors

## Components

### 1. Main ErrorBoundary

The main `ErrorBoundary` component catches all JavaScript errors in its child component tree.

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 2. RouteErrorBoundary

Specifically designed for routing errors with a custom fallback UI.

```tsx
import { RouteErrorBoundary } from '@/components/ErrorBoundary';

<RouteErrorBoundary>
  <YourRoute />
</RouteErrorBoundary>
```

### 3. NetworkErrorBoundary

Handles network and API-related errors.

```tsx
import { NetworkErrorBoundary } from '@/components/ErrorBoundary';

<NetworkErrorBoundary>
  <YourAPIComponent />
</NetworkErrorBoundary>
```

## Usage Examples

### Basic Error Boundary

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
```

### Route-Specific Error Handling

```tsx
import { RouteErrorBoundary } from '@/components/ErrorBoundary';

function Dashboard() {
  return (
    <RouteErrorBoundary>
      <div className="dashboard">
        <DashboardContent />
      </div>
    </RouteErrorBoundary>
  );
}
```

### Custom Fallback UI

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

function CustomErrorFallback() {
  return (
    <div className="custom-error">
      <h2>Oops! Something went wrong</h2>
      <p>Please try refreshing the page.</p>
    </div>
  );
}

<ErrorBoundary fallback={<CustomErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

## Error Handling Hook

Use the `useRouteError` hook to manage route errors programmatically:

```tsx
import { useRouteError } from '@/hooks/useRouteError';

function MyComponent() {
  const { 
    errors, 
    addError, 
    clearError, 
    handleRouteError,
    navigateWithErrorHandling 
  } = useRouteError();

  const handleNavigation = () => {
    try {
      // Your navigation logic
      navigateWithErrorHandling('/dashboard');
    } catch (error) {
      handleRouteError(error);
    }
  };

  return (
    <div>
      {errors.map((error, index) => (
        <div key={index} className="error-message">
          {error.message}
          <button onClick={() => clearError(index)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}
```

## Error Types

### RouteError Interface

```tsx
interface RouteError {
  message: string;        // Error message
  code?: string;          // Error code/name
  path?: string;          // Route path where error occurred
  timestamp: Date;        // When the error occurred
  componentStack?: string; // React component stack trace
}
```

## Error Recovery Actions

The error boundaries provide several recovery options:

1. **Try Again**: Reload the current page
2. **Go Back**: Navigate to the previous page
3. **Go Home**: Navigate to the landing page
4. **Custom Actions**: Define your own recovery logic

## Development vs Production

### Development Mode
- Shows detailed error information
- Displays component stack traces
- Logs errors to console
- Provides debugging information

### Production Mode
- Shows user-friendly error messages
- Hides technical details
- Logs errors to external services (if configured)
- Focuses on user experience

## Best Practices

1. **Wrap Critical Components**: Always wrap important routes and components
2. **Use Specific Boundaries**: Use `RouteErrorBoundary` for routes, `NetworkErrorBoundary` for API calls
3. **Handle Errors Gracefully**: Provide clear recovery options
4. **Log Errors**: Use the error handling hook to track and manage errors
5. **Test Error Scenarios**: Test your error boundaries with intentional errors

## Configuration

### Environment Variables

```bash
# Enable detailed error logging in development
NODE_ENV=development

# Configure error reporting service (optional)
REACT_APP_ERROR_REPORTING_URL=https://your-error-service.com
```

### Custom Error Reporting

```tsx
// In ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // Send to your error reporting service
  if (process.env.REACT_APP_ERROR_REPORTING_URL) {
    fetch(process.env.REACT_APP_ERROR_REPORTING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error, errorInfo })
    });
  }
}
```

## Troubleshooting

### Common Issues

1. **Error Boundary Not Catching Errors**
   - Ensure the ErrorBoundary wraps the component tree
   - Check that errors are JavaScript errors, not async errors

2. **Infinite Error Loops**
   - Avoid setting state in error boundaries
   - Use conditional rendering to prevent re-renders

3. **Missing Error Information**
   - Check browser console for additional details
   - Verify error boundary placement

### Debug Mode

Enable debug mode to see more information:

```tsx
// Add to your component
console.log('Error Boundary Debug:', { error, errorInfo });
```

## Support

For issues with the Error Boundary system:
1. Check the browser console for error details
2. Verify component wrapping and imports
3. Test with simple components first
4. Review the error recovery flow

import { ErrorInfo } from "react";

interface DevelopmentErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo | null;
}

/**
 * Development Error Details Component
 * 
 * Shows detailed error information in development mode only.
 * Displays error message and component stack trace.
 */
export function DevelopmentErrorDetails({ error, errorInfo }: DevelopmentErrorDetailsProps) {
  return (
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
            <pre className="mt-1 whitespace-pre-wrap">
              {errorInfo.componentStack}
            </pre>
          </div>
        )}
      </div>
    </details>
  );
}

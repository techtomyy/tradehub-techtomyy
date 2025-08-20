import { Suspense, lazy } from "react";
import { Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AppLoader } from "@/components/ui/loading";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CurrencyProvider } from "@/lib/context/CurrencyContext";
import socket from "./socket/connection";
// Lazy load the main routes component
const AppRoutes = lazy(() => import("@/routes"));

/**
 * Main App Component
 * 
 * This component sets up the application's core structure including:
 * - Routing with Wouter
 * - Error boundary for graceful error handling
 * - Currency context for global currency management
 * - Toast notifications system
 * - Lazy loading for improved performance
 */
export default function App() {
  return (
    
    
    <Router>
      
      <ErrorBoundary>
        <CurrencyProvider>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<AppLoader />}>
              <AppRoutes />
            </Suspense>
            <Toaster />
          </div>
        </CurrencyProvider>
      </ErrorBoundary>
    </Router>
  );
}

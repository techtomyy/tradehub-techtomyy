import { Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/routes";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CurrencyProvider } from "@/lib/context/CurrencyContext";
import socket from "./socket/connection";
/**
 * Main App Component
 * 
 * This component sets up the application's core structure including:
 * - Routing with Wouter
 * - Error boundary for graceful error handling
 * - Currency context for global currency management
 * - Toast notifications system
 */
export default function App() {
  return (
    
    
    <Router>
      
      <ErrorBoundary>
        <CurrencyProvider>
          <div className="min-h-screen bg-background">
            <AppRoutes />
            <Toaster />
          </div>
        </CurrencyProvider>
      </ErrorBoundary>
    </Router>
  );
}

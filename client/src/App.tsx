import { Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/routes";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CurrencyProvider } from "@/lib/context/CurrencyContext";

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

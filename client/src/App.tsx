import { Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/routes";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <AppRoutes />
          <Toaster />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

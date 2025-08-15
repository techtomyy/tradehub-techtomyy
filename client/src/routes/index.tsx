import { Route, Switch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "./constants";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import CreateListing from "@/pages/CreateListing";
import ListingDetail from "@/pages/ListingDetail";
import Inbox from "@/pages/Inbox";
import Message from "@/pages/Message";
import Dispute from "@/pages/Dispute";
import AuthCallback from "@/pages/AuthCallback";
import NotFound from "@/pages/not-found";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";
import Wallet from "@/pages/wallet";
import Settings from "@/pages/settings";
import EscrowManagement from "@/pages/EscrowManagement";

// Types
interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
}

/**
 * Protected Route Component
 * 
 * Wraps components that require authentication.
 * Redirects to login if user is not authenticated.
 */
function ProtectedRoute({ 
  component: Component, 
  ...rest 
}: { 
  component: React.ComponentType<any>; 
  [key: string]: any; 
}) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Render protected component if authenticated
  return <Component {...rest} />;
}

// Route configurations
const PUBLIC_ROUTES_CONFIG: RouteConfig[] = [
  { path: PUBLIC_ROUTES.HOME, component: Landing },
  { path: PUBLIC_ROUTES.LOGIN, component: Login },
  { path: PUBLIC_ROUTES.SIGNUP, component: Signup },
  { path: PUBLIC_ROUTES.AUTH_CALLBACK, component: AuthCallback },
  // Temporarily making home public for testing
  { path: PROTECTED_ROUTES.HOME_PAGE, component: Home },
];

const PROTECTED_ROUTES_CONFIG: RouteConfig[] = [
  // { path: PROTECTED_ROUTES.HOME_PAGE, component: Home }, // Temporarily moved to public
  { path: PROTECTED_ROUTES.DASHBOARD, component: Dashboard },
  { path: PROTECTED_ROUTES.MARKETPLACE, component: Marketplace },
  { path: PROTECTED_ROUTES.CREATE_LISTING, component: CreateListing },
  { path: PROTECTED_ROUTES.LISTING_DETAIL, component: ListingDetail },
  { path: PROTECTED_ROUTES.INBOX, component: Inbox },
  { path: PROTECTED_ROUTES.MESSAGE, component: Message },
  { path: PROTECTED_ROUTES.DISPUTE, component: Dispute },
  { path: PROTECTED_ROUTES.WALLET, component: Wallet },
  { path: PROTECTED_ROUTES.SETTINGS, component: Settings },
  { path: PROTECTED_ROUTES.ESCROW_MANAGEMENT, component: EscrowManagement },
];

/**
 * App Routes Component
 * 
 * Main routing component that handles all application routes.
 * Includes public routes, protected routes, and a 404 fallback.
 */
export default function AppRoutes() {
  return (
    <Switch>
      {/* Public Routes - Accessible to all users */}
      {PUBLIC_ROUTES_CONFIG.map(({ path, component: Component }) => (
        <Route key={path} path={path}>
          <RouteErrorBoundary>
            <Component />
          </RouteErrorBoundary>
        </Route>
      ))}

      {/* Protected Routes - Require authentication */}
      {PROTECTED_ROUTES_CONFIG.map(({ path, component: Component }) => (
        <Route key={path} path={path}>
          <RouteErrorBoundary>
            <ProtectedRoute component={Component} />
          </RouteErrorBoundary>
        </Route>
      ))}

      {/* 404 Route - Catch all unmatched routes */}
      <Route path="*">
        <RouteErrorBoundary>
          <NotFound />
        </RouteErrorBoundary>
      </Route>
    </Switch>
  );
}

import { Route, Switch } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "./constants";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home"; // Added import for Home page
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

// Protected Route Component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>; [key: string]: any }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component {...rest} />;
}

// Public Routes Configuration
const publicRoutes = [
  { path: PUBLIC_ROUTES.HOME, component: Landing },
  { path: PUBLIC_ROUTES.LOGIN, component: Login },
  { path: PUBLIC_ROUTES.SIGNUP, component: Signup },
  { path: PUBLIC_ROUTES.AUTH_CALLBACK, component: AuthCallback },
  // Temporarily making home public for testing
  { path: PROTECTED_ROUTES.HOME_PAGE, component: Home },
];

// Protected Routes Configuration
const protectedRoutes = [
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
];

export default function AppRoutes() {
  return (
    <Switch>
      {/* Public Routes */}
      {publicRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path}>
          <RouteErrorBoundary>
            <Component />
          </RouteErrorBoundary>
        </Route>
      ))}

      {/* Protected Routes */}
      {protectedRoutes.map(({ path, component: Component }) => (
        <Route key={path} path={path}>
          <RouteErrorBoundary>
            <ProtectedRoute component={Component} />
          </RouteErrorBoundary>
        </Route>
      ))}

      {/* 404 Route */}
      <Route path="*">
        <RouteErrorBoundary>
          <NotFound />
        </RouteErrorBoundary>
      </Route>
    </Switch>
  );
}

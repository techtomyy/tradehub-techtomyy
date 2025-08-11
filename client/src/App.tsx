import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import Marketplace from "@/pages/Marketplace";
import ListingDetail from "@/pages/ListingDetail";
import CreateListing from "@/pages/CreateListing";
import Dashboard from "@/pages/Dashboard";
import Inbox from "@/pages/Inbox";
import NotFound from "@/pages/not-found";
import Message from "./pages/Message";
import Dispute from "./pages/Dispute";
import Wallet from "./pages/wallet";
import Settings from "./pages/settings";
import AuthCallback from "./pages/AuthCallback";


function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Public routes - always accessible */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/auth/callback" component={AuthCallback} />

      {/* Root path - redirect based on authentication */}
      {isAuthenticated ? (
        <Route path="/" component={Dashboard} />
      ) : (
        <Route path="/" component={Landing} />
      )}

      {/* Protected routes - only for authenticated users */}
      {isAuthenticated ? (
        <>
          <Route path="/home" component={Home} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/listing/:id" component={ListingDetail} />
          <Route path="/create-listing" component={CreateListing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/wallet" component={Wallet} />
          <Route path="/inbox" component={Inbox} />
          <Route path="/settings" component={Settings} />
          <Route path="/message/:id" component={Message} />
          <Route path="/dispute/:transactionId" component={Dispute} />

        </>
      ) : (
        <>

          <Route path="/home" component={Landing} />
          <Route path="/marketplace" component={Landing} />
          <Route path="/listing/:id" component={Landing} />
          <Route path="/create-listing" component={Landing} />
          <Route path="/dashboard" component={Landing} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;

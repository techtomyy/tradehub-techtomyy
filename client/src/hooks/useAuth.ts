import { useState, useEffect } from "react";
import supabase from "@/config/client";
import { User } from "@supabase/supabase-js";
import { PROTECTED_ROUTES } from "@/routes/constants";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      // Check for demo session first
      const demoSession = localStorage.getItem('demoSession');
      if (demoSession) {
        try {
          const sessionData = JSON.parse(demoSession);
          const sessionAge = new Date().getTime() - new Date(sessionData.timestamp).getTime();
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            console.log("Demo session found, restoring authentication");
            setIsAuthenticated(true);
            setUser(null); // Will trigger fallback to demo user data
            setIsLoading(false);
            return;
          } else {
            console.log("Demo session expired, clearing");
            localStorage.removeItem('demoSession');
          }
        } catch (error) {
          console.error("Error parsing demo session:", error);
          localStorage.removeItem('demoSession');
        }
      }
      
      // Check for Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Debug authentication state changes
  useEffect(() => {
    console.log("Authentication state changed:", { 
      isAuthenticated, 
      user: user?.email,
      isLoading,
      currentPath: window.location.pathname
    });
  }, [isAuthenticated, user, isLoading]);

  // User data from Supabase or fallback to demo data
  const userData = user || {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    firstName: "Demo",
    lastName: "User",
    username: "demouser",
    profileImageUrl: "",
    rating: 4.5,
    totalSales: 8,
    kycVerified: true,
    bio: "Experienced digital asset trader.",
  };

  const logout = async () => {
    try {
      // Clear demo session if it exists
      localStorage.removeItem('demoSession');
      
      // Sign out from Supabase if there's a session
      await supabase.auth.signOut();
      
      // Reset local state
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const login = () => {
    // This is now handled by Supabase OAuth
    // The auth state will be updated automatically
  };

  const demoLogin = () => {
   
     // Set authentication state to true
    setIsAuthenticated(true);
    
    // Set user to null to trigger the fallback to demo user data
    // This provides a proper demo user with all the expected properties
    setUser(null);
    
    // Store demo session in localStorage for persistence
    localStorage.setItem('demoSession', JSON.stringify({
      isAuthenticated: true,
      timestamp: new Date().toISOString()
    }));
    
    // Redirect to home page after successful demo login
    setTimeout(() => {
      console.log("Redirecting to home page...");
      window.location.href = "/home";
    }, 1000);
  };

  return {
    user: userData,
    isLoading,
    isAuthenticated,
    logout,
    login,
    demoLogin,
  };
}

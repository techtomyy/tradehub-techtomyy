import { useState, useEffect } from "react";
import supabase from "@/config/client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
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
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const login = () => {
    // This is now handled by Supabase OAuth
    // The auth state will be updated automatically
  };

  return {
    user: userData,
    isLoading,
    isAuthenticated,
    logout,
    login,
  };
}

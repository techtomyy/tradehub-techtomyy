import { useState, useEffect } from "react";
import supabase from "@/config/client";
import { User } from "@supabase/supabase-js";
import { PROTECTED_ROUTES } from "@/routes/constants";
import { authApi } from "@/lib/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      // Check for API authentication first
      const isApiAuthenticated = localStorage.getItem('isAuthenticated');
      const userEmail = localStorage.getItem('userEmail');
      if (isApiAuthenticated === 'true' && userEmail) {
        console.log("API authentication found, restoring session");
        setIsAuthenticated(true);
        // Create a user object for API authentication
        const apiUser = {
          id: 'api-user',
          email: userEmail,
          user_metadata: {
            full_name: userEmail.split('@')[0],
          },
        };
        setUser(apiUser as any);
        setIsLoading(false);
        return;
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

  // User data from Supabase or API
  const userData = user || null;

  const logout = async () => {
    try {
      // Clear API authentication
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      

      
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

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.success) {
        setIsAuthenticated(true);
        // You might want to store user data from the response here
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  };



  return {
    user: userData,
    isLoading,
    isAuthenticated,
    logout,
    login,
  };
}

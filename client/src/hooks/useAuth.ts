import { useState, useEffect } from "react";
import supabase from "@/config/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { PROTECTED_ROUTES } from "@/routes/constants";
import { authApi } from "@/lib/api";
import { User } from "@/types/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to create a basic user object from email
  const createBasicUser = (email: string): User => {
    return {
      id: 'api-user',
      firstName: email.split('@')[0],
      lastName: '',
      email: email,
      profileImageUrl: undefined,
      kycVerified: false,
    };
  };

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      // Check for API authentication first
      const isApiAuthenticated = localStorage.getItem('isAuthenticated');
      const userEmail = localStorage.getItem('userEmail');
      if (isApiAuthenticated === 'true' && userEmail) {
        setIsAuthenticated(true);
        // Create basic user object from email
        const userData = createBasicUser(userEmail);
        setUser(userData);
        setIsLoading(false);
        return;
      }
      

      
      // Check for Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        // For Supabase users, create a compatible user object
        const supabaseUser: User = {
          id: session.user.id,
          firstName: session.user.user_metadata?.full_name?.split(' ')[0] || session.user.email?.split('@')[0] || 'User',
          lastName: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          email: session.user.email || '',
          profileImageUrl: session.user.user_metadata?.avatar_url,
          kycVerified: false,
        };
        setUser(supabaseUser);
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsAuthenticated(true);
          // Create compatible user object for Supabase
          const supabaseUser: User = {
            id: session.user.id,
            firstName: session.user.user_metadata?.full_name?.split(' ')[0] || session.user.email?.split('@')[0] || 'User',
            lastName: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            email: session.user.email || '',
            profileImageUrl: session.user.user_metadata?.avatar_url,
            kycVerified: false,
          };
          setUser(supabaseUser);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);



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
        // Create basic user object from email after successful login
        const userData = createBasicUser(email);
        setUser(userData);
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

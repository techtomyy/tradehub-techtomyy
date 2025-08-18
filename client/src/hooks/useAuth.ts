import { useState, useEffect } from "react";
import supabase from "@/config/client";
import { User } from "@supabase/supabase-js";
import { PROTECTED_ROUTES } from "@/routes/constants";
import { authApi, UserProfile } from "@/lib/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile from API
  const fetchUserProfile = async (email: string): Promise<UserProfile | null> => {
    try {
      // Try to get user profile first
      const profileResponse = await authApi.getUserProfile();
      if (profileResponse.success && profileResponse.data) {
        return profileResponse.data;
      }
      
      // Fallback to current user endpoint
      const currentUserResponse = await authApi.getCurrentUser();
      if (currentUserResponse.success && currentUserResponse.data) {
        return currentUserResponse.data;
      }
      
      // If both endpoints fail, return null
      return null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      // Check for API authentication first
      const isApiAuthenticated = localStorage.getItem('isAuthenticated');
      const userEmail = localStorage.getItem('userEmail');
      const authToken = localStorage.getItem('authToken');
      
      if (isApiAuthenticated === 'true' && userEmail && authToken) {
        console.log("API authentication found, restoring session");
        setIsAuthenticated(true);
        
        // Check if we have stored user data
        const storedUserData = localStorage.getItem('userData');
        let userProfile: UserProfile | null = null;
        
        if (storedUserData) {
          try {
            userProfile = JSON.parse(storedUserData);
          } catch (error) {
            console.warn('Failed to parse stored user data:', error);
          }
        }
        
        // If no stored data, try to fetch from API
        if (!userProfile) {
          userProfile = await fetchUserProfile(userEmail);
        }
        
        if (userProfile) {
          // Create a user object with profile data
          const apiUser = {
            id: userProfile.id,
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            profileImageUrl: userProfile.profileImageUrl,
            kycVerified: userProfile.kycVerified,
            user_metadata: {
              full_name: `${userProfile.firstName} ${userProfile.lastName}`,
            },
          };
          setUser(apiUser as any);
          
          // Store user data in localStorage for future use
          localStorage.setItem('userData', JSON.stringify(userProfile));
        } else {
          // Fallback to basic user object if profile fetch fails
          const apiUser = {
            id: 'api-user',
            email: userEmail,
            firstName: userEmail.split('@')[0], // Use email prefix as first name
            lastName: '', // Empty last name
            user_metadata: {
              full_name: userEmail.split('@')[0],
            },
          };
          setUser(apiUser as any);
        }
        
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
      userFirstName: (user as any)?.firstName,
      userLastName: (user as any)?.lastName,
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      

      
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
        // Store authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        // Store auth token if provided in response
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        // Check if user data is included in login response
        let userProfile: UserProfile | null = null;
        if (response.data?.user) {
          console.log('Login - User data found in response:', response.data.user);
          userProfile = response.data.user;
        } else {
          console.log('Login - No user data in response, fetching profile...');
          // Try to fetch user profile from API
          userProfile = await fetchUserProfile(email);
        }
        
        console.log('Login - Final user profile:', userProfile);
        
        if (userProfile) {
          // Create a user object with profile data
          const apiUser = {
            id: userProfile.id,
            email: userProfile.email,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            profileImageUrl: userProfile.profileImageUrl,
            kycVerified: userProfile.kycVerified,
            user_metadata: {
              full_name: `${userProfile.firstName} ${userProfile.lastName}`,
            },
          };
          setUser(apiUser as any);
          
          // Store user data in localStorage for future use
          localStorage.setItem('userData', JSON.stringify(userProfile));
        } else {
          // Fallback to basic user object if profile fetch fails
          const apiUser = {
            id: 'api-user',
            email: email,
            firstName: email.split('@')[0], // Use email prefix as first name
            lastName: '', // Empty last name
            user_metadata: {
              full_name: email.split('@')[0],
            },
          };
          setUser(apiUser as any);
        }
        
        setIsAuthenticated(true);
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

import { useState, useEffect } from "react";

export function useAuth() {
  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('isAuthenticated');
    return stored ? JSON.parse(stored) : true; // Default to true for demo
  });

  // Update localStorage when authentication state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Static user data
  const user = {
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

  const logout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    
    // Set authentication to false
    setIsAuthenticated(false);
    
    // Redirect to landing page
    window.location.href = '/';
  };

  const login = () => {
    // Set authentication to true
    setIsAuthenticated(true);
  };

  return {
    user,
    isLoading: false,
    isAuthenticated,
    logout,
    login,
  };
}

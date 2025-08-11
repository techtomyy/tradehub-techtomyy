import { useEffect } from "react";
import { useLocation } from "wouter";
import supabase from "@/config/client";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }
      if (data?.session) {
        console.log("User session:", data.session);

        // Send token to backend for verification
        try {
          await fetch("https://tradehub-techtomyy-production.up.railway.app/auth/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Backend verification failed:", error);
        }
        
        // Navigate to Home after successful authentication
        setLocation("/home");
      }
    }
    getSession();
  }, [setLocation]);

  return <h2>Logging in...</h2>;
}

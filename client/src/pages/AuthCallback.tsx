import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import supabase from "@/config/client";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }
      if (data?.session) {
        console.log("User session:", data.session);

        const access_token = data.session.access_token; // 👈 token le liya

        // Send token to backend for verification
        try {
          await fetch("https://tradehub-techtomyy-production.up.railway.app/auth/api", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${access_token}`, // 👈 yahan bhejna hoga
            },
          });
        } catch (error) {
          console.error("Backend verification failed:", error);
        }

        // Show success toast for Google sign-in
        toast({
          title: "✅ Google Sign-in Successful!",
          description: "Welcome back! Redirecting to home page...",
          className: "bg-green-50 border-green-200 text-green-800",
        });

        // Navigate to Home after successful authentication
        setTimeout(() => {
          setLocation("/home");
        }, 1500);
      }
    }
    getSession();
  }, [setLocation, toast]);

  return <h2>Logging in...</h2>;
}

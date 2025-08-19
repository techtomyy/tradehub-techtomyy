import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

/**
 * Signup Header Component
 * 
 * Displays the header section with back button for the signup page.
 */
export function SignupHeader() {
  return (
    <Link href="/">
      <Button 
        variant="ghost" 
        className="mb-8 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-full px-6 border border-white/20 hover:border-white/40 shadow-sm hover:shadow-lg"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
    </Link>
  );
}

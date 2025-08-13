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
      <Button variant="ghost" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
    </Link>
  );
}

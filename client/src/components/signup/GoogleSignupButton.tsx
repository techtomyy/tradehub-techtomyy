import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignupButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

/**
 * Google Signup Button Component
 * 
 * Displays a Google OAuth signup button with
 * the Google icon and loading state.
 */
export function GoogleSignupButton({ onClick, isLoading }: GoogleSignupButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
      disabled={isLoading}
    >
      <FcGoogle className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Continue with Google"}
    </Button>
  );
}

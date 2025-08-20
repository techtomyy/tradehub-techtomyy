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
      className="w-full h-14 border-2 border-white/20 hover:border-blue-400 bg-white/10 backdrop-blur-sm text-white hover:text-blue-300 hover:bg-blue-50/10 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
      onClick={onClick}
      disabled={isLoading}
    >
      <FcGoogle className="h-6 w-6" />
      <span className="font-semibold text-lg">
        {isLoading ? "Connecting..." : "Continue with Google"}
      </span>
    </Button>
  );
}

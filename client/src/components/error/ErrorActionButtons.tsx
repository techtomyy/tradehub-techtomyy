import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft, Home } from "lucide-react";

interface ErrorActionButtonsProps {
  onRetry: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
}

/**
 * Error Action Buttons Component
 * 
 * Provides action buttons for error recovery including retry,
 * go back, and go home options.
 */
export function ErrorActionButtons({ 
  onRetry, 
  onGoBack, 
  onGoHome 
}: ErrorActionButtonsProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Button onClick={onRetry} className="w-full">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
      
      <Button variant="outline" onClick={onGoBack} className="w-full">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </Button>
      
      <Button variant="outline" onClick={onGoHome} className="w-full">
        <Home className="w-4 h-4 mr-2" />
        Go Home
      </Button>
    </div>
  );
}

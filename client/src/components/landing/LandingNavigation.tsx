import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Landing Navigation Component
 * 
 * Displays the navigation bar for the landing page
 * with logo and sign-in button.
 */
export function LandingNavigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">AssetVault</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

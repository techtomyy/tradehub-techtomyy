import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

/**
 * Create Listing Header Component
 * 
 * Displays the header section with back button, title, and description
 * for the create listing page.
 */
export function CreateListingHeader() {
  return (
    <div className="mb-8">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-4 hover-golden">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Digital Asset</h1>
      <p className="text-gray-600">
        Create a listing for your digital asset. All listings go through verification before being published.
      </p>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Link } from "wouter";

/**
 * Empty Listings State Component
 * 
 * Displays when there are no listings to show,
 * with a call-to-action to create the first listing.
 */
export function EmptyListingsState() {
  return (
    <div className="col-span-full text-center py-12">
      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
      <p className="text-gray-600 mb-6">Start by creating your first listing</p>
      <Link href="/create-listing">
        <Button>Create Your First Listing</Button>
      </Link>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { UserListing } from "@/types/dashboard";
import { DashboardListingCard } from "./DashboardListingCard";
import { EmptyListingsState } from "./EmptyListingsState";

interface ListingsTabProps {
  userListings: UserListing[];
  getStatusColor: (status: string) => string;
  getCategoryIcon: (category: string) => string;
}

/**
 * Listings Tab Component
 * 
 * Displays the listings tab with a grid of user listings
 * and options to create new listings.
 */
export function ListingsTab({ 
  userListings, 
  getStatusColor, 
  getCategoryIcon 
}: ListingsTabProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
        <Link href="/create-listing">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Listing
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userListings?.map((listing) => (
          <DashboardListingCard 
            key={listing.id} 
            listing={listing} 
            getStatusColor={getStatusColor} 
            getCategoryIcon={getCategoryIcon} 
          />
        ))}
        
        {(!userListings || userListings.length === 0) && (
          <EmptyListingsState />
        )}
      </div>
    </>
  );
}

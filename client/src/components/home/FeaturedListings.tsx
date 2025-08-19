import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ListingCard from "@/components/ListingCard";

interface FeaturedListing {
  id: number;
  title: string;
  price: string;
  category: string;
  followers: number;
  engagement: number;
  verified: boolean;
  featured: boolean;
}

interface FeaturedListingsProps {
  featuredListings: FeaturedListing[];
}

/**
 * Featured Listings Component
 * 
 * Displays a section of featured listings with a grid layout
 * and a link to view all listings.
 */
export function FeaturedListings({ featuredListings }: FeaturedListingsProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
          <Link href="/marketplace">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section className="py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-7 md:mb-8">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">Featured Listings</h2>
          <Link href="/marketplace">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {featuredListings.slice(0, 6).map((listing) => (
            <ListingCard 
              key={listing.id} 
              listing={{
                id: listing.id.toString(),
                title: listing.title,
                description: `${listing.category} account with ${listing.followers.toLocaleString()} followers and ${listing.engagement}% engagement`,
                category: listing.category,
                price: parseFloat(listing.price),
                followers: listing.followers,
                engagement: listing.engagement.toString(),
                verificationStatus: listing.verified ? 'verified' : 'unverified',
                status: 'active',
                featured: listing.featured,
                sellerId: 'demo-seller',
                seller: {
                  rating: '4.5',
                  totalSales: 10
                }
              }} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { UserListing } from "@/types/dashboard";

interface DashboardListingCardProps {
  listing: UserListing;
  getStatusColor: (status: string) => string;
  getCategoryIcon: (category: string) => string;
}

/**
 * Dashboard Listing Card Component
 * 
 * Displays a single listing card in the dashboard listings tab
 * with status, category, title, description, and price.
 */
export function DashboardListingCard({ 
  listing, 
  getStatusColor, 
  getCategoryIcon 
}: DashboardListingCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={getStatusColor(listing.status)}>
            {listing.status}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {listing.category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${parseFloat(listing.price.toString()).toLocaleString()}
          </span>
          <Link href={`/listing/${listing.id}`}>
            <Button size="sm" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

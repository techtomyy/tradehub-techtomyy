import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { UserListing } from "@/types/dashboard";

interface RecentListingsProps {
  listings: UserListing[];
  getStatusColor: (status: string) => string;
  getCategoryIcon: (category: string) => string;
  onViewAll: () => void;
}

/**
 * Recent Listings Component
 * 
 * Displays a card showing recent listings with options
 * to view all listings.
 */
export function RecentListings({ 
  listings, 
  getStatusColor, 
  getCategoryIcon,
  onViewAll
}: RecentListingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Listings
          <Button variant="ghost" size="sm" onClick={onViewAll} className="hover-golden">
            View All <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {listings?.slice(0, 3).map((listing) => (
            <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">
                    {getCategoryIcon(listing.category)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                  <p className="text-xs text-gray-500">${listing.price}</p>
                </div>
              </div>
              <Badge className={getStatusColor(listing.status)}>
                {listing.status}
              </Badge>
            </div>
          ))}
          {(!listings || listings.length === 0) && (
            <p className="text-gray-500 text-center py-4">No listings yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

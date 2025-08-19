import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Star } from "lucide-react";
import { Listing } from "@/types/listing";

interface SellerInfoCardProps {
  listing: Listing;
}

/**
 * Seller Info Card Component
 * 
 * Displays detailed information about the seller including profile,
 * rating, verification status, and bio.
 */
export function SellerInfoCard({ listing }: SellerInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={listing.seller.profileImageUrl} />
            <AvatarFallback>
                              {listing.seller.firstName?.[0] || ''}{listing.seller.lastName?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {listing.seller.firstName} {listing.seller.lastName}
            </h3>
            
            {listing.seller.username && (
              <p className="text-gray-600">@{listing.seller.username}</p>
            )}
            
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600">
                {listing.seller.rating || '0.0'} ({listing.seller.totalSales || 0} sales)
              </span>
              
              {listing.seller.kycVerified && (
                <Badge variant="outline" className="ml-2">
                  <Shield className="h-3 w-3 mr-1" /> 
                  KYC Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {listing.seller.bio && (
          <p className="text-gray-600 mt-4">{listing.seller.bio}</p>
        )}
      </CardContent>
    </Card>
  );
}

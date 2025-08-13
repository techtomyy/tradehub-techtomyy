import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { Listing } from "@/types/listing";

interface AssetCardProps {
  listing: Listing;
  getCategoryIcon: (category: string) => string;
}

/**
 * Asset Card Component
 * 
 * Displays the main asset information including media, title, description,
 * and statistics in a card format.
 */
export function AssetCard({ listing, getCategoryIcon }: AssetCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        {/* Media Section */}
        <div className="relative">
          {listing.media[0] ? (
            <img 
              src={listing.media[0]} 
              alt={listing.title} 
              className="w-full h-64 object-cover rounded-t-lg" 
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
              <span className="text-6xl">{getCategoryIcon(listing.category)}</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="capitalize">
              {listing.category}
            </Badge>
          </div>
          
          {/* Verification Badge */}
          {listing.verificationStatus === 'verified' && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-emerald-500">
                <CheckCircle className="h-3 w-3 mr-1" /> 
                Verified
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {listing.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {listing.description}
          </p>
          
          {/* Stats Grid */}
          <StatsGrid listing={listing} />
        </div>
      </CardContent>
    </Card>
  );
}

// Component: Stats Grid
function StatsGrid({ listing }: { listing: Listing }) {
  const { Users, TrendingUp, Eye, DollarSign } = require("lucide-react");
  
  const stats = [
    {
      icon: Users,
      value: listing.followers?.toLocaleString(),
      label: "Followers",
      show: !!listing.followers
    },
    {
      icon: TrendingUp,
      value: `${listing.engagement}%`,
      label: "Engagement",
      show: !!listing.engagement
    },
    {
      icon: Eye,
      value: listing.monthlyViews?.toLocaleString(),
      label: "Monthly Views",
      show: !!listing.monthlyViews
    },
    {
      icon: DollarSign,
      value: `$${listing.monthlyRevenue}`,
      label: "Monthly Revenue",
      show: !!listing.monthlyRevenue
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => 
        stat.show && (
          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
            <stat.icon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-900">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500">
              {stat.label}
            </div>
          </div>
        )
      )}
    </div>
  );
}

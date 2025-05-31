import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Eye, DollarSign, Star, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: string;
    followers?: number;
    engagement?: string;
    monthlyViews?: number;
    monthlyRevenue?: string;
    media?: string[];
    verificationStatus: string;
    status: string;
    featured?: boolean;
    sellerId: string;
    seller?: {
      rating?: string;
      totalSales?: number;
    };
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'instagram': return '📷';
      case 'youtube': return '📹';
      case 'tiktok': return '🎵';
      case 'twitter': return '🐦';
      case 'website': return '🌐';
      default: return '💻';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'youtube': return 'bg-red-100 text-red-800';
      case 'tiktok': return 'bg-gray-100 text-gray-800';
      case 'twitter': return 'bg-blue-100 text-blue-800';
      case 'website': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const price = parseFloat(listing.price);

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative">
        {listing.media && listing.media[0] ? (
          <img
            src={listing.media[0]}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
            <span className="text-6xl">{getCategoryIcon(listing.category)}</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <Badge className={getCategoryColor(listing.category)}>
            {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
          </Badge>
        </div>
        
        <div className="absolute top-3 right-3">
          {listing.verificationStatus === 'verified' && (
            <Badge className="bg-emerald-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {listing.featured && (
            <Badge className="bg-amber-500 text-white ml-1">
              Featured
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          {listing.seller && (
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{listing.seller.rating || '0.0'}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {listing.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {listing.followers && (
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {listing.followers.toLocaleString()}
              </span>
            )}
            {listing.engagement && (
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {listing.engagement}%
              </span>
            )}
            {listing.monthlyViews && (
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {listing.monthlyViews.toLocaleString()}
              </span>
            )}
            {listing.monthlyRevenue && (
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                ${listing.monthlyRevenue}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">+ fees</span>
          </div>
          <Link href={`/listing/${listing.id}`}>
            <Button 
              className="bg-primary text-white hover:bg-blue-700 transition-colors"
              size="sm"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

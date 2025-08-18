import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { Users, TrendingUp, Eye, DollarSign, Star, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number; // Changed from string to number since we're now passing converted prices
    followers?: number;
    engagement?: string;
    monthlyViews?: number;
    monthlyRevenue?: number; // Changed from string to number for consistency
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
  const { selectedCurrency, formatAmount } = useCurrency();
  
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

  // Price is already converted to the selected currency from the parent component
  const price = listing.price;

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
          <div className="grid grid-cols-2 gap-2 w-full">
            {listing.followers && (
              <span className="flex items-center flex-shrink-0 max-w-full">
                <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate text-sm text-gray-500">{listing.followers.toLocaleString()}</span>
              </span>
            )}
            {listing.engagement && (
              <span className="flex items-center flex-shrink-0 max-w-full">
                <TrendingUp className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate text-sm text-gray-500">{listing.engagement}%</span>
              </span>
            )}
            {listing.monthlyViews && (
              <span className="flex items-center flex-shrink-0 max-w-full">
                <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate text-sm text-gray-500">{listing.monthlyViews.toLocaleString()}</span>
              </span>
            )}
            {listing.monthlyRevenue && (
              <span className="flex items-center flex-shrink-0 max-w-full">
                <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate text-sm text-gray-500">{formatAmount(typeof listing.monthlyRevenue === 'number' ? listing.monthlyRevenue : 0, selectedCurrency)}</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatAmount(typeof price === 'number' && !isNaN(price) ? price : 0, selectedCurrency)}
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

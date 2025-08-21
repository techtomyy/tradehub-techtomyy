import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { useLazyImage } from "@/hooks/useLazyImage";
import { Users, TrendingUp, Eye, DollarSign, Star, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
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
  const { imageRef, isInView, isLoaded, hasError } = useLazyImage({
    rootMargin: '50px',
    threshold: 0.1
  });

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
      case 'instagram': return 'from-pink-500 to-rose-600';
      case 'youtube': return 'from-red-500 to-pink-600';
      case 'tiktok': return 'from-gray-500 to-slate-600';
      case 'twitter': return 'from-blue-500 to-indigo-600';
      case 'website': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  // Price is already converted to the selected currency from the parent component
  const price = listing.price;

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative">
        {listing.media && listing.media[0] ? (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            {isInView && (
              <img
                ref={imageRef}
                src={listing.media[0]}
                alt={listing.title}
                className={`w-full h-48 object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                loading="lazy"
              />
            )}
            {!isLoaded && isInView && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
              </div>
            )}
            {hasError && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-2xl mb-2">📷</div>
                  <div className="text-sm">Image unavailable</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
            <span className="text-6xl">{getCategoryIcon(listing.category)}</span>
          </div>
        )}

          {/* Enhanced Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Category Badge */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Badge className={`bg-gradient-to-r ${getCategoryColor(listing.category)} text-white border-0 shadow-lg px-3 py-1`}>
                {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
              </Badge>
            </motion.div>
            
            {/* Status Badges */}
            <div className="flex gap-2 items-center">
              {listing.verificationStatus === 'verified' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </motion.div>
              )}
              {listing.featured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
            {/* Heart Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
            >
              <Heart className="w-4 h-4" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>
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

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-500 w-full">
            {listing.followers && (
              <span className="flex items-center text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {listing.followers.toLocaleString()}
              </span>
            )}
            {listing.engagement && (
              <span className="flex items-center text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {listing.engagement}%
              </span>
            )}
            {listing.monthlyViews && (
              <span className="flex items-center text-xs sm:text-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {listing.monthlyViews.toLocaleString()}
              </span>
            )}
            {listing.monthlyRevenue && (
              <span className="flex items-center text-xs sm:text-sm">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {formatAmount(typeof listing.monthlyRevenue === 'number' ? listing.monthlyRevenue : 0, selectedCurrency)}
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

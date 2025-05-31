import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  TrendingUp, 
  Eye, 
  DollarSign, 
  Shield, 
  Star, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: [`/api/listings/${id}`],
  });

  const { data: fees } = useQuery({
    queryKey: [`/api/calculate-fees`],
    queryFn: async () => {
      if (!listing?.price) return null;
      const response = await apiRequest("POST", "/api/calculate-fees", {
        amount: listing.price,
      });
      return response.json();
    },
    enabled: !!listing?.price,
  });

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/transactions", {
        listingId: id,
        amount: listing.price,
      });
      return response.json();
    },
    onSuccess: (transaction) => {
      toast({
        title: "Purchase Initiated",
        description: "Your payment has been placed in escrow. The seller will provide asset credentials shortly.",
      });
      // Redirect to transaction page or dashboard
      window.location.href = `/dashboard`;
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePurchase = async () => {
    if (!user) {
      window.location.href = '/api/login';
      return;
    }
    
    if (listing?.sellerId === user.id) {
      toast({
        title: "Cannot Purchase",
        description: "You cannot purchase your own listing.",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    try {
      await purchaseMutation.mutateAsync();
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Listing Not Found</h2>
            <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
            <Link href="/marketplace">
              <Button>Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Asset Preview */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="relative">
                  {listing.media && listing.media[0] ? (
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
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="capitalize">
                      {listing.category}
                    </Badge>
                  </div>
                  {listing.verificationStatus === 'verified' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
                  <p className="text-gray-600 mb-6">{listing.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {listing.followers && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">
                          {listing.followers.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                    )}
                    {listing.engagement && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">
                          {listing.engagement}%
                        </div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    )}
                    {listing.monthlyViews && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Eye className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">
                          {listing.monthlyViews.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Monthly Views</div>
                      </div>
                    )}
                    {listing.monthlyRevenue && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                        <div className="text-sm font-medium text-gray-900">
                          ${listing.monthlyRevenue}
                        </div>
                        <div className="text-xs text-gray-500">Monthly Revenue</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={listing.seller.profileImageUrl} />
                    <AvatarFallback>
                      {listing.seller.firstName?.[0]}{listing.seller.lastName?.[0]}
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
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">
                  ${parseFloat(listing.price).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fees && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Asset Price</span>
                      <span>${fees.assetPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Buyer Fee (2.5%)</span>
                      <span>${fees.buyerFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${fees.totalBuyerPays.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handlePurchase}
                  disabled={isPurchasing || !listing || listing.status !== 'active'}
                >
                  {isPurchasing ? "Processing..." : "Buy Now"}
                </Button>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-emerald-500" />
                    <span>Protected by escrow</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                    <span>72-hour verification period</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-emerald-500" />
                    <span>Dispute resolution available</span>
                  </div>
                </div>

                <Separator />

                <div className="text-xs text-gray-500">
                  By purchasing, you agree to our Terms of Service and acknowledge 
                  that funds will be held in escrow until asset verification is complete.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

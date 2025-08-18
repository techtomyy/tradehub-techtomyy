import { useState } from "react";
import { useParams, Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { 
  ArrowLeft,
  AlertTriangle
} from "lucide-react";
import { 
  AssetCard, 
  SellerInfoCard, 
  PurchaseCard, 
  OfferModal 
} from "@/components/listing";
import { Listing, User, Seller, Fees } from "@/types/listing";

// Constants
const BUYER_FEE_PERCENTAGE = 0.025;
const LOADING_DELAY = 1500;

const CATEGORY_ICONS = {
  instagram: '📷',
  youtube: '📹',
  tiktok: '🎵',
  twitter: '🐦',
  website: '🌐',
} as const;

// Static data - All prices are in USD
const STATIC_USER: User = { 
  id: "1", 
  name: "Demo User" 
};

const STATIC_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Demo Asset 1",
    price: 100, // Price in USD
    description: "A great digital asset.",
    category: "instagram",
    media: [],
    verificationStatus: "verified",
    followers: 12000,
    engagement: 5.2,
    monthlyViews: 50000,
    monthlyRevenue: 200,
    status: "active",
    sellerId: "2",
    seller: {
      firstName: "Alice",
      lastName: "Smith",
      username: "alicesmith",
      profileImageUrl: "",
      rating: 4.8,
      totalSales: 12,
      kycVerified: true,
      bio: "Experienced seller of digital assets."
    }
  },
  {
    id: "2",
    title: "Demo Asset 2",
    price: 200, // Price in USD
    description: "Another awesome asset.",
    category: "youtube",
    media: [],
    verificationStatus: "unverified",
    followers: 8000,
    engagement: 3.1,
    monthlyViews: 20000,
    monthlyRevenue: 100,
    status: "active",
    sellerId: "3",
    seller: {
      firstName: "Bob",
      lastName: "Jones",
      username: "bobjones",
      profileImageUrl: "",
      rating: 4.2,
      totalSales: 5,
      kycVerified: false,
      bio: "Selling high-quality YouTube channels."
    }
  }
];

export default function ListingDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { selectedCurrency, formatAmount, convertAmount } = useCurrency();
  
  // State
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  // Derived state
  const listing = STATIC_LISTINGS.find(l => l.id === id);
  const isLoading = false;

  // Calculate fees
  const fees: Fees | null = listing
    ? {
        assetPrice: listing.price,
        buyerFee: listing.price * BUYER_FEE_PERCENTAGE,
        totalBuyerPays: listing.price * (1 + BUYER_FEE_PERCENTAGE),
        assetPriceInSelectedCurrency: convertAmount(listing.price, 'USD', selectedCurrency),
        buyerFeeInSelectedCurrency: convertAmount(listing.price * BUYER_FEE_PERCENTAGE, 'USD', selectedCurrency),
        totalBuyerPaysInSelectedCurrency: convertAmount(listing.price * (1 + BUYER_FEE_PERCENTAGE), 'USD', selectedCurrency),
      }
    : null;

  // Event handlers
  const handlePurchase = async () => {
    if (!STATIC_USER) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase this asset.",
        variant: "destructive",
      });
      return;
    }

    if (listing?.sellerId === STATIC_USER.id) {
      toast({
        title: "Cannot Purchase",
        description: "You cannot purchase your own listing.",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    
    setTimeout(() => {
      setIsPurchasing(false);
      setPurchaseSuccess(true);
      toast({
        title: "Purchase Initiated",
        description: "Your payment has been placed in escrow. The seller will provide asset credentials shortly.",
      });
    }, LOADING_DELAY);
  };

  const handleOfferSubmit = () => {
    if (!offerAmount || isNaN(Number(offerAmount))) {
      toast({
        title: "Invalid Offer",
        description: "Please enter a valid number.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Offer Sent",
      description: `Your offer of $${offerAmount} has been sent to the seller.`,
    });
    
    setIsOfferModalOpen(false);
    setOfferAmount("");
  };

  const getCategoryIcon = (category: string): string => {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '💻';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          Loading...
        </div>
      </div>
    );
  }

  // Not found state
  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Listing Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/marketplace">
              <Button>Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Asset Card */}
            <AssetCard listing={listing} getCategoryIcon={getCategoryIcon} />
            
            {/* Seller Info */}
            <SellerInfoCard listing={listing} />
          </div>

          {/* Purchase Card */}
          <PurchaseCard 
            listing={listing}
            fees={fees}
            isPurchasing={isPurchasing}
            purchaseSuccess={purchaseSuccess}
            onPurchase={handlePurchase}
            onMakeOffer={() => setIsOfferModalOpen(true)}
            formatAmount={formatAmount}
            selectedCurrency={selectedCurrency}
          />
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        offerAmount={offerAmount}
        onOfferAmountChange={setOfferAmount}
        onSubmit={handleOfferSubmit}
      />
    </div>
  );
}

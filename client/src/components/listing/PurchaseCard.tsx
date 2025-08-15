import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Listing, Fees } from "@/types/listing";
import { Currency } from "@/lib/store/walletStore";
import { FeeBreakdown } from "./FeeBreakdown";
import { SecurityFeatures } from "./SecurityFeatures";

interface PurchaseCardProps {
  listing: Listing;
  fees: Fees | null;
  isPurchasing: boolean;
  purchaseSuccess: boolean;
  onPurchase: () => void;
  onMakeOffer: () => void;
  formatAmount: (amount: number, currency: Currency) => string;
  selectedCurrency: Currency;
}

/**
 * Purchase Card Component
 * 
 * Displays the purchase interface including price, fees, action buttons,
 * and security features for buying an asset.
 */
export function PurchaseCard({ 
  listing, 
  fees, 
  isPurchasing, 
  purchaseSuccess, 
  onPurchase, 
  onMakeOffer,
  formatAmount,
  selectedCurrency
}: PurchaseCardProps) {
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-2xl">
          {formatAmount(
            parseFloat(listing.price.toString()), 
            selectedCurrency
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Fee Breakdown */}
        {fees && <FeeBreakdown fees={fees} formatAmount={formatAmount} selectedCurrency={selectedCurrency} />}
        
        {/* Action Buttons */}
        <Button
          size="lg"
          className="w-full"
          onClick={onPurchase}
          disabled={isPurchasing || !listing || listing.status !== 'active'}
        >
          {isPurchasing ? "Processing..." : purchaseSuccess ? "Purchased!" : "Buy Now"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={onMakeOffer}
        >
          Make Offer
        </Button>

        {/* Security Features */}
        <SecurityFeatures />
        
        <Separator />
        
        {/* Terms */}
        <div className="text-xs text-gray-500">
          By purchasing, you agree to our Terms of Service and acknowledge that funds will be held in escrow until asset verification is complete.
        </div>
      </CardContent>
    </Card>
  );
}

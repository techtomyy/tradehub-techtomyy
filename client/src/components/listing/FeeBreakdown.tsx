import { Separator } from "@/components/ui/separator";
import { Fees } from "@/types/listing";
import { Currency } from "@/lib/store/walletStore";

interface FeeBreakdownProps {
  fees: Fees;
  formatAmount: (amount: number, currency: Currency) => string;
  selectedCurrency: Currency;
}

/**
 * Fee Breakdown Component
 * 
 * Displays a detailed breakdown of the purchase including asset price,
 * buyer fees, and total amount in the selected currency.
 */
export function FeeBreakdown({ fees, formatAmount, selectedCurrency }: FeeBreakdownProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Asset Price</span>
        <span>{formatAmount(fees.assetPriceInSelectedCurrency, selectedCurrency)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Buyer Fee (2.5%)</span>
        <span>{formatAmount(fees.buyerFeeInSelectedCurrency, selectedCurrency)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatAmount(fees.totalBuyerPaysInSelectedCurrency, selectedCurrency)}</span>
      </div>
    </div>
  );
}

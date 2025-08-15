import { Wallet } from "lucide-react";
import { Currency } from "@/lib/store/walletStore";

interface WalletBalanceProps {
  walletBalance: number;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
}

/**
 * Wallet Balance Component
 * 
 * Displays the current wallet balance in the selected currency
 * with a wallet icon and formatted amount.
 */
export function WalletBalance({ 
  walletBalance, 
  selectedCurrency, 
  formatAmount, 
  convertAmount 
}: WalletBalanceProps) {
  return (
    <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
      <Wallet className="h-4 w-4 text-emerald-600" />
      <span className="text-sm font-medium">
        {formatAmount(convertAmount(walletBalance, 'USD', selectedCurrency), selectedCurrency)}
      </span>
    </div>
  );
}

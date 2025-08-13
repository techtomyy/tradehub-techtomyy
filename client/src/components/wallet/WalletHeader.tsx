import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/lib/store/walletStore";

interface WalletHeaderProps {
  balance: number;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  getBalanceInCurrency: (currency: Currency) => number;
  setCurrency: (currency: Currency) => void;
}

/**
 * Wallet Header Component
 * 
 * Displays the wallet title, current balance, and currency selection.
 */
export function WalletHeader({ 
  balance, 
  selectedCurrency, 
  formatAmount, 
  getBalanceInCurrency,
  setCurrency
}: WalletHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet & Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-sm text-gray-600">Current Balance</div>
          <div className="text-3xl font-bold">
            {formatAmount(getBalanceInCurrency(selectedCurrency), selectedCurrency)}
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="text-sm text-gray-500">
              Currency: {selectedCurrency}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-xs rounded-md ${
                  selectedCurrency === 'USD' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('PKR')}
                className={`px-3 py-1 text-xs rounded-md ${
                  selectedCurrency === 'PKR' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                PKR
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

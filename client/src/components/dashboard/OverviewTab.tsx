import { Transaction, UserListing } from "@/types/dashboard";
import { Currency } from "@/lib/store/walletStore";
import { RecentTransactions } from "./RecentTransactions";
import { RecentListings } from "./RecentListings";

interface OverviewTabProps {
  userTransactions: Transaction[];
  userListings: UserListing[];
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  getTransactionStatusColor: (status: string) => string;
  getStatusColor: (status: string) => string;
  getCategoryIcon: (category: string) => string;
  onTabChange: (tab: string) => void;
}

/**
 * Overview Tab Component
 * 
 * Main overview tab that displays recent transactions and listings
 * in a two-column grid layout.
 */
export function OverviewTab({ 
  userTransactions, 
  userListings, 
  selectedCurrency, 
  formatAmount, 
  convertAmount, 
  getTransactionStatusColor, 
  getStatusColor, 
  getCategoryIcon,
  onTabChange
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Transactions */}
      <RecentTransactions 
        transactions={userTransactions}
        selectedCurrency={selectedCurrency}
        formatAmount={formatAmount}
        convertAmount={convertAmount}
        getStatusColor={getTransactionStatusColor}
        onViewAll={() => onTabChange("transactions")}
      />
      
      {/* Recent Listings */}
      <RecentListings 
        listings={userListings}
        getStatusColor={getStatusColor}
        getCategoryIcon={getCategoryIcon}
        onViewAll={() => onTabChange("listings")}
      />
    </div>
  );
}

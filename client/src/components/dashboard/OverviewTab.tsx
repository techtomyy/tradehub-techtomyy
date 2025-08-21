import { Transaction, UserListing } from "@/types/dashboard";
import { Currency } from "@/lib/store/walletStore";
import { RecentTransactions } from "./RecentTransactions";
import { RecentListings } from "./RecentListings";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

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
    <div className="space-y-6">
      {/* Enhanced Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Revenue Card */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">+12.5%</div>
              <div className="text-xs text-green-500">vs last month</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatAmount(convertAmount(125000, 'USD', selectedCurrency), selectedCurrency)}
          </p>
          <p className="text-sm text-gray-600 mt-2">From completed transactions</p>
        </motion.div>

        {/* Active Listings Card */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-600">+8.2%</div>
              <div className="text-xs text-blue-500">vs last month</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Active Listings</h3>
          <p className="text-3xl font-bold text-blue-600">{userListings.filter(l => l.status === 'active').length}</p>
          <p className="text-sm text-gray-600 mt-2">Currently available for sale</p>
        </motion.div>

        {/* Success Rate Card */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-purple-600">+2.1%</div>
              <div className="text-xs text-purple-500">vs last month</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-purple-600">94.2%</p>
          <p className="text-sm text-gray-600 mt-2">Successful transactions</p>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
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
      </motion.div>
    </div>
  );
}

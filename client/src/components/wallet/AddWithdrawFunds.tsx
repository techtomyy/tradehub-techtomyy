import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Minus, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AddWithdrawFundsProps {
  addAmount: string;
  setAddAmount: (amount: string) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  handleAddFunds: () => void;
  handleWithdrawFunds: () => void;
  selectedCurrency: 'USD' | 'PKR';
  formatAmount: (amount: number, currency: 'USD' | 'PKR') => string;
  convertAmount: (amount: number, fromCurrency: 'USD' | 'PKR', toCurrency: 'USD' | 'PKR') => number;
}

/**
 * Enhanced Add Withdraw Funds Component
 * 
 * Displays beautiful input fields and buttons for adding and withdrawing funds.
 */
export function AddWithdrawFunds({ 
  addAmount, 
  setAddAmount, 
  withdrawAmount, 
  setWithdrawAmount, 
  handleAddFunds, 
  handleWithdrawFunds,
  selectedCurrency,
  formatAmount,
  convertAmount
}: AddWithdrawFundsProps) {
  const quickAmounts = [50, 100, 200, 500];

  // Convert amounts based on selected currency
  const getConvertedAmount = (amount: number) => {
    if (selectedCurrency === 'PKR') {
      return convertAmount(amount, 'USD', 'PKR');
    }
    return amount;
  };

  // Get currency symbol
  const getCurrencySymbol = () => selectedCurrency === 'PKR' ? '₨' : '$';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add Funds Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add Funds</h3>
            <p className="text-sm text-gray-600">Deposit money into your wallet</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Amount Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
              {selectedCurrency === 'PKR' ? '₨' : '$'}
            </div>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder={`0.00 ${selectedCurrency}`}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amount) => (
              <motion.button
                key={amount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAddAmount(amount.toString())}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
              >
                              <div className="text-center">
                <div className="font-semibold text-base">{getCurrencySymbol()}{getConvertedAmount(amount).toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">${amount} USD</div>
              </div>
              </motion.button>
            ))}
          </div>

          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddFunds}
            disabled={!addAmount || parseFloat(addAmount) <= 0}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="w-5 h-5" />
            Add Funds
          </motion.button>
        </div>
      </motion.div>

      {/* Withdraw Funds Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
            <Minus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Withdraw Funds</h3>
            <p className="text-sm text-gray-600">Transfer money to your bank</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Amount Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
              {selectedCurrency === 'PKR' ? '₨' : '$'}
            </div>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={`0.00 ${selectedCurrency}`}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amount) => (
              <motion.button
                key={amount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setWithdrawAmount(amount.toString())}
                className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-colors duration-200"
              >
                              <div className="text-center">
                <div className="font-semibold text-base">{getCurrencySymbol()}{getConvertedAmount(amount).toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">${amount} USD</div>
              </div>
              </motion.button>
            ))}
          </div>

          {/* Withdraw Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWithdrawFunds}
            disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowDownRight className="w-5 h-5" />
            Withdraw Funds
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

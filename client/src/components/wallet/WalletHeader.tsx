import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/lib/store/walletStore";
import { Wallet, TrendingUp, Globe, Shield } from "lucide-react";

interface WalletHeaderProps {
  balance: number;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  getBalanceInCurrency: (currency: Currency) => number;
  setCurrency: (currency: Currency) => void;
}

/**
 * Enhanced Wallet Header Component
 * 
 * Displays the wallet title, current balance, and currency selection with beautiful design.
 */
export function WalletHeader({ 
  balance, 
  selectedCurrency, 
  formatAmount, 
  getBalanceInCurrency,
  setCurrency
}: WalletHeaderProps) {
  const currentBalance = getBalanceInCurrency(selectedCurrency);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm"
        />

        <div className="relative p-8 text-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
              >
                <Wallet className="w-6 h-6" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">Digital Wallet</h1>
                <p className="text-blue-100 text-sm">Manage your digital assets</p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-2 bg-white/20 rounded-lg backdrop-blur-sm"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure</span>
            </motion.div>
          </div>

          {/* Balance Display */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-2"
            >
              <p className="text-blue-100 text-sm font-medium">Current Balance</p>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-4"
            >
              <div className="text-5xl font-bold tracking-tight">
                {formatAmount(currentBalance, selectedCurrency)}
              </div>
            </motion.div>

            {/* Balance Trend */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-blue-100"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+2.5% this month</span>
            </motion.div>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <Globe className="w-4 h-4" />
              <span>Currency:</span>
            </div>
            
            <div className="flex gap-2">
              {(['USD', 'PKR'] as Currency[]).map((currency) => (
                <motion.button
                  key={currency}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrency(currency)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCurrency === currency
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {currency}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, TrendingUp, Clock, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { Transaction } from "@/types/dashboard";
import { Currency } from "@/lib/store/walletStore";

interface RecentTransactionsProps {
  transactions: Transaction[];
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  getStatusColor: (status: string) => string;
  onViewAll: () => void;
}

/**
 * Enhanced Recent Transactions Component
 * 
 * Displays a beautiful card showing recent transactions with options
 * to view all transactions, enhanced with animations and better design.
 */
export function RecentTransactions({ 
  transactions, 
  selectedCurrency, 
  formatAmount, 
  convertAmount, 
  getStatusColor,
  onViewAll
}: RecentTransactionsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'payment_received':
        return <DollarSign className="w-4 h-4 text-yellow-600" />;
      case 'credentials_sent':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Recent Transactions</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onViewAll} 
                className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions?.slice(0, 3).map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="group relative overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-gray-200">
                    {getStatusIcon(transaction.status)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {transaction.listing.title}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatAmount(convertAmount(parseFloat(transaction.amount), 'USD', selectedCurrency), selectedCurrency)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    className={`${getStatusColor(transaction.status)} px-3 py-1 text-xs font-medium border-0 shadow-sm`}
                  >
                    {getStatusText(transaction.status)}
                  </Badge>
                  <p className="text-xs text-gray-500 text-right">
                    {transaction.buyer.firstName} {transaction.buyer.lastName}
                  </p>
                </div>
              </div>
              
              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
          
          {(!transactions || transactions.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No transactions yet</p>
              <p className="text-gray-400 text-sm">Your transaction history will appear here</p>
            </motion.div>
          )}
          
          {/* Summary */}
          {transactions && transactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 pt-4 border-t border-gray-200"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-semibold text-gray-900">
                  {formatAmount(
                    convertAmount(
                      transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
                      'USD',
                      selectedCurrency
                    ),
                    selectedCurrency
                  )}
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

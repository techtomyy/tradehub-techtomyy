import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/lib/store/walletStore";
import { 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useState } from "react";

interface Transaction {
  date: string;
  type: string;
  amount: number;
  fee: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
}

/**
 * Enhanced Transaction History Component
 * 
 * Displays a beautiful table of wallet transactions with filtering and search capabilities.
 */
export function TransactionHistory({ 
  transactions, 
  selectedCurrency, 
  formatAmount, 
  convertAmount 
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mock transactions for demonstration
  const mockTransactions = [
    { date: "2024-01-15", type: "Deposit", amount: 500, fee: 0 },
    { date: "2024-01-14", type: "Withdrawal", amount: 200, fee: 2 },
    { date: "2024-01-13", type: "Payment", amount: 150, fee: 1.5 },
    { date: "2024-01-12", type: "Deposit", amount: 1000, fee: 0 },
    { date: "2024-01-11", type: "Transfer", amount: 300, fee: 3 },
  ];

  const allTransactions = transactions.length > 0 ? transactions : mockTransactions;

  // Filter and search transactions
  const filteredTransactions = allTransactions.filter(txn => {
    const matchesSearch = txn.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.date.includes(searchTerm);
    const matchesFilter = filterType === "all" || txn.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "amount":
        return b.amount - a.amount;
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return <ArrowDownRight className="w-4 h-4 text-green-600" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "transfer":
        return <Banknote className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return "text-green-600 bg-green-50 border-green-200";
      case "withdrawal":
        return "text-red-600 bg-red-50 border-red-200";
      case "payment":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "transfer":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Transaction History</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Track all your wallet activities</p>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              
              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="payment">Payments</option>
                <option value="transfer">Transfers</option>
              </select>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTransactions.map((txn, idx) => (
                <motion.div
                  key={`${txn.date}-${txn.type}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  {/* Transaction Info */}
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg border ${getTransactionColor(txn.type)}`}>
                      {getTransactionIcon(txn.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{txn.type}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTransactionColor(txn.type)}`}>
                          {txn.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(txn.date)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount and Fee */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {txn.type.toLowerCase() === "withdrawal" ? "-" : "+"}
                      {formatAmount(txn.amount, selectedCurrency)}
                    </p>
                    {txn.fee > 0 && (
                      <p className="text-xs text-gray-500">
                        Fee: {formatAmount(txn.fee, selectedCurrency)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Deposits</p>
              <p className="font-semibold text-gray-900">
                {formatAmount(
                  allTransactions
                    .filter(t => t.type.toLowerCase() === "deposit")
                    .reduce((sum, t) => sum + convertAmount(t.amount, 'USD', selectedCurrency), 0),
                  selectedCurrency
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Withdrawals</p>
              <p className="font-semibold text-gray-900">
                {formatAmount(
                  allTransactions
                    .filter(t => t.type.toLowerCase() === "withdrawal")
                    .reduce((sum, t) => sum + convertAmount(t.amount, 'USD', selectedCurrency), 0),
                  selectedCurrency
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="font-semibold text-gray-900">
                {formatAmount(
                  allTransactions.reduce((sum, t) => sum + convertAmount(t.fee, 'USD', selectedCurrency), 0),
                  selectedCurrency
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
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
 * Recent Transactions Component
 * 
 * Displays a card showing recent transactions with options
 * to view all transactions.
 */
export function RecentTransactions({ 
  transactions, 
  selectedCurrency, 
  formatAmount, 
  convertAmount, 
  getStatusColor,
  onViewAll
}: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <Button variant="ghost" size="sm" onClick={onViewAll} className="hover-golden">
            View All <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.slice(0, 3).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatAmount(convertAmount(parseFloat(transaction.amount), 'USD', selectedCurrency), selectedCurrency)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status.replace('_', ' ')}
              </Badge>
            </div>
          ))}
          {(!transactions || transactions.length === 0) && (
            <p className="text-gray-500 text-center py-4">No transactions yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

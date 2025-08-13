import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Currency } from "@/lib/store/walletStore";

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
 * Transaction History Component
 * 
 * Displays a table of wallet transactions with date, type, amount, and fee.
 */
export function TransactionHistory({ 
  transactions, 
  selectedCurrency, 
  formatAmount, 
  convertAmount 
}: TransactionHistoryProps) {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Fee</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2">{txn.date}</td>
                  <td className="py-2">{txn.type}</td>
                  <td className="py-2">
                    {formatAmount(convertAmount(txn.amount, 'USD', selectedCurrency), selectedCurrency)}
                  </td>
                  <td className="py-2">
                    {formatAmount(convertAmount(txn.fee, 'USD', selectedCurrency), selectedCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

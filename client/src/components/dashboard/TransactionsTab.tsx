import TransactionCard from "@/components/TransactionCard";
import { Transaction } from "@/types/dashboard";
import { EmptyTransactionsState } from "./EmptyTransactionsState";

interface TransactionsTabProps {
  userTransactions: Transaction[];
}

/**
 * Transactions Tab Component
 * 
 * Displays the transactions tab with a list of user transactions
 * and handles empty state.
 */
export function TransactionsTab({ userTransactions }: TransactionsTabProps) {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
      <div className="space-y-4">
        {userTransactions?.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
        
        {(!userTransactions || userTransactions.length === 0) && (
          <EmptyTransactionsState />
        )}
      </div>
    </>
  );
}

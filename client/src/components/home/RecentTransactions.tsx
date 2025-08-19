import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import TransactionCard from "@/components/TransactionCard";

interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  amount: string;
  buyerFee: string;
  sellerFee: string;
  totalAmount: string;
  status: string;
  verificationDeadline: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
  listing: {
    title: string;
    category: string;
  };
  buyer: {
    firstName: string;
    lastName: string;
  };
  seller: {
    firstName: string;
    lastName: string;
  };
}

interface RecentTransactionsProps {
  userTransactions: Transaction[];
}

/**
 * Recent Transactions Component
 * 
 * Displays a section of recent user transactions with a list layout
 * and a link to view all transactions.
 */
export function RecentTransactions({ userTransactions }: RecentTransactionsProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Recent Transactions</h2>
          <Link href="/dashboard">
            <Button variant="outline" className="hover-golden">View All</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {userTransactions.slice(0, 3).map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-7 md:mb-8">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900">Your Recent Transactions</h2>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="hover-golden w-full sm:w-auto">View All</Button>
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-3 md:space-y-4">
          {userTransactions.slice(0, 3).map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>
    </section>
  );
}

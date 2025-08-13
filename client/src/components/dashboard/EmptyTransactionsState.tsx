import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "wouter";

/**
 * Empty Transactions State Component
 * 
 * Displays when there are no transactions to show,
 * with a call-to-action to browse the marketplace.
 */
export function EmptyTransactionsState() {
  return (
    <div className="text-center py-12">
      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
      <p className="text-gray-600 mb-6">Start buying or selling assets to see your transaction history</p>
      <Link href="/marketplace">
        <Button>Browse Marketplace</Button>
      </Link>
    </div>
  );
}

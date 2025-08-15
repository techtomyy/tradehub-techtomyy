import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { useWalletStore } from "@/lib/store/walletStore";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { Link } from "wouter";

/**
 * Escrow Summary Component
 * 
 * Displays a summary of escrow status and quick actions
 * for the dashboard overview.
 */
export function EscrowSummary() {
  const { getEscrowBalanceInCurrency } = useWalletStore();
  const { selectedCurrency, formatAmount } = useCurrency();

  // Mock escrow statistics - replace with real data from escrow store
  const escrowStats = {
    pending: 2,
    funded: 1,
    totalInEscrow: getEscrowBalanceInCurrency(selectedCurrency),
    hasDisputes: false
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Escrow Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {escrowStats.pending}
              </div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {escrowStats.funded}
              </div>
              <div className="text-xs text-gray-600">Funded</div>
            </div>
          </div>

          {/* Total in Escrow */}
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">
              {formatAmount(escrowStats.totalInEscrow, selectedCurrency)}
            </div>
            <div className="text-sm text-gray-600">Total in Escrow</div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Link href="/escrow-management">
              <Button className="w-full hover-golden" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Manage Escrow
              </Button>
            </Link>
            
            {escrowStats.hasDisputes && (
              <div className="flex items-center p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                <span className="text-sm text-red-600">Active disputes require attention</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

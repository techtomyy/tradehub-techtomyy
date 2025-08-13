import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface EscrowDeal {
  id: string;
  deal: string;
  counterparty: string;
  counterpartyType: 'seller' | 'buyer';
  amountHeld: number;
  fee: number;
  netToSeller: number;
  counterpartyConfirmed: 'confirmed' | 'pending';
  status: 'funded' | 'in_progress';
}

interface EscrowManagementProps {
  deals: EscrowDeal[];
  onConfirmCompletion: (dealId: string) => void;
  onRaiseDispute: (dealId: string) => void;
}

/**
 * Escrow Management Component
 * 
 * Displays a table of current escrow deals with actions
 * for confirming completion or raising disputes.
 * Matches the exact UI structure from the images.
 */
export function EscrowManagement({ 
  deals, 
  onConfirmCompletion, 
  onRaiseDispute 
}: EscrowManagementProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfirmationColor = (confirmed: string) => {
    switch (confirmed) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrow Management</CardTitle>
        <p className="text-sm text-gray-600">
          Manage held payments for deals. Funds are held in escrow until both parties confirm completion. Platform fee: 2.5% deducted upon release.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-3 px-2 font-medium text-gray-900">Deal</th>
                <th className="py-3 px-2 font-medium text-gray-900">Counterparty</th>
                <th className="py-3 px-2 font-medium text-gray-900">Amount Held</th>
                <th className="py-3 px-2 font-medium text-gray-900">Fee (2.5%)</th>
                <th className="py-3 px-2 font-medium text-gray-900">Net to Seller</th>
                <th className="py-3 px-2 font-medium text-gray-900">Counterparty Confirmed</th>
                <th className="py-3 px-2 font-medium text-gray-900">Status</th>
                <th className="py-3 px-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-900">{deal.deal}</td>
                  <td className="py-3 px-2">
                    <span className="capitalize text-gray-600">{deal.counterpartyType}: </span>
                    <span className="font-medium text-gray-900">{deal.counterparty}</span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-900">${deal.amountHeld.toLocaleString()}</td>
                  <td className="py-3 px-2 text-gray-600">${deal.fee.toFixed(2)}</td>
                  <td className="py-3 px-2 font-semibold text-green-600">${deal.netToSeller.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <Badge className={getConfirmationColor(deal.counterpartyConfirmed)}>
                      {deal.counterpartyConfirmed === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge className={getStatusColor(deal.status)}>
                      {deal.status === 'funded' ? 'Funded' : 'In Progress'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        onClick={() => onConfirmCompletion(deal.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Confirm Completion
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="text-xs"
                        onClick={() => onRaiseDispute(deal.id)}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Dispute
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

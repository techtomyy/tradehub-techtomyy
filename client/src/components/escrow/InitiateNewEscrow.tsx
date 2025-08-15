import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface InitiateNewEscrowProps {
  onCreateEscrow: (dealDescription: string, counterpartyUsername: string, amount: number) => void;
  isLoading?: boolean;
}

/**
 * Initiate New Escrow Component
 * 
 * Follows the exact 6-step flow:
 * 1. Enter Details
 * 2. Create Escrow
 * 3. Invite Counterparty
 * 4. Initiator Confirmation
 * 5. Counterparty Confirmation
 * 6. Deal Completion or Dispute
 */
export function InitiateNewEscrow({ onCreateEscrow, isLoading = false }: InitiateNewEscrowProps) {
  const { toast } = useToast();
  const [dealDescription, setDealDescription] = useState("");
  const [counterpartyUsername, setCounterpartyUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [escrowStatus, setEscrowStatus] = useState<'entering_details' | 'escrow_created' | 'invitation_sent' | 'initiator_confirmed' | 'counterparty_confirmed' | 'funds_held' | 'deal_completed' | 'dispute_raised'>('entering_details');
  const [initiatorConfirmed, setInitiatorConfirmed] = useState(false);
  const [counterpartyConfirmed, setCounterpartyConfirmed] = useState(false);

  // Step 1: Enter Details
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!dealDescription.trim() || !counterpartyUsername.trim() || !amount.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Step 2: Create Escrow
    onCreateEscrow(dealDescription, counterpartyUsername, parseFloat(amount));
    setEscrowStatus('escrow_created');
    
    toast({
      title: "Escrow Created",
      description: "Escrow created successfully. Invite counterparty and confirm participation.",
    });
  };

  // Step 3: Invite Counterparty
  const handleInviteCounterparty = () => {
    setEscrowStatus('invitation_sent');
    toast({
      title: "Invitation Sent",
      description: "Invitation sent to counterparty successfully.",
    });
  };

  // Step 4: Initiator Confirmation
  const handleConfirmParticipation = () => {
    setInitiatorConfirmed(true);
    setEscrowStatus('initiator_confirmed');
    toast({
      title: "Participation Confirmed",
      description: "Your participation has been confirmed.",
    });
  };

  // Step 5: Counterparty Confirmation (Simulated)
  const handleConfirmAsCounterparty = () => {
    setCounterpartyConfirmed(true);
    setEscrowStatus('counterparty_confirmed');
    toast({
      title: "Counterparty Confirmed",
      description: "Counterparty has confirmed participation.",
    });

    // If both parties confirmed, move to funds held state
    if (initiatorConfirmed) {
      setTimeout(() => {
        setEscrowStatus('funds_held');
        toast({
          title: "Funds Held in Escrow",
          description: "Both parties confirmed. Funds are now held in escrow.",
        });
      }, 1000);
    }
  };

  // Step 6a: Deal Completion
  const handleConfirmCompletion = () => {
    setEscrowStatus('deal_completed');
    toast({
      title: "Deal Completed",
      description: "Deal completed successfully! Payment released (minus 2.5% fee).",
    });
  };

  // Step 6b: Raise Dispute
  const handleRaiseDispute = () => {
    setEscrowStatus('dispute_raised');
    toast({
      title: "Dispute Raised",
      description: "Dispute raised. Please provide details in the Dispute Resolution section.",
      variant: "destructive",
    });
  };

  const resetEscrow = () => {
    setEscrowStatus('entering_details');
    setInitiatorConfirmed(false);
    setCounterpartyConfirmed(false);
    setDealDescription("");
    setCounterpartyUsername("");
    setAmount("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiate New Escrow</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Step 1: Enter Details */}
        {escrowStatus === 'entering_details' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Description
              </label>
              <Input
                type="text"
                placeholder="e.g., YouTube Channel Sale"
                value={dealDescription}
                onChange={(e) => setDealDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Counterparty Username
              </label>
              <Input
                type="text"
                placeholder="e.g., channelhub"
                value={counterpartyUsername}
                onChange={(e) => setCounterpartyUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Hold
              </label>
              <Input
                type="number"
                placeholder="e.g., 2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Escrow"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Escrow Created */}
        {escrowStatus === 'escrow_created' && (
          <div className="space-y-4">
            <div className="bg-orange-100 border border-orange-300 rounded-md p-4">
              <p className="text-orange-800 text-sm">
                Escrow created. Invite counterparty and confirm participation.
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handleInviteCounterparty}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Invite Counterparty
              </Button>
              <Button 
                onClick={handleConfirmParticipation}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Confirm Your Participation
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Invitation Sent */}
        {escrowStatus === 'invitation_sent' && (
          <div className="space-y-4">
            <div className="bg-blue-100 border border-blue-300 rounded-md p-4">
              <p className="text-blue-800 text-sm">
                Invitation sent to counterparty. Status remains pending.
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handleConfirmParticipation}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Confirm Your Participation
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Initiator Confirmed */}
        {escrowStatus === 'initiator_confirmed' && (
          <div className="space-y-4">
            <div className="bg-yellow-100 border border-yellow-300 rounded-md p-4">
              <p className="text-yellow-800 text-sm">
                Your participation confirmed. Waiting for counterparty to confirm.
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handleConfirmAsCounterparty}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Confirm as Counterparty (Simulate)
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Counterparty Confirmed */}
        {escrowStatus === 'counterparty_confirmed' && (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-300 rounded-md p-4">
              <p className="text-green-800 text-sm">
                Counterparty confirmed. Processing escrow setup...
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Funds Held in Escrow */}
        {escrowStatus === 'funds_held' && (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-300 rounded-md p-4">
              <p className="text-green-800 text-sm">
                Funds held in escrow. Confirm deal completion or raise a dispute.
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={handleConfirmCompletion}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm Deal Completion
              </Button>
              <Button 
                onClick={handleRaiseDispute}
                variant="destructive"
                className="w-full"
              >
                Raise Dispute
              </Button>
            </div>
          </div>
        )}

        {/* Final States */}
        {escrowStatus === 'deal_completed' && (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-300 rounded-md p-4">
              <p className="text-green-800 text-sm">
                Deal completed successfully!
              </p>
            </div>
            <Button 
              onClick={resetEscrow}
              variant="outline"
              className="w-full"
            >
              Create New Escrow
            </Button>
          </div>
        )}

        {escrowStatus === 'dispute_raised' && (
          <div className="space-y-4">
            <div className="bg-orange-100 border border-orange-300 rounded-md p-4">
              <p className="text-orange-800 text-sm">
                Dispute raised. Awaiting resolution.
              </p>
            </div>
            <Button 
              onClick={resetEscrow}
              variant="outline"
              className="w-full"
            >
              Create New Escrow
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

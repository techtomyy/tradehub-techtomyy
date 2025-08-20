import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import {
  EscrowManagement as EscrowManagementComponent,
  DealStatusTimeline,
  InitiateNewEscrow,
  DisputeResolution
} from "@/components/escrow";
import { EscrowDeal, TimelineStep } from "@/types/escrow";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function EscrowManagementPage() {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'main' | 'dispute'>('main');

  // Mock data for escrow deals - matching the exact data from images
  const [escrowDeals] = useState<EscrowDeal[]>([
    {
      id: "1",
      deal: "YouTube Channel - 150K Subs",
      counterparty: "channelhub",
      counterpartyType: "seller",
      amountHeld: 2500,
      fee: 62.50,
      netToSeller: 2437.50,
      counterpartyConfirmed: "confirmed",
      status: "funded"
    },
    {
      id: "2",
      deal: "Instagram Account - 50K Followers",
      counterparty: "influencermkt",
      counterpartyType: "buyer",
      amountHeld: 1200,
      fee: 30.00,
      netToSeller: 1170.00,
      counterpartyConfirmed: "pending",
      status: "in_progress"
    }
  ]);

  // Mock data for timeline steps - matching the exact data from images
  const [timelineSteps] = useState<TimelineStep[]>([
    {
      id: "1",
      title: "Escrow Created",
      date: "Aug 1, 2025",
      status: "completed"
    },
    {
      id: "2",
      title: "Buyer Funded Escrow",
      date: "Aug 2, 2025",
      status: "completed"
    },
    {
      id: "3",
      title: "Seller Confirmation",
      date: "Pending",
      status: "pending"
    }
  ]);

  const handleConfirmCompletion = (dealId: string) => {
    const deal = escrowDeals.find(d => d.id === dealId);
    if (deal) {
      toast({
        title: "Deal Completion Confirmed",
        description: `Successfully confirmed completion for ${deal.deal}`,
      });
    }
  };

  const handleRaiseDispute = (dealId: string) => {
    const deal = escrowDeals.find(d => d.id === dealId);
    if (deal) {
      toast({
        title: "Dispute Raised",
        description: `Dispute raised for ${deal.deal}. Our team will review within 7 business days.`,
        variant: "destructive",
      });
    }
  };

  const handleCreateEscrow = (dealDescription: string, counterpartyUsername: string, amount: number) => {
    toast({
      title: "Escrow Created",
      description: `Successfully created escrow for ${dealDescription} with ${counterpartyUsername} for $${amount}`,
    });
  };

  const handleNavigateToDispute = () => {
    setCurrentView('dispute');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Matching the TradeHub header from images */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TradeHub</h1>
          <p className="text-gray-600 mt-2">
            {currentView === 'main' ? 'Escrow Management Dashboard' : 'Dispute Resolution Center'}
          </p>
        </div>

        {currentView === 'main' ? (
          /* Main Escrow Management View */
          <div className="space-y-8">
            {/* 1. Escrow Management Table */}
            <EscrowManagementComponent 
              deals={escrowDeals}
              onConfirmCompletion={handleConfirmCompletion}
              onRaiseDispute={handleRaiseDispute}
              onNavigateToDispute={handleNavigateToDispute}
            />

            {/* 2. Deal Status Timeline */}
            <DealStatusTimeline steps={timelineSteps} />

            {/* 3. Initiate New Escrow */}
            <InitiateNewEscrow onCreateEscrow={handleCreateEscrow} />

            {/* 4. Quick Dispute Access */}
            <div className="flex justify-center">
              <Button
                onClick={handleNavigateToDispute}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Raise Dispute
              </Button>
            </div>
          </div>
        ) : (
          /* Dispute Resolution View */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBackToMain}
                className="mb-4"
              >
                ← Back to Escrow Management
              </Button>
            </div>
            
            <DisputeResolution 
              deals={escrowDeals}
              onSubmitDispute={handleRaiseDispute}
            />
          </div>
        )}
      </div>
    </div>
  );
}

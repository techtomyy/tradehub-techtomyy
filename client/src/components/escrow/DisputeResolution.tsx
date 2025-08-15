import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface EscrowDeal {
  id: string;
  deal: string;
}

interface DisputeResolutionProps {
  deals: EscrowDeal[];
  onSubmitDispute: (dealId: string, disputeDetails: string) => void;
  isLoading?: boolean;
}

/**
 * Dispute Resolution Component
 * 
 * Provides a form for submitting disputes on escrow transactions
 * with deal selection and dispute details fields.
 * Matches the exact UI structure from the images.
 */
export function DisputeResolution({ 
  deals, 
  onSubmitDispute, 
  isLoading = false 
}: DisputeResolutionProps) {
  const [selectedDealId, setSelectedDealId] = useState("");
  const [disputeDetails, setDisputeDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDealId && disputeDetails) {
      onSubmitDispute(selectedDealId, disputeDetails);
      // Reset form after submission
      setSelectedDealId("");
      setDisputeDetails("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute Resolution</CardTitle>
        <p className="text-sm text-gray-600">
          If a dispute arises, submit details below for review. Our team will mediate and resolve within 7 business days.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal in Dispute
            </label>
            <Select value={selectedDealId} onValueChange={setSelectedDealId} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a deal" />
              </SelectTrigger>
              <SelectContent>
                {deals.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.deal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dispute Details
            </label>
            <Textarea
              placeholder="Describe the issue..."
              value={disputeDetails}
              onChange={(e) => setDisputeDetails(e.target.value)}
              rows={4}
              className="w-full"
              required
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              variant="destructive"
              className="w-full"
              disabled={isLoading}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              {isLoading ? "Submitting..." : "Submit Dispute for Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

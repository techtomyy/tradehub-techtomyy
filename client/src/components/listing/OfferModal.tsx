import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerAmount: string;
  onOfferAmountChange: (value: string) => void;
  onSubmit: () => void;
}

/**
 * Offer Modal Component
 * 
 * Modal dialog for users to make offers on assets.
 * Includes input field for offer amount and action buttons.
 */
export function OfferModal({ 
  isOpen, 
  onClose, 
  offerAmount, 
  onOfferAmountChange, 
  onSubmit 
}: OfferModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Enter your offer amount"
            value={offerAmount}
            onChange={(e) => onOfferAmountChange(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Submit Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

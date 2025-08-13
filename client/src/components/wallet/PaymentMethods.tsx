import { Button } from "@/components/ui/button";

interface SavedCard {
  type: string;
  last4: string;
}

interface PaymentMethodsProps {
  savedCards: SavedCard[];
  setAddCard: (show: boolean) => void;
}

/**
 * Payment Methods Component
 * 
 * Displays linked payment methods and options to add new cards or link bank accounts.
 */
export function PaymentMethods({ savedCards, setAddCard }: PaymentMethodsProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Linked Payment Method
      </label>
      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
        {savedCards.map((card, idx) => (
          <option key={idx}>
            {card.type} **** {card.last4}
          </option>
        ))}
      </select>
      <div className="flex gap-4 mt-3">
        <Button variant="secondary" onClick={() => setAddCard(true)}>
          Add New Card
        </Button>
        <Button variant="default" className="bg-green-600 hover:bg-green-700">
          Link Bank Account
        </Button>
      </div>
    </div>
  );
}

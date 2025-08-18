import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCardFormProps {
  cardNumber: string;
  setCardNumber: (number: string) => void;
  cardName: string;
  setCardName: (name: string) => void;
  cardDate: string;
  setCardDate: (date: string) => void;
  cardCvv: string;
  setCardCvv: (cvv: string) => void;
  cardType: string;
  getCardIcon: (cardType: string) => string;
  handleCardNumberChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearCardForm: () => void;
  handleSaveCard: () => void;
}

/**
 * Add Card Form Component
 * 
 * Displays the form for adding a new payment card with all required fields.
 * Optimized for mobile and desktop with responsive design.
 */
export function AddCardForm({ 
  cardNumber, 
  setCardNumber, 
  cardName, 
  setCardName, 
  cardDate, 
  setCardDate, 
  cardCvv, 
  setCardCvv, 
  cardType, 
  getCardIcon, 
  handleCardNumberChange, 
  clearCardForm, 
  handleSaveCard 
}: AddCardFormProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Add New Payment Card</h3>
        <p className="text-sm text-gray-500 mt-1">Enter your card details to save for future payments</p>
      </div>

      <div className="space-y-4">
        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardName" className="text-sm font-medium text-gray-700">
            Cardholder Name
          </Label>
          <Input
            id="cardName"
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Enter the name on your card"
            className="w-full h-11"
          />
        </div>

        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
            Card Number
          </Label>
          <div className="relative">
            <Input
              id="cardNumber"
              type="tel"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className="w-full h-11 pl-12 pr-4"
            />
            {cardNumber && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                {typeof getCardIcon(cardType) === 'string' && getCardIcon(cardType) === "💳" ? (
                  <span className="text-lg flex items-center justify-center">{getCardIcon(cardType)}</span>
                ) : (
                  <img
                    src={getCardIcon(cardType) as string}
                    alt={`${cardType} card`}
                    className="w-6 h-4 object-contain"
                  />
                )}
              </div>
            )}
          </div>
          {cardNumber && (
            <p className="text-sm text-gray-500">
              Detected: <span className="font-semibold text-gray-700">{cardType}</span>
            </p>
          )}
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cardDate" className="text-sm font-medium text-gray-700">
              Expiry Date
            </Label>
            <Input
              id="cardDate"
              type="month"
              value={cardDate}
              onChange={(e) => setCardDate(e.target.value)}
              className="w-full h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardCvv" className="text-sm font-medium text-gray-700">
              CVV/CVC
            </Label>
            <Input
              id="cardCvv"
              type="number"
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value)}
              placeholder="123"
              className="w-full h-11"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          onClick={clearCardForm}
          className="flex-1 h-11"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveCard}
          className="flex-1 h-11"
        >
          Save Card
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";

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
    <div className="p-4 border border-gray-300 rounded-md">
      <div>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Name on Card"
          className="w-80 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <div className="relative">
          <input
            type="tel"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="Card Number"
            className="w-80 mt-2 pl-10 pr-3 py-2 border border-gray-300 rounded-md"
          />
          {cardNumber && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
              {typeof getCardIcon(cardType) === 'string' && getCardIcon(cardType) === "💳" ? (
                <span className="text-lg flex items-center justify-center">{getCardIcon(cardType)}</span>
              ) : (
                <img
                  src={getCardIcon(cardType) as string}
                  alt={`${cardType} card`}
                  className="w-6 h-4 object-contain flex items-center justify-center"
                />
              )}
            </div>
          )}
        </div>
        {cardNumber && (
          <p className="text-sm text-gray-500 mt-1">
            Detected: <span className="font-semibold">{cardType}</span>
          </p>
        )}
      </div>
      <div>
        <input
          type="month"
          value={cardDate}
          onChange={(e) => setCardDate(e.target.value)}
          className="w-44 mt-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          value={cardCvv}
          onChange={(e) => setCardCvv(e.target.value)}
          placeholder="CVV/CVC"
          className="w-36 ml-2 mt-2 px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <Button className="mt-2 ml-44" variant="secondary" onClick={clearCardForm}>
          Cancel
        </Button>
        <Button className="mt-2 ml-2" variant="secondary" onClick={handleSaveCard}>
          Save
        </Button>
      </div>
    </div>
  );
}

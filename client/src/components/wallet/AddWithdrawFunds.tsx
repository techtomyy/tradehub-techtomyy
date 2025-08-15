import { Button } from "@/components/ui/button";

interface AddWithdrawFundsProps {
  addAmount: string;
  setAddAmount: (amount: string) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  handleAddFunds: () => void;
  handleWithdrawFunds: () => void;
}

/**
 * Add Withdraw Funds Component
 * 
 * Displays input fields and buttons for adding and withdrawing funds.
 */
export function AddWithdrawFunds({ 
  addAmount, 
  setAddAmount, 
  withdrawAmount, 
  setWithdrawAmount, 
  handleAddFunds, 
  handleWithdrawFunds 
}: AddWithdrawFundsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <input
          type="number"
          value={addAmount}
          onChange={(e) => setAddAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <Button onClick={handleAddFunds} className="mt-2 w-full">
          Add
        </Button>
      </div>
      <div>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <Button onClick={handleWithdrawFunds} className="mt-2 w-full">
          Withdraw
        </Button>
      </div>
    </div>
  );
}

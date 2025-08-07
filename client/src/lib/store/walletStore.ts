import { create } from 'zustand';

interface WalletState {
  balance: number;
  transactions: {
    date: string;
    type: string;
    amount: number;
    fee: number;
  }[];
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 2450,
  transactions: [
    { date: "2025-08-01", type: "Deposit", amount: 500, fee: 5 },
    { date: "2025-07-28", type: "Withdrawal", amount: 300, fee: 3 },
  ],
  addFunds: (amount) =>
    set((state) => ({
      balance: state.balance + amount,
      transactions: [
        {
          date: new Date().toISOString().split("T")[0],
          type: "Deposit",
          amount,
          fee: 5,
        },
        ...state.transactions,
      ],
    })),
  withdrawFunds: (amount) =>
    set((state) => ({
      balance: state.balance - amount,
      transactions: [
        {
          date: new Date().toISOString().split("T")[0],
          type: "Withdrawal",
          amount,
          fee: 3,
        },
        ...state.transactions,
      ],
    })),
}));

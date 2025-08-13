import { create } from 'zustand';

export type Currency = 'USD' | 'PKR';

interface WalletState {
  balance: number;
  selectedCurrency: Currency;
  conversionRate: number; // PKR to USD rate
  transactions: {
    date: string;
    type: string;
    amount: number;
    fee: number;
    currency: Currency;
  }[];
  addFunds: (amount: number, currency?: Currency) => void;
  withdrawFunds: (amount: number, currency?: Currency) => void;
  setCurrency: (currency: Currency) => void;
  getBalanceInCurrency: (currency: Currency) => number;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 2450, // Base balance in USD
  selectedCurrency: 'USD',
  conversionRate: 287, // 1 USD = 287 PKR (approximate)
  transactions: [
    { date: "2025-08-01", type: "Deposit", amount: 500, fee: 5, currency: 'USD' },
    { date: "2025-07-28", type: "Withdrawal", amount: 300, fee: 3, currency: 'USD' },
  ],
  
  addFunds: (amount, currency = 'USD') => {
    const state = get();
    const amountInUSD = currency === 'PKR' ? amount / state.conversionRate : amount;
    
    set((state) => ({
      balance: state.balance + amountInUSD,
      transactions: [
        {
          date: new Date().toISOString().split("T")[0],
          type: "Deposit",
          amount: amountInUSD,
          fee: 5,
          currency: 'USD',
        },
        ...state.transactions,
      ],
    }));
  },
  
  withdrawFunds: (amount, currency = 'USD') => {
    const state = get();
    const amountInUSD = currency === 'PKR' ? amount / state.conversionRate : amount;
    
    set((state) => ({
      balance: state.balance - amountInUSD,
      transactions: [
        {
          date: new Date().toISOString().split("T")[0],
          type: "Withdrawal",
          amount: amountInUSD,
          fee: 3,
          currency: 'USD',
        },
        ...state.transactions,
      ],
    }));
  },
  
  setCurrency: (currency) => set({ selectedCurrency: currency }),
  
  getBalanceInCurrency: (currency) => {
    const state = get();
    if (currency === 'USD') {
      return state.balance;
    } else {
      return state.balance * state.conversionRate;
    }
  },
  
  convertAmount: (amount, fromCurrency, toCurrency) => {
    const state = get();
    if (fromCurrency === toCurrency) {
      return amount;
    }
    if (fromCurrency === 'USD' && toCurrency === 'PKR') {
      return amount * state.conversionRate;
    } else {
      return amount / state.conversionRate;
    }
  },
}));

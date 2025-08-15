import { create } from 'zustand';

/**
 * Currency type definition
 * Supports USD (US Dollar) and PKR (Pakistani Rupee)
 */
export type Currency = 'USD' | 'PKR';

/**
 * Transaction record interface
 * Represents a single wallet transaction
 */
interface Transaction {
  date: string;
  type: string;
  amount: number;
  fee: number;
  currency: Currency;
}

/**
 * Wallet State Interface
 * Defines the structure and methods for the wallet store
 */
interface WalletState {
  // State properties
  balance: number;
  selectedCurrency: Currency;
  conversionRate: number; // PKR to USD rate
  escrowBalance: number; // Amount held in escrow
  
  // Transaction history
  transactions: Transaction[];
  
  // Actions
  addFunds: (amount: number, currency?: Currency) => void;
  withdrawFunds: (amount: number, currency?: Currency) => void;
  setCurrency: (currency: Currency) => void;
  getBalanceInCurrency: (currency: Currency) => number;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  getEscrowBalanceInCurrency: (currency: Currency) => number;
  updateEscrowBalance: (amount: number) => void;
}

// Constants
const DEFAULT_BALANCE = 2450; // Base balance in USD
const DEFAULT_CURRENCY: Currency = 'USD';
const DEFAULT_CONVERSION_RATE = 287; // 1 USD = 287 PKR (approximate)
const DEFAULT_ESCROW_BALANCE = 0; // Base escrow balance in USD
const DEPOSIT_FEE = 5;
const WITHDRAWAL_FEE = 3;

// Sample transaction data
const SAMPLE_TRANSACTIONS: Transaction[] = [
  { 
    date: "2025-08-01", 
    type: "Deposit", 
    amount: 500, 
    fee: DEPOSIT_FEE, 
    currency: 'USD' 
  },
  { 
    date: "2025-07-28", 
    type: "Withdrawal", 
    amount: 300, 
    fee: WITHDRAWAL_FEE, 
    currency: 'USD' 
  },
];

/**
 * Wallet Store
 * 
 * Manages wallet state including:
 * - Balance in USD
 * - Selected currency preference
 * - Currency conversion rates
 * - Transaction history
 * - Fund management operations
 */
export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial state
  balance: DEFAULT_BALANCE,
  selectedCurrency: DEFAULT_CURRENCY,
  conversionRate: DEFAULT_CONVERSION_RATE,
  escrowBalance: DEFAULT_ESCROW_BALANCE,
  transactions: SAMPLE_TRANSACTIONS,
  
  /**
   * Add funds to the wallet
   * 
   * @param amount - Amount to add
   * @param currency - Currency of the amount (defaults to USD)
   */
  addFunds: (amount, currency = 'USD') => {
    const state = get();
    
    // Handle invalid inputs
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      return;
    }
    
    const amountInUSD = currency === 'PKR' ? amount / state.conversionRate : amount;
    
    set((state) => ({
      balance: state.balance + amountInUSD,
      transactions: [
        {
          date: new Date().toISOString().split("T")[0],
          type: "Deposit",
          amount: amountInUSD,
          fee: DEPOSIT_FEE,
          currency: 'USD',
        },
        ...state.transactions,
      ],
    }));
  },
  
  /**
   * Withdraw funds from the wallet
   * 
   * @param amount - Amount to withdraw
   * @param currency - Currency of the amount (defaults to USD)
   */
  withdrawFunds: (amount, currency = 'USD') => {
    const state = get();
    
    // Handle invalid inputs
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      return;
    }
    
    const amountInUSD = currency === 'PKR' ? amount / state.conversionRate : amount;
    
    // Check if user has sufficient balance
    if (amountInUSD > state.balance) {
      return;
    }
    
    set((state) => ({
      balance: state.balance - amountInUSD,
      transactions: [
        {
          date: new Date().toISOString().split("T")[0],
          type: "Withdrawal",
          amount: amountInUSD,
          fee: WITHDRAWAL_FEE,
          currency: 'USD',
        },
        ...state.transactions,
      ],
    }));
  },
  
  /**
   * Set the selected currency for display
   * 
   * @param currency - The currency to set as selected
   */
  setCurrency: (currency) => {
    // Validate currency parameter
    if (currency !== 'USD' && currency !== 'PKR') {
      return;
    }
    set({ selectedCurrency: currency });
  },
  
  /**
   * Get wallet balance in a specific currency
   * 
   * @param currency - The currency to get balance in
   * @returns {number} Balance in the specified currency
   */
  getBalanceInCurrency: (currency) => {
    const state = get();
    
    // Handle invalid balance
    if (typeof state.balance !== 'number' || isNaN(state.balance)) {
      return 0;
    }
    
    if (currency === 'USD') {
      return state.balance;
    } else {
      return state.balance * state.conversionRate;
    }
  },
  
  /**
   * Convert amount between currencies
   * 
   * @param amount - Amount to convert
   * @param fromCurrency - Source currency
   * @param toCurrency - Target currency
   * @returns {number} Converted amount
   */
  convertAmount: (amount, fromCurrency, toCurrency) => {
    const state = get();
    
    // Handle invalid inputs
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 0;
    }
    
    // No conversion needed if currencies are the same
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    // Convert from USD to PKR
    if (fromCurrency === 'USD' && toCurrency === 'PKR') {
      return amount * state.conversionRate;
    } 
    // Convert from PKR to USD
    else {
      return amount / state.conversionRate;
    }
  },

  /**
   * Get escrow balance in a specific currency
   * 
   * @param currency - The currency to get escrow balance in
   * @returns {number} Escrow balance in the specified currency
   */
  getEscrowBalanceInCurrency: (currency) => {
    const state = get();
    
    // Handle invalid escrow balance
    if (typeof state.escrowBalance !== 'number' || isNaN(state.escrowBalance)) {
      return 0;
    }
    
    if (currency === 'USD') {
      return state.escrowBalance;
    } else {
      return state.escrowBalance * state.conversionRate;
    }
  },

  /**
   * Update escrow balance
   * 
   * @param amount - Amount to add/subtract from escrow balance
   */
  updateEscrowBalance: (amount) => {
    const state = get();
    
    // Handle invalid inputs
    if (typeof amount !== 'number' || isNaN(amount)) {
      return;
    }
    
    set((state) => ({
      escrowBalance: Math.max(0, state.escrowBalance + amount),
    }));
  },
}));

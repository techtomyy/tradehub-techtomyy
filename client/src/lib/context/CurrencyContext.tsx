import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletStore, Currency } from '@/lib/store/walletStore';

/**
 * Currency Context Type Definition
 * 
 * Provides currency-related functionality including:
 * - Selected currency state
 * - Currency conversion utilities
 * - Amount formatting
 * - Currency symbol retrieval
 */
interface CurrencyContextType {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  getBalanceInCurrency: (currency: Currency) => number;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  formatAmount: (amount: number, currency: Currency) => string;
  getCurrencySymbol: (currency: Currency) => string;
  conversionRate: number;
}

// Create the context with undefined as initial value
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

/**
 * Custom hook to use the currency context
 * 
 * @throws {Error} When used outside of CurrencyProvider
 * @returns {CurrencyContextType} The currency context value
 */
export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  
  return context;
};

// Provider props interface
interface CurrencyProviderProps {
  children: ReactNode;
}

/**
 * Currency Provider Component
 * 
 * Provides currency context to the application tree.
 * Integrates with the wallet store for currency management.
 */
export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  // Get currency-related state and functions from wallet store
  const selectedCurrency = useWalletStore((state) => state.selectedCurrency);
  const setCurrency = useWalletStore((state) => state.setCurrency);
  const getBalanceInCurrency = useWalletStore((state) => state.getBalanceInCurrency);
  const convertAmount = useWalletStore((state) => state.convertAmount);
  const conversionRate = useWalletStore((state) => state.conversionRate);

  /**
   * Get the currency symbol for a given currency
   * 
   * @param currency - The currency to get the symbol for
   * @returns {string} The currency symbol
   */
  const getCurrencySymbol = (currency: Currency): string => {
    return currency === 'USD' ? '$' : '₨';
  };

  /**
   * Format an amount with the appropriate currency symbol and formatting
   * 
   * @param amount - The amount to format
   * @param currency - The currency to format in
   * @returns {string} The formatted amount string
   */
  const formatAmount = (amount: number, currency: Currency): string => {
    const symbol = getCurrencySymbol(currency);
    
    if (currency === 'PKR') {
      // PKR amounts are rounded to whole numbers
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    } else {
      // USD amounts show 2 decimal places
      return `${symbol}${amount.toFixed(2)}`;
    }
  };

  // Create the context value object
  const value: CurrencyContextType = {
    selectedCurrency,
    setCurrency,
    getBalanceInCurrency,
    convertAmount,
    formatAmount,
    getCurrencySymbol,
    conversionRate,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

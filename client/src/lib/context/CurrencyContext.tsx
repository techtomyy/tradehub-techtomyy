import React, { createContext, useContext, ReactNode } from 'react';
import { useWalletStore, Currency } from '@/lib/store/walletStore';

interface CurrencyContextType {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  getBalanceInCurrency: (currency: Currency) => number;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  formatAmount: (amount: number, currency: Currency) => string;
  getCurrencySymbol: (currency: Currency) => string;
  conversionRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const selectedCurrency = useWalletStore((state) => state.selectedCurrency);
  const setCurrency = useWalletStore((state) => state.setCurrency);
  const getBalanceInCurrency = useWalletStore((state) => state.getBalanceInCurrency);
  const convertAmount = useWalletStore((state) => state.convertAmount);
  const conversionRate = useWalletStore((state) => state.conversionRate);

  const getCurrencySymbol = (currency: Currency) => {
    return currency === 'USD' ? '$' : '₨';
  };

  const formatAmount = (amount: number, currency: Currency) => {
    const symbol = getCurrencySymbol(currency);
    if (currency === 'PKR') {
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    } else {
      return `${symbol}${amount.toFixed(2)}`;
    }
  };

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

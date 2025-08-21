import { Currency } from "@/lib/store/walletStore";

export interface SavedCard {
  type: string;
  last4: string;
}

export interface Transaction {
  date: string;
  type: string;
  amount: number;
  fee: number;
}

export interface WalletHeaderProps {
  balance: number;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  getBalanceInCurrency: (currency: Currency) => number;
  setCurrency: (currency: Currency) => void;
}

export interface AddWithdrawFundsProps {
  addAmount: string;
  setAddAmount: (amount: string) => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  handleAddFunds: () => void;
  handleWithdrawFunds: () => void;
  selectedCurrency: 'USD' | 'PKR';
  formatAmount: (amount: number, currency: 'USD' | 'PKR') => string;
  convertAmount: (amount: number, fromCurrency: 'USD' | 'PKR', toCurrency: 'USD' | 'PKR') => number;
}

export interface PaymentMethodsProps {
  savedCards: SavedCard[];
  setAddCard: (show: boolean) => void;
}

export interface AddCardFormProps {
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

export interface TransactionHistoryProps {
  transactions: Transaction[];
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
}

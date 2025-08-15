import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { useWalletStore } from "@/lib/store/walletStore";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { 
  WalletHeader,
  AddWithdrawFunds,
  PaymentMethods,
  AddCardForm,
  TransactionHistory
} from "@/components/wallet";
import { SavedCard } from "@/types/wallet";
import visa from "../attached_assets/debit_payment_visa_icon.svg";
import mastercard from "../attached_assets/mastercard_payment_icon.svg";
import amex from "../attached_assets/amex_charge_credit card_payment_icon.svg";
import discover from "../attached_assets/discover_payment_icon.svg";
import jcb from "../attached_assets/jcb_payment_icon.svg";
import dinersclub from "../attached_assets/diners club_payment_icon.svg";

export default function WalletPage() {
    const { toast } = useToast();
    const balance = useWalletStore((state) => state.balance);
    const transactions = useWalletStore((state) => state.transactions);
    const addFunds = useWalletStore((state) => state.addFunds);
    const withdrawFunds = useWalletStore((state) => state.withdrawFunds);
    
    const { 
        selectedCurrency, 
        setCurrency, 
        getBalanceInCurrency, 
        convertAmount, 
        formatAmount 
    } = useCurrency();

    const [addAmount, setAddAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    // Card-related states
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardDate, setCardDate] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [addCard, setAddCard] = useState(false);
    const [cardType, setCardType] = useState("Unknown");

    // Saved cards
    const [savedCards, setSavedCards] = useState<SavedCard[]>([{ type: "Visa", last4: "1234" }]);

    // Get card type icon with unique symbols
    const getCardIcon = (cardType: string) => {
        switch (cardType) {
            case "Visa":
                return visa; // Visa symbol
            case "Mastercard":
                return mastercard; // Mastercard symbol
            case "American Express":
                return amex; // Amex symbol
            case "Discover":
                return discover; // Discover symbol
            case "JCB":
                return jcb; // JCB symbol
            case "Diners Club":
                return dinersclub; // Diners Club symbol
            default:
                return "💳"; // Default card icon
        }
    };

    // Detect card type
    const getCardType = (cardNumber: string) => {
        const cleanCardNumber = cardNumber.replace(/\D/g, '');

        if (/^4/.test(cleanCardNumber)) {
            return "Visa";
        } else if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(cleanCardNumber)) {
            return "Mastercard";
        } else if (/^3[47]/.test(cleanCardNumber)) {
            return "American Express";
        } else if (/^6(?:011|5)/.test(cleanCardNumber)) {
            return "Discover";
        } else if (/^35(2[89]|[3-8][0-9])/.test(cleanCardNumber)) {
            return "JCB";
        } else if (/^3(?:0[0-5]|[68])/.test(cleanCardNumber)) {
            return "Diners Club";
        }
        return "Unknown";
    };

    const handleAddFunds = () => {
        const amount = parseFloat(addAmount);
        if (!isNaN(amount)) {
            addFunds(amount, selectedCurrency);
            setAddAmount("");
        }
    };

    const handleWithdrawFunds = () => {
        const amount = parseFloat(withdrawAmount);
        if (!isNaN(amount)) {
            withdrawFunds(amount, selectedCurrency);
            setWithdrawAmount("");
        }
    };

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCardNumber = event.target.value;
        setCardNumber(newCardNumber);
        setCardType(getCardType(newCardNumber));
    };

    const clearCardForm = () => {
        setCardNumber("");
        setCardName("");
        setCardDate("");
        setCardCvv("");
        setCardType("Unknown");
        setAddCard(false);
    };

    const handleSaveCard = () => {
        if (!cardNumber || !cardName || !cardDate || !cardCvv) {
            toast({ title: "Fields Required", description: "Please enter all fields for saving card" });
        } else {
            const last4 = cardNumber.slice(-4);
            setSavedCards([...savedCards, { type: cardType, last4 }]);
            clearCardForm();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-4xl mx-auto py-12 px-4">
                {/* Wallet Header */}
                <WalletHeader 
                    balance={balance}
                    selectedCurrency={selectedCurrency}
                    formatAmount={formatAmount}
                    getBalanceInCurrency={getBalanceInCurrency}
                    setCurrency={setCurrency}
                />

                {/* Add / Withdraw Funds */}
                <AddWithdrawFunds 
                    addAmount={addAmount}
                    setAddAmount={setAddAmount}
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    handleAddFunds={handleAddFunds}
                    handleWithdrawFunds={handleWithdrawFunds}
                />

                {/* Linked Payment Method */}
                <PaymentMethods 
                    savedCards={savedCards}
                    setAddCard={setAddCard}
                />

                {/* Add Card Form */}
                {addCard && (
                    <AddCardForm 
                        cardNumber={cardNumber}
                        setCardNumber={setCardNumber}
                        cardName={cardName}
                        setCardName={setCardName}
                        cardDate={cardDate}
                        setCardDate={setCardDate}
                        cardCvv={cardCvv}
                        setCardCvv={setCardCvv}
                        cardType={cardType}
                        getCardIcon={getCardIcon}
                        handleCardNumberChange={handleCardNumberChange}
                        clearCardForm={clearCardForm}
                        handleSaveCard={handleSaveCard}
                    />
                )}

                {/* Transaction History */}
                <TransactionHistory 
                    transactions={transactions}
                    selectedCurrency={selectedCurrency}
                    formatAmount={formatAmount}
                    convertAmount={convertAmount}
                />
            </div>
        </div>
    );
}

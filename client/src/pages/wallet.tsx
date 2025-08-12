import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useWalletStore } from "@/lib/store/walletStore";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/context/CurrencyContext";
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
    const [savedCards, setSavedCards] = useState([{ type: "Visa", last4: "1234" }]);



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
                <Card>
                    <CardHeader>
                        <CardTitle>Wallet & Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-6">
                            <div className="text-sm text-gray-600">Current Balance</div>
                            <div className="text-3xl font-bold">
                                {formatAmount(getBalanceInCurrency(selectedCurrency), selectedCurrency)}
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-2">
                                <div className="text-sm text-gray-500">
                                    Currency: {selectedCurrency}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrency('USD')}
                                        className={`px-3 py-1 text-xs rounded-md ${
                                            selectedCurrency === 'USD' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        USD
                                    </button>
                                    <button
                                        onClick={() => setCurrency('PKR')}
                                        className={`px-3 py-1 text-xs rounded-md ${
                                            selectedCurrency === 'PKR' 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        PKR
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Add / Withdraw Funds */}
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

                        {/* Linked Payment Method */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Linked Payment Method
                            </label>
                            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                                {savedCards.map((card, idx) => (
                                    <option key={idx}>
                                        {card.type} **** {card.last4}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-4 mt-3">
                                <Button variant="secondary" onClick={() => setAddCard(true)}>
                                    Add New Card
                                </Button>
                                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                                    Link Bank Account
                                </Button>
                            </div>
                        </div>

                        {/* Add Card Form */}
                        {addCard && (
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
                        )}
                    </CardContent>
                </Card>

                {/* Transaction History */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-gray-200">
                                        <th className="py-2">Date</th>
                                        <th className="py-2">Type</th>
                                        <th className="py-2">Amount</th>
                                        <th className="py-2">Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((txn, idx) => (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-2">{txn.date}</td>
                                            <td className="py-2">{txn.type}</td>
                                            <td className="py-2">
                                                {formatAmount(convertAmount(txn.amount, 'USD', selectedCurrency), selectedCurrency)}
                                            </td>
                                            <td className="py-2">
                                                {formatAmount(convertAmount(txn.fee, 'USD', selectedCurrency), selectedCurrency)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

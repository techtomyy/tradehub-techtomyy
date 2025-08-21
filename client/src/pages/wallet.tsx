import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Banknote, 
  Wallet, 
  Zap,
  Shield,
  Gift
} from "lucide-react";
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
    const [showConfetti, setShowConfetti] = useState(false);

    // Card-related states
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardDate, setCardDate] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [addCard, setAddCard] = useState(false);
    const [cardType, setCardType] = useState("Unknown");

    // Saved cards
    const [savedCards, setSavedCards] = useState<SavedCard[]>([
        { type: "Visa", last4: "1234" },
        { type: "Mastercard", last4: "5678" }
    ]);

    // Mock data for enhanced features
    const [monthlySpending] = useState([
        { month: "Jan", amount: 1200 },
        { month: "Feb", amount: 1800 },
        { month: "Mar", amount: 1400 },
        { month: "Apr", amount: 2200 },
        { month: "May", amount: 1600 },
        { month: "Jun", amount: 1900 }
    ]);

    const [quickActions] = useState([
        { icon: CreditCard, label: "Add Card", color: "from-blue-500 to-purple-600" },
        { icon: Banknote, label: "Deposit", color: "from-green-500 to-emerald-600" },
        { icon: Wallet, label: "Withdraw", color: "from-orange-500 to-red-600" },
        { icon: Gift, label: "Rewards", color: "from-pink-500 to-rose-600" }
    ]);

    // Get card type icon with unique symbols
    const getCardIcon = (cardType: string) => {
        switch (cardType) {
            case "Visa":
                return visa;
            case "Mastercard":
                return mastercard;
            case "American Express":
                return amex;
            case "Discover":
                return discover;
            case "JCB":
                return jcb;
            case "Diners Club":
                return dinersclub;
            default:
                return "💳";
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
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            toast({ 
                title: "Funds Added!", 
                description: `Successfully added ${formatAmount(amount, selectedCurrency)} to your wallet` 
            });
        }
    };

    const handleWithdrawFunds = () => {
        const amount = parseFloat(withdrawAmount);
        if (!isNaN(amount)) {
            withdrawFunds(amount, selectedCurrency);
            setWithdrawAmount("");
            toast({ 
                title: "Withdrawal Successful!", 
                description: `Successfully withdrew ${formatAmount(amount, selectedCurrency)} from your wallet` 
            });
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
            toast({ title: "Card Saved!", description: "Your payment method has been added successfully" });
        }
    };

    // Calculate statistics
    const totalSpent = monthlySpending.reduce((sum, item) => sum + item.amount, 0);
    const avgSpending = totalSpent / monthlySpending.length;
    const spendingTrend = monthlySpending[monthlySpending.length - 1].amount > avgSpending ? "up" : "down";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Navigation />

            {/* Confetti Effect */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-50"
                    >
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: -10,
                                    rotate: 0
                                }}
                                animate={{
                                    y: window.innerHeight + 10,
                                    rotate: 360,
                                    x: Math.random() * window.innerWidth
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Enhanced Wallet Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                <WalletHeader 
                    balance={balance}
                    selectedCurrency={selectedCurrency}
                    formatAmount={formatAmount}
                    getBalanceInCurrency={getBalanceInCurrency}
                    setCurrency={setCurrency}
                />
                </motion.div>

                {/* Quick Actions Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-8"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={action.label}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                                onClick={() => {
                                    if (action.label === "Add Card") setAddCard(true);
                                    if (action.label === "Deposit") setAddAmount("100");
                                    if (action.label === "Withdraw") setWithdrawAmount("50");
                                }}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <action.icon className="w-6 h-6" />
                                    <span className="text-sm font-medium">{action.label}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Statistics Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatAmount(totalSpent, selectedCurrency)}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full ${spendingTrend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {spendingTrend === 'up' ? (
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {spendingTrend === 'up' ? '↗' : '↘'} {Math.abs(monthlySpending[monthlySpending.length - 1].amount - avgSpending).toFixed(0)}% from average
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Cards</p>
                                <p className="text-2xl font-bold text-gray-900">{savedCards.length}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100">
                                <CreditCard className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {savedCards.length > 1 ? 'Multiple payment methods' : 'Add more cards'}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Security Score</p>
                                <p className="text-2xl font-bold text-gray-900">98%</p>
                            </div>
                            <div className="p-3 rounded-full bg-emerald-100">
                                <Shield className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Excellent security rating
                        </p>
                    </div>
                </motion.div>

                {/* Enhanced Add / Withdraw Funds */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8"
                >
                <AddWithdrawFunds 
                    addAmount={addAmount}
                    setAddAmount={setAddAmount}
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    handleAddFunds={handleAddFunds}
                    handleWithdrawFunds={handleWithdrawFunds}
                    selectedCurrency={selectedCurrency}
                    formatAmount={formatAmount}
                    convertAmount={convertAmount}
                />
                </motion.div>

                {/* Enhanced Payment Methods */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8"
                >
                <PaymentMethods 
                    savedCards={savedCards}
                    setAddCard={setAddCard}
                />
                </motion.div>

                {/* Add Card Form */}
                <AnimatePresence>
                {addCard && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
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
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enhanced Transaction History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-8"
                >
                <TransactionHistory 
                    transactions={transactions}
                    selectedCurrency={selectedCurrency}
                    formatAmount={formatAmount}
                    convertAmount={convertAmount}
                />
                </motion.div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useWalletStore } from "@/lib/store/walletStore";

export default function WalletPage() {
    const balance = useWalletStore((state) => state.balance);
    const transactions = useWalletStore((state) => state.transactions);
    const addFunds = useWalletStore((state) => state.addFunds);
    const withdrawFunds = useWalletStore((state) => state.withdrawFunds);
    const [addAmount, setAddAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");


    const handleAddFunds = () => {
        const amount = parseFloat(addAmount);
        if (!isNaN(amount)) {
            addFunds(amount);
            setAddAmount("");
        }
    };

    const handleWithdrawFunds = () => {
        const amount = parseFloat(withdrawAmount);
        if (!isNaN(amount)) {
            withdrawFunds(amount);
            setWithdrawAmount("");
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
                            <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
                        </div>

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

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Linked Payment Method
                            </label>
                            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                                <option>Visa **** 1234</option>
                            </select>
                            <div className="flex gap-4 mt-3">
                                <Button variant="secondary">Add New Card</Button>
                                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                                    Link Bank Account
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                                            <td className="py-2">${txn.amount}</td>
                                            <td className="py-2">${txn.fee}</td>
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

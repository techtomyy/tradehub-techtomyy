import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";

// Example: static transactions (replace with API in real app)
const transactions = [
  {
    id: "1",
    amount: 2500,
    buyer: { name: "Buyer 1", verified: true },
    seller: {
      name: "Seller 1",
      verified: true,
      asset: "YouTube Channel",
      subscribers: "150K",
      price: 2500,
    },
    steps: ["Payment", "Escrow", "Transfer", "Complete"],
    currentStep: 3,
    messages: [
      { id: 1, sender: "You", text: "Payment completed.", time: "1h ago", type: "buyer" },
      { id: 2, sender: "Seller", text: "Thanks! Delivering credentials now.", time: "58m ago", type: "seller" },
    ],
  },
  {
    id: "2",
    amount: 1500,
    buyer: { name: "Buyer 2", verified: false },
    seller: {
      name: "Seller 2",
      verified: true,
      asset: "Instagram Handle",
      subscribers: "80K",
      price: 1500,
    },
    steps: ["Payment", "Escrow", "Transfer", "Complete"],
    currentStep: 2,
    messages: [
      { id: 1, sender: "You", text: "Waiting for payment.", time: "3h ago", type: "buyer" },
    ],
  },
];

export default function Message() {
  const [match, params] = useRoute("/message/:id");
  const transactionId = params?.id;

  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Transaction not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Buyer/Seller Info */}
        <div className="bg-white rounded-2xl shadow p-6">
          <a href="/inbox" className="text-sm text-blue-600 font-medium hover:underline flex items-center mb-6">
            ← Back to Inbox
          </a>
          <div className="text-center mb-6">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <p className="font-semibold text-gray-900">{transaction.buyer.name}</p>
            {transaction.buyer.verified && (
              <p className="text-green-600 text-sm font-medium">✔ Verified</p>
            )}
          </div>
          <hr />
          <div className="text-center mt-6">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <p className="font-semibold text-gray-900">{transaction.seller.name}</p>
            {transaction.seller.verified && (
              <p className="text-green-600 text-sm font-medium">✔ Verified</p>
            )}
            <p className="text-sm text-gray-600 mt-2">{transaction.seller.asset}</p>
            <p className="text-sm text-gray-600">{transaction.seller.subscribers} Subscribers</p>
            <p className="text-sm text-gray-600">Price: ${transaction.seller.price}</p>
          </div>
        </div>

        {/* Transaction & Messages */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Transaction #{transaction.id} - ${transaction.amount}
          </h2>

          {/* Steps */}
          <div className="relative mb-6">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-300">
              <div
                className="h-0.5 bg-green-500"
                style={{
                  width: `${((transaction.currentStep - 1) / (transaction.steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between relative">
              {transaction.steps.map((step, index) => {
                const isCompleted = index + 1 <= transaction.currentStep;
                return (
                  <div key={index} className="text-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border-2 z-10 relative ${isCompleted
                        ? "border-green-500 text-green-500 bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <p className={`text-sm mt-2 ${isCompleted ? "text-green-600" : "text-gray-400"}`}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4">
            {transaction.messages.map((msg) => (
              <div key={msg.id} className={`mb-3 ${msg.type === "buyer" ? "text-right" : "text-left"}`}>
                <p
                  className={`inline-block px-4 py-2 rounded-lg ${msg.type === "buyer" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                    }`}
                >
                  {msg.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender} • {msg.time}
                </p>
              </div>
            ))}
          </div>


          {/* Input */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mt-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 min-w-0 border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button className="shrink-0 bg-green-700 text-white px-4 py-2 rounded-lg hover-golden">
              Send
            </button>
          </div>


        </div>
      </div>
    </div>
  );
}

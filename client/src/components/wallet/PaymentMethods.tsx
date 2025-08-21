import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Building2, Shield, Zap } from "lucide-react";

interface SavedCard {
  type: string;
  last4: string;
}

interface PaymentMethodsProps {
  savedCards: SavedCard[];
  setAddCard: (show: boolean) => void;
}

/**
 * Enhanced Payment Methods Component
 * 
 * Displays linked payment methods with beautiful card designs and 3D effects.
 */
export function PaymentMethods({ savedCards, setAddCard }: PaymentMethodsProps) {
  const getCardIcon = (cardType: string) => {
    switch (cardType) {
      case "Visa":
        return "💳";
      case "Mastercard":
        return "💳";
      case "American Express":
        return "💳";
      default:
        return "💳";
    }
  };

  const getCardGradient = (cardType: string) => {
    switch (cardType) {
      case "Visa":
        return "from-blue-500 to-indigo-600";
      case "Mastercard":
        return "from-orange-500 to-red-600";
      case "American Express":
        return "from-green-500 to-emerald-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Payment Methods
          </h3>
          <p className="text-sm text-gray-600 mt-1">Manage your cards and bank accounts</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddCard(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </motion.button>
      </div>

      {/* Saved Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-3xl">
        {savedCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ 
              y: -8,
              rotateY: 5,
              scale: 1.02
            }}
            className="group cursor-pointer"
          >
            <div className={`relative bg-gradient-to-br ${getCardGradient(card.type)} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform perspective-1000`}>
              {/* Card Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30"></div>
              
              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl">{getCardIcon(card.type)}</div>
                  <Shield className="w-5 h-5 opacity-80" />
                </div>
                
                <div className="mb-4">
                  <p className="text-sm opacity-80 mb-1">Card Number</p>
                  <p className="text-lg font-mono font-semibold">**** **** **** {card.last4}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80 mb-1">Card Type</p>
                    <p className="font-semibold">{card.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80 mb-1">Status</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Card Placeholder */}
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          className="group cursor-pointer"
          onClick={() => setAddCard(true)}
        >
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all duration-300 group-hover:bg-blue-50">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors duration-300">
              <Plus className="w-6 h-6" />
            </div>
            <p className="font-medium text-sm">Add New Card</p>
            <p className="text-xs text-center mt-1">Click to add a new payment method</p>
          </div>
        </motion.div>
      </div>

      {/* Bank Account Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Link Bank Account</h4>
              <p className="text-sm text-gray-600">Connect your bank for instant transfers</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Zap className="w-4 h-4" />
            Connect Bank
          </motion.button>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Fraud Protection</p>
              <p className="text-xs text-gray-600">24/7 monitoring</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Instant Transfers</p>
              <p className="text-xs text-gray-600">Real-time processing</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Multiple Cards</p>
              <p className="text-xs text-gray-600">Flexible payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

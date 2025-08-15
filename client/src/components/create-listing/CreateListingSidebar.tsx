import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, Clock, Shield, Wallet } from "lucide-react";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { useWalletStore } from "@/lib/store/walletStore";
import { Link } from "wouter";

/**
 * Create Listing Sidebar Component
 * 
 * Displays helpful information and guidelines for creating
 * a listing in the right sidebar.
 */
export function CreateListingSidebar() {
  const { selectedCurrency, formatAmount } = useCurrency();
  const { balance } = useWalletStore();
  
  // Placeholder escrow balance - can be updated when escrow functionality is added
  const escrowBalance = 0;

  const guidelines = [
    {
      icon: CheckCircle,
      title: "Be Honest",
      description: "Provide accurate information about your asset. Misleading listings will be rejected."
    },
    {
      icon: Shield,
      title: "Verification Required",
      description: "All listings go through a verification process before being published."
    },
    {
      icon: Clock,
      title: "24-48 Hours",
      description: "Verification typically takes 24-48 hours during business days."
    }
  ];

  const tips = [
    "Include high-quality screenshots as proof of ownership",
    "Be specific about engagement rates and monetization",
    "Provide detailed descriptions of your audience",
    "Set realistic pricing based on market value",
    "Include any unique features or advantages"
  ];

  return (
    <div className="space-y-6">
      {/* Wallet & Escrow Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wallet className="h-5 w-5 mr-2 text-green-600" />
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Wallet Balance</span>
            <span className="text-sm font-medium text-green-600">
              {formatAmount(balance, selectedCurrency)}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">In Escrow</span>
            <span className="text-sm font-medium text-amber-600">
              {formatAmount(escrowBalance, selectedCurrency)}
            </span>
          </div>
          <Separator />
          <Link href="/wallet">
            <Button variant="outline" size="sm" className="w-full hover-golden">
              Add Funds
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
            Listing Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-3">
              <guideline.icon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">{guideline.title}</h4>
                <p className="text-sm text-gray-600">{guideline.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 text-sm mt-1">•</span>
                <span className="text-sm text-gray-600">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            If you have questions about creating a listing or need assistance, our support team is here to help.
          </p>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Contact Support
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

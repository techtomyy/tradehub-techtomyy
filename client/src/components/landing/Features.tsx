import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star } from "lucide-react";

/**
 * Features Component
 * 
 * Displays the key features and benefits of the platform
 * with a list of advantages and a trust card.
 */
export function Features() {
  const features = [
    "100% secure escrow protection",
    "Asset verification before listing",
    "24/7 dispute resolution support",
    "Transparent fee structure (2.5% each)",
    "User rating & review system"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose AssetVault?</h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-12 w-12 text-yellow-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Trusted by Thousands</h4>
                <p className="text-gray-600">Join thousands of successful buyers and sellers who trust AssetVault for their digital asset transactions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

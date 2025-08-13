import { Shield, CheckCircle, Star } from "lucide-react";

/**
 * Security Features Component
 * 
 * Displays the security features and protections available
 * for the purchase transaction.
 */
export function SecurityFeatures() {
  const features = [
    { icon: Shield, text: "Protected by escrow" },
    { icon: CheckCircle, text: "72-hour verification period" },
    { icon: Star, text: "Dispute resolution available" }
  ];

  return (
    <div className="space-y-2 text-sm text-gray-600">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center">
          <feature.icon className="h-4 w-4 mr-2 text-emerald-500" />
          <span>{feature.text}</span>
        </div>
      ))}
    </div>
  );
}

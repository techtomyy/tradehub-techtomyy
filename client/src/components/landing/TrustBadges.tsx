import { Shield, Users, MessageSquare, Gavel } from "lucide-react";

/**
 * Trust Badges Component
 * 
 * Displays trust badges and features that build confidence
 * in the platform's security and reliability.
 */
export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "Escrow Protection",
      description: "Funds held safely until verified"
    },
    {
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      title: "Verified Users",
      description: "KYC verification for trust"
    },
    {
      icon: MessageSquare,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      title: "Secure Chat",
      description: "Encrypted communication"
    },
    {
      icon: Gavel,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Dispute Resolution",
      description: "Fair mediation process"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${badge.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <badge.icon className={`h-8 w-8 ${badge.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

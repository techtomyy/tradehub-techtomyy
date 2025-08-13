import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Gavel, Users } from "lucide-react";

/**
 * Security Section Component
 * 
 * Displays detailed information about the platform's security measures
 * and protection features.
 */
export function SecuritySection() {
  const securityFeatures = [
    {
      icon: Shield,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "Escrow Protection",
      description: "100% of all funds are held securely in our trusted escrow system until both parties confirm satisfaction."
    },
    {
      icon: CheckCircle,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Two-Factor Authentication",
      description: "Enhanced account security with SMS and app-based 2FA protection for all users."
    },
    {
      icon: Gavel,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Regulatory Compliance",
      description: "Fully licensed and compliant with international financial regulations and standards."
    },
    {
      icon: Users,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      title: "24/7 Monitoring",
      description: "Continuous security monitoring and threat detection systems protect your transactions."
    }
  ];

  const securityLayers = [
    "Application Security",
    "Infrastructure Security",
    "Data Encryption",
    "User Authentication"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Security is Our Priority</h2>
          <p className="text-xl text-gray-600">We employ industry-leading security measures to protect your assets and personal information.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <Card className="border-0 shadow-2xl bg-gradient-to-b from-blue-500 to-emerald-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Multi-Layer Security</h3>
                <p className="text-blue-100 mb-6">Your assets protected at every level</p>
                
                <div className="space-y-4">
                  {securityLayers.map((layer, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-white" />
                      <span className="font-medium">{layer}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

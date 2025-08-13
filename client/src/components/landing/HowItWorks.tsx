import { TrendingUp, Shield, MessageSquare, CheckCircle } from "lucide-react";

/**
 * How It Works Component
 * 
 * Displays the step-by-step process of how the escrow system works
 * with numbered steps and descriptions.
 */
export function HowItWorks() {
  const steps = [
    {
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      stepNumber: "1",
      title: "Browse & Select",
      description: "Find the perfect digital asset from our verified marketplace"
    },
    {
      icon: Shield,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      stepNumber: "2",
      title: "Secure Payment",
      description: "Funds are held safely in our escrow system until verification"
    },
    {
      icon: MessageSquare,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      stepNumber: "3",
      title: "Asset Transfer",
      description: "Seller provides credentials through our secure messaging system"
    },
    {
      icon: CheckCircle,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      stepNumber: "4",
      title: "Verification & Release",
      description: "Verify the asset and funds are released to the seller"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Escrow System Works</h2>
          <p className="text-xl text-gray-600">Safe, secure, and transparent transactions every time</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`${step.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative`}>
                <step.icon className={`h-8 w-8 ${step.iconColor}`} />
                <span className={`absolute -top-2 -right-2 ${step.iconColor.replace('text-', 'bg-')} text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold`}>
                  {step.stepNumber}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

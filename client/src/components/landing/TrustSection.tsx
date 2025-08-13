import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

/**
 * Trust Section Component
 * 
 * Displays customer testimonials and reviews to build trust
 * in the platform's reliability and user satisfaction.
 */
export function TrustSection() {
  const testimonials = [
    {
      rating: 5,
      quote: "AssetVault made selling my Instagram account incredibly easy. The escrow system gave me peace of mind, and the verification process was smooth.",
      author: "John Davis",
      initials: "JD",
      role: "Social Media Seller",
      bgColor: "bg-blue-500"
    },
    {
      rating: 5,
      quote: "I've bought multiple YouTube channels through AssetVault. The platform's security and verification process is unmatched in the industry.",
      author: "Sarah Miller",
      initials: "SM",
      role: "Content Creator",
      bgColor: "bg-emerald-500"
    },
    {
      rating: 5,
      quote: "The dispute resolution system is excellent. When I had an issue, the support team resolved it quickly and fairly. Highly recommend!",
      author: "Robert Johnson",
      initials: "RJ",
      role: "Digital Asset Investor",
      bgColor: "bg-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Traders Worldwide</h2>
          <p className="text-xl text-gray-600">See what our users have to say about their trading experience.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <div className={`w-10 h-10 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
                    {testimonial.initials}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

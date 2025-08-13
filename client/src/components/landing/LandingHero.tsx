import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Landing Hero Component
 * 
 * Displays the main hero section for the landing page
 * with title, description, call-to-action buttons, and stats.
 */
export function LandingHero() {
  const stats = [
    { value: "$2.5M+", label: "Total Volume" },
    { value: "15,000+", label: "Assets Sold" },
    { value: "99.8%", label: "Success Rate" }
  ];

  return (
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Buy & Sell Digital Assets
          <br />
          <span className="text-blue-200">Safely & Securely</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Trade Instagram pages, YouTube channels, TikTok accounts, and more with our secure escrow protection. 
          Your transactions are protected every step of the way.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
            >
              Get Started Now
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-primary hover:bg-white"
          >
            Learn How It Works
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

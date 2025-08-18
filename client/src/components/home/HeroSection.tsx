import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Hero Section Component
 * 
 * Displays the main hero section with title, description,
 * call-to-action buttons, and platform statistics.
 */
export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-12 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">
              Buy & Sell Digital Assets
              <span className="text-blue-200 block">Securely</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-xl mb-6 sm:mb-7 md:mb-8 text-blue-100">
              The trusted marketplace for Instagram pages, YouTube channels, TikTok accounts, and more.
              Protected by our escrow system.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-50 w-full sm:w-auto">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button size="lg" variant="outline" className="border-white text-primary hover:bg-gray-50 w-full sm:w-auto">
                  List Your Asset
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <PlatformStats />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Platform Stats Component
 * 
 * Displays platform statistics in a grid format
 * within the hero section.
 */
function PlatformStats() {
  const stats = [
    { value: "$2.5M+", label: "Total Volume" },
    { value: "15K+", label: "Assets Sold" },
    { value: "99.8%", label: "Success Rate" },
    { value: "5K+", label: "Active Users" }
  ];

  return (
    <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-4">Platform Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-blue-200 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Buy & Sell Digital Assets
              <span className="text-blue-200 block">Securely</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              The trusted marketplace for Instagram pages, YouTube channels, TikTok accounts, and more.
              Protected by our escrow system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button size="lg" variant="outline" className="border-white text-primary hover:bg-gray-50">
                  List Your Asset
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
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

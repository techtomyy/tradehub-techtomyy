import { Button } from "@/components/ui/button";
import { Link } from "wouter";

/**
 * Final CTA Component
 * 
 * Displays the final call-to-action section encouraging users
 * to create an account and start trading.
 */
export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-500 to-emerald-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Start Trading?</h2>
        <p className="text-xl text-blue-100 mb-10">
          Join thousands of users who trust AssetVault for their digital asset trading needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 border-2 border-white font-semibold px-8 py-4"
            >
              Create Free Account
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white bg-transparent text-white"
          >
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
}

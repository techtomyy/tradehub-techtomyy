import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, MessageSquare, Gavel, TrendingUp, Star, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AssetVault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Learn How It Works
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">$2.5M+</div>
              <div className="text-blue-200">Total Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold">15,000+</div>
              <div className="text-blue-200">Assets Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.8%</div>
              <div className="text-blue-200">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Escrow Protection</h3>
              <p className="text-sm text-gray-600">Funds held safely until verified</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Users</h3>
              <p className="text-sm text-gray-600">KYC verification for trust</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Chat</h3>
              <p className="text-sm text-gray-600">Encrypted communication</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dispute Resolution</h3>
              <p className="text-sm text-gray-600">Fair mediation process</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Escrow System Works</h2>
            <p className="text-xl text-gray-600">Safe, secure, and transparent transactions every time</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <TrendingUp className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse & Select</h3>
              <p className="text-sm text-gray-600">Find the perfect digital asset from our verified marketplace</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Shield className="h-8 w-8 text-amber-600" />
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Funds are held safely in our escrow system until verification</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Asset Transfer</h3>
              <p className="text-sm text-gray-600">Seller provides credentials through our secure messaging system</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verification & Release</h3>
              <p className="text-sm text-gray-600">Verify the asset and funds are released to the seller</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose AssetVault?</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700">100% secure escrow protection</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Asset verification before listing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700">24/7 dispute resolution support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Transparent fee structure (2.5% each)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700">User rating & review system</span>
                </li>
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

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our secure marketplace today and discover thousands of verified digital assets.
          </p>
          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
            >
              Sign Up Now - It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AssetVault</h3>
              <p className="text-gray-400">The trusted marketplace for digital asset transactions with secure escrow protection.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Browse Assets</a></li>
                <li><a href="#" className="hover:text-white">Sell Assets</a></li>
                <li><a href="#" className="hover:text-white">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Safety Tips</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Fees</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AssetVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
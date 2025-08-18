import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Globe, 
  Play, 
  Mail, 
  Crown,
  Smartphone,
  Code,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle
} from "lucide-react";

interface FormSelectorProps {
  onFormSelect: (formType: string) => void;
  selectedForm: string;
}

/**
 * Form Selector Component
 * 
 * Enhanced UI for choosing the appropriate form based on the type of asset
 * they want to list.
 */
export function FormSelector({ onFormSelect, selectedForm }: FormSelectorProps) {
  const formOptions = [
    {
      id: "social-media",
      title: "Social Media",
      description: "Instagram, YouTube, TikTok, Twitter accounts",
      icon: Instagram,
      color: "from-pink-500 via-purple-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
      borderColor: "border-pink-200",
      hoverColor: "hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700",
      examples: ["Instagram pages", "YouTube channels", "TikTok accounts", "Twitter profiles"],
      features: ["Followers", "Engagement", "Monetization", "Content Niche"],
      popular: true,
      stats: "Most Popular"
    },
    {
      id: "website-apps",
      title: "Websites & Apps",
      description: "Websites, web apps, mobile apps, desktop software",
      icon: Globe,
      color: "from-blue-500 via-cyan-500 to-teal-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:from-blue-600 hover:via-cyan-600 hover:to-teal-700",
      examples: ["E-commerce sites", "SaaS platforms", "Mobile apps", "Desktop software"],
      features: ["Traffic", "Technology Stack", "Monetization", "Platform Support"],
      popular: false,
      stats: "High Value"
    },
    {
      id: "premium-subscriptions",
      title: "Premium Subscriptions",
      description: "Netflix, Prime Video, gaming subscriptions, software licenses",
      icon: Crown,
      color: "from-amber-500 via-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      hoverColor: "hover:from-amber-600 hover:via-orange-600 hover:to-red-700",
      examples: ["Streaming services", "Gaming subscriptions", "Software licenses", "Music services"],
      features: ["Service Type", "Subscription Plan", "Premium Features", "Concurrent Users"],
      popular: true,
      stats: "Fast Selling"
    },
    {
      id: "other-assets",
      title: "Other Assets",
      description: "Email accounts, gaming accounts, crypto wallets, domains",
      icon: Shield,
      color: "from-emerald-500 via-teal-500 to-cyan-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      hoverColor: "hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700",
      examples: ["Email accounts", "Gaming accounts", "Crypto wallets", "Domain names"],
      features: ["Rarity", "Security", "Verification", "Special Features"],
      popular: false,
      stats: "Unique Assets"
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="text-3xl font-bold text-gray-900">
          Choose Your Asset Type
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Select the category that best describes your digital asset. Each form is tailored with 
          specific fields and validation for optimal user experience and faster listing creation.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Tailored Forms</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Smart Validation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Quick Setup</span>
          </div>
        </div>
      </div>

      {/* Asset Type Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {formOptions.map((option) => (
          <Card 
            key={option.id}
            className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 relative overflow-hidden ${
              selectedForm === option.id 
                ? 'ring-2 ring-primary ring-offset-4 shadow-xl scale-105' 
                : 'hover:border-gray-300 hover:shadow-lg'
            } ${option.bgColor} ${option.borderColor}`}
            onClick={() => onFormSelect(option.id)}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-transparent transform rotate-12 scale-150"></div>
            </div>

            <CardContent className="p-8 relative z-10">
              {/* Header with Icon and Stats */}
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${option.color} text-white shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110`}>
                  <option.icon className="h-8 w-8" />
                </div>
                <div className="text-right">
                  {option.popular && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 mb-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <div className="text-xs font-medium text-gray-600 bg-white/70 px-2 py-1 rounded-full">
                    {option.stats}
                  </div>
                </div>
              </div>

              {/* Title and Description */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                  {option.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {option.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                  Key Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {option.features.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-white/80 border-gray-200 text-gray-700 hover:bg-white transition-colors"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                  Examples
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {option.examples.join(" • ")}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <Button 
                  variant={selectedForm === option.id ? "default" : "outline"}
                  className={`w-full group-hover:scale-105 transition-all duration-300 ${
                    selectedForm === option.id 
                      ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFormSelect(option.id);
                  }}
                >
                  {selectedForm === option.id ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Selected</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Choose This Type</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg pointer-events-none`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="text-center space-y-4 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">All forms include basic asset information and proof requirements</span>
        </div>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Need help choosing? Contact our support team for guidance on the best form for your asset. 
          We're here to help you create the perfect listing!
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { 
  CreateListingHeader,
  FormSelector,
  SocialMediaForm,
  WebsiteAppsForm,
  PremiumSubscriptionForm,
  OtherAssetsForm,
  CreateListingSidebar
} from "@/components/create-listing";
import { ChevronRight, Home, Plus, FileText } from "lucide-react";

// Base schema for common fields
const baseSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  featured: z.boolean().default(false),
});

// Social Media Schema
const socialMediaSchema = baseSchema.extend({
  platform: z.enum(["instagram", "youtube", "tiktok", "twitter"]),
  profileUrl: z.string().url("Please enter a valid profile URL"),
  profileUsername: z.string().min(1, "Username is required"),
  followers: z.string().min(1, "Followers count is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Followers must be a positive number"),
  engagement: z.string().min(1, "Engagement rate is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, "Engagement must be between 0-100%"),
  monthlyViews: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly views must be a non-negative number"),
  monthlyRevenue: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly revenue must be a non-negative number"),
  accountAge: z.string().min(1, "Account age is required"),
  niche: z.string().min(1, "Niche is required"),
  isVerified: z.boolean().default(false),
  hasMonetization: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
});

// Website & Apps Schema
const websiteAppsSchema = baseSchema.extend({
  assetType: z.enum(["website", "webapp", "mobile-app", "desktop-app"]),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  domainName: z.string().optional(),
  monthlyVisitors: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly visitors must be a non-negative number"),
  monthlyRevenue: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly revenue must be a non-negative number"),
  technology: z.string().optional(),
  platform: z.string().optional(),
  hasMonetization: z.boolean().default(false),
  hasAds: z.boolean().default(false),
  hasSubscription: z.boolean().default(false),
  hasEcommerce: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
});

// Premium Subscription Schema
const premiumSubscriptionSchema = baseSchema.extend({
  serviceType: z.enum(["streaming", "gaming", "software", "music", "other"]),
  serviceName: z.string().min(1, "Service name is required"),
  subscriptionType: z.enum(["monthly", "yearly", "lifetime"]),
  originalPrice: z.string().optional(),
  accountAge: z.string().min(1, "Account age is required"),
  concurrentUsers: z.string().min(1, "Number of concurrent users is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Concurrent users must be a positive number"),
  hasPremiumFeatures: z.boolean().default(false),
  hasAdFree: z.boolean().default(false),
  hasOfflineAccess: z.boolean().default(false),
  hasFamilyPlan: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
});

// Other Assets Schema
const otherAssetsSchema = baseSchema.extend({
  assetType: z.enum(["email", "gaming-account", "crypto-wallet", "domain", "software-license", "other"]),
  assetName: z.string().min(1, "Asset name is required"),
  accountAge: z.string().optional(),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]).optional(),
  hasTwoFactor: z.boolean().default(false),
  hasRecoveryEmail: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  hasSpecialFeatures: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
});

type SocialMediaForm = z.infer<typeof socialMediaSchema>;
type WebsiteAppsForm = z.infer<typeof websiteAppsSchema>;
type PremiumSubscriptionForm = z.infer<typeof premiumSubscriptionSchema>;
type OtherAssetsForm = z.infer<typeof otherAssetsSchema>;

type FormData = SocialMediaForm | WebsiteAppsForm | PremiumSubscriptionForm | OtherAssetsForm;

export default function CreateListing() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedForm, setSelectedForm] = useState<string>("");
  const { selectedCurrency } = useCurrency();

  // Create forms for each type
  const socialMediaForm = useForm<SocialMediaForm>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      title: "",
      description: "",
      platform: "instagram",
      price: "",
      profileUrl: "",
      profileUsername: "",
      followers: "",
      engagement: "",
      monthlyViews: "",
      monthlyRevenue: "",
      accountAge: "",
      niche: "",
      isVerified: false,
      hasMonetization: false,
      featured: false,
    },
  });

  const websiteAppsForm = useForm<WebsiteAppsForm>({
    resolver: zodResolver(websiteAppsSchema),
    defaultValues: {
      title: "",
      description: "",
      assetType: "website",
      price: "",
      url: "",
      domainName: "",
      monthlyVisitors: "",
      monthlyRevenue: "",
      technology: "",
      platform: "",
      hasMonetization: false,
      hasAds: false,
      hasSubscription: false,
      hasEcommerce: false,
      featured: false,
    },
  });

  const premiumSubscriptionForm = useForm<PremiumSubscriptionForm>({
    resolver: zodResolver(premiumSubscriptionSchema),
    defaultValues: {
      title: "",
      description: "",
      serviceType: "streaming",
      serviceName: "",
      price: "",
      subscriptionType: "monthly",
      originalPrice: "",
      accountAge: "",
      concurrentUsers: "",
      hasPremiumFeatures: false,
      hasAdFree: false,
      hasOfflineAccess: false,
      hasFamilyPlan: false,
      featured: false,
    },
  });

  const otherAssetsForm = useForm<OtherAssetsForm>({
    resolver: zodResolver(otherAssetsSchema),
    defaultValues: {
      title: "",
      description: "",
      assetType: "email",
      price: "",
      assetName: "",
      accountAge: "",
      rarity: "common",
      hasTwoFactor: false,
      hasRecoveryEmail: false,
      isVerified: false,
      hasSpecialFeatures: false,
      featured: false,
    },
  });

  const handleFormSelect = (formType: string) => {
    setSelectedForm(formType);
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Listing Created",
        description: `Your ${selectedForm.replace('-', ' ')} listing has been created and is pending verification.`,
      });
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }, 1500);
  };

  const renderForm = () => {
    switch (selectedForm) {
      case "social-media":
        return (
          <SocialMediaForm
            form={socialMediaForm}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            selectedCurrency={selectedCurrency}
          />
        );
      case "website-apps":
        return (
          <WebsiteAppsForm
            form={websiteAppsForm}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            selectedCurrency={selectedCurrency}
          />
        );
      case "premium-subscriptions":
        return (
          <PremiumSubscriptionForm
            form={premiumSubscriptionForm}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            selectedCurrency={selectedCurrency}
          />
        );
      case "other-assets":
        return (
          <OtherAssetsForm
            form={otherAssetsForm}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            selectedCurrency={selectedCurrency}
          />
        );
      default:
        return <FormSelector onFormSelect={handleFormSelect} selectedForm={selectedForm} />;
    }
  };

  const getFormTitle = () => {
    switch (selectedForm) {
      case "social-media": return "Social Media Asset";
      case "website-apps": return "Website & Apps Asset";
      case "premium-subscriptions": return "Premium Subscription Asset";
      case "other-assets": return "Other Digital Asset";
      default: return "Create New Listing";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <a href="/" className="flex items-center hover:text-gray-700 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Home
          </a>
          <ChevronRight className="h-4 w-4" />
          <a href="/dashboard" className="flex items-center hover:text-gray-700 transition-colors">
            <FileText className="h-4 w-4 mr-1" />
            Dashboard
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="flex items-center text-gray-900 font-medium">
            <Plus className="h-4 w-4 mr-1" />
            {getFormTitle()}
          </span>
        </nav>

        {/* Header */}
        <CreateListingHeader />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {renderForm()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CreateListingSidebar />
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {selectedForm && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Form Type Selected: {getFormTitle()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

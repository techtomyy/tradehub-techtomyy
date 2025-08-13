import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { 
  CreateListingHeader,
  CreateListingForm,
  CreateListingSidebar
} from "@/components/create-listing";

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["instagram", "youtube", "tiktok", "twitter", "website"], {
    required_error: "Please select a category",
  }),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  assetUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" }),
  followers: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Followers must be a non-negative number"),
  engagement: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), "Engagement must be between 0-100%"),
  monthlyViews: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly views must be a non-negative number"),
  monthlyRevenue: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly revenue must be a non-negative number"),
  featured: z.boolean().default(false),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

export default function CreateListing() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedCurrency } = useCurrency();

  const form = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "Travel Photography Instagram Account",
      description: "High-quality travel photography Instagram account with engaged audience. Features stunning landscape and city photography from around the world. Strong engagement rate with travel enthusiasts and photography lovers. Monetized through sponsored posts and affiliate marketing.",
      category: "instagram",
      price: "2500",
      assetUrl: "https://instagram.com/travelphotography_demo",
      followers: "15000",
      engagement: "4.2",
      monthlyViews: "45000",
      monthlyRevenue: "800",
      featured: false,
    },
  });

  const onSubmit = async (data: CreateListingForm) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success message with image info if provided
      const imageInfo = data.assetProofImage 
        ? ` with proof screenshot (${data.assetProofImage.name})`
        : '';
      
      toast({
        title: "Listing Created",
        description: `Your asset listing has been created${imageInfo} and is pending verification.`,
      });
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <CreateListingHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <CreateListingForm 
              form={form}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              selectedCurrency={selectedCurrency}
            />
          </div>

          {/* Sidebar */}
                    <div>
            <CreateListingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

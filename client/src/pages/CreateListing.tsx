import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { Link } from "wouter";

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
  const { selectedCurrency, getCurrencySymbol } = useCurrency();

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

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'instagram': return 'Instagram pages, accounts, and profiles';
      case 'youtube': return 'YouTube channels with subscribers and content';
      case 'tiktok': return 'TikTok accounts with followers and engagement';
      case 'twitter': return 'Twitter accounts and profiles';
      case 'website': return 'Websites, domains, and web properties';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Digital Asset</h1>
          <p className="text-gray-600">
            Create a listing for your digital asset. All listings go through verification before being published.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Asset Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Travel Photography Instagram" {...field} />
                            </FormControl>
                            <FormDescription>
                              Choose a clear, descriptive title for your asset
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select asset category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="website">Website</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {field.value && getCategoryDescription(field.value)}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your asset, its audience, engagement, monetization potential, etc."
                                className="h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide detailed information about your asset to attract buyers
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                                                          <FormLabel>Price ({getCurrencySymbol(selectedCurrency)})</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Set your asking price. Remember, both buyer and seller pay 2.5% platform fees
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset URL <span className="text-gray-500">(Optional)</span></FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="https://instagram.com/youraccount"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a link to your asset (e.g., Instagram profile, YouTube channel). This will be shared with the buyer after purchase.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetProofImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Proof Screenshot <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                <div className="flex items-center justify-center w-full">
                                  <label
                                    htmlFor="asset-proof-upload"
                                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                      !field.value 
                                        ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                    }`}
                                  >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className={`w-8 h-8 mb-3 ${!field.value ? 'text-red-400' : 'text-gray-400'}`} />
                                      <p className={`mb-2 text-sm ${!field.value ? 'text-red-600' : 'text-gray-500'}`}>
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                      </p>
                                      <p className={`text-xs ${!field.value ? 'text-red-500' : 'text-gray-500'}`}>
                                        PNG, JPG, JPEG up to 2MB
                                      </p>
                                      {!field.value && (
                                        <p className="text-xs text-red-500 font-medium mt-1">
                                          * Required for verification
                                        </p>
                                      )}
                                    </div>
                                    <input
                                      id="asset-proof-upload"
                                      type="file"
                                      className="hidden"
                                      accept="image/png,image/jpeg,image/jpg"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          // Check file size (2MB = 2 * 1024 * 1024 bytes)
                                          if (file.size > 2 * 1024 * 1024) {
                                            toast({
                                              title: "File Too Large",
                                              description: "Please select an image smaller than 2MB.",
                                              variant: "destructive",
                                            });
                                            return;
                                          }
                                          field.onChange(file);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                {field.value && (
                                  <div className="space-y-3">
                                    {/* File Info */}
                                    <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-green-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-green-900 truncate">
                                          {field.value.name}
                                        </p>
                                        <p className="text-xs text-green-600">
                                          {(field.value.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => field.onChange(undefined)}
                                        className="text-green-600 hover:text-green-700"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                    
                                    {/* Image Preview */}
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                      <img
                                        src={URL.createObjectURL(field.value)}
                                        alt="Asset proof preview"
                                        className="w-full h-48 object-cover"
                                        onLoad={(e) => {
                                          // Clean up the object URL when image loads
                                          URL.revokeObjectURL(e.currentTarget.src);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload a screenshot proving ownership of your asset (e.g., Instagram analytics, YouTube dashboard). <span className="font-semibold text-red-600">Required for verification.</span> Max size: 2MB.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Analytics & Stats */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Analytics & Performance</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="followers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Followers/Subscribers</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="engagement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Engagement Rate (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0.0"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="monthlyViews"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Views</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="monthlyRevenue"
                          render={({ field }) => (
                            <FormItem>
                                                             <FormLabel>Monthly Revenue ({getCurrencySymbol(selectedCurrency)})</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? "Creating Listing..." : "Create Listing"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Verification Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Submit Listing</p>
                      <p className="text-xs text-gray-600">Provide asset details and analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Verification</p>
                      <p className="text-xs text-gray-600">We verify ownership and metrics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Go Live</p>
                      <p className="text-xs text-gray-600">Listing appears in marketplace</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Structure */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fee Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Buyer Fee</span>
                    <span className="font-medium">2.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seller Fee</span>
                    <span className="font-medium">2.5%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-600">
                      Fees are automatically calculated and deducted during transactions
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                    Listing Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p>• Be honest about metrics and performance</p>
                  <p>• Include recent screenshots if possible</p>
                  <p>• Highlight unique selling points</p>
                  <p>• Price competitively based on similar assets</p>
                  <p>• Respond quickly to buyer inquiries</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { Link } from "wouter";

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["instagram", "youtube", "tiktok", "twitter", "website"], {
    required_error: "Please select a category",
  }),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  followers: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Followers must be a non-negative number"),
  engagement: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100), "Engagement must be between 0-100%"),
  monthlyViews: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly views must be a non-negative number"),
  monthlyRevenue: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly revenue must be a non-negative number"),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

export default function CreateListing() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      price: "",
      followers: "",
      engagement: "",
      monthlyViews: "",
      monthlyRevenue: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        followers: data.followers ? parseInt(data.followers) : null,
        engagement: data.engagement ? parseFloat(data.engagement) : null,
        monthlyViews: data.monthlyViews ? parseInt(data.monthlyViews) : null,
        monthlyRevenue: data.monthlyRevenue ? parseFloat(data.monthlyRevenue) : null,
      };

      const response = await apiRequest("POST", "/api/listings", payload);
      return response.json();
    },
    onSuccess: (listing) => {
      toast({
        title: "Listing Created",
        description: "Your asset listing has been created and is pending verification.",
      });
      window.location.href = `/listing/${listing.id}`;
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CreateListingForm) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
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
                            <FormLabel>Price (USD)</FormLabel>
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
                              <FormLabel>Monthly Revenue ($)</FormLabel>
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

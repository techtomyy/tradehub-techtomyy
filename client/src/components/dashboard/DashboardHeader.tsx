import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

/**
 * Dashboard Header Component
 * 
 * Displays the dashboard title, description, and action button
 * for creating new listings.
 */
export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Manage your listings, transactions, and account</p>
      </div>
      <Link href="/create-listing">
        <Button size="lg">
          <Plus className="h-4 w-4 mr-2" />
          List Asset
        </Button>
      </Link>
    </div>
  );
}

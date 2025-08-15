import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Currency } from "@/lib/store/walletStore";

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
}

/**
 * Currency Selector Component
 * 
 * Dropdown menu for selecting the display currency
 * with options for USD and PKR.
 */
export function CurrencySelector({ selectedCurrency, setCurrency }: CurrencySelectorProps) {
  const CURRENCY_OPTIONS = [
    { value: 'USD' as Currency, label: 'USD - US Dollar' },
    { value: 'PKR' as Currency, label: 'PKR - Pakistani Rupee' }
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{selectedCurrency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {CURRENCY_OPTIONS.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onClick={() => setCurrency(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

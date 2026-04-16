import { LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const CartHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-foreground">SwiftCart</span>
      </div>
      <p className="text-sm text-muted-foreground hidden sm:block">
        Welcome, <span className="font-semibold text-foreground">Alex</span>
      </p>
      <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </header>
  );
};

export default CartHeader;

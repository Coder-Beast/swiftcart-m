import { Button } from "@/components/ui/button";
import { type CartItemData } from "./CartItem";

interface FinancialSummaryProps {
  items: CartItemData[];
}

const FinancialSummary = ({ items }: FinancialSummaryProps) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  return (
    <div className="sticky bottom-0 bg-card border-t border-border px-4 pt-4 pb-6 space-y-3">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>GST (18%)</span>
        <span>₹{gst.toFixed(2)}</span>
      </div>
      <div className="h-px bg-border" />
      <div className="flex justify-between text-lg font-bold text-foreground">
        <span>Grand Total</span>
        <span>₹{grandTotal.toFixed(2)}</span>
      </div>
      <Button className="w-full h-12 text-base font-semibold" size="lg" disabled={items.length === 0}>
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default FinancialSummary;

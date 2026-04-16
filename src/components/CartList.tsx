import { AnimatePresence } from "framer-motion";
import CartItem, { type CartItemData } from "./CartItem";
import { ShoppingCart } from "lucide-react";

interface CartListProps {
  items: CartItemData[];
  onRemove: (id: string) => void;
}

const CartList = ({ items, onRemove }: CartListProps) => {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground py-16">
        <ShoppingCart className="h-12 w-12 opacity-40" />
        <p className="text-sm">Your cart is empty. Start scanning!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {items.length} item{items.length !== 1 && "s"} in cart
      </p>
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <CartItem key={item.id} item={item} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CartList;

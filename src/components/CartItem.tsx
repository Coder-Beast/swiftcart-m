import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onRemove }: CartItemProps) => {
  const subtotal = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      className="flex items-center justify-between bg-card rounded-lg border border-border p-3 gap-3"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
      </div>
      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-badge text-badge-foreground">
        x{item.quantity}
      </span>
      <p className="shrink-0 w-20 text-right font-semibold text-foreground">
        ₹{subtotal.toFixed(2)}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors active:scale-95"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export default CartItem;

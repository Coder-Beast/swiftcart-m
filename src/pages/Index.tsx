import { useState, useCallback } from "react";
import CartHeader from "@/components/CartHeader";
import ScannerSection from "@/components/ScannerSection";
import CartList from "@/components/CartList";
import FinancialSummary from "@/components/FinancialSummary";
import { type CartItemData } from "@/components/CartItem";

const PRODUCT_CATALOG: Record<string, { name: string; price: number }> = {
  "1001": { name: "Organic Milk 1L", price: 68 },
  "1002": { name: "Whole Wheat Bread", price: 45 },
  "1003": { name: "Basmati Rice 5kg", price: 320 },
  "1004": { name: "Extra Virgin Olive Oil", price: 599 },
  "1005": { name: "Dark Chocolate Bar", price: 120 },
  "1006": { name: "Free Range Eggs (12)", price: 95 },
  "1007": { name: "Greek Yogurt 400g", price: 85 },
  "1008": { name: "Almond Butter Jar", price: 450 },
};

const Index = () => {
  const [items, setItems] = useState<CartItemData[]>([
    { id: "1001", name: "Organic Milk 1L", price: 68, quantity: 2 },
    { id: "1003", name: "Basmati Rice 5kg", price: 320, quantity: 1 },
    { id: "1005", name: "Dark Chocolate Bar", price: 120, quantity: 3 },
  ]);

  const handleScan = useCallback((barcode: string) => {
    const product = PRODUCT_CATALOG[barcode];
    if (!product) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === barcode);
      if (existing) {
        return prev.map((i) =>
          i.id === barcode ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: barcode, ...product, quantity: 1 }];
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-background">
      <CartHeader />
      <ScannerSection onScan={handleScan} />
      <CartList items={items} onRemove={handleRemove} />
      <FinancialSummary items={items} />
    </div>
  );
};

export default Index;

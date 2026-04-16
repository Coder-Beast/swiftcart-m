import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CartList from "@/components/CartList";
import type { CartItemData } from "@/components/CartItem";

const items: CartItemData[] = [
  { id: "1001", name: "Organic Milk 1L", price: 68, quantity: 2 },
  { id: "1003", name: "Basmati Rice 5kg", price: 320, quantity: 1 },
];

describe("CartList", () => {
  it("shows empty state when no items", () => {
    render(<CartList items={[]} onRemove={vi.fn()} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("renders all items", () => {
    render(<CartList items={items} onRemove={vi.fn()} />);
    expect(screen.getByText("Organic Milk 1L")).toBeInTheDocument();
    expect(screen.getByText("Basmati Rice 5kg")).toBeInTheDocument();
  });

  it("shows correct item count — singular", () => {
    render(<CartList items={[items[0]]} onRemove={vi.fn()} />);
    expect(screen.getByText(/1 item in cart/i)).toBeInTheDocument();
  });

  it("shows correct item count — plural", () => {
    render(<CartList items={items} onRemove={vi.fn()} />);
    expect(screen.getByText(/2 items in cart/i)).toBeInTheDocument();
  });
});

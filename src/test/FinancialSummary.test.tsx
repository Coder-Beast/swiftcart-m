import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FinancialSummary from "@/components/FinancialSummary";
import type { CartItemData } from "@/components/CartItem";

const items: CartItemData[] = [
  { id: "1001", name: "Organic Milk 1L", price: 68, quantity: 2 },
  { id: "1003", name: "Basmati Rice 5kg", price: 320, quantity: 1 },
];

describe("FinancialSummary", () => {
  it("calculates subtotal correctly", () => {
    render(<FinancialSummary items={items} />);
    // 68*2 + 320*1 = 456
    expect(screen.getByText("₹456.00")).toBeInTheDocument();
  });

  it("calculates 18% GST correctly", () => {
    render(<FinancialSummary items={items} />);
    // 456 * 0.18 = 82.08
    expect(screen.getByText("₹82.08")).toBeInTheDocument();
  });

  it("calculates grand total correctly", () => {
    render(<FinancialSummary items={items} />);
    // 456 + 82.08 = 538.08
    expect(screen.getByText("₹538.08")).toBeInTheDocument();
  });

  it("disables checkout button when cart is empty", () => {
    render(<FinancialSummary items={[]} />);
    expect(screen.getByRole("button", { name: /proceed to checkout/i })).toBeDisabled();
  });

  it("enables checkout button when cart has items", () => {
    render(<FinancialSummary items={items} />);
    expect(screen.getByRole("button", { name: /proceed to checkout/i })).not.toBeDisabled();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CartItem from "@/components/CartItem";

const item = { id: "1005", name: "Dark Chocolate Bar", price: 120, quantity: 3 };

describe("CartItem", () => {
  it("renders item name and price", () => {
    render(<CartItem item={item} onRemove={vi.fn()} />);
    expect(screen.getByText("Dark Chocolate Bar")).toBeInTheDocument();
    expect(screen.getByText("₹120.00")).toBeInTheDocument();
  });

  it("renders quantity badge", () => {
    render(<CartItem item={item} onRemove={vi.fn()} />);
    expect(screen.getByText("x3")).toBeInTheDocument();
  });

  it("renders correct subtotal", () => {
    render(<CartItem item={item} onRemove={vi.fn()} />);
    // 120 * 3 = 360
    expect(screen.getByText("₹360.00")).toBeInTheDocument();
  });

  it("calls onRemove with item id when remove button clicked", () => {
    const onRemove = vi.fn();
    render(<CartItem item={item} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button", { name: /remove dark chocolate bar/i }));
    expect(onRemove).toHaveBeenCalledWith("1005");
  });
});

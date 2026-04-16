import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CartHeader from "@/components/CartHeader";

describe("CartHeader", () => {
  it("renders app name", () => {
    render(<CartHeader />);
    expect(screen.getByText("SwiftCart")).toBeInTheDocument();
  });

  it("renders sign out button", () => {
    render(<CartHeader />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});

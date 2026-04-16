import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScannerSection from "@/components/ScannerSection";

describe("ScannerSection", () => {
  it("calls onScan with barcode when Scan button clicked", () => {
    const onScan = vi.fn();
    render(<ScannerSection onScan={onScan} />);
    const input = screen.getByPlaceholderText(/manual barcode entry/i);
    fireEvent.change(input, { target: { value: "1001" } });
    fireEvent.click(screen.getByRole("button", { name: /scan/i }));
    expect(onScan).toHaveBeenCalledWith("1001");
  });

  it("calls onScan when Enter key is pressed", () => {
    const onScan = vi.fn();
    render(<ScannerSection onScan={onScan} />);
    const input = screen.getByPlaceholderText(/manual barcode entry/i);
    fireEvent.change(input, { target: { value: "1003" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onScan).toHaveBeenCalledWith("1003");
  });

  it("clears input after scan", () => {
    render(<ScannerSection onScan={vi.fn()} />);
    const input = screen.getByPlaceholderText(/manual barcode entry/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1001" } });
    fireEvent.click(screen.getByRole("button", { name: /scan/i }));
    expect(input.value).toBe("");
  });

  it("does not call onScan for empty input", () => {
    const onScan = vi.fn();
    render(<ScannerSection onScan={onScan} />);
    fireEvent.click(screen.getByRole("button", { name: /scan/i }));
    expect(onScan).not.toHaveBeenCalled();
  });

  it("trims whitespace from barcode", () => {
    const onScan = vi.fn();
    render(<ScannerSection onScan={onScan} />);
    const input = screen.getByPlaceholderText(/manual barcode entry/i);
    fireEvent.change(input, { target: { value: "  1005  " } });
    fireEvent.click(screen.getByRole("button", { name: /scan/i }));
    expect(onScan).toHaveBeenCalledWith("1005");
  });
});

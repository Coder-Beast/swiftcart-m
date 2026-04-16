import { ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ScannerSectionProps {
  onScan: (barcode: string) => void;
}

const ScannerSection = ({ onScan }: ScannerSectionProps) => {
  const [barcode, setBarcode] = useState("");

  const handleScan = () => {
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode("");
    }
  };

  return (
    <div className="mx-4 mt-4 rounded-xl border border-scanner-border bg-scanner p-6 flex flex-col items-center gap-4">
      <ScanBarcode className="h-12 w-12 text-primary opacity-80" strokeWidth={1.5} />
      <p className="text-sm font-medium text-muted-foreground">Scan or enter barcode</p>
      <div className="flex w-full max-w-sm gap-2">
        <Input
          placeholder="Manual Barcode Entry"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          className="bg-card"
        />
        <Button onClick={handleScan} className="shrink-0">
          Scan
        </Button>
      </div>
    </div>
  );
};

export default ScannerSection;

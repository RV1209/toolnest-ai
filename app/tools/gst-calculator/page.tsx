import ToolShell from "@/components/tools/ToolShell";
import GstCalculator from "@/components/tools/GstCalculator";

export const metadata = {
  title: "GST Calculator | ToolNest AI",
  description: "Calculate GST instantly. Add or remove GST with CGST and SGST split.",
};

export default function GstCalculatorPage() {
  return (
    <ToolShell
      title="GST Calculator"
      description="Calculate GST instantly. Add GST to a price or remove it from a total."
    >
      <GstCalculator />
    </ToolShell>
  );
}
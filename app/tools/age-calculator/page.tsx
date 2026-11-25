import ToolShell from "@/components/tools/ToolShell";
import AgeCalculator from "@/components/tools/AgeCalculator";

export const metadata = {
  title: "Age Calculator | ToolNest AI",
  description: "Calculate your exact age in years, months and days.",
};

export default function AgeCalculatorPage() {
  return (
    <ToolShell
      title="Age Calculator"
      description="Find your exact age in years, months and days."
    >
      <AgeCalculator />
    </ToolShell>
  );
}
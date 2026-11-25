import ToolShell from "@/components/tools/ToolShell";
import PdfTools from "@/components/tools/PdfTools";

export const metadata = {
  title: "PDF Tools | ToolNest AI",
  description: "Merge PDF files and extract pages. Files stay on your device.",
};

export default function PdfToolsPage() {
  return (
    <ToolShell
      title="PDF Tools"
      description="Merge PDF files or extract the pages you need. Your files never leave your device."
    >
      <PdfTools />
    </ToolShell>
  );
}
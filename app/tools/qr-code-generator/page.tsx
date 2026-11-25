import ToolShell from "@/components/tools/ToolShell";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";

export const metadata = {
  title: "QR Code Generator | ToolNest AI",
  description: "Create QR codes in seconds and download them as PNG.",
};

export default function QrCodeGeneratorPage() {
  return (
    <ToolShell
      title="QR Code Generator"
      description="Turn any link or text into a QR code and download it."
    >
      <QrCodeGenerator />
    </ToolShell>
  );
}
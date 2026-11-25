import ToolShell from "@/components/tools/ToolShell";
import ImageCompressor from "@/components/tools/ImageCompressor";

export const metadata = {
  title: "Image Compressor | ToolNest AI",
  description: "Reduce image size easily. Compress JPG, PNG and WebP in your browser.",
};

export default function ImageCompressorPage() {
  return (
    <ToolShell
      title="Image Compressor"
      description="Reduce image size easily. Everything happens in your browser, nothing is uploaded."
    >
      <ImageCompressor />
    </ToolShell>
  );
}
import {
  ImageDown,
  FileText,
  Percent,
  CalendarDays,
  QrCode,
  Type,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
  icon: LucideIcon;
};

export const categories = ["All", "Image", "PDF", "Calculators", "Utilities"];

export const tools: Tool[] = [
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image size easily.",
    category: "Image",
    href: "/tools/image-compressor",
    icon: ImageDown,
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    description: "Manage PDF documents.",
    category: "PDF",
    href: "/tools/pdf-tools",
    icon: FileText,
  },
  {
    id: "gst-calculator",
    name: "GST Calculator",
    description: "Calculate GST instantly.",
    category: "Calculators",
    href: "/tools/gst-calculator",
    icon: Percent,
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age.",
    category: "Calculators",
    href: "/tools/age-calculator",
    icon: CalendarDays,
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Create QR codes in seconds.",
    category: "Utilities",
    href: "/tools/qr-code-generator",
    icon: QrCode,
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words and characters.",
    category: "Utilities",
    href: "/tools/word-counter",
    icon: Type,
  },
];
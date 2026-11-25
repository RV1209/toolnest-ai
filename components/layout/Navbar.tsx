import Link from "next/link";
import { Sparkles } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-y-3 border-b border-gray-200 px-4 py-3 sm:justify-start sm:gap-6 sm:px-8 sm:py-5">
      <Link href="/" className="flex items-center gap-2 sm:mr-auto">
        <Sparkles className="text-blue-600" />
        <span className="text-lg font-bold sm:text-xl">ToolNest AI</span>
      </Link>

      <div className="order-last flex w-full items-center justify-center gap-6 text-sm sm:order-none sm:w-auto sm:text-base">
        <Link href="/#tools">Tools</Link>
        <Link href="/#about">About</Link>
      </div>

      <ThemeToggle />
    </nav>
  );
}
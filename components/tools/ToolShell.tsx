import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type ToolShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function ToolShell({
  title,
  description,
  children,
}: ToolShellProps) {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
                <Link
          href="/#tools"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          All tools
        </Link>

        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-3 text-gray-500">{description}</p>

        <div className="mt-8">{children}</div>
      </section>

      <Footer />
    </main>
  );
}
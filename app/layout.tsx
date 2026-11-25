import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ToolNest AI | Free Online Tools",
  description:
    "Free online tools in one place: image compressor, PDF merge and extract, GST calculator, age calculator, QR code generator and word counter.",
  keywords: [
    "free online tools",
    "image compressor",
    "PDF merge",
    "GST calculator",
    "age calculator",
    "QR code generator",
    "word counter",
  ],
  openGraph: {
    title: "ToolNest AI | Free Online Tools",
    description:
      "Compress images, manage PDFs, calculate GST and age, and more. Fast, free and private.",
    siteName: "ToolNest AI",
    type: "website",
  },
};

// Site opens in light mode. Dark only if the visitor chose it with the button.
const themeScript = `
(function () {
  try {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
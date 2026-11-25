import Navbar from "@/components/layout/Navbar";
import HomeContent from "@/components/home/HomeContent";
import Features from "@/components/home/Features";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <HomeContent />
      <Features />
      <Footer />
    </main>
  );
}

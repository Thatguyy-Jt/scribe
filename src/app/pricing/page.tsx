import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pt-20">
      <Navbar />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
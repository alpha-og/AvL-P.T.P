import Hero from "@components/landing/Hero";
import PricingCarousel from "@components/landing/Pricing";
import FeaturesSection from "@components/landing/Features";
import Footer from "@components/landing/Footer";
export default function Landing() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center overflow-scroll">
      <Hero />
      <FeaturesSection />
      <PricingCarousel />
      <Footer />
    </div>
  );
}

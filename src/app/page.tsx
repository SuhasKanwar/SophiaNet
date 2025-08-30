import FeaturesSection from "@/components/FeaturesSection";
import FunctionalitiesSection from "@/components/FunctionalitiesSection";
import HeroSection from "@/components/HeroSection";
import HighlightedSection from "@/components/HighlightedSection";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full gap-28">
      <HeroSection />
      <FeaturesSection />
      <FunctionalitiesSection />
      <HighlightedSection />
    </main>
  );
}
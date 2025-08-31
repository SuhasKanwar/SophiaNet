import FeaturesSection from "@/components/FeaturesSection";
import FunctionalitiesSection from "@/components/FunctionalitiesSection";
import HeroSection from "@/components/HeroSection";
import HighlightedSection from "@/components/HighlightedSection";
import AIProcessingPipeline from "@/components/AIProcessingPipeline";
import DIPWorkflowSection from "@/components/DIPWorkflowSection";
import ContactUs from "@/components/ContactUs";
import MoveTopButton from "@/components/MoveTopButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full gap-28" id="top">
      <section id="hero" className="w-full">
        <HeroSection />
      </section>
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="functionalities">
        <FunctionalitiesSection />
      </section>
      <HighlightedSection />
      <section id="ai-processing-pipeline">
        <AIProcessingPipeline />
      </section>
      <section id="dip-workflow">
        <DIPWorkflowSection />
      </section>
      <section id="contact-us">
        <ContactUs />
      </section>
      <MoveTopButton />
    </main>
  );
}
"use client";
import { motion } from "motion/react";
import { HighlightSection } from "@/components/ui/highlight-section";

export default function HighlightedSection() {
  return (
    <HighlightSection>
      <section id="vision" className="w-full px-4">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-100 max-w-5xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Reimagining how humans interact with knowledge — bridging handwritten memory, digital media & generative creativity into a living Wisdom Network.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-10 max-w-3xl mx-auto text-center text-neutral-400 text-sm md:text-base leading-relaxed"
        >
          Enhanced notes, multimodal search, explainers & dashboards—grounded in clean, context‑rich data.
        </motion.p>
      </section>
    </HighlightSection>
  );
}
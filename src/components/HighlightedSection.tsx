"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { HighlightSection } from "@/components/ui/highlight-section";

export default function HighlightedSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  return (
    <HighlightSection>
      <motion.section 
        id="vision" 
        className="w-full px-4"
        ref={sectionRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-100 max-w-5xl leading-relaxed lg:leading-snug text-center mx-auto"
        >
          Reimagining how humans interact with knowledge — bridging handwritten memory, digital media & generative creativity into a living Wisdom Network.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 max-w-3xl mx-auto text-center text-neutral-400 text-sm md:text-base leading-relaxed"
        >
          Enhanced notes, multimodal search, explainers & dashboards—grounded in clean, context‑rich data.
        </motion.p>
      </motion.section>
    </HighlightSection>
  );
}
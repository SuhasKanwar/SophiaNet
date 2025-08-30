"use client";

import { CometCard } from "@/components/ui/comet-card";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const features = [
  {
    title: "Intelligent Ingestion",
    body: "Scans handwritten & printed notes, parses YouTube lectures, crawls web sources and accepts raw images.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Digital Image Processing",
    body: "Enhances clarity, extracts diagrams, performs OCR, edge detection, segmentation & super‑resolution on frames.",
    img: "https://images.unsplash.com/photo-1667818471799-dfbbcec55033?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Multimodal Embeddings",
    body: "CLIP-style alignment links equations, diagrams, text, video scenes & web context for cross‑modal retrieval.",
    img: "https://images.unsplash.com/photo-1728652964288-e2a54f061b46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Generative Enrichment",
    body: "LLMs summarize & structure knowledge; diffusion & video models create visuals, diagrams & explainers.",
    img: "https://images.unsplash.com/photo-1753233379772-f236933eb90b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Autonomous Agents",
    body: "Specialized agents orchestrated for crawling, processing, embedding, generation, analysis & linking.",
    img: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Unified Outputs",
    body: "Digitized notes, cross-modal search, structured knowledge base, dashboards, summaries & media assets.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
  }
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  return (
    <motion.section 
      id="features" 
      className="relative min-h-screen py-24"
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="mx-auto max-w-[80vw] px-6">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-indigo-500 mb-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Core Capabilities
        </motion.h2>
        <motion.div 
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 place-items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.6 + index * 0.1,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 } 
              }}
            >
              <CometCard>
                <div className="flex w-80 flex-col rounded-2xl bg-[#1F2121] p-3 md:p-4 shadow-lg/30">
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
                    <Image
                      fill
                      src={f.img}
                      alt={f.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover contrast-110 saturate-110 opacity-90"
                    />
                  </div>
                  <div className="mt-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">{f.title}</h3>
                    <p className="text-sm text-neutral-300 leading-relaxed">{f.body}</p>
                  </div>
                </div>
              </CometCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
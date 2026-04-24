"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { Camera, Settings, Brain, Link, Sparkles, Rocket } from "lucide-react";

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  techniques: string[];
  IconComponent: React.ComponentType<{ className?: string }>;
  color: string;
  delay: number;
}

const processingSteps: ProcessingStep[] = [
  {
    id: "input-capture",
    title: "Input Capture",
    description: "Multi-modal data ingestion from various sources",
    techniques: ["OCR", "Video Frame Extraction", "Web Scraping", "Audio Processing"],
    IconComponent: Camera,
    color: "from-blue-500/20 to-cyan-500/20",
    delay: 0.1
  },
  {
    id: "preprocessing",
    title: "DIP Enhancement",
    description: "Advanced digital image processing pipeline",
    techniques: ["Denoising", "Binarization", "Deskewing", "Super Resolution"],
    IconComponent: Settings,
    color: "from-purple-500/20 to-pink-500/20",
    delay: 0.2
  },
  {
    id: "feature-extraction",
    title: "Feature Extraction",
    description: "Deep learning based feature detection and analysis",
    techniques: ["Edge Detection", "Contour Analysis", "Text Recognition", "Object Detection"],
    IconComponent: Brain,
    color: "from-green-500/20 to-emerald-500/20",
    delay: 0.3
  },
  {
    id: "embedding-alignment",
    title: "Multimodal Alignment",
    description: "CLIP-style embeddings for cross-modal understanding",
    techniques: ["Text-Image Alignment", "Video-Text Mapping", "Semantic Embeddings", "Vector Space"],
    IconComponent: Link,
    color: "from-orange-500/20 to-yellow-500/20",
    delay: 0.4
  },
  {
    id: "ai-generation",
    title: "GenAI Enhancement",
    description: "Generative AI for content creation and enrichment",
    techniques: ["LLM Summarization", "Stable Diffusion", "Video Generation", "Knowledge Synthesis"],
    IconComponent: Sparkles,
    color: "from-indigo-500/20 to-purple-500/20",
    delay: 0.5
  },
  {
    id: "output-delivery",
    title: "Smart Delivery",
    description: "Intelligent output formatting and presentation",
    techniques: ["Dynamic Dashboards", "Interactive Visualizations", "Structured Knowledge", "Real-time Updates"],
    IconComponent: Rocket,
    color: "from-red-500/20 to-rose-500/20",
    delay: 0.6
  }
];

export default function AIProcessingPipeline() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <motion.section 
      ref={sectionRef}
      className="relative py-24 px-4"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
      
      <div className="max-w-[80vw] mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI Processing
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              {" "}Pipeline
            </span>
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            From raw inputs to enriched knowledge through state-of-the-art AI and DIP techniques
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {processingSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: step.delay }}
              onHoverStart={() => setHoveredStep(step.id)}
              onHoverEnd={() => setHoveredStep(null)}
            >
              <CometCard>
                <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${step.color} backdrop-blur-sm border border-white/10 h-full transition-all duration-300 ${hoveredStep === step.id ? 'scale-105' : ''}`}>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-neutral-300 mb-4 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Key Techniques
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.techniques.map((technique, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-white/10 text-neutral-200 rounded-md border border-white/20"
                        >
                          {technique}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CometCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative mt-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white text-center mb-8">
              End-to-End Processing Flow
            </h3>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-0">
              {processingSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} border-2 border-white/20 flex items-center justify-center backdrop-blur-sm`}>
                      <step.IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: hoveredStep === step.id 
                          ? "0 0 20px rgba(99, 102, 241, 0.5)" 
                          : "0 0 0px rgba(99, 102, 241, 0)"
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  
                  {index < processingSteps.length - 1 && (
                    <motion.div
                      className="hidden lg:block w-32 h-px bg-gradient-to-r from-indigo-500/50 to-purple-500/50 mx-4"
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <motion.p
                className="text-neutral-400 text-sm max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              >
                Each step in our pipeline leverages cutting-edge AI and computer vision techniques 
                to transform raw, unstructured data into actionable knowledge.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
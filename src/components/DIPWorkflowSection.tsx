"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Camera, Settings, Scissors, Target, BookOpen, Sparkles } from "lucide-react";

interface DIPStep {
  id: string;
  name: string;
  description: string;
  input: string;
  output: string;
  techniques: string[];
  IconComponent: React.ComponentType<{ className?: string }>;
  color: string;
}

const dipWorkflow: DIPStep[] = [
  {
    id: "acquisition",
    name: "Image Acquisition",
    description: "Capture raw images from various sources including scanned documents, photos, and video frames",
    input: "Raw Images/Scans",
    output: "Digital Images",
    techniques: ["Scanner Input", "Camera Capture", "Video Frame Extraction", "Multi-format Support"],
    IconComponent: Camera,
    color: "from-blue-400 to-cyan-400"
  },
  {
    id: "preprocessing",
    name: "Preprocessing",
    description: "Clean and enhance images to improve quality and prepare for further analysis",
    input: "Digital Images",
    output: "Enhanced Images",
    techniques: ["Noise Reduction", "Contrast Enhancement", "Brightness Adjustment", "Gamma Correction"],
    IconComponent: Settings,
    color: "from-purple-400 to-pink-400"
  },
  {
    id: "segmentation",
    name: "Segmentation",
    description: "Identify and separate different regions, text blocks, and elements within the image",
    input: "Enhanced Images",
    output: "Segmented Regions",
    techniques: ["Edge Detection", "Region Growing", "Watershed Algorithm", "Clustering"],
    IconComponent: Scissors,
    color: "from-green-400 to-emerald-400"
  },
  {
    id: "feature-detection",
    name: "Feature Detection",
    description: "Extract key features like text regions, diagrams, mathematical formulas, and structural elements",
    input: "Segmented Regions",
    output: "Feature Maps",
    techniques: ["Corner Detection", "Blob Detection", "Template Matching", "Contour Analysis"],
    IconComponent: Target,
    color: "from-orange-400 to-yellow-400"
  },
  {
    id: "text-recognition",
    name: "Text Recognition",
    description: "Convert detected text regions into machine-readable text using advanced OCR techniques",
    input: "Feature Maps",
    output: "Structured Text",
    techniques: ["OCR Processing", "Handwriting Recognition", "Math Formula Parsing", "Language Detection"],
    IconComponent: BookOpen,
    color: "from-indigo-400 to-purple-400"
  },
  {
    id: "enhancement",
    name: "AI Enhancement",
    description: "Apply generative AI to improve, complete, and enrich the extracted content",
    input: "Structured Text",
    output: "Enriched Knowledge",
    techniques: ["Super Resolution", "Content Completion", "Style Transfer", "Quality Enhancement"],
    IconComponent: Sparkles,
    color: "from-red-400 to-rose-400"
  }
];

export default function DIPWorkflowSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [cardGlowPositions, setCardGlowPositions] = useState<Record<string, { x: number; y: number }>>({});

  return (
    <motion.section 
      ref={sectionRef}
      className="relative py-24 px-4"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10 10h80v80h-80z" stroke="url(#grad)" strokeWidth="1" fill="none"/>
              <circle cx="10" cy="10" r="2" fill="url(#grad)"/>
              <circle cx="90" cy="10" r="2" fill="url(#grad)"/>
              <circle cx="10" cy="90" r="2" fill="url(#grad)"/>
              <circle cx="90" cy="90" r="2" fill="url(#grad)"/>
              <path d="M10 50h30m30 0h30" stroke="url(#grad)" strokeWidth="1"/>
              <path d="M50 10v30m0 30v30" stroke="url(#grad)" strokeWidth="1"/>
            </pattern>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Digital Image
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-pink-400">
              {" "}Processing
            </span>
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            Advanced computer vision pipeline that transforms raw visual inputs into structured, searchable knowledge
          </p>
        </motion.div>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {dipWorkflow.map((step, index) => {
              const pos = cardGlowPositions[step.id];
              return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: -15 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
                onHoverStart={() => setActiveStep(step.id)}
                onHoverEnd={() => setActiveStep(null)}
                whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 260, damping: 22 } }}
                onMouseMove={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setCardGlowPositions(p => ({ ...p, [step.id]: { x, y } }));
                }}
                className="group"
              >
                <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${
                  activeStep === step.id ? 'from-black/75 to-gray-900/75' : 'from-black/55 to-gray-900/55'
                } backdrop-blur-xl border transition-all duration-500 ${
                  activeStep === step.id ? 'border-white/25 shadow-[0_8px_32px_-12px_rgba(255,255,255,0.15)]' : 'border-white/10'
                }`}>
                  <motion.div
                    className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r ${step.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    style={{
                      padding: '2px',
                      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude'
                    }}
                    animate={{ opacity: activeStep === step.id ? 1 : 0 }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at ${pos?.x ?? 50}% ${pos?.y ?? 50}%, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 55%, transparent 70%)`,
                      mixBlendMode: 'screen'
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(140deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 30%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 85%)`
                    }}
                  />
                  <div className="relative z-10">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                      <step.IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">
                      {step.name}
                    </h3>
                    
                    <p className="text-neutral-300 text-sm mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded border border-blue-500/30">
                          Input: {step.input}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-green-500/20 text-green-200 rounded border border-green-500/30">
                          Output: {step.output}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                        Techniques
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {step.techniques.map((technique, idx) => (
                          <motion.span
                            key={idx}
                            className="px-2 py-1 text-xs bg-white/5 text-neutral-300 rounded border border-white/10 hover:bg-white/10 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {technique}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>

        <motion.div
          className="mt-20 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-2">99.2%</div>
            <div className="text-sm text-neutral-300">OCR Accuracy</div>
            <div className="text-xs text-neutral-400 mt-1">For printed text recognition</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-2">4K+</div>
            <div className="text-sm text-neutral-300">Resolution Support</div>
            <div className="text-xs text-neutral-400 mt-1">Ultra-high definition processing</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-2">&lt;2s</div>
            <div className="text-sm text-neutral-300">Processing Time</div>
            <div className="text-xs text-neutral-400 mt-1">Average per page analysis</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
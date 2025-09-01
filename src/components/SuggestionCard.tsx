import { useState } from "react";
import { motion } from "motion/react";

interface SuggestionCardProps {
  title: string;
  desc: string;
  question: string;
  color: string;
  onSelect: (q: string) => void;
}

export default function SuggestionCard({ title, desc, question, color, onSelect }: SuggestionCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  return (
    <motion.button
      onClick={() => onSelect(question)}
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setGlowPosition({ x, y });
      }}
      whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 260, damping: 22 } }}
      className="group relative"
    >
      <div
        className={`relative rounded-xl bg-gradient-to-br ${
          isActive ? "from-black/75 to-gray-900/75" : "from-black/55 to-gray-900/55"
        } backdrop-blur-xl border transition-all duration-500 ${
          isActive ? "border-white/25 shadow-[0_8px_32px_-12px_rgba(255,255,255,0.15)]" : "border-indigo-400/50"
        } p-4 text-left flex flex-col gap-2`}
      >
        <motion.div
          className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          style={{
            padding: "1px",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 55%, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"
          style={{
            background: `linear-gradient(140deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 30%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 85%)`,
          }}
        />

        <div className="relative z-10">
          <span className="font-medium text-sm text-white/90 group-hover:text-indigo-200 transition-colors">
            {title}
          </span>
          <span className="text-[11px] leading-snug text-neutral-400 line-clamp-3">{desc}</span>
          <span className="text-[10px] text-indigo-300/70 mt-auto opacity-0 group-hover:opacity-100 transition">
            Click to use
          </span>
        </div>
      </div>
    </motion.button>
  );
}
"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudyCarouselProps {
  label: string;
  index: number;
  count: number;
  onChange: (index: number) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function StudyCarousel({
  label,
  index,
  count,
  onChange,
  disabled,
  children,
}: StudyCarouselProps) {
  const reducedMotion = useReducedMotion();
  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="min-w-0 space-y-4"
    >
      <div className="flex items-center justify-between gap-3 text-xs text-neutral-400">
        <span aria-live="polite">
          {label} {index + 1} of {count}
        </span>
        <span>No rush. Go at your own pace.</span>
      </div>
      <div className="overflow-hidden rounded-2xl">
        <motion.div
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
          initial={{
            opacity: reducedMotion ? 1 : 0,
            x: reducedMotion ? 0 : 16,
          }}
          animate={{ opacity: 1, x: 0 }}
          exit={{
            opacity: reducedMotion ? 1 : 0,
            x: reducedMotion ? 0 : -16,
          }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        >
          {children}
        </motion.div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={`Previous ${label.toLowerCase()}`}
          disabled={disabled || index === 0}
          onClick={() => onChange(index - 1)}
          className="rounded-xl border border-white/15 p-2.5 hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: count }, (_, page) => (
            <button
              type="button"
              key={page}
              aria-label={`Go to ${label.toLowerCase()} ${page + 1}`}
              aria-current={page === index ? "step" : undefined}
              disabled={disabled}
              onClick={() => onChange(page)}
              className={`h-8 w-8 rounded-lg border text-xs transition ${page === index ? "border-indigo-400/50 bg-indigo-400/15 text-indigo-200" : "border-white/10 text-neutral-500 hover:bg-white/5"}`}
            >
              {page + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={`Next ${label.toLowerCase()}`}
          disabled={disabled || index === count - 1}
          onClick={() => onChange(index + 1)}
          className="rounded-xl border border-white/15 p-2.5 hover:bg-white/5 disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

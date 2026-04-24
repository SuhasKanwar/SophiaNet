"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_60%_40%,rgba(99,102,241,0.25),transparent_65%)]" />
      <motion.div
        className="relative flex flex-col items-center gap-8 w-full max-w-sm p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/60 backdrop-blur-xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <motion.div
            className="w-28 h-28 rounded-full border-4 border-indigo-500/20 border-t-indigo-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-400/70 border-b-indigo-400/70"
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-sm font-medium text-indigo-200 tracking-wide"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            Loading
          </motion.span>
        </div>
        <div className="w-full">
          <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-500/10 relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              style={{ width: "60%" }}
            />
          </div>
          <motion.p
            className="mt-4 text-center text-xs uppercase tracking-wider text-indigo-200/70"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Preparing content...
          </motion.p>
        </div>
      </motion.div>
    </main>
  );
}
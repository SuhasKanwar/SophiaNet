"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/60 backdrop-blur-xl p-10"
      >
        <motion.div
          className="pointer-events-none absolute -top-20 -right-24 w-72 h-72 rounded-full bg-gradient-to-tr from-rose-500/20 via-purple-500/10 to-indigo-500/20 blur-3xl"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-1.5 text-rose-200 text-xs tracking-wide">
          <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" /> Runtime Error
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-neutral-300 leading-relaxed mb-6">
          An unexpected error occurred while rendering this page. You can retry the operation or return to the homepage.
        </p>
        {error?.message && (
          <pre className="text-xs md:text-sm text-rose-200/90 bg-black/30 border border-white/10 rounded-lg p-4 overflow-x-auto mb-6">
            {error.message}
            {error.digest ? `\n\nDigest: ${error.digest}` : ""}
          </pre>
        )}
        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={() => reset()}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-400 transition-colors"
          >
            Try Again
          </motion.button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg font-medium text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/10 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
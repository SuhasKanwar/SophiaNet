"use client";
import Link from "next/link";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/60 backdrop-blur-xl overflow-hidden"
      >
        <motion.div
          className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500/20 via-blue-500/10 to-cyan-500/20 blur-3xl"
          animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
        <div className="flex flex-col items-center text-center relative">
          <motion.div
            className="mb-8 relative"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-7xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow">
              404
            </span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
          <p className="text-neutral-300 max-w-md leading-relaxed mb-8">
            The page you are looking for may have been moved, renamed, or does not exist. Try returning home or reloading.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-indigo-500/20 hover:from-indigo-400 hover:to-purple-400 transition-colors"
            >
              Go Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-lg font-medium border border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/10 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
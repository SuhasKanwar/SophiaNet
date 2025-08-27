"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                <Link href="#home" className="font-extrabold tracking-tight text-lg md:text-xl">
                    Sophia<span className="text-indigo-400">Net</span>
                </Link>
                <button
                    aria-label="Toggle menu"
                    className="md:hidden p-2 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    onClick={() => setOpen(o => !o)}
                >
                    <span className="sr-only">Menu</span>
                    <div className="w-5 h-5 relative">
                        <span
                            className={`absolute inset-x-0 top-1 block h-0.5 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
                        />
                        <span
                            className={`absolute inset-x-0 top-2.5 block h-0.5 bg-white transition-opacity ${open ? "opacity-0" : ""}`}
                        />
                        <span
                            className={`absolute inset-x-0 top-4 block h-0.5 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
                        />
                    </div>
                </button>
                <ul className="hidden md:flex gap-8 text-sm font-medium">
                    <li><Link href="#features" className="hover:text-indigo-300 transition-colors">Features</Link></li>
                    <li><Link href="#architecture" className="hover:text-indigo-300 transition-colors">Architecture</Link></li>
                    <li><Link href="#outputs" className="hover:text-indigo-300 transition-colors">Outputs</Link></li>
                    <li><Link href="#vision" className="hover:text-indigo-300 transition-colors">Vision</Link></li>
                </ul>
            </div>
            {open && (
                <div className="md:hidden border-t border-white/10 px-4 pb-4">
                    <ul className="flex flex-col gap-3 pt-3 text-sm">
                        <li><Link href="#features" onClick={() => setOpen(false)} className="block px-1 py-1 rounded hover:bg-white/10">Features</Link></li>
                        <li><Link href="#architecture" onClick={() => setOpen(false)} className="block px-1 py-1 rounded hover:bg-white/10">Architecture</Link></li>
                        <li><Link href="#outputs" onClick={() => setOpen(false)} className="block px-1 py-1 rounded hover:bg-white/10">Outputs</Link></li>
                        <li><Link href="#vision" onClick={() => setOpen(false)} className="block px-1 py-1 rounded hover:bg-white/10">Vision</Link></li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

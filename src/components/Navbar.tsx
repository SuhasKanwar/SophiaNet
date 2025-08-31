"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    
    const navbarOpacity = useTransform(scrollY, [0, 100], [0.6, 0.95]);
    const navbarBlur = useTransform(scrollY, [0, 100], [8, 16]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#architecture", label: "Architecture" },
        { href: "#technology", label: "Technology" },
        { href: "#vision", label: "Vision" },
    ];

    return (
        <motion.nav 
            className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10"
            style={{ 
                backdropFilter: `blur(${navbarBlur}px)`,
                backgroundColor: `rgba(0, 0, 0, ${navbarOpacity})`
            }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        >
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
                    {navLinks.map(l => (
                        <li key={l.href}>
                            <Link href={l.href} className="hover:text-indigo-300 transition-colors">
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {open && (
                <div className="md:hidden border-t border-white/10 px-4 pb-4">
                    <ul className="flex flex-col gap-3 pt-3 text-sm">
                        {navLinks.map(l => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="block px-1 py-1 rounded hover:bg-white/10"
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.nav>
    );
}

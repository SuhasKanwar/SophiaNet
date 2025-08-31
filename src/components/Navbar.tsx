"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/ToastProvider";

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const { showToast } = useToast();
    const [hadSession, setHadSession] = useState(false);
    const [open, setOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);
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

    useEffect(() => {
        if (session && !hadSession) {
            showToast({ type: "success", title: "Signed in", message: `Welcome ${session.user?.name || ""}` });
            setHadSession(true);
        } else if (!session && hadSession) {
            showToast({ type: "info", title: "Signed out", message: "You have been signed out." });
            setHadSession(false);
        }
    }, [session, hadSession, showToast]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setUserMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    const NAV_LINKS = [
        { href: "#features", label: "Features" },
        { href: "#functionalities", label: "Functionalities" },
        { href: "#ai-processing-pipeline", label: "AI" },
        { href: "#dip-workflow", label: "DIP" },
        { href: "#contact-us", label: "Contact" }
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
                <Link href="/#top" className="font-extrabold tracking-tight text-lg md:text-xl">
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
                    {NAV_LINKS.map(l => (
                        <li key={l.href}>
                            <Link href={l.href} className="hover:text-indigo-300 transition-colors">
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center gap-4">
                    {!session && (
                        <button
                            onClick={() => {
                                router.push("/auth/signin");
                            }}
                            className="relative overflow-hidden rounded-md px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/15 transition"
                        >
                            <span className="relative z-10">Sign In</span>
                        </button>
                    )}
                    {session && (
                        <div ref={userMenuRef} className="relative">
                            <button
                                aria-haspopup="true"
                                aria-expanded={userMenuOpen}
                                onClick={() => setUserMenuOpen(o => !o)}
                                className="group relative outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-full"
                            >
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/15 bg-white/5 hover:border-indigo-400/60 transition">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "Profile"}
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-indigo-500/40 to-purple-500/40 text-indigo-100">
                                            {session.user?.name?.[0] || "U"}
                                        </div>
                                    )}
                                    <div className={`absolute inset-0 rounded-full ring-2 ring-indigo-400/0 group-hover:ring-indigo-400/50 transition`} />
                                </div>
                                <span className="sr-only">User menu</span>
                            </button>
                            {userMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute right-0 mt-3 w-72 z-50"
                                >
                                    <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-white/25 via-white/10 to-transparent backdrop-blur">
                                        <div className="absolute inset-0 rounded-2xl opacity-40 mix-blend-overlay pointer-events-none"
                                             style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(129,140,248,0.35), transparent 65%)' }} />
                                        <div className="relative rounded-[15px] bg-black/80 border border-white/10 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden">
                                            <div className="px-5 pt-5 pb-4 flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/15 bg-white/5">
                                                    {session.user?.image ? (
                                                        <Image
                                                            src={session.user.image}
                                                            alt={session.user.name || "User"}
                                                            fill
                                                            sizes="56px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-indigo-500/40 to-purple-500/40 text-indigo-100">
                                                            {session.user?.name?.[0] || "U"}
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {session.user?.name}
                                                    </p>
                                                    <p className="text-xs text-neutral-400 truncate">
                                                        {session.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="px-5 pb-5">
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            showToast({ type: "warning", title: "Signing out", message: "Ending session..." });
                                                            signOut({ callbackUrl: "/" });
                                                        }}
                                                        className="group relative w-full overflow-hidden rounded-md px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-500/70 to-purple-500/70 hover:from-indigo-500 hover:to-purple-500 border border-white/10 transition"
                                                    >
                                                        <span className="relative z-10">Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="px-5 pb-4 -mt-1">
                                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                <p className="mt-3 text-[10px] text-neutral-500 tracking-wide">
                                                    Secure session • SophiaNet
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {open && (
                <div className="md:hidden border-t border-white/10 px-4 pb-4">
                    <ul className="flex flex-col gap-3 pt-3 text-sm">
                        {NAV_LINKS.map(l => (
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
                        {!session && (
                            <li>
                                <button
                                    onClick={() => {
                                        router.push("/auth/signin");
                                    }}
                                    className="w-full text-left px-1 py-1 rounded hover:bg-white/10"
                                >
                                    Sign In
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </motion.nav>
    );
}
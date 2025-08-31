"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "motion/react";
import { useToast } from "@/providers/ToastProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function SignInPage() {
    const { showToast } = useToast();
    const searchParams = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            const map: Record<string,string> = {
                OAuthAccountNotLinked: "Account already linked with another provider.",
                AccessDenied: "Access denied.",
                Configuration: "Configuration error.",
                CredentialsSignin: "Credential sign in failed.",
                Default: "Authentication error."
            };
            showToast({
                type: "error",
                title: "Sign in error",
                message: map[error] || map.Default
            });
        }
    }, [searchParams, showToast]);

    return (
        <main className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-24">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-32 -left-20 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-indigo-600/25 via-purple-600/20 to-cyan-500/25 blur-3xl"
                    animate={{ scale: [0.85, 1.05, 0.85], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-16 w-[44rem] h-[44rem] rounded-full bg-gradient-to-tr from-blue-500/25 via-sky-500/20 to-teal-400/25 blur-3xl"
                    animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-white/15 via-white/5 to-transparent backdrop-blur">
                    <div className="absolute inset-0 rounded-2xl opacity-40 mix-blend-overlay"
                         style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.4), transparent 60%)' }} />
                    <div className="relative rounded-[15px] bg-black/70 border border-white/10 backdrop-blur-xl p-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl font-extrabold tracking-tight">
                                    Sophia<span className="text-indigo-400">Net</span>
                                </span>
                            </div>
                            <h1 className="text-2xl font-semibold">Welcome back</h1>
                            <p className="mt-2 text-sm text-neutral-300 max-w-xs">
                                Sign in to access your unified multimodal knowledge workspace.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ y: -2 }}
                                onClick={() => {
                                    showToast({ type: "info", title: "Redirecting", message: "To Google for authentication..." });
                                    signIn("google", { callbackUrl: "/" });
                            }}
                                className="w-full group relative overflow-hidden rounded-lg border border-white/15 bg-white/5 px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium text-white transition"
                            >
                                <Image src="/google-icon.svg" alt="Google" width={20} height={20} priority />
                                <span>Continue with Google</span>
                            </motion.button>

                            <div className="relative text-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <span className="relative bg-black/70 px-3 text-[11px] tracking-wide uppercase text-neutral-400">
                                    Secure • OAuth 2.0
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 text-[11px] text-neutral-400 leading-relaxed space-y-2">
                            <p>
                                By signing in you agree to our{" "}
                                <Link href="#" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
                                    Terms
                                </Link>{" "}
                                &{" "}
                                <Link href="#" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
                                    Privacy Policy
                                </Link>.
                            </p>
                            <p className="text-neutral-500">
                                Need an account? Just continue with Google — we create it automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
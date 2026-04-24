"use client";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MoveTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const hero = document.getElementById("hero");
        const calcThreshold = () => (hero ? hero.offsetHeight : 300);
        const onScroll = () => {
            const threshold = calcThreshold();
            setVisible(window.scrollY > threshold);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            className="fixed bottom-10 right-10 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 z-50 transition-opacity"
            aria-label="Scroll to top"
        >
            <Link href="#top">
                <ArrowUp size={24} className="text-white size-7 font-extrabold" />
            </Link>
        </button>
    );
}
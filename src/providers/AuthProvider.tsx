"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useToast } from "./ToastProvider";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const lastRedirectRef = useRef<string | null>(null);

  const publicAllowed = ["/", "/auth/signin"];

  useEffect(() => {
    if (
      status === "unauthenticated" &&
      !publicAllowed.includes(pathname) &&
      lastRedirectRef.current !== pathname
    ) {
      lastRedirectRef.current = pathname;
      showToast({
        type: "warning",
        title: "Authentication required",
        message: "Please sign in to access that page.",
      });
      router.replace("/auth/signin");
    }
  }, [status, pathname, router, publicAllowed, showToast]);

  if (status === "loading") return null;
  if (status === "unauthenticated" && !publicAllowed.includes(pathname)) return null;

  return <>{children}</>;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGate>{children}</AuthGate>
    </SessionProvider>
  );
}
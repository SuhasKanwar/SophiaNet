import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "@/providers/ContextProvider";

export const metadata: Metadata = {
  title: "SophiaNet",
  keywords: [
    "SophiaNet",
    "AI",
    "Knowledge",
    "Web",
    "GenAI",
    "Digital Image Processing",
  ],
  authors: [
    {
      name: "Suhas Kanwar",
      url: "https://suhaskanwar.tech",
    },
  ],
  description:
    "SophiaNet is an AI-powered multimodal knowledge platform that transforms scattered information across notes, videos, and the web into structured, enhanced, and generative insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased text-white min-h-screen flex flex-col bg-gradient-to-b from-black via-black to-[#0f0f17]">
        <ContextProvider>
          <main className="flex-1">
            {children}
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
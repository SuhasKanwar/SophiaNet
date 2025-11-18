"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidChartProps {
  code: string;
}

export default function MermaidChart({ code }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        background: "#020617",
        primaryColor: "#020617",
        primaryBorderColor: "#e5e7eb",
        primaryTextColor: "#e5e7eb",
        lineColor: "#e5e7eb",
        secondaryColor: "#020617",
        secondaryBorderColor: "#e5e7eb",
        tertiaryColor: "#020617",
        tertiaryBorderColor: "#e5e7eb",
        textColor: "#e5e7eb",
      },
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !code.trim()) return;

    const id = "mermaid-" + Math.random().toString(36).slice(2);
    containerRef.current.innerHTML = "";

    mermaid
      .render(id, code)
      .then(({ svg }) => {
        containerRef.current!.innerHTML = svg;
      })
      .catch(() => {
        containerRef.current!.innerHTML =
          '<div class="text-red-400 text-xs">Failed to render diagram. Please check Mermaid syntax.</div>';
      });
  }, [code]);

  return <div ref={containerRef} className="mermaid-dark" />;
}
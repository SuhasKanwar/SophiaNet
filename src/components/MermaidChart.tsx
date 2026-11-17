"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict", suppressErrorRendering: true });

export default function MermaidChart({ code, onRender, className = "flex h-[480px] flex-col sm:h-[560px]" }: { code: string; className?: string; onRender: (svg: string | null) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [rendering, setRendering] = useState(false);

  const fit = useCallback(() => {
    const viewport = viewportRef.current;
    const svg = containerRef.current?.querySelector("svg");
    if (!viewport || !svg) return;
    const { width, height } = svg.viewBox.baseVal;
    if (!width || !height) return;
    const scale = Math.min((viewport.clientWidth - 40) / width, (viewport.clientHeight - 40) / height, 1.5);
    setZoom(scale);
    setPan({ x: (viewport.clientWidth - width * scale) / 2, y: (viewport.clientHeight - height * scale) / 2 });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    onRender(null);
    setError("");
    setRendering(true);
    const id = `diagram-${crypto.randomUUID()}`;
    if (!code.trim()) { setRendering(false); return; }
    mermaid.render(id, code).then(({ svg }) => {
      if (cancelled) return;
      container.innerHTML = svg;
      const element = container.querySelector("svg");
      if (element) {
        const { width, height } = element.viewBox.baseVal;
        element.style.maxWidth = "none";
        element.setAttribute("width", String(width));
        element.setAttribute("height", String(height));
        element.setAttribute("role", "img");
        element.setAttribute("aria-label", "Generated diagram");
      }
      onRender(new XMLSerializer().serializeToString(container.querySelector("svg")!));
      fit();
    }).catch(() => {
      if (!cancelled) setError("This code could not be rendered. Ask for a correction in the chat input to regenerate the diagram.");
    }).finally(() => {
      if (!cancelled) setRendering(false);
    });
    return () => { cancelled = true; };
  }, [code, fit, onRender]);

  useEffect(() => {
    if (!viewportRef.current) return;
    const observer = new ResizeObserver(fit);
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [fit]);

  const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className={className}>
      <div ref={viewportRef} className="relative min-h-0 flex-1 touch-none overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={event => {
          if (event.button !== 0) return;
          drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          if (drag.current) setPan({ x: drag.current.panX + event.clientX - drag.current.x, y: drag.current.panY + event.clientY - drag.current.y });
        }}
        onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={() => { drag.current = null; }}>
        <div ref={containerRef} className="absolute left-0 top-0 origin-top-left" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }} />
        {rendering && <p role="status" className="absolute inset-x-4 top-4 rounded-lg bg-slate-950 p-3 text-sm text-neutral-300">Rendering preview…</p>}
        {error && <p role="alert" className="absolute inset-x-4 top-4 rounded-lg bg-slate-950 p-3 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  );
}

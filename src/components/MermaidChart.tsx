"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "strict", suppressErrorRendering: true });

export default function MermaidChart({ code }: { code: string }) {
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
    setError("");
    setRendering(true);
    const id = `diagram-${crypto.randomUUID()}`;
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
      fit();
    }).catch(() => {
      if (!cancelled) setError("This code could not be rendered. Correct the Mermaid syntax and update the preview.");
    }).finally(() => {
      if (!cancelled) setRendering(false);
    });
    return () => { cancelled = true; };
  }, [code, fit]);

  useEffect(() => {
    if (!viewportRef.current) return;
    const observer = new ResizeObserver(fit);
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [fit]);

  const changeZoom = (factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = Math.max(0.05, Math.min(4, zoom * factor));
    const ratio = next / zoom;
    setPan(current => ({
      x: viewport.clientWidth / 2 - (viewport.clientWidth / 2 - current.x) * ratio,
      y: viewport.clientHeight / 2 - (viewport.clientHeight / 2 - current.y) * ratio,
    }));
    setZoom(next);
  };

  const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="flex h-[480px] flex-col sm:h-[560px]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <span className="text-sm text-neutral-300">Preview</span>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Zoom out" onClick={() => changeZoom(1 / 1.2)} className="rounded border border-white/20 px-3 py-1 hover:bg-white/10">−</button>
          <output className="w-12 text-center text-xs text-neutral-400" aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
          <button type="button" aria-label="Zoom in" onClick={() => changeZoom(1.2)} className="rounded border border-white/20 px-3 py-1 hover:bg-white/10">+</button>
          <button type="button" onClick={fit} className="rounded border border-white/20 px-3 py-1 text-sm hover:bg-white/10">Fit</button>
        </div>
      </div>
      <div ref={viewportRef} className="relative min-h-0 flex-1 touch-none overflow-hidden cursor-grab active:cursor-grabbing" style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "22px 22px" }}
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
      <p className="border-t border-white/10 px-4 py-2 text-xs text-neutral-500">Drag to pan. Use + / − to zoom, or Fit to center the diagram.</p>
    </div>
  );
}

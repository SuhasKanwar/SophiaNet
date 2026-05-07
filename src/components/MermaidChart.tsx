"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidChartProps {
  code: string;
}

export default function MermaidChart({ code }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 24, y: 24 });

  const minZoom = 0.5;
  const maxZoom = 2.5;
  const zoomStep = 0.12;
  const canvasStyle = useMemo(
    () => ({
      backgroundImage:
        "radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.16) 1px, transparent 0)",
      backgroundSize: "22px 22px",
      backgroundPosition: "0 0",
    }),
    []
  );

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
    setZoom(1);

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

  const updateZoom = (
    nextZoom: number,
    anchor?: { x: number; y: number; rect: DOMRect }
  ) => {
    const clampedZoom = Math.min(maxZoom, Math.max(minZoom, nextZoom));
    const zoomRatio = clampedZoom / zoom;

    if (anchor) {
      const anchorX = anchor.x - anchor.rect.left;
      const anchorY = anchor.y - anchor.rect.top;
      setPan((currentPan) => ({
        x: anchorX - (anchorX - currentPan.x) * zoomRatio,
        y: anchorY - (anchorY - currentPan.y) * zoomRatio,
      }));
    }

    setZoom(clampedZoom);
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    const direction = event.deltaY > 0 ? -1 : 1;
    const nextZoom = zoom + direction * zoomStep;

    updateZoom(nextZoom, { x: event.clientX, y: event.clientY, rect });
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    panStartRef.current = pan;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!isDraggingRef.current) return;

    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;

    setPan({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY,
    });
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="relative h-full min-h-[70vh] w-full overflow-hidden touch-none" style={canvasStyle}>
      <div
        className="absolute inset-0"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <div
            ref={containerRef}
            className="mermaid-dark inline-block"
          />
        </div>
      </div>
    </div>
  );
}
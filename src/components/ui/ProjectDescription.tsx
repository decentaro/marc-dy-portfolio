"use client";

import { useEffect, useRef, useCallback } from "react";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

interface ProjectDescriptionProps {
  text: string;
  // Corner obstacle: thumbnail right-bottom corner clips into the text area
  // thumbHeight: how tall the thumbnail is (192px), cornerRadius: how much it bites in
  thumbOverlapW: number; // px wide the thumbnail bites into text at top
  thumbOverlapH: number; // px tall the overlap lasts
}

const FONT = "400 14px Inter, system-ui, sans-serif";
const LINE_H = 22;
const CANVAS_PAD = 0;

export default function ProjectDescription({
  text,
  thumbOverlapW,
  thumbOverlapH,
}: ProjectDescriptionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preparedRef = useRef<ReturnType<typeof prepareWithSegments> | null>(null);
  const heightRef = useRef(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    if (W <= 0) return;

    if (!preparedRef.current) {
      preparedRef.current = prepareWithSegments(text, FONT);
    }
    const prepared = preparedRef.current;

    // First pass: measure total height by laying out with obstacle
    let totalLines = 0;
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let lineY = 0;
    const maxIter = 200;
    let iter = 0;

    while (iter++ < maxIter) {
      const lineTop = lineY;
      const lineBot = lineY + LINE_H;
      // Obstacle: top-right corner of thumbnail hangs into text area
      const obsOverlaps = lineTop < thumbOverlapH && thumbOverlapW > 0;
      const availW = obsOverlaps
        ? Math.max(0, W - thumbOverlapW - CANVAS_PAD)
        : W - CANVAS_PAD;
      const lineX = 0;

      if (availW < 20) { lineY += LINE_H; totalLines++; continue; }

      const line = layoutNextLine(prepared, cursor, availW);
      if (!line) break;
      cursor = line.end;
      lineY += LINE_H;
      totalLines++;
      void lineX;
      void lineBot;
    }

    const neededH = lineY + 4;

    // Resize canvas to fit text exactly
    canvas.width = W * dpr;
    canvas.height = neededH * dpr;
    canvas.style.height = `${neededH}px`;
    heightRef.current = neededH;

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.font = FONT;
    ctx.fillStyle = "rgba(209,213,219,0.9)"; // text-gray-300
    ctx.textBaseline = "top";

    // Second pass: actually draw
    cursor = { segmentIndex: 0, graphemeIndex: 0 };
    lineY = 0;
    iter = 0;
    preparedRef.current = prepareWithSegments(text, FONT);

    while (iter++ < maxIter) {
      const lineTop = lineY;
      const obsOverlaps = lineTop < thumbOverlapH && thumbOverlapW > 0;
      const availW = obsOverlaps
        ? Math.max(0, W - thumbOverlapW - CANVAS_PAD)
        : W - CANVAS_PAD;
      const lineX = obsOverlaps ? thumbOverlapW : 0;

      if (availW < 20) { lineY += LINE_H; continue; }

      const line = layoutNextLine(prepared, cursor, availW);
      if (!line) break;
      ctx.fillText(line.text, lineX, lineY);
      cursor = line.end;
      lineY += LINE_H;
    }

    ctx.restore();
  }, [text, thumbOverlapW, thumbOverlapH]);

  useEffect(() => {
    render();
    const ro = new ResizeObserver(render);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", display: "block" }}
    />
  );
}

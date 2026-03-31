"use client";

import { useEffect, useRef, useCallback } from "react";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

interface Line {
  text: string;
  fontSize: number;
  color: string;
  weight: string;
  font?: string; // optional font override, e.g. monospace
}

interface ParticleTextProps {
  lines: Line[];
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  char: string; // the falling character shown before settling
  charAlpha: number; // fade out as particle settles
}

const PARTICLE_SPACING = 3;
const MOUSE_RADIUS = 90;
const MOUSE_FORCE = 4;
const SPRING = 0.055;
const FRICTION = 0.80;
const CODE_CHARS = "01アイウエオabcdef{}[]<>/\\|!@#$%^&*";

function sampleTextPixels(
  text: string,
  fontStr: string,
  maxWidth: number,
  lineHeightPx: number,
  canvasWidth: number
): { x: number; y: number }[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = canvasWidth;
  offscreen.height = lineHeightPx * 8;
  const ctx = offscreen.getContext("2d", { willReadFrequently: true })!;

  ctx.clearRect(0, 0, offscreen.width, offscreen.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = fontStr;
  ctx.textBaseline = "top";

  const prepared = prepareWithSegments(text, fontStr);
  const { lines } = layoutWithLines(prepared, maxWidth, lineHeightPx);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i].text, 0, i * lineHeightPx);
  }

  const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);
  const pixels: { x: number; y: number }[] = [];

  for (let y = 0; y < offscreen.height; y += PARTICLE_SPACING) {
    for (let x = 0; x < offscreen.width; x += PARTICLE_SPACING) {
      if (imageData.data[(y * offscreen.width + x) * 4 + 3] > 128) {
        pixels.push({ x, y });
      }
    }
  }

  return pixels;
}

export default function ParticleText({ lines, className }: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const buildParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    canvas.width = W * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    const allParticles: Particle[] = [];
    let offsetY = 0;

    for (const line of lines) {
      const fontFamily = line.font ?? "Inter, system-ui, sans-serif";
      const fontStr = `${line.weight} ${line.fontSize * dpr}px ${fontFamily}`;
      const lineHeightPx = line.fontSize * dpr * 1.25;
      const maxWidth = W * dpr;

      const pixels = sampleTextPixels(line.text, fontStr, maxWidth, lineHeightPx, W * dpr);

      const prepared = prepareWithSegments(line.text, fontStr);
      const { lines: ptLines, height } = layoutWithLines(prepared, maxWidth, lineHeightPx);

      let maxLineWidth = 0;
      for (const ptLine of ptLines) {
        if (ptLine.width > maxLineWidth) maxLineWidth = ptLine.width;
      }

      const xOffset = (W * dpr - maxLineWidth) / 2;

      for (const px of pixels) {
        const tx = px.x + xOffset;
        const ty = px.y + offsetY;

        // Fall from above (terminal feel) with horizontal jitter
        const ox = tx + (Math.random() - 0.5) * W * dpr * 0.6;
        const oy = -50 - Math.random() * 300;

        allParticles.push({
          x: ox,
          y: oy,
          targetX: tx,
          targetY: ty,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2,
          size: 1.0 + Math.random() * 0.8,
          color: line.color,
          alpha: 0,
          targetAlpha: 0.88 + Math.random() * 0.12,
          char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
          charAlpha: 1,
        });
      }

      offsetY += height + line.fontSize * dpr * 0.5;
    }

    particlesRef.current = allParticles;
  }, [lines]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const mx = mouseRef.current.x * dpr;
    const my = mouseRef.current.y * dpr;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particlesRef.current) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const distSq = dx * dx + dy * dy;
      const r = MOUSE_RADIUS * dpr;

      if (distSq < r * r) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / r) * MOUSE_FORCE;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx += (p.targetX - p.x) * SPRING;
      p.vy += (p.targetY - p.y) * SPRING;
      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += (p.targetAlpha - p.alpha) * 0.035;

      // How close to target (0=far, 1=arrived)
      const distToTarget = Math.sqrt((p.x - p.targetX) ** 2 + (p.y - p.targetY) ** 2);
      const settled = Math.max(0, 1 - distToTarget / (30 * dpr));
      p.charAlpha = Math.max(0, 1 - settled * 1.6);

      // Draw the falling code char while in transit
      if (p.charAlpha > 0.02) {
        ctx.globalAlpha = p.alpha * p.charAlpha * 0.7;
        ctx.fillStyle = "#22d3ee";
        ctx.font = `${Math.round(p.size * 5)}px 'Courier New', monospace`;
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, p.x - p.size * 2, p.y);
      }

      // Draw the settled dot
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha)) * (1 - p.charAlpha * 0.8);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    buildParticles();
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", buildParticles);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", buildParticles);
    };
  }, [buildParticles, animate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}

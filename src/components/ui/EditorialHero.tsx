"use client";

import { useEffect, useRef, useCallback } from "react";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

interface EditorialHeroProps {
  name: string;
  bio: string;
}

const LINE_HEIGHT = 24;
const BODY_SIZE = 15;
// Obstacles: name block + title block + stats block
const OBSTACLES_PAD_X = 20;
const OBSTACLES_PAD_Y = 8;

interface Obstacle {
  x: number; y: number; w: number; h: number;
}

export default function EditorialHero({ name, bio }: EditorialHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preparedRef = useRef<ReturnType<typeof prepareWithSegments> | null>(null);
  const rafRef = useRef<number>(0);

  // All obstacle positions — smoothly lerped toward targets
  const namePos = useRef({ x: 0, y: 0 });
  const nameTgt = useRef({ x: 0, y: 0 });
  const initRef = useRef(false);

  // Glitch state
  const glitchRef = useRef({ active: false, frame: 0, totalFrames: 0, nextAt: Date.now() + 800 });
  const frameCountRef = useRef(0);

  const getNameFont = (W: number) => {
    const size = Math.round(Math.min(Math.max(W * 0.11, 48), 96));
    return { size, font: `800 ${size}px Inter, system-ui, sans-serif` };
  };

  const getTitleFont = (nameSize: number) => {
    const size = Math.round(nameSize * 0.28);
    return { size, font: `300 ${size}px Inter, system-ui, sans-serif` };
  };

  const getObstacles = useCallback((
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    nx: number, ny: number
  ): Obstacle[] => {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const { size: nameSize, font: nameFont } = getNameFont(W);
    ctx.font = nameFont;
    const nameW = ctx.measureText(name).width;
    const nameH = nameSize * 1.15;

    const { size: titleSize, font: titleFont } = getTitleFont(nameSize);
    ctx.font = titleFont;
    const titleText = "Software Engineer";
    const titleW = ctx.measureText(titleText).width;
    const titleH = titleSize * 1.3;

    // Stats block: fixed text, positioned below title
    const statsText = "6 projects  ·  50+ users  ·  ● live";
    const statsSize = Math.round(nameSize * 0.18);
    ctx.font = `400 ${statsSize}px 'Courier New', monospace`;
    const statsW = ctx.measureText(statsText).width;
    const statsH = statsSize * 1.5;

    const obstacles: Obstacle[] = [
      // Name block
      {
        x: nx - OBSTACLES_PAD_X,
        y: ny - OBSTACLES_PAD_Y,
        w: nameW + OBSTACLES_PAD_X * 2,
        h: nameH + OBSTACLES_PAD_Y * 2,
      },
      // Title — sits right below name, right-aligned to name
      {
        x: nx + nameW - titleW - OBSTACLES_PAD_X,
        y: ny + nameH + 4 - OBSTACLES_PAD_Y,
        w: titleW + OBSTACLES_PAD_X * 2,
        h: titleH + OBSTACLES_PAD_Y * 2,
      },
      // Stats — below title, right-aligned
      {
        x: nx + nameW - statsW - OBSTACLES_PAD_X,
        y: ny + nameH + titleH + 10 - OBSTACLES_PAD_Y,
        w: statsW + OBSTACLES_PAD_X * 2,
        h: statsH + OBSTACLES_PAD_Y * 2,
      },
    ];

    return obstacles;
  }, [name]);

  const setDefaultPos = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const { size, font } = getNameFont(W);
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;
    const nameW = ctx.measureText(name).width;
    const x = 8;
    const y = Math.round(canvas.height / dpr * 0.08);
    namePos.current = { x, y };
    nameTgt.current = { x, y };
  }, [name]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    preparedRef.current = null;
    setDefaultPos(canvas);
    initRef.current = true;
  }, [setDefaultPos]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !initRef.current) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Lerp name toward target (smooth mouse follow)
    const cur = namePos.current;
    const tgt = nameTgt.current;
    cur.x += (tgt.x - cur.x) * 0.07;
    cur.y += (tgt.y - cur.y) * 0.07;
    const nx = cur.x;
    const ny = cur.y;

    // Compute all three obstacle rects
    const obstacles = getObstacles(canvas, ctx, nx, ny);

    // ── Body text: layoutNextLine with variable width per line ────────
    // For each line, compute available width by subtracting obstacle overlap
    if (!preparedRef.current) {
      preparedRef.current = prepareWithSegments(bio, `400 ${BODY_SIZE}px Inter, system-ui, sans-serif`);
    }
    const prepared = preparedRef.current;

    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(148,163,184,0.85)";
    ctx.font = `400 ${BODY_SIZE}px Inter, system-ui, sans-serif`;

    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let lineY = 0;

    while (lineY < H + LINE_HEIGHT) {
      const lineTop = lineY;
      const lineBot = lineY + LINE_HEIGHT;

      // Find all obstacles that overlap this line vertically
      const overlapping = obstacles.filter(
        (o) => lineTop < o.y + o.h && lineBot > o.y && o.x < W && o.x + o.w > 0
      );

      if (overlapping.length === 0) {
        // Full width — hot path, just arithmetic
        const line = layoutNextLine(prepared, cursor, W);
        if (!line) break;
        ctx.fillText(line.text, 0, lineY);
        cursor = line.end;
      } else {
        // Build free segments by subtracting all obstacle x-ranges from [0, W]
        // Sort obstacles left to right
        const sorted = [...overlapping].sort((a, b) => a.x - b.x);
        const segments: Array<{ x: number; w: number }> = [];
        let pos = 0;
        for (const o of sorted) {
          if (o.x > pos) segments.push({ x: pos, w: o.x - pos });
          pos = Math.max(pos, o.x + o.w);
        }
        if (pos < W) segments.push({ x: pos, w: W - pos });

        // Pick the widest free segment to flow text into
        const best = segments.reduce(
          (a, b) => (b.w > a.w ? b : a),
          { x: 0, w: 0 }
        );

        if (best.w > 40) {
          const line = layoutNextLine(prepared, cursor, best.w);
          if (!line) break;
          ctx.fillText(line.text, best.x, lineY);
          cursor = line.end;
        }
        // else: skip line, obstacles cover entire width
      }

      lineY += LINE_HEIGHT;
    }

    // ── Draw obstacles (text on top of body) ─────────────────────────
    const { size: nameSize, font: nameFont } = getNameFont(W);
    const { size: titleSize, font: titleFont } = getTitleFont(nameSize);
    const statsSize = Math.round(nameSize * 0.18);

    // ── Glitch tick ──────────────────────────────────────────────────
    const g = glitchRef.current;
    const now = Date.now();
    frameCountRef.current++;
    const fc = frameCountRef.current;

    if (!g.active && now >= g.nextAt) {
      g.active = true;
      g.frame = 0;
      g.totalFrames = 14 + Math.floor(Math.random() * 10);
    }
    if (g.active) {
      g.frame++;
      if (g.frame >= g.totalFrames) {
        g.active = false;
        g.nextAt = now + 1800 + Math.random() * 2500;
      }
    }

    // Name
    ctx.font = nameFont;
    ctx.textBaseline = "top";
    const nameW = ctx.measureText(name).width;

    // Continuous slow pulse on the glow
    const pulse = 0.15 + 0.1 * Math.sin(fc * 0.04);

    if (g.active) {
      const ox = (Math.random() - 0.5) * nameSize * 0.07;
      const oy = (Math.random() - 0.5) * nameSize * 0.025;
      const sliceY = ny + Math.random() * nameSize * 0.85;
      const sliceH = nameSize * (0.06 + Math.random() * 0.18);

      // Base white with stronger glow during glitch
      ctx.shadowColor = "rgba(34,211,238,0.5)";
      ctx.shadowBlur = 36;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(name, nx, ny);
      ctx.shadowBlur = 0;

      // RGB channel split
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(255,40,40,0.65)";
      ctx.fillText(name, nx - ox * 2.5, ny + oy);
      ctx.fillStyle = "rgba(40,255,140,0.4)";
      ctx.fillText(name, nx + ox * 2, ny - oy);
      ctx.fillStyle = "rgba(40,140,255,0.4)";
      ctx.fillText(name, nx + ox, ny + oy * 2.5);
      ctx.restore();

      // Horizontal scanline slice
      if (g.frame % 2 === 0) {
        ctx.save();
        ctx.fillStyle = "rgba(34,211,238,0.15)";
        ctx.fillRect(nx - 2, sliceY, nameW + 8, sliceH);
        // Second thin slice
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(nx - 2, sliceY + sliceH + 2, nameW + 8, 2);
        ctx.restore();
      }
    } else {
      // Normal: breathing cyan glow
      ctx.shadowColor = `rgba(34,211,238,${pulse})`;
      ctx.shadowBlur = 24 + pulse * 20;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(name, nx, ny);
      ctx.shadowBlur = 0;
    }

    // Cyan underline — also pulses
    ctx.fillStyle = `rgba(34,211,238,${0.4 + pulse * 0.6})`;
    ctx.fillRect(nx, ny + nameSize * 1.15 - 2, nameW, 2);

    // Title
    ctx.font = titleFont;
    ctx.fillStyle = "rgba(148,163,184,0.7)";
    ctx.textBaseline = "top";
    const titleText = "Software Engineer";
    const titleW = ctx.measureText(titleText).width;
    ctx.fillText(titleText, nx + nameW - titleW, ny + nameSize * 1.15 + 6);

    // Stats
    ctx.font = `400 ${statsSize}px 'Courier New', monospace`;
    ctx.fillStyle = "rgba(34,211,238,0.45)";
    const statsText = "6 projects  ·  50+ users  ·  ● live";
    const statsW = ctx.measureText(statsText).width;
    ctx.fillText(
      statsText,
      nx + nameW - statsW,
      ny + nameSize * 1.15 + titleSize * 1.3 + 12
    );

    ctx.restore();
  }, [name, bio, getObstacles]);

  const animate = useCallback(() => {
    draw();
    rafRef.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    resize();
    rafRef.current = requestAnimationFrame(animate);
    // Live resize — re-layout runs every frame naturally since draw() is called
    // on every rAF; resize just updates canvas dimensions + resets prepared
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [resize, animate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const { size, font } = getNameFont(W);
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;
    const nameW = ctx.measureText(name).width;
    const nameH = size * 1.15;
    nameTgt.current = {
      x: Math.max(0, Math.min(W - nameW, mx - nameW / 2)),
      y: Math.max(0, Math.min(H - nameH * 2.5, my - nameH / 2)),
    };
  }, [name]);

  const handleMouseLeave = useCallback(() => {
    setDefaultPos(canvasRef.current!);
  }, [setDefaultPos]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}

"use client";

import { useEffect, useRef, useCallback } from "react";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

interface EditorialHeroProps {
  name: string;
  bio: string;
}

const LINE_HEIGHT = 26;
const BODY_SIZE = 15;
const NAME_PAD_X = 24;
const NAME_PAD_Y = 12;

export default function EditorialHero({ name, bio }: EditorialHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const namePosRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const preparedRef = useRef<ReturnType<typeof prepareWithSegments> | null>(null);
  const rafRef = useRef<number>(0);
  const initdRef = useRef(false);

  const getNameFont = (W: number) => {
    const size = Math.round(Math.min(Math.max(W * 0.11, 48), 96));
    return { size, font: `800 ${size}px Inter, system-ui, sans-serif` };
  };

  const getBodyFont = (dpr: number) =>
    `400 ${BODY_SIZE * dpr}px Inter, system-ui, sans-serif`;

  const setDefaultPos = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const { size, font } = getNameFont(W);
    const ctx = canvas.getContext("2d")!;
    ctx.font = font;
    const nameW = ctx.measureText(name).width;
    const nameH = size * 1.15;
    // Place name top-right, text flows left and below
    const x = W - nameW - 8;
    const y = 4;
    namePosRef.current = { x, y };
    targetPosRef.current = { x, y };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void nameH;
  }, [name]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    preparedRef.current = null;
    setDefaultPos(canvas);
    initdRef.current = true;
  }, [setDefaultPos]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !initdRef.current) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Lerp name toward target
    const cur = namePosRef.current;
    const tgt = targetPosRef.current;
    cur.x += (tgt.x - cur.x) * 0.07;
    cur.y += (tgt.y - cur.y) * 0.07;

    const { size, font: nameFont } = getNameFont(W);
    const bodyFont = getBodyFont(1); // CSS px, not dpr
    const nameH = size * 1.15;

    ctx.font = nameFont;
    const nameW = ctx.measureText(name).width;

    const nx = cur.x;
    const ny = cur.y;
    const obsLeft = nx - NAME_PAD_X;
    const obsRight = nx + nameW + NAME_PAD_X;
    const obsTop = ny - NAME_PAD_Y;
    const obsBottom = ny + nameH + NAME_PAD_Y;

    // ── Body text with obstacle-aware layout via layoutNextLine ──────
    if (!preparedRef.current) {
      preparedRef.current = prepareWithSegments(bio, `400 ${BODY_SIZE}px Inter, system-ui, sans-serif`);
    }
    const prepared = preparedRef.current;

    ctx.font = bodyFont;
    ctx.fillStyle = "rgba(148,163,184,0.85)";
    ctx.textBaseline = "top";

    const fullW = W;
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let lineY = 0;

    while (lineY < H + LINE_HEIGHT) {
      const lineTop = lineY;
      const lineBot = lineY + LINE_HEIGHT;
      const overlaps =
        lineTop < obsBottom &&
        lineBot > obsTop &&
        obsRight > 0 &&
        obsLeft < fullW;

      if (!overlaps) {
        const line = layoutNextLine(prepared, cursor, fullW);
        if (!line) break;
        ctx.fillText(line.text, 0, lineY);
        cursor = line.end;
      } else {
        // Left column
        const leftW = Math.max(0, obsLeft);
        // Right column
        const rightW = Math.max(0, fullW - obsRight);
        const rightX = obsRight;

        if (leftW > 60) {
          const line = layoutNextLine(prepared, cursor, leftW);
          if (!line) break;
          ctx.fillText(line.text, 0, lineY);
          cursor = line.end;
        } else if (rightW > 60) {
          const line = layoutNextLine(prepared, cursor, rightW);
          if (!line) break;
          ctx.fillText(line.text, rightX, lineY);
          cursor = line.end;
        } else {
          // No room either side — skip line (name covers full width here)
          lineY += LINE_HEIGHT;
          continue;
        }
      }

      lineY += LINE_HEIGHT;
    }

    // ── Name ────────────────────────────────────────────────────────
    ctx.font = nameFont;
    ctx.textBaseline = "top";
    ctx.shadowColor = "rgba(34,211,238,0.2)";
    ctx.shadowBlur = 32;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name, nx, ny);
    ctx.shadowBlur = 0;

    // Thin cyan accent under name
    ctx.fillStyle = "rgba(34,211,238,0.5)";
    ctx.fillRect(nx, ny + nameH - 2, nameW, 2);

    ctx.restore();
  }, [name, bio]);

  const animate = useCallback(() => {
    draw();
    rafRef.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    resize();
    rafRef.current = requestAnimationFrame(animate);
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
    targetPosRef.current = {
      x: Math.max(0, Math.min(W - nameW, mx - nameW / 2)),
      y: Math.max(0, Math.min(H - nameH, my - nameH / 2)),
    };
  }, [name]);

  const handleMouseLeave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    setDefaultPos(canvas);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void dpr;
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

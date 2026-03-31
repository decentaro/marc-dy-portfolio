import { useEffect, useState, useCallback, useRef } from "react";
import { prepareWithSegments, layout } from "@chenglou/pretext";

interface Project {
  id: number;
  title: string;
  shortDesc: string;
  description: string;
  detailedDescription: string;
  year: string;
  users?: string;
  techStack: { name: string }[];
  github?: string;
  demo?: string;
  status: string;
}

interface CardMeasurement {
  id: number;
  collapsedHeight: number;
  expandedHeight: number;
}

// All measurements are in px, matching the DOM layout of ProjectCard
const THUMBNAIL_H = 192;
const CARD_PADDING = 24; // p-6 = 24px each side, we measure inner width
const HEADER_H = 56; // title + status badge row + subtitle row
const USERS_H = 20;
const READ_MORE_BTN_H = 32;
const BADGE_H = 28; // one row of tech badges
const BUTTONS_H = 40;
const IN_DEV_NOTE_H = 24;
const DESC_FONT = "400 14px Inter, system-ui, sans-serif";
const DESC_LINE_H = 22; // text-sm leading-relaxed ≈ 14 * 1.57

function measureTextHeight(text: string, widthPx: number): number {
  if (!text || widthPx <= 0) return 0;
  const prepared = prepareWithSegments(text, DESC_FONT);
  const { height } = layout(prepared, widthPx, DESC_LINE_H);
  return height;
}

function calcCardHeight(project: Project, innerWidth: number, expanded: boolean): number {
  const descText = expanded ? project.detailedDescription : project.description;
  const descH = measureTextHeight(descText, innerWidth);

  // Badge rows: estimate how many rows the tech stack wraps into
  // Each badge is ~px wide; we use a fixed-width estimate per badge
  const BADGE_MIN_W = 60;
  const BADGE_GAP = 8;
  const badgesPerRow = Math.max(1, Math.floor((innerWidth + BADGE_GAP) / (BADGE_MIN_W + BADGE_GAP)));
  const badgeRows = Math.ceil(project.techStack.length / badgesPerRow);
  const badgesH = badgeRows * BADGE_H + (badgeRows - 1) * 8;

  let total =
    THUMBNAIL_H +
    CARD_PADDING +
    HEADER_H +
    (project.users ? USERS_H : 0) +
    12 + // mb-3
    descH +
    16 + // mb-4
    READ_MORE_BTN_H +
    16 + // mb-3 (tech)
    badgesH +
    12 + // mb-3 (actions)
    BUTTONS_H +
    CARD_PADDING;

  if (project.status === "In Development" && !project.github) {
    total += IN_DEV_NOTE_H + 16;
  }

  return Math.ceil(total);
}

export function useProjectMeasurements(
  projects: Project[],
  containerWidth: number,
  columns: number
) {
  const [measurements, setMeasurements] = useState<Map<number, CardMeasurement>>(new Map());
  const prevWidthRef = useRef(0);

  const measure = useCallback(() => {
    if (containerWidth <= 0) return;
    const colWidth = Math.floor((containerWidth - (columns - 1) * 32) / columns);
    const innerWidth = colWidth - CARD_PADDING * 2;

    const map = new Map<number, CardMeasurement>();
    for (const p of projects) {
      map.set(p.id, {
        id: p.id,
        collapsedHeight: calcCardHeight(p, innerWidth, false),
        expandedHeight: calcCardHeight(p, innerWidth, true),
      });
    }
    setMeasurements(map);
    prevWidthRef.current = containerWidth;
  }, [projects, containerWidth, columns]);

  useEffect(() => {
    // Only re-measure if width actually changed (debounce noise)
    if (Math.abs(containerWidth - prevWidthRef.current) > 2) {
      measure();
    }
  }, [measure, containerWidth]);

  // Initial measure
  useEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return measurements;
}

// Greedy masonry: assign each card to the shortest column
export function buildMasonryColumns<T extends { id: number }>(
  items: T[],
  measurements: Map<number, CardMeasurement>,
  columns: number,
  expandedId: number | null
): T[][] {
  const cols: T[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);

  for (const item of items) {
    const m = measurements.get(item.id);
    const h = m
      ? expandedId === item.id
        ? m.expandedHeight
        : m.collapsedHeight
      : 400;

    // Pick shortest column
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push(item);
    heights[shortest] += h + 32; // 32 = gap-8
  }

  return cols;
}

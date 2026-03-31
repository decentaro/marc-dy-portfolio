import { useEffect, useState, useRef } from "react";
import { prepareWithSegments, walkLineRanges } from "@chenglou/pretext";

const FONT = "400 16px Inter, system-ui, sans-serif";
const LINE_HEIGHT = 24;

// Uses pretext's walkLineRanges to binary-search the tightest width
// that keeps line count stable — eliminating orphan words on the last line.
function findBalancedWidth(text: string, maxWidth: number): number {
  if (!text || maxWidth <= 0) return maxWidth;

  const prepared = prepareWithSegments(text, FONT);

  // Get baseline line count at full width
  let baselineLines = 0;
  walkLineRanges(prepared, maxWidth, () => { baselineLines++; });

  if (baselineLines <= 1) return maxWidth;

  // Binary search: find the smallest width that preserves the same line count
  let lo = Math.floor(maxWidth * 0.5);
  let hi = maxWidth;

  while (hi - lo > 4) {
    const mid = Math.floor((lo + hi) / 2);
    let lines = 0;
    walkLineRanges(prepared, mid, () => { lines++; });
    if (lines === baselineLines) {
      hi = mid; // can go narrower
    } else {
      lo = mid; // too narrow, text wraps more
    }
  }

  return hi;
}

// Returns optimal max-width values for an array of texts at a given container width
export function useBalancedText(texts: string[], containerWidth: number): number[] {
  const [widths, setWidths] = useState<number[]>([]);
  // Stable ref for texts so we compare by value not reference
  const textsKey = texts.join("||");
  const prevKey = useRef("");
  const prevWidth = useRef(0);

  useEffect(() => {
    if (containerWidth <= 0) return;
    if (textsKey === prevKey.current && containerWidth === prevWidth.current) return;
    prevKey.current = textsKey;
    prevWidth.current = containerWidth;
    const cardInnerWidth = Math.floor(containerWidth / 3) - 48;
    const balanced = texts.map((t) => findBalancedWidth(t, cardInnerWidth));
    setWidths(balanced);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textsKey, containerWidth]);

  return widths;
}

/**
 * SpiderGraph.jsx  —  Pure SVG Radar / Spider Chart
 * ──────────────────────────────────────────────────
 * Zero external dependencies. Renders directly from spider_graph_data.
 * Supports snake_case, camelCase, and short key formats.
 */
import React, { useId } from "react";

const DIMENSIONS = [
  { key: "professional_alignment", label: "Professional", color: "#8b5cf6", darkColor: "#6d28d9" },
  { key: "lifestyle_sync",         label: "Lifestyle",    color: "#10b981", darkColor: "#047857" },
  { key: "emotional_readiness",    label: "Emotional",    color: "#f43f5e", darkColor: "#be123c" },
];

const SIZE   = 140;  // SVG viewBox half-size
const CENTER = SIZE; // cx = cy = SIZE  (viewBox = "0 0 280 280")
const RINGS  = 4;    // concentric grid rings

/**
 * Convert a polar coordinate to Cartesian.
 * angle: 0 = top, clockwise.
 */
function polarToCart(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Build an SVG polygon points string from a list of {x, y} pairs.
 */
function toPoints(pts) {
  return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}

export default function SpiderGraph({ data }) {
  const gradientId = useId();
  const strokeId = useId();

  // ── Guard & Value extraction ──────────────────────────────────────────────
  let parsedData = data || {};
  if (typeof data === "string") {
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = {};
    }
  }

  const values = DIMENSIONS.map((d) => {
    // Attempt multiple key formats (snake_case, camelCase, or short key prefix)
    const snakeVal = parsedData[d.key];
    
    const camelKey = d.key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    const camelVal = parsedData[camelKey];
    
    const shortKey = d.key.split('_')[0];
    const shortVal = parsedData[shortKey];

    const finalVal = snakeVal !== undefined ? snakeVal : (camelVal !== undefined ? camelVal : shortVal);
    const raw = Number(finalVal);
    return isNaN(raw) ? 60 : Math.max(0, Math.min(100, raw)); // default fallback value to 60 if missing
  });

  const n       = DIMENSIONS.length;        // 3 axes
  const maxR    = SIZE * 0.65;              // max polygon radius
  const cx      = CENTER;
  const cy      = CENTER;
  const step    = 360 / n;

  // ── Grid polygons (rings at 25 / 50 / 75 / 100%) ─────────────────────────
  const gridPolygons = Array.from({ length: RINGS }, (_, i) => {
    const r = (maxR * (i + 1)) / RINGS;
    const pts = DIMENSIONS.map((_, j) => polarToCart(cx, cy, r, j * step));
    return toPoints(pts);
  });

  // ── Axis lines ────────────────────────────────────────────────────────────
  const axisLines = DIMENSIONS.map((_, j) => {
    const end = polarToCart(cx, cy, maxR, j * step);
    return { x1: cx, y1: cy, x2: end.x, y2: end.y };
  });

  // ── Data polygon ─────────────────────────────────────────────────────────
  const dataPoints = values.map((v, j) => {
    const r = (v / 100) * maxR;
    return polarToCart(cx, cy, r, j * step);
  });

  // ── Labels ────────────────────────────────────────────────────────────────
  const labelR = maxR + 22;
  const labels = DIMENSIONS.map((d, j) => {
    const pos    = polarToCart(cx, cy, labelR, j * step);
    const anchor =
      Math.abs(pos.x - cx) < 4
        ? "middle"
        : pos.x < cx
        ? "end"
        : "start";
    return { ...pos, label: d.label, color: d.darkColor, anchor };
  });

  // ── Dot positions ─────────────────────────────────────────────────────────
  const dots = dataPoints.map((pt, i) => ({
    ...pt,
    color: DIMENSIONS[i].color,
    value: values[i],
  }));

  return (
    <div className="w-full py-2">
      {/* Title */}
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1.5">
        Compatibility Radar
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
        className="w-full max-w-[210px] h-auto block mx-auto overflow-visible"
        aria-label="Spider radar chart"
      >
        {/* ── Gradient defs (scoped uniquely using useId) ── */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="50%"  stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#8b5cf6" />
            <stop offset="50%"  stopColor="#10b981" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* ── Grid rings ── */}
        {gridPolygons.map((pts, i) => (
          <polygon
            key={`ring-${i}`}
            points={pts}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        ))}

        {/* ── Axis lines ── */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* ── Data polygon fill ── */}
        <polygon
          points={toPoints(dataPoints)}
          fill={`url(#${gradientId})`}
          stroke={`url(#${strokeId})`}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* ── Dots at each axis vertex ── */}
        {dots.map((dot, i) => (
          <circle
            key={`dot-${i}`}
            cx={dot.x}
            cy={dot.y}
            r="4.5"
            fill={dot.color}
            stroke="white"
            strokeWidth="1.5"
            className="shadow-sm"
          />
        ))}

        {/* ── Axis labels ── */}
        {labels.map((lbl, i) => (
          <text
            key={`lbl-${i}`}
            x={lbl.x}
            y={lbl.y}
            textAnchor={lbl.anchor}
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="800"
            fontFamily="Inter, system-ui, sans-serif"
            fill={lbl.color}
          >
            {lbl.label}
          </text>
        ))}
      </svg>

      {/* ── Numeric Score Row ── */}
      <div className="flex justify-around mt-3 pt-2.5 border-t border-slate-100">
        {DIMENSIONS.map((d, i) => (
          <div key={d.key} className="text-center">
            <div className="text-sm font-extrabold" style={{ color: d.color }}>
              {values[i]}%
            </div>
            <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

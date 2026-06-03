/**
 * SpiderGraph.jsx  —  Pure SVG Radar / Spider Chart
 * ──────────────────────────────────────────────────
 * Zero external dependencies. Renders directly from spider_graph_data.
 * Supports: Professional Alignment | Lifestyle Sync | Emotional Readiness
 */
import React from "react";

const DIMENSIONS = [
  { key: "professional_alignment", label: "Professional", color: "#8b5cf6" },
  { key: "lifestyle_sync",         label: "Lifestyle",    color: "#10b981" },
  { key: "emotional_readiness",    label: "Emotional",    color: "#f43f5e" },
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
  // ── Guard ────────────────────────────────────────────────────────────────
  if (!data || typeof data !== "object") return null;

  const values = DIMENSIONS.map((d) => {
    const raw = Number(data[d.key]);
    return isNaN(raw) ? 0 : Math.max(0, Math.min(100, raw));
  });

  // If all values are 0, skip rendering (no meaningful data)
  if (values.every((v) => v === 0)) return null;

  const n       = DIMENSIONS.length;        // 3 axes
  const maxR    = SIZE * 0.68;              // max polygon radius
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
  const labelR = maxR + 24;
  const labels = DIMENSIONS.map((d, j) => {
    const pos    = polarToCart(cx, cy, labelR, j * step);
    const anchor =
      Math.abs(pos.x - cx) < 4
        ? "middle"
        : pos.x < cx
        ? "end"
        : "start";
    return { ...pos, label: d.label, color: d.color, anchor };
  });

  // ── Dot positions ─────────────────────────────────────────────────────────
  const dots = dataPoints.map((pt, i) => ({
    ...pt,
    color: DIMENSIONS[i].color,
    value: values[i],
  }));

  return (
    <div style={{ width: "100%", padding: "8px 0" }}>
      {/* Title */}
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#94a3b8",
          textAlign: "center",
          marginBottom: "4px",
        }}
      >
        Compatibility Radar
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
        style={{ width: "100%", maxWidth: "260px", display: "block", margin: "0 auto" }}
        aria-label="Spider radar chart"
      >
        {/* ── Grid rings ── */}
        {gridPolygons.map((pts, i) => (
          <polygon
            key={`ring-${i}`}
            points={pts}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
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
          fill="url(#radarGradient)"
          fillOpacity="0.35"
          stroke="url(#radarStroke)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* ── Gradient defs ── */}
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="50%"  stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* ── Dots at each axis vertex ── */}
        {dots.map((dot, i) => (
          <circle
            key={`dot-${i}`}
            cx={dot.x}
            cy={dot.y}
            r="4"
            fill={dot.color}
            stroke="white"
            strokeWidth="1.5"
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
            fontSize="9.5"
            fontWeight="700"
            fontFamily="Inter, system-ui, sans-serif"
            fill={lbl.color}
          >
            {lbl.label}
          </text>
        ))}
      </svg>

      {/* ── Numeric Score Row ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "6px",
          paddingTop: "6px",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        {DIMENSIONS.map((d, i) => (
          <div key={d.key} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: d.color,
                lineHeight: 1,
              }}
            >
              {values[i]}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "#94a3b8",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

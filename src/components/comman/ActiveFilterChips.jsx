import React from "react";
import { FILTER_LABELS } from "../../validations/searchSchemas";

/**
 * Removable chips for the filters currently in effect.
 *
 * The chip SET comes from URL state so it reacts the instant the user changes
 * something, while the chip VALUES prefer the server's `filters` echo once it
 * arrives — the echo is authoritative because it reflects trimming, clamping
 * and enum normalisation the client did not apply.
 */
export default function ActiveFilterChips({
  fields,
  urlState = {},
  appliedFilters = {},
  onRemove,
  onClearAll,
}) {
  // `fields` scopes the chips to the filters the active mode actually uses, so
  // a leftover value can never be advertised for a mode that would ignore it.
  const candidates = fields?.length ? fields : Object.keys(FILTER_LABELS);
  const keys = candidates.filter((key) => {
    if (!FILTER_LABELS[key]) return false;
    const value = urlState[key];
    return value !== undefined && value !== null && value !== "";
  });

  if (keys.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Filters
      </span>

      {keys.map((key) => {
        const meta = FILTER_LABELS[key];
        // Prefer what the server actually applied; fall back to the URL while
        // the request is still in flight.
        const raw = appliedFilters[key] ?? urlState[key];
        const display = meta.format ? meta.format(raw) : raw;
        const isReset = meta.resetTo !== undefined;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onRemove(key, meta.resetTo)}
            title={isReset ? `Reset ${meta.label.toLowerCase()}` : `Remove ${meta.label.toLowerCase()} filter`}
            className="group inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full border border-indigo-100 bg-indigo-50/60 text-[11px] font-bold text-[#002060] hover:bg-indigo-100 transition cursor-pointer"
          >
            <span className="text-slate-500 font-semibold">{meta.label}:</span>
            <span>{String(display)}</span>
            <i className="fa-solid fa-xmark text-[10px] text-slate-400 group-hover:text-[#002060]"></i>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onClearAll}
        className="text-[11px] font-bold text-slate-400 hover:text-[#FF2A6D] underline underline-offset-2 transition cursor-pointer ml-1"
      >
        Clear all
      </button>
    </div>
  );
}

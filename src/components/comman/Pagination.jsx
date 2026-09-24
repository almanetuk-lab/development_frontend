import React from "react";
import { getPageRange, DOTS } from "../../utils/pagination";

/**
 * Windowed numbered pagination, shared by the search module and Browse Members.
 *
 * Both pages previously rendered one button per page, so a large result set
 * produced an unbounded row of buttons.
 *
 * @param noun  what is being counted, for the "Showing X - Y of Z" line
 */
export default function Pagination({
  pagination,
  onPageChange,
  disabled = false,
  noun = "results",
}) {
  if (!pagination) return null;

  const { currentPage, totalPages, totalCount, limit } = pagination;
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);
  const firstShown = (currentPage - 1) * limit + 1;
  const lastShown = Math.min(currentPage * limit, totalCount);

  const arrowClass =
    "w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-200">
      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
        Showing {firstShown} - {lastShown} of {totalCount} {noun}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || !pagination.hasPrevPage}
          aria-label="Previous page"
          className={arrowClass}
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>

        {pages.map((page, i) =>
          page === DOTS ? (
            <span
              key={`dots-${i}`}
              className="w-10 h-10 flex items-center justify-center text-slate-400 text-xs font-bold select-none"
            >
              {DOTS}
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={disabled}
              aria-current={page === currentPage ? "page" : undefined}
              className="w-10 h-10 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center disabled:cursor-not-allowed"
              style={
                page === currentPage
                  ? { backgroundColor: "#002060", color: "#ffffff" }
                  : { border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#475569" }
              }
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || !pagination.hasNextPage}
          aria-label="Next page"
          className={arrowClass}
        >
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
}

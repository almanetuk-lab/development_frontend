import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { buildSearchParams, parseSearchParams } from "../utils/urlState.js";

/**
 * Makes the address bar the single source of truth for a page's filters.
 *
 * `defaults` should be a module-level constant, not an inline object literal,
 * or setParams changes identity on every render.
 *
 * @returns {{ state: object, setParams: Function, reset: Function }}
 */
export function useUrlState({ schema, defaults }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // useSearchParams hands back a NEW URLSearchParams instance every render, so
  // the memo has to key on its serialised form rather than object identity.
  const key = searchParams.toString();
  const state = useMemo(
    () => parseSearchParams(new URLSearchParams(key), schema),
    [key, schema]
  );

  /**
   * @param patch              fields to merge; undefined/"" removes a field
   * @param opts.history       "replace" (default) or "push"
   * @param opts.resetPage     send the user back to page 1 (default true)
   */
  const setParams = useCallback(
    (patch, { history = "replace", resetPage = true } = {}) => {
      setSearchParams(
        (prev) => {
          // Read from `prev`, never from a captured `state`. Two updates landing
          // in the same tick — a debounce flush arriving alongside a select
          // change — would otherwise clobber each other via a stale closure.
          const current = parseSearchParams(prev, schema);
          const next = { ...current, ...patch };
          if (resetPage && !("page" in patch)) next.page = 1;
          return buildSearchParams(next, defaults);
        },
        { replace: history === "replace" }
      );
    },
    [setSearchParams, schema, defaults]
  );

  /**
   * Writes an ENTIRE new state, rather than merging into the existing one.
   *
   * setParams cannot express a removal it does not name: `{ ...current, ...patch }`
   * only adds or overrides keys. So "clear all" and "switch tab" — both of which
   * need fields to disappear — have to replace the query string outright.
   */
  const replaceParams = useCallback(
    (nextState, { history = "replace" } = {}) => {
      setSearchParams(() => buildSearchParams(nextState, defaults), {
        replace: history === "replace",
      });
    },
    [setSearchParams, defaults]
  );

  const reset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return { state, setParams, replaceParams, reset };
}

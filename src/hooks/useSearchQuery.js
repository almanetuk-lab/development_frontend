import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { searchProfiles } from "../components/services/searchApi.js";

const compact = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v !== undefined && v !== null && v !== "") out[k] = String(v);
  }
  return out;
};

const PLAN_ERROR_CODES = ["SEARCH_LIMIT_EXCEEDED", "NO_ACTIVE_PLAN", "PLAN_RESTRICTED", "PLAN_EXPIRED"];

/**
 * The one and only fetch path for /search.
 *
 * Nothing else calls the endpoint: a URL change is the sole trigger. That is
 * what removes the old double-fetch, where SearchSection fired from both a
 * debounced effect and the Search button.
 *
 * @param apiParams        from toApiParams(); may be a fresh object each render
 * @param opts.enabled     false blocks the request (plan still loading, Near Me
 *                         without coordinates)
 */
export function useSearchQuery(apiParams, { enabled = true } = {}) {
  const [result, setResult] = useState({ data: [], pagination: null, filters: {} });
  const [loading, setLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  // Key on the serialised params, never on object identity — depending on the
  // object would re-run the effect every render and fetch in a loop.
  const key = new URLSearchParams(compact(apiParams)).toString();

  const paramsRef = useRef(apiParams);
  paramsRef.current = apiParams;
  const hasLoadedRef = useRef(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    let cancelled = false;

    // Skeletons on the first load; dim-and-keep on subsequent ones, so paging
    // does not collapse the grid.
    if (hasLoadedRef.current) setIsRefetching(true);
    else setLoading(true);
    setError(null);
    setErrorCode(null);

    searchProfiles(compact(paramsRef.current), { signal: controller.signal })
      .then((payload) => {
        if (cancelled) return;
        setResult({
          data: payload?.data ?? [],
          pagination: payload?.pagination ?? null,
          filters: payload?.filters ?? {},
        });
        hasLoadedRef.current = true;
      })
      .catch((err) => {
        if (cancelled || axios.isCancel(err) || err?.name === "CanceledError") return;
        const code = err?.response?.data?.code;
        setErrorCode(PLAN_ERROR_CODES.includes(code) ? code : null);
        setError(
          err?.response?.data?.message ||
            "Search failed. Please check your connection and try again."
        );
        setResult({ data: [], pagination: null, filters: {} });
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setIsRefetching(false);
      });

    return () => {
      cancelled = true;
      // Aborting means a slow page-1 response can never land on top of a fast
      // page-2 one.
      controller.abort();
    };
  }, [key, enabled, reloadToken]);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  return { ...result, loading, isRefetching, error, errorCode, refetch };
}

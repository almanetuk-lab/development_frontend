import { useCallback, useEffect, useRef } from "react";

/**
 * Debounces a callback, keeping the timer and the latest function in refs.
 *
 * Replaces the hand-rolled setTimeout debounces scattered through the app. The
 * one in MemberPage stored its timer id in useState, which caused an extra
 * render per keystroke and an off-by-one clear (the cleanup closed over the
 * previous render's id, so stale timers could still fire).
 *
 * @returns {[Function, Function, Function]} [debounced, flush, cancel] — all stable.
 */
export function useDebouncedCallback(fn, delay = 400) {
  const fnRef = useRef(fn);
  const timerRef = useRef(null);
  const argsRef = useRef([]);

  // Keep the latest fn without re-creating the debounced identity.
  useEffect(() => {
    fnRef.current = fn;
  });

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      fnRef.current(...argsRef.current);
    }
  }, []);

  const debounced = useCallback(
    (...args) => {
      argsRef.current = args;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );

  useEffect(() => cancel, [cancel]);

  return [debounced, flush, cancel];
}

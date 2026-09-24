import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "./useDebouncedCallback.js";

/**
 * Binds a text input to a URL parameter without the input feeling broken.
 *
 * The problem: if the input's `value` reads straight from the URL and the URL
 * write is debounced, then for the whole debounce window React keeps re-setting
 * the DOM value back to the older string — characters disappear and the caret
 * jumps to the end.
 *
 * The fix: local state owns the input, the URL owns the query. The `lastWritten`
 * ref records what this field itself put into the URL, so the re-sync effect can
 * tell "the URL changed because of my own debounced write" (ignore it) from "the
 * URL changed for an external reason" — back/forward, a chip removal, a reset —
 * which is the only case that should overwrite what the user is typing.
 *
 * Spread the result onto an input: {...useDebouncedUrlField("q", state.q, setParams)}
 */
export function useDebouncedUrlField(key, urlValue, setParams, delay = 400) {
  const [text, setText] = useState(urlValue ?? "");
  const lastWritten = useRef(urlValue ?? "");

  const [write, flush] = useDebouncedCallback((value) => {
    lastWritten.current = value;
    setParams({ [key]: value === "" ? undefined : value });
  }, delay);

  useEffect(() => {
    const next = urlValue ?? "";
    if (next !== lastWritten.current) {
      lastWritten.current = next;
      setText(next);
    }
  }, [urlValue]);

  return {
    value: text,
    onChange: (e) => {
      setText(e.target.value);
      write(e.target.value);
    },
    // Commit immediately when the user signals they are done.
    onBlur: flush,
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        flush();
      }
    },
  };
}

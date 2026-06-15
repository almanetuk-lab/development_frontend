// Shared content sanitization & decoding helpers for blog content
// - Handles JSON-escaped HTML strings, double-encoded entities
// - Provides getPlainText(rawHtml) for previews and getCleanHtml(rawHtml) for safe full render

/* eslint-disable no-unused-vars */

// Decode HTML entities using a textarea (browser-safe)
export function decodeEntities(text) {
  if (typeof text !== "string") return "";
  const textarea = typeof document !== "undefined" ? document.createElement("textarea") : null;
  if (!textarea) return text;
  textarea.innerHTML = text;
  return textarea.value;
}

// Sometimes the backend returns JSON-stringified HTML (e.g., "\"<p>...\""),
// so unescape typical JSON quoting and surrounding quotes.
export function unescapeJSONString(text) {
  if (typeof text !== "string") return "";
  let t = text;

  // If it looks like a JSON-encoded string or contains unicode escapes, try parsing it.
  try {
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")) || /\\u[\dA-Fa-f]{4}/.test(t)) {
      const parsed = JSON.parse(t);
      if (typeof parsed === 'string') return parsed;
    }
  } catch (e) {
    // ignore parse errors and continue with manual unescape
  }

  // Remove wrapping quotes if present
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.substring(1, t.length - 1);
  }

  // Convert unicode escapes like \u003C to actual chars
  t = t.replace(/\\u([\dA-Fa-f]{4})/g, (_, g) => String.fromCharCode(parseInt(g, 16)));

  // Unescape common sequences
  t = t.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\"/g, '"').replace(/\\'/g, "'");
  return t;
}

// Remove HTML tags and collapse whitespace
export function stripTagsAndCollapse(text) {
  if (!text) return "";
  // Remove tags
  let t = text.replace(/<[^>]*>/g, "");
  // Collapse whitespace
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

// Remove a single outer <p> wrapper if the entire HTML is inside it
function removeOuterPTags(html) {
  if (!html) return html;
  // Match a single <p ...>...</p> that wraps the whole string (case-insensitive, dotall)
  const m = html.match(/^\s*<p(?:\s[^>]*)?>([\s\S]*)<\/p>\s*$/i);
  if (m) return m[1];
  return html;
}

// Public: getCleanHtml - decode, unescape and return HTML safe to inject (caller should still use a sanitizer like DOMPurify if available)
export function getCleanHtml(raw) {
  if (!raw) return "";
  let t = raw;
  // Unescape JSON if it looks like JSON-encoded HTML
  t = unescapeJSONString(t);
  // Decode HTML entities twice to handle double-encoding
  t = decodeEntities(t);
  t = decodeEntities(t);
  // Remove an outer <p> wrapper if present (prevents nested <p> when embedding)
  t = removeOuterPTags(t);
  // Remove any <script> blocks as a basic safety measure (prefer DOMPurify in production)
  t = t.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  return t;
}

// Public: getPlainText - convert raw HTML (possibly encoded) to a short plain-text snippet for previews
export function getPlainText(raw) {
  if (!raw) return "";
  let t = getCleanHtml(raw);
  t = stripTagsAndCollapse(t);
  return t;
}
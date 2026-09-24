import { MODE_FIELDS, SURFACE_LIMITS } from "../validations/searchSchemas.js";

/**
 * Translation between the address bar, component state, and the /search API.
 *
 * The URL is a UI contract (`tab`); the API is a separate contract
 * (`search_mode`). Browse Members shows why they are not the same thing: its
 * mode is `members` but it has no `tab` param at all, because the route implies
 * it. One adapter owns the mapping so nothing else has to know.
 */

/** Fixed key order, so identical state always serialises to an identical URL. */
const KEY_ORDER = [
  "tab", "q", "first_name", "last_name", "gender", "marital_status",
  "profession", "skills", "interests", "city", "state",
  "min_age", "max_age", "radius", "page",
];

const isEmpty = (v) => v === undefined || v === null || v === "";

/**
 * Serialises state to URLSearchParams, dropping anything empty or equal to its
 * default. Canonical output matters: a differing URL means a differing fetch
 * key, and the server would charge a second search for the same criteria.
 */
export const buildSearchParams = (state, defaults = {}) => {
  const params = new URLSearchParams();
  for (const key of KEY_ORDER) {
    const value = state[key];
    if (isEmpty(value)) continue;
    if (defaults[key] !== undefined && String(defaults[key]) === String(value)) continue;
    params.set(key, String(value));
  }
  return params;
};

export const parseSearchParams = (searchParams, schema) =>
  schema.parse(Object.fromEntries(searchParams.entries()));

/**
 * Builds the axios params for GET /search.
 * `surface` decides both the API mode and the page size.
 */
export const toApiParams = (state, { surface }) => {
  const search_mode = surface === "members" ? "members" : state.tab || "basic";
  const fields = MODE_FIELDS[search_mode] || [];

  const params = {
    search_mode,
    page: state.page || 1,
    limit: SURFACE_LIMITS[surface] || SURFACE_LIMITS.search,
  };
  for (const field of fields) {
    if (!isEmpty(state[field])) params[field] = state[field];
  }
  return params;
};

/**
 * Drops filters that do not belong to the target tab, so switching tabs does
 * not smuggle stale values into the next query. Replaces the hand-maintained
 * field-clearing that used to live in SearchSection's handleTabChange.
 */
export const pruneToMode = (state, tab) => {
  const keep = new Set(MODE_FIELDS[tab] || []);
  const next = { tab, page: 1 };
  for (const field of keep) {
    if (!isEmpty(state[field])) next[field] = state[field];
  }
  return next;
};

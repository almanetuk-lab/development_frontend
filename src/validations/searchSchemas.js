import { z } from "zod";

/**
 * URL-parameter contract for the search module and Browse Members.
 *
 * ⚠️ MIRROR: keep the constants below in sync with
 *    development_backend/validations/searchSchemas.js
 * The two repos deploy separately and share no package, so the shape is
 * deliberately duplicated. Exactly one divergence is intentional: this copy
 * uses .catch() so a hand-edited or stale URL degrades to sane defaults, while
 * the backend copy rejects with a 400.
 *
 * NOTE ON ZOD VERSION: this repo runs zod 4, where the zod-3 `required_error`
 * option is silently ignored. Use `{ error: "..." }`. The older schemas in
 * src/validations/authSchemas.js still use `required_error` and their custom
 * messages are dead — do not copy that idiom.
 */

export const SEARCH_MODES = ["basic", "advanced", "nearme", "members"];

/** Which filters belong to which mode. Drives tab-switch pruning and chips. */
export const MODE_FIELDS = {
  basic: ["q", "profession", "city"],
  advanced: [
    "first_name", "last_name", "gender", "marital_status", "profession",
    "skills", "interests", "city", "state", "min_age", "max_age",
  ],
  nearme: ["radius", "city"],
  members: ["q", "gender", "city", "min_age", "max_age"],
};

export const LIMITS = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
  MAX_PAGE: 10000,
  MAX_TEXT: 100,
  MIN_AGE: 18,
  MAX_AGE: 100,
  MIN_RADIUS: 1,
  MAX_RADIUS: 100,
  DEFAULT_RADIUS: 10,
};

export const GENDER_OPTIONS = ["Male", "Female", "Non-Binary", "Other"];
export const MARITAL_STATUS_OPTIONS = [
  "Single", "Married", "Divorced", "Widowed", "Other", "Separated",
];

/** Page size per surface. Not a URL param — it is not user intent. */
export const SURFACE_LIMITS = { search: 6, members: 12 };

/** Values that are omitted from the URL because they are the default. */
export const SEARCH_DEFAULTS = { tab: "basic", page: 1, radius: LIMITS.DEFAULT_RADIUS };
export const MEMBERS_DEFAULTS = { page: 1 };

/* ── field helpers ────────────────────────────────────────────────────────── */

const blankToUndefined = (v) => (v === "" || v === null ? undefined : v);

const optText = (max = LIMITS.MAX_TEXT) =>
  z.preprocess(blankToUndefined, z.string().trim().max(max).optional()).catch(undefined);

const optInt = (min, max) =>
  z.preprocess(
    blankToUndefined,
    z.coerce.number().int().min(min).max(max).optional()
  ).catch(undefined);

const optEnum = (values) =>
  z.preprocess(blankToUndefined, z.enum(values).optional()).catch(undefined);

/* ── schemas ──────────────────────────────────────────────────────────────── */

const pageField = z.preprocess(
  blankToUndefined,
  z.coerce.number().int().min(1).max(LIMITS.MAX_PAGE).default(1)
).catch(1);

/** Parses the address bar for /dashboard/search. */
export const searchUiSchema = z.object({
  tab: z.preprocess(blankToUndefined, z.enum(SEARCH_MODES).default("basic")).catch("basic"),
  page: pageField,
  q: optText(),
  first_name: optText(50),
  last_name: optText(50),
  profession: optText(),
  city: optText(80),
  state: optText(80),
  skills: optText(),
  interests: optText(),
  gender: optEnum(GENDER_OPTIONS),
  marital_status: optEnum(MARITAL_STATUS_OPTIONS),
  min_age: optInt(LIMITS.MIN_AGE, LIMITS.MAX_AGE),
  max_age: optInt(LIMITS.MIN_AGE, LIMITS.MAX_AGE),
  radius: optInt(LIMITS.MIN_RADIUS, LIMITS.MAX_RADIUS),
});

/** Parses the address bar for /dashboard/members. Mode is implied by the route. */
export const membersUiSchema = z.object({
  page: pageField,
  q: optText(),
  city: optText(80),
  gender: optEnum(GENDER_OPTIONS),
  min_age: optInt(LIMITS.MIN_AGE, LIMITS.MAX_AGE),
  max_age: optInt(LIMITS.MIN_AGE, LIMITS.MAX_AGE),
});

/** Labels and formatting for the active-filter chips. */
export const FILTER_LABELS = {
  q: { label: "Keyword" },
  first_name: { label: "First name" },
  last_name: { label: "Last name" },
  profession: { label: "Profession" },
  city: { label: "City" },
  state: { label: "State" },
  skills: { label: "Skills" },
  interests: { label: "Interests" },
  gender: { label: "Gender" },
  marital_status: { label: "Status" },
  min_age: { label: "Min age" },
  max_age: { label: "Max age" },
  // Radius always has a value, so removing it is meaningless — clicking it
  // resets to the default rather than clearing.
  radius: { label: "Within", format: (v) => `${v} km`, resetTo: LIMITS.DEFAULT_RADIUS },
};

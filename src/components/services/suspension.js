// Hand-off for the "account suspended" popup.
//
// A suspension can be detected anywhere (an API 403, the socket, the LinkedIn
// callback). The payload is parked in sessionStorage and the user is sent to
// /login, where Login.jsx shows AccountSuspendedModal.

export const SUSPENDED_CODE = "ACCOUNT_SUSPENDED";
export const RECIPIENT_UNAVAILABLE_CODE = "RECIPIENT_UNAVAILABLE";
// Auto-moderation chat mute: the user can read chats but not send (no logout)
export const MUTED_CODE = "CHAT_MUTED";
export const SUSPENDED_EVENT = "account-suspended";
// Soft-deleted accounts: a live session ends, and logging in / signing up again
// with the same email offers "restore or start fresh"
export const ACCOUNT_DELETED_CODE = "ACCOUNT_DELETED";
export const ACCOUNT_DELETED_RESTORABLE_CODE = "ACCOUNT_DELETED_RESTORABLE";

const STORAGE_KEY = "accountSuspension";

export const isSuspendedError = (err) => err?.response?.data?.code === SUSPENDED_CODE;

export const isSuspendedPayload = (data) => data?.code === SUSPENDED_CODE;

export const isDeletedError = (err) => err?.response?.data?.code === ACCOUNT_DELETED_CODE;

export const isRestorableError = (err) => err?.response?.data?.code === ACCOUNT_DELETED_RESTORABLE_CODE;

export const isRestorablePayload = (data) => data?.code === ACCOUNT_DELETED_RESTORABLE_CODE;

// Hand-off for the "restore or start fresh" popup (LinkedIn callback → /login)
const RECOVERY_KEY = "accountRecovery";

export const storeRecovery = (payload) => {
  try {
    sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable — the popup just won't show after the redirect
  }
};

/** Returns and clears the stored recovery payload, or null. */
export const takeRecovery = () => {
  try {
    const raw = sessionStorage.getItem(RECOVERY_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RECOVERY_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const storeSuspension = (payload) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable — the popup just won't show after the redirect
  }
};

/** Returns and clears the stored suspension payload, or null. */
export const takeSuspension = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const clearLocalUserCache = () => {
  try {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("user_id");
    localStorage.removeItem("currentUser");
  } catch {
    // ignore
  }
};

/**
 * Ends the local session and routes to /login with the popup.
 * The backend has already cleared the auth cookies.
 */
export const handleSuspendedSession = (payload) => {
  clearLocalUserCache();
  if (window.location.pathname === "/login") {
    // Already there: tell the mounted Login page instead of reloading
    window.dispatchEvent(new CustomEvent(SUSPENDED_EVENT, { detail: payload }));
    return;
  }
  storeSuspension(payload);
  window.location.href = "/login";
};

/**
 * Ends the local session of an account that was deleted (from another tab or
 * device). The backend has already cleared the auth cookies.
 */
export const handleDeletedSession = async () => {
  clearLocalUserCache();
  if (window.location.pathname === "/login") return;
  // The auth cookies are httpOnly: only the server can clear them. Without this
  // a still-valid access cookie makes /login bounce straight back to /dashboard.
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
    await fetch(`${baseUrl}/api/logout`, { method: "POST", credentials: "include" });
  } catch {
    // Offline: the backend still refuses this session on its next request
  }
  window.location.href = "/login";
};

// Login endpoints surface the popup themselves (Login.jsx), so they're left alone.
const LOGIN_ENDPOINTS = ["/api/login", "/api/auth/google", "/api/linkedin"];

/**
 * Adds a response interceptor that ends the session on 403 ACCOUNT_SUSPENDED.
 * Install on every axios instance that calls user-authenticated endpoints.
 */
export const installSuspensionHandler = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const url = error?.config?.url || "";
      if (isSuspendedError(error) && !LOGIN_ENDPOINTS.some((endpoint) => url.includes(endpoint))) {
        handleSuspendedSession(error.response.data);
      } else if (isDeletedError(error)) {
        handleDeletedSession();
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

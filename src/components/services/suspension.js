// Hand-off for the "account suspended" popup.
//
// A suspension can be detected anywhere (an API 403, the socket, the LinkedIn
// callback). The payload is parked in sessionStorage and the user is sent to
// /login, where Login.jsx shows AccountSuspendedModal.

export const SUSPENDED_CODE = "ACCOUNT_SUSPENDED";
export const RECIPIENT_UNAVAILABLE_CODE = "RECIPIENT_UNAVAILABLE";
export const SUSPENDED_EVENT = "account-suspended";

const STORAGE_KEY = "accountSuspension";

export const isSuspendedError = (err) => err?.response?.data?.code === SUSPENDED_CODE;

export const isSuspendedPayload = (data) => data?.code === SUSPENDED_CODE;

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
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

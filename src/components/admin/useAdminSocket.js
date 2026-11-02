import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
const TOAST_WINDOW_MS = 5000;

/**
 * Admin-dashboard socket for chat moderation alerts.
 *
 * Joins the server's "admins" room (verified against the adminAccessToken
 * cookie), keeps the pending-alert count for the sidebar badge, and lets the
 * Abuse Alerts page subscribe to live events. Separate from the user socket in
 * UseProfileContext, which is keyed on a user id.
 *
 * @param {(path: string) => void} onToastClick - navigate to the alerts page
 */
export default function useAdminSocket(onToastClick) {
  const [pendingCount, setPendingCount] = useState(0);
  const listenersRef = useRef(new Set());
  const toastBufferRef = useRef({ count: 0, last: null });
  const toastTimerRef = useRef(null);
  const onToastClickRef = useRef(onToastClick);
  onToastClickRef.current = onToastClick;

  const refreshCount = useCallback(async () => {
    try {
      const res = await adminAPI.getFlaggedCount();
      setPendingCount(res.data?.pending ?? 0);
    } catch (err) {
      console.error("Failed to fetch abuse alert count:", err);
    }
  }, []);

  // Subscribe to { type: "abuse_alert" | "abuse_alert_resolved", payload }
  const subscribe = useCallback((fn) => {
    listenersRef.current.add(fn);
    return () => listenersRef.current.delete(fn);
  }, []);

  useEffect(() => {
    refreshCount();

    // One toast per window, so a single spammer can't flood the screen.
    const flushToast = () => {
      const { count, last } = toastBufferRef.current;
      toastBufferRef.current = { count: 0, last: null };
      if (count === 0) return false;
      const text =
        count === 1
          ? `🚩 Abuse alert: message from ${last?.sender_name || `user #${last?.sender_id}`}`
          : `🚩 ${count} new abuse alerts`;
      toast.warn(text, { onClick: () => onToastClickRef.current?.("/admin/abuse-alerts") });
      return true;
    };
    const tick = () => {
      toastTimerRef.current = flushToast() ? setTimeout(tick, TOAST_WINDOW_MS) : null;
    };
    const queueToast = (payload) => {
      toastBufferRef.current.count += 1;
      toastBufferRef.current.last = payload;
      if (!toastTimerRef.current) tick();
    };

    const emit = (event) => listenersRef.current.forEach((fn) => fn(event));

    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
    });

    // "connect" also fires after a reconnect, so the room is re-joined and any
    // count changes missed while offline are picked up.
    socket.on("connect", () => {
      socket.emit("register_admin");
      refreshCount();
    });

    socket.on("abuse_alert", (payload) => {
      setPendingCount((n) => n + 1);
      queueToast(payload);
      // Repeat offenders are never coalesced: an admin should decide on a ban.
      if (payload?.needs_ban_review) {
        toast.error(
          `⛔ Ban review suggested: ${payload.sender_name || `user #${payload.sender_id}`} has ${payload.strike_count} strikes in 30 days and was auto-muted for 7 days`,
          { autoClose: false, onClick: () => onToastClickRef.current?.("/admin/abuse-alerts") },
        );
      }
      emit({ type: "abuse_alert", payload });
    });

    socket.on("abuse_alert_resolved", (payload) => {
      setPendingCount((n) => Math.max(0, n - 1));
      emit({ type: "abuse_alert_resolved", payload });
    });

    socket.on("error", (err) => {
      console.warn("Admin socket error:", err?.message || err);
    });

    return () => {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
      socket.disconnect();
    };
  }, [refreshCount]);

  return { pendingCount, refreshCount, subscribe };
}

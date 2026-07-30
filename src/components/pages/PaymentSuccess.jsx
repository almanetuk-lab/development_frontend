
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [open, setOpen] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Activating your subscription plan...");

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setVerifying(false);
        setStatusMessage("Payment completed.");
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
        const response = await fetch(`${backendUrl}/payments/verify-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const data = await response.json();
        if (data.success) {
          console.log("✅ Subscription plan activated successfully:", data);
          setStatusMessage("Subscription activated! Enjoy your plan.");
        } else {
          console.warn("⚠️ Session verification response:", data);
          setStatusMessage("Payment processed. Plan activation in progress.");
        }
      } catch (err) {
        console.error("❌ Error verifying payment session:", err);
        setStatusMessage("Payment successful!");
      } finally {
        setVerifying(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="flex flex-col items-center gap-4 text-center animate-scaleIn p-6 bg-gray-900/90 rounded-2xl border border-gray-700 max-w-md mx-4">
        {/* green tick */}
        <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
          {verifying ? (
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* message */}
        <h1 className="text-white text-2xl font-bold">Payment Successful!</h1>
        <p className="text-emerald-400 text-sm font-medium">{statusMessage}</p>

        {/* optional session ID */}
        {sessionId && (
          <p className="text-gray-400 text-xs font-mono bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
            Ref ID: {sessionId}
          </p>
        )}

        {/* close button */}
        <button
          disabled={verifying}
          onClick={() => {
            setOpen(false);
            window.location.href = "/#/dashboard";
          }}
          className="mt-4 px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition duration-200 shadow-md disabled:opacity-50"
        >
          Go to Dashboard
        </button>
      </div>

      {/* animation */}
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

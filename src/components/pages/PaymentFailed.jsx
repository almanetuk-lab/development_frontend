import React from "react";

export default function PaymentFailed() {
  const handleRetry = () => {
    window.location.href = "/dashboard/plans";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="flex flex-col items-center gap-4 text-center animate-scaleIn">

        {/* Red Cross Icon */}
        <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 className="text-white text-3xl font-semibold">Payment Failed</h1>

        <p className="text-gray-300 text-sm">
          Your payment could not be completed.
        </p>

        <button
          onClick={handleRetry}
          className="mt-4 px-6 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          Try Again
        </button>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

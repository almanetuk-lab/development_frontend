import React, { useEffect, useState, useRef } from "react";

export default function PaymentHistory({ onClose }) {
  const [history, setHistory] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // Load 2 at a time
  const [loading, setLoading] = useState(true);

  const modalRef = useRef(null); // ⭐ Reference for outside click detection

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        const res = await fetch(`https://backend-q0wc.onrender.com/payments/${user_id}`);
        const data = await res.json();

        setTimeout(() => {
          setHistory(data);
          setLoading(false);
        }, 2000);
      } catch (err) {
        console.error("Error loading history:", err);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchHistory();
  }, []);

  // ⭐ Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onClose) onClose(); // call parent function to close modal
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  // Loader Component
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>

      {/* Text */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          Loading payment history...
        </p>
        <p className="text-sm text-gray-500 mt-1">Please wait for 2 seconds</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 animate-progress"></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div
        ref={modalRef} // ⭐ This tracks the modal box
        className="bg-white w-[400px] p-6 rounded shadow-lg relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-2xl font-bold text-gray-500"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Payment History</h2>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {/* ⭐ Loader added here - no other changes */}
          {loading ? (
            <Loader />
          ) : history.length === 0 ? (
            <p>No payment history yet.</p>
          ) : (
            <>
              {history.slice(0, visibleCount).map((p) => (
                <div
                  key={p.id}
                  className={`p-4 border rounded ${
                    p.status === "success" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p>
                    <strong>Plan:</strong> {p.plan_name}
                  </p>
                  <p>
                    <strong>Amount:</strong> £{p.amount} {p.currency}
                  </p>
                  <p>
                    <strong>Status:</strong> {p.status}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(p.created_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      hour12: true,
                    })}
                  </p>
                </div>
              ))}

              {visibleCount < history.length && (
                <button
                  onClick={loadMore}
                  className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full"
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const style = document.createElement("style");
style.textContent = `
  @keyframes progress {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
  }
  .animate-progress {
    animation: progress 3s ease-in-out forwards;
  }
`;
document.head.appendChild(style);





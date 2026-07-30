import React, { useEffect } from "react";

export default function ImageModal({ isOpen, imageUrl, title = "Profile Image", onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:top-2 sm:right-2 text-white hover:text-amber-400 bg-black/60 hover:bg-black/90 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10 shadow-lg text-xl"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Image */}
        <div className="overflow-hidden rounded-2xl shadow-2xl bg-black/40 border border-white/10 flex items-center justify-center max-h-[80vh] w-full">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[80vh] max-w-full object-contain transition-all duration-300 transform hover:scale-[1.01]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                title || "User"
              )}&background=random&size=400`;
            }}
          />
        </div>

        {/* Title / Caption */}
        {title && (
          <div className="mt-3 text-white font-medium text-center bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm border border-white/10 shadow-md max-w-md truncate">
            {title}
          </div>
        )}
      </div>
    </div>
  );
}

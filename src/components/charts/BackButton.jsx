import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ fallback = "/", label = "← Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // browser back jaisa behavior
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50"
    >
      {label}
    </button>
  );
};

export default BackButton;
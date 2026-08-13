import React from "react";
import { useNavigate } from "react-router-dom";

const BRAND_BLUE = "#002060";
const BRAND_PINK = "#FF2A6D";
const BRAND_FONT = "'Outfit', 'Inter', sans-serif";

export default function Logo({ size = "text-xl", className = "", onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate("/");
  };

  return (
    <a
      href="/"
      onClick={handleClick}
      style={{
        fontFamily: BRAND_FONT,
        textDecoration: "none",
        color: "inherit",
      }}
      className={`font-extrabold tracking-wider inline-flex items-center select-none ${size} ${className}`}
    >
      <span className="brand-logo-blue" style={{ color: BRAND_BLUE, fontSize: "inherit", fontWeight: "inherit" }}>
        Intentional
      </span>
      <span className="brand-logo-pink" style={{ color: BRAND_PINK, fontSize: "inherit", fontWeight: "inherit", marginLeft: "4px" }}>
        Connections
      </span>
    </a>
  );
}

/**
 * Intentional Connection Brand Design System
 * 
 * This file serves as the single source of truth for the platform's color palette,
 * typography, gradients, styling utilities, and UI patterns.
 */

export const theme = {
  // Brand Colors (Derived from alternate.png logo)
  colors: {
    brand: {
      navy: "#002060",      // Primary logo blue
      pink: "#FF2A6D",      // Accent raspberry pink
      pinkHover: "#e0105a", // Pink hover state
    },
    // Supporting UI Colors
    ui: {
      background: "#FAFBFD", // Warm alabaster/off-white base (Figma-grade layout backdrop)
      cardBg: "#FFFFFF",     // Pure white for crisp contrast
      border: "#E2E8F0",     // Standard light border (slate-200)
      textPrimary: "#1E293B",  // Main body text (slate-800)
      textSecondary: "#64748B", // Subtitles & info text (slate-500)
    }
  },

  // Tailwind CSS Equivalence Cheat Sheet
  tailwind: {
    // Brand Colors
    textNavy: "text-[#002060]",
    textPink: "text-[#FF2A6D]",
    bgNavy: "bg-[#002060]",
    bgPink: "bg-[#FF2A6D]",
    borderNavy: "border-[#002060]",
    borderPink: "border-[#FF2A6D]",
    
    // Focus states
    focusPink: "focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D]",

    // Interactive Button Presets
    buttons: {
      primaryPink: "bg-[#FF2A6D] hover:bg-[#e0105a] text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg rounded-xl",
      secondaryNavy: "bg-[#002060] hover:bg-[#001740] text-white font-bold transition-all duration-200 shadow-md hover:shadow-lg rounded-xl",
    },

    // Background Gradient Themes & Shapes
    gradients: {
      // Skewed Auth Flow stripes (Used in Login, Register, ForgotPassword, ResetPassword)
      authStripeBlue: "absolute top-0 left-[-15%] sm:left-[-10%] w-[55%] sm:w-[30%] h-full bg-[#E3F2FD] transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100",
      authStripePink: "absolute top-0 right-[-15%] sm:right-[-10%] w-[55%] sm:w-[30%] h-full bg-pink-100/50 transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100",
      
      // Banner deep blue gradient (About Page Promise/Homepage Choice cards)
      promiseBanner: "bg-gradient-to-br from-[#002060] to-[#1e3a8a]",
      // FAQ Modal Backdrop Blur
      faqBackdrop: "bg-slate-900/40 backdrop-blur-sm",
    },

    // Responsive Card Styling
    cards: {
      standard: "bg-white border border-slate-100/80 shadow-sm rounded-3xl p-6 sm:p-10 md:p-12 transition-all duration-200 hover:shadow-md",
      authCard: "w-full max-w-md bg-white border border-slate-100/80 shadow-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative z-10 animate-fade-in",
    },

    // Screen Layout Bounds
    layouts: {
      authWrapper: "min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 relative overflow-hidden",
      pageWrapper: "min-h-screen bg-slate-50/50 relative overflow-hidden",
      outerPadding: "py-8 sm:py-12 md:py-16 px-4",
    }
  }
};

export default theme;

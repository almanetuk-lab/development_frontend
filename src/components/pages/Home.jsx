// src/pages/Home.jsx (Refined, Premium UI Design)
import React from "react";
import { FiLock, FiShield, FiActivity } from "react-icons/fi";
import Heroo from "../home/Heroo";

export default function Home() {
  const applicationFeatures = [
    {
      title: "Career & Ambition",
      desc: "Your ambition, professional rhythm and long-term direction shape the kind of partnership that actually works.",
      img: (
        <img
          src="/images/5.jpg.jpg"
          alt="Career"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ),
      accentColor: "border-t-4 border-t-[#4D6D9E]",
      badgeColor: "bg-blue-50 text-[#4D6D9E]",
      badgeText: "Ambition Alignment"
    },
    {
      title: "Lifestyle & Balance",
      desc: "Daily habits, energy levels, social preferences and how you choose to live outside of work matter more than people admit.",
      img: (
        <img
          src="/images/8.jpg.jpg"
          alt="Lifestyle"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ),
      accentColor: "border-t-4 border-t-[#FF2A6D]",
      badgeColor: "bg-pink-50 text-[#FF2A6D]",
      badgeText: "Daily Harmony"
    },
    {
      title: "Character & Values",
      desc: "Values, emotional temperament, communication style and how someone shows up consistently over time.",
      img: (
        <img
          src="/images/9.jpg.jpg"
          alt="Character"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ),
      accentColor: "border-t-4 border-t-emerald-400",
      badgeColor: "bg-emerald-50 text-emerald-600",
      badgeText: "Core Integrity"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/30 relative overflow-hidden">
      {/* Dynamic Ambient Background Grid, Glows & Curves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Fine Radial Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-50"></div>
        
        {/* Soft Organic Ambient Orbs */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-br from-pink-200/20 to-purple-300/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] -right-[10%] w-[45%] h-[45%] bg-gradient-to-br from-blue-200/20 to-indigo-300/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-purple-200/20 to-pink-200/10 rounded-full blur-[140px]"></div>

        {/* Top Decorative Wave Curve */}
        <svg className="absolute top-0 right-0 w-full h-[600px] text-slate-200/50" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1440 100C1150 250 850 50 570 250C290 450 150 200 0 350" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M1440 130C1170 280 870 80 590 280C310 480 150 240 0 390" stroke="#FF2A6D" strokeWidth="1.5" opacity="0.1" />
        </svg>

        {/* Middle Decorative Wave Curve */}
        <svg className="absolute top-[35%] left-0 w-full h-[600px] text-slate-200/50" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 200C300 400 600 150 900 350C1200 550 1350 300 1440 400" stroke="currentColor" strokeWidth="2" />
          <path d="M0 230C320 430 620 180 920 380C1220 580 1350 330 1440 430" stroke="#4D6D9E" strokeWidth="1.5" opacity="0.12" />
        </svg>

        {/* Bottom Decorative Wave Curve */}
        <svg className="absolute bottom-[5%] right-0 w-full h-[500px] text-slate-200/50" viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1440 100C1100 300 800 100 500 250C200 400 100 250 0 350" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
          <path d="M1440 120C1120 320 820 120 520 270C220 420 100 270 0 370" stroke="#FF2A6D" strokeWidth="1.5" opacity="0.06" />
        </svg>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 pb-12 md:pb-16 relative z-10">
        {/* 1. Hero Section */}
        <div className="mb-8 md:mb-12">
          <Heroo />
        </div>

        {/* 2. COMPATIBILITY SECTION */}
        <section className="mb-8 md:mb-12 py-10 md:py-16 px-4 sm:px-8 md:px-12 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-50/50 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF2A6D] bg-pink-50 px-3 py-1 rounded-full">
                Core Compatibility
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002060] mt-4 mb-3 md:mb-4 tracking-tight">
                Compatibility is more than attraction
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Real connection depends on how two lives align, not just how two people look or feel in a brief moment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {applicationFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center ${feature.accentColor}`}
                >
                  <div className="mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-4 ring-slate-100/80 shadow-md group-hover:shadow-lg transition-all duration-300">
                      {feature.img}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 ${feature.badgeColor}`}>
                    {feature.badgeText}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 text-center">
                    {feature.title}
                  </h3>

                  <p className="text-slate-500 text-center text-xs sm:text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CHOICE WITHOUT PRESSURE SECTION */}
        <section className="mb-8 md:mb-12 py-10 md:py-16 px-4 sm:px-8 md:px-12 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-50/30 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-5xl mx-auto">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-10 md:mb-16">
              <div className="order-2 md:order-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#4D6D9E] bg-blue-50 px-3 py-1 rounded-full">
                  Zero Pressure
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002060] mt-4 mb-3 md:mb-4 tracking-tight">
                  Choice works better without pressure
                </h2>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                  Explore the entire community. No swipes, no artificial rankings, and no fake urgency. You explore, reflect, and connect only when it feels natural and right to you.
                </p>
              </div>

              <div className="order-1 md:order-2">
                <div className="rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-100 hover:shadow-xl transition-all duration-500">
                  <img
                    src="/images/five.jpg"
                    alt="People exploring connections without pressure"
                    className="w-full h-[220px] sm:h-[300px] md:h-[320px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-100 hover:shadow-xl transition-all duration-500">
                  <img
                    src="/images/09.jpg"
                    alt="Happy couple enjoying meaningful connection"
                    className="w-full h-[220px] sm:h-[300px] md:h-[320px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              <div>
                <div className="bg-gradient-to-br from-[#002060] to-[#2c3e50] p-6 sm:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-4 tracking-tight">
                    When connection aligns, life feels lighter
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm md:text-base">
                    When a connection resonates with who you are and how you live, conversations flow naturally and relationships fit into your life instead of disrupting it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. THE COGNITIVE SAFETY SHIELD SECTION */}
        <section className="py-10 md:py-16 px-4 sm:px-8 md:px-12 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -z-10"></div>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full inline-block">
                Advanced features designed to enhance your experience and ensure safety
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002060] mt-4 mb-3 md:mb-4 tracking-tight">
                The Cognitive Safety Shield
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Designed to protect your mental peace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Privacy Shield Card */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-[#4D6D9E] rounded-xl flex items-center justify-center mr-4 border border-blue-100 shadow-inner">
                    <FiLock className="text-lg sm:text-xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                    THE PRIVACY SHIELD
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-[#4D6D9E] mb-2 uppercase tracking-wide">
                  Control Your Visibility
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Control your profile visibility with precision, tailored exclusively to the circles and interactions you choose to trust.
                </p>
              </div>

              {/* Identity Shield Card */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mr-4 border border-emerald-100 shadow-inner">
                    <FiShield className="text-lg sm:text-xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                    THE IDENTITY SHIELD
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-emerald-600 mb-2 uppercase tracking-wide">
                  Clarity & Accountability
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Verified user profiles paired with secure two-factor authentication to ensure every connection you make is genuine.
                </p>
              </div>

              {/* Behavioral Shield Card */}
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 hover:border-purple-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mr-4 border border-purple-100 shadow-inner">
                    <FiActivity className="text-lg sm:text-xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                    BEHAVIORAL INSIGHTS
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-purple-600 mb-2 uppercase tracking-wide">
                  Pattern Sense™ System
                </p>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Quietly observes subtle patterns of pace, consistency, and reciprocity in interactions, offering gentle awareness while keeping decisions human.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

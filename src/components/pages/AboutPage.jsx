// src/components/pages/AboutPage.jsx (Refined, Premium UI Design)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiCompass, FiSliders } from "react-icons/fi";
import ComingSoonModal from "../comman/ComingSoonModal";

export default function About() {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF2A6D] bg-pink-50 px-3.5 py-1.5 rounded-full mb-4 inline-block">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002060] mb-4 tracking-tight">
            About Intentional Connection
          </h1>
          <div className="h-1 w-20 bg-[#FF2A6D] mx-auto mb-6 rounded-full"></div>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Creating meaningful connections in a demanding world.
          </p>
        </section>

        {/* The Problem Section */}
        <section className="relative overflow-hidden mb-10 md:mb-16 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/40 rounded-full blur-3xl z-0"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full mb-4 inline-block">
                The Challenge
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002060] mb-5 tracking-tight">
                The Problem We're Solving
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mb-4 leading-relaxed">
                A demanding professional life requires constant focus and high energy, 
                often leading to mental and emotional fatigue that leaves little space 
                for genuine, meaningful connection.
              </p>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Typical dating platforms worsen this strain through aggressive alerts, 
                artificial deadlines, and systems that promote endless swiping. This 
                reduces the search for a partner to a rushed, superficial activity 
                focused only on speed, not on deep understanding or true compatibility.
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-100/50 hover:shadow-xl transition-all duration-500">
              <img 
                src="/images/five.jpg"
                alt="Professional life demands"
                className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="relative overflow-hidden bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-100 shadow-sm mb-10 md:mb-16">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl z-0"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <span className="text-xs font-bold text-[#4D6D9E] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                Our Vision
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002060] mt-4 mb-4 tracking-tight">
                Our Solution
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Image */}
              <div className="order-2 md:order-1">
                <div className="rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-100/50 hover:shadow-xl transition-all duration-500">
                  <img 
                    src="/images/eight.jpg" 
                    alt="Calm and deliberate connection"
                    className="w-full h-[250px] sm:h-[350px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Right Text */}
              <div className="order-1 md:order-2">
                <p className="text-sm sm:text-base text-slate-500 mb-4 leading-relaxed">
                  This platform is intentionally designed to be the opposite of that 
                  overload. We offer a profoundly calmer, more deliberate environment 
                  where successful adults can explore connection without the stress 
                  of constant performance.
                </p>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                  We focus on a contextual type of compatibility that respects your 
                  real life, honors your personal boundaries, and moves at a pace 
                  that suits you. This allows you to engage thoughtfully and step 
                  away when professional demands require it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise Section */}
        <section className="mb-10 md:mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a2a3a] to-[#2c3e50] p-6 sm:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 tracking-tight text-center">
                Our Promise
              </h2>
              
              <div className="space-y-4 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed text-center">
                <p>
                  Here, connection is never rushed, filtered, or forced by an outside system. 
                  It unfolds naturally, guided entirely by your choice, awareness and mutual interest.
                </p>
                <p>
                  We give you complete control (sovereignty) to focus on your successful life 
                  and return to your search with absolute clarity. This guarantees your journey 
                  toward an enduring partnership is fully integrated and intentional, without 
                  the usual fatigue of online dating.
                </p>
              </div>
              
              <div className="mt-8 rounded-2xl overflow-hidden ring-4 ring-white/10 shadow-md">
                <img 
                  src="/images/three.jpg"
                  alt="Meaningful connections"
                  className="w-full h-[220px] sm:h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-6 md:py-10 mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002060] mb-10 text-center tracking-tight">
            Our Core Values
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Value 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 hover:border-pink-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-50 text-[#FF2A6D] rounded-xl flex items-center justify-center mb-5 border border-pink-100 shadow-inner">
                <FiHeart className="text-xl sm:text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 tracking-tight">
                Meaningful Connections
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                We design interactions around deep, real-world compatibility rather than superficial swiping or initial physical attraction.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 text-[#4D6D9E] rounded-xl flex items-center justify-center mb-5 border border-blue-100 shadow-inner">
                <FiCompass className="text-xl sm:text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 tracking-tight">
                Mental Peace
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Our features are carefully constructed to reduce dating fatigue and screen anxiety, promoting a calm, deliberate journey.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 hover:border-purple-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-5 border border-purple-100 shadow-inner">
                <FiSliders className="text-xl sm:text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 tracking-tight">
                User Sovereignty
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                We believe you deserve complete command over your personal profile visibility, connection speed, and choice details.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden text-center py-8 md:py-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-50/20 rounded-full blur-3xl z-0"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002060] mb-4 tracking-tight">
              Ready to Experience Meaningful Connection?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
              Join our community of intentional individuals seeking genuine, compatible relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <button
                onClick={() => setIsComingSoonOpen(true)}
                className="px-8 py-3.5 bg-[#FF2A6D] hover:bg-[#e0105a] text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-200 text-sm shadow-sm"
              >
                Get Started
              </button>
              <Link
                onClick={() => window.scrollTo(0, 0)}
                to="/"
                className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-200 text-sm shadow-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>
      <ComingSoonModal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
    </div>
  );
}
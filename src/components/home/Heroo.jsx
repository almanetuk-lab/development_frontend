// src/components/home/Heroo.jsx (Refined Buttons, Blueish Gradient Background)
import React, { useEffect, useState } from "react";
import AOS from "aos";
import { FaLinkedin, FaApple, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Heroo() {
  const bannerImage = "/images/4.jpg.jpg";
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true);
    try {
      console.log('🔗 Getting LinkedIn auth URL...');
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3435';
      const apiUrl = `${backendUrl}/api/linkedin/auth-url`;
      console.log('📞 Calling backend for LinkedIn URL:', apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Backend LinkedIn response:', data);

      if (data.url) {
        console.log('🚀 Redirecting to LinkedIn login...');
        window.location.href = data.url;
      } else {
        throw new Error('No LinkedIn URL received from backend');
      }
    } catch (error) {
      console.error('❌ LinkedIn login error:', error);
      alert(`Login failed: ${error.message}. Please try again.`);
    } finally {
      setLinkedinLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-[800px] md:min-h-[750px] lg:min-h-[750px] rounded-3xl overflow-hidden shadow-lg bg-gradient-to-r from-[#F8F9FA] to-[#E3F2FD]">
      <div className="relative h-full flex flex-col lg:flex-row">
        {/* MOBILE: Banner Image (Visible only on mobile/tablet) */}
        <div className="lg:hidden h-[350px] md:h-[400px] w-full relative overflow-hidden">
          <img
            src={bannerImage}
            alt="Connection Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* LEFT SIDE: Content */}
        <div className="lg:w-1/2 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
          <div className="max-w-xl w-full mx-auto lg:mx-0">
            <h1
              data-aos="fade-up"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#002060] leading-[1.15] mb-6 tracking-tight"
            >
              Where connection fits your life
            </h1>

            {/* Subtitle */}
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-base sm:text-lg text-slate-500 mb-4 leading-relaxed font-medium"
            >
              A platform designed around real-life compatibility, not endless swiping or surface-level attraction.
            </p>

            {/* Description */}
            <p
              data-aos="fade-up"
              data-aos-delay="150"
              className="text-sm text-slate-400 mb-8 leading-relaxed"
            >
              Built for adults who value ambition, personal balance and meaningful connection and want the freedom to explore openly and decide for themselves.
            </p>

            {/* Interactive Section */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="space-y-6"
            >
              {/* Social Login Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLinkedInLogin}
                  disabled={linkedinLoading}
                  className="flex items-center justify-center gap-2.5 px-6 py-3 bg-[#0077B5] text-white rounded-xl font-bold hover:bg-[#00669c] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-200 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {linkedinLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <FaLinkedin size={16} />
                      <span>LinkedIn</span>
                    </>
                  )}
                </button>

                <Link
                  to="/Coming-soon"
                  className="flex items-center justify-center gap-2.5 px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-200 text-sm shadow-sm"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <FaApple size={16} />
                  <span>Apple</span>
                </Link>

                <Link
                  to="/coming-soon"
                  className="flex items-center justify-center gap-2.5 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-200 text-sm shadow-sm"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <FaGoogle size={16} className="text-red-500" />
                  <span>Google</span>
                </Link>
              </div>

              {/* OR Divider */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-slate-200/60"></div>
                <span className="mx-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-slate-200/60"></div>
              </div>

              {/* Email Waitlist */}
              <div className="max-w-md">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] transition-all duration-200 text-sm shadow-inner"
                  />

                  <Link
                    onClick={() => window.scrollTo(0, 0)}
                    to="/register"
                    className="px-8 py-3 bg-[#FF2A6D] hover:bg-[#e0105a] text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md transition-all duration-200 whitespace-nowrap text-sm text-center inline-block shadow-md"
                  >
                    Join Waitlist
                  </Link>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  We'll notify you when we launch. No spam, ever.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP: Banner Image Right Side */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img
            src={bannerImage}
            alt="Connection Banner"
            className="w-full h-full object-cover object-center transition-transform duration-[10000ms] hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

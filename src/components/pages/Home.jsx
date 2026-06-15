// src/pages/Home.jsx (Updated with darker blue and smaller images)
import React from "react";
import Heroo from "../home/Heroo";
import Footer from "../home/Footer";

export default function Home() {
  const applicationFeatures = [
    {
      title: "Career & Ambition",
      desc: "Your ambition, professional rhythm and long-term direction shape the kind of partnership that actually works.",
      img: (
        <img
          src="/images/5.jpg.jpg"
          alt="Career"
          className="w-full h-full object-cover"
        />
      ),
      color: "from-blue-100 to-blue-200",
      borderColor: "border-blue-300",
    },
    {
      title: "Lifestyle & Balance",
      desc: "Daily habits, energy levels, social preferences and how you choose to live outside of work matter more than people admit.",
      img: (
        <img
          src="/images/8.jpg.jpg"
          alt="Lifestyle"
          className="w-full h-full object-cover"
        />
      ),
      color: "from-pink-100 to-pink-200",
      borderColor: "border-pink-300",
    },
    {
      title: "Character & Values",
      desc: "Values, emotional temperament, communication style and how someone shows up consistently over time.",
      img: (
        <img
          src="/images/9.jpg.jpg"
          alt="Character"
          className="w-full h-full object-cover"
        />
      ),
      color: "from-green-100 to-green-200",
      borderColor: "border-green-300",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero Section */}
        <div className="mb-6">
          <Heroo />
        </div>

        {/* 2. APPLICATION FEATURES - Darker Blue Background */}
        <section className="py-8 bg-gradient-to-b from-blue-100/40 to-blue-50/30 rounded-3xl mb-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-3">
                Compatibility is more than attraction
              </h2>
              <p className="text-lg text-[#546E7A] max-w-3xl mx-auto">
                Real connection depends on how two lives align, not just how two
                people look or feel in a moment.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 px-4">
              {applicationFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.color} p-5 rounded-xl border ${feature.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/90 shadow-md overflow-hidden">
                      {feature.img}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#2C3E50] mb-2 text-center">
                    {feature.title}
                  </h3>

                  <p className="text-[#546E7A] text-center text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CHOICE WITHOUT PRESSURE SECTION - Darker Blue Gradient */}
        <section className="py-8 bg-gradient-to-b from-blue-100/50 to-blue-50/40 rounded-3xl mb-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
              <div>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/images/five.jpg"
                    alt="People exploring connections without pressure"
                    className="w-full h-[320px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-3">
                  Choice works better without pressure
                </h2>
                <p className="text-lg text-[#546E7A] leading-relaxed">
                  Explore the entire community. No swipes, no rankings, no
                  artificial urgency. You explore and connect when it feels
                  right.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="bg-gradient-to-r from-[#4D6D9E] to-[#3A5A8F] p-5 rounded-xl text-white shadow-lg">
                  <h3 className="text-xl md:text-2xl font-bold mb-3">
                    When connection aligns, life feels lighter
                  </h3>
                  <p className="text-base leading-relaxed">
                    When a connection resonates with who you are and how you
                    live, conversations flow naturally and relationships fit
                    into your life instead of disrupting it.
                  </p>
                </div>
              </div>

              <div>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/images/09.jpg"
                    alt="Happy couple enjoying meaningful connection"
                    className="w-full h-[320px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FEATURES TITLE SECTION - Darker Cyan Background */}
        <section className="py-6 bg-gradient-to-r from-blue-100/50 to-blue-200/40 rounded-3xl mb-6">
          <div className="px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[#2C3E50] mb-3">
              Features
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#4D6D9E] to-[#FF66CC] mx-auto mb-4"></div>
            <p className="text-lg text-[#546E7A] max-w-3xl mx-auto">
              Advanced features designed to enhance your experience and ensure
              safety
            </p>
          </div>
        </section>

        {/* 5. THE COGNITIVE SAFETY SHIELD SECTION - Darker Blue Background */}
        <section className="py-8 bg-gradient-to-b from-blue-200/30 via-blue-100/20 to-blue-50/30 rounded-3xl mb-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-3">
                The Cognitive Safety Shield
              </h2>
              <p className="text-lg text-[#546E7A] max-w-3xl mx-auto">
                Designed to protect your mental peace.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 px-4">
              {/* Privacy Shield Card */}
              <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-blue-300 shadow-lg hover:shadow-xl transition-all hover:border-blue-400">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2C3E50]">
                    THE PRIVACY SHIELD
                  </h3>
                </div>
                <p className="text-[#546E7A] mb-2 font-medium">
                  Where privacy matters
                </p>
                <p className="text-sm text-[#546E7A]">
                  Control your profile visibility with precision, tailored to
                  the circles you trust.
                </p>
              </div>

              {/* Identity Shield Card */}
              <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-green-300 shadow-lg hover:shadow-xl transition-all hover:border-green-400">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">🆔</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2C3E50]">
                    THE IDENTITY SHIELD
                  </h3>
                </div>
                <p className="text-[#546E7A] mb-2 font-medium">
                  Built on clarity and accountability
                </p>
                <p className="text-sm text-[#546E7A]">
                  Profile verification with Two-factor Authentication.
                </p>
              </div>

              {/* Behavioral Shield Card */}
              <div className="bg-white/90 backdrop-blur-sm p-5 rounded-xl border border-purple-300 shadow-lg hover:shadow-xl transition-all hover:border-purple-400">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2C3E50]">
                    THE BEHAVIOURAL SHIELD
                  </h3>
                </div>
                <p className="text-[#546E7A] mb-2 font-medium">
                  Intelligent Behavioural Insights
                </p>
                <p className="text-sm text-[#546E7A]">
                  <span className="font-bold">Pattern Sense™</span> observes
                  subtle patterns of pace, consistency, and reciprocity in
                  interactions offering quiet awareness while keeping every
                  decision human.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* <div className="mt-4">
        <Footer />
      </div> */}
    </div>
  );
}
























































































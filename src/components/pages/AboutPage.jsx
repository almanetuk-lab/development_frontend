// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function About() {

const heroImage = "/images/ok.jpg";
const img1 ="./images/1.jpg";

  return (
    <div className="min-h-screen bg-white">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section for About Us */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-6">
            About Us
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#4D6D9E] to-[#FF66CC] mx-auto mb-8"></div>
          <p className="text-xl text-[#546E7A] max-w-3xl mx-auto">
            Creating meaningful connections in a demanding world
          </p>
        </section>

        {/* Main Content - PDF Content ke exactly according */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Text Content */}
          <div>
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
              The Problem We're Solving
            </h2>
            <p className="text-lg text-[#546E7A] mb-6 leading-relaxed">
              A demanding professional life requires constant focus and high energy, 
              often leading to mental and emotional fatigue that leaves little space 
              for genuine, meaningful connection.
            </p>
            <p className="text-lg text-[#546E7A] mb-6 leading-relaxed">
              Typical dating platforms worsen this strain through aggressive alerts, 
              artificial deadlines and systems that promote endless swiping. This 
              reduces the search for a partner to a rushed, superficial activity 
              focused only on speed, not on deep understanding or true compatibility.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="/images/five.jpg"
            // src={img1}
              alt="Professional life demands"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Our Solution Section */}
        <div className="bg-gradient-to-r from-[#F8F9FA] to-[#E3F2FD] rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-8 text-center">
            Our Solution
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Image */}
            <div className="order-2 md:order-1">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/images/eight.jpg" 
                  alt="Calm and deliberate connection"
                  className="w-full h-[350px] object-cover"
                />
              </div>
            </div>

            {/* Right Side - Text */}
            <div className="order-1 md:order-2">
              <p className="text-lg text-[#546E7A] mb-6 leading-relaxed">
                This platform is intentionally designed to be the opposite of that 
                overload. We offer a profoundly calmer, more deliberate environment 
                where successful adults can explore connection without the stress 
                of constant performance.
              </p>
              <p className="text-lg text-[#546E7A] mb-6 leading-relaxed">
                We focus on a contextual type of compatibility that respects your 
                real life, honors your personal boundaries and moves at a pace 
                that suits you. This allows you to engage thoughtfully and step 
                away when professional demands require it.
              </p>
            </div>
          </div>
        </div>

        {/* Our Promise Section */}
        <section className="text-center py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-8">
              Our Promise
            </h2>
            
            <div className="bg-gradient-to-r from-[#4D6D9E] to-[#3A5A8F] text-white p-8 rounded-2xl shadow-xl">
              <p className="text-xl leading-relaxed mb-6">
                Here, connection is never rushed, filtered, or forced by an outside system. 
                It unfolds naturally, guided entirely by your choice, awareness and mutual interest.
              </p>
              <p className="text-xl leading-relaxed mb-6">
                We give you the complete control (sovereignty) to focus on your successful life 
                and return to your search with absolute clarity. This guarantees your journey 
                toward an enduring partnership is fully integrated and intentional, without 
                the usual fatigue of online dating.
              </p>
              
              {/* Image from PDF */}
              <div className="mt-8 rounded-xl overflow-hidden">
                <img 
                  src="/images/three.jpg"
                  alt="Meaningful connections"
                  className="w-full h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-12 text-center">
            Our Core Values
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">
                Meaningful Connections
              </h3>
              <p className="text-[#546E7A]">
                Focus on deep compatibility rather than superficial attraction
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">
                Mental Peace
              </h3>
              <p className="text-[#546E7A]">
                Designed to reduce stress, not add to it
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">
                User Sovereignty
              </h3>
              <p className="text-[#546E7A]">
                Complete control over your journey and pace
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
            Ready to Experience Meaningful Connection?
          </h2>
          <p className="text-xl text-[#546E7A] mb-8 max-w-2xl mx-auto">
            Join our community of intentional individuals seeking genuine relationships
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#4D6D9E] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3A5A8F] transition-all duration-200 inline-block"
            >
              Get Started
            </Link>
            <Link
              to="/"
              className="bg-white text-[#4D6D9E] px-8 py-3 rounded-lg font-medium border border-[#4D6D9E] hover:bg-gray-50 transition-all duration-200 inline-block"
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>
      
    </div>
  );
}
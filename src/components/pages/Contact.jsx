// src/components/pages/Contact.jsx (Refined, Premium UI Design with Popups)
import React, { useState } from 'react';
import axios from 'axios';
import { FiPhone, FiMail, FiMapPin, FiInfo, FiShield, FiCreditCard, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // State for active FAQ popup
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Name Validation
    const name = (formData.name || "").trim();
    if (!name) {
      const msg = "Name is required.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (name.length < 2 || name.length > 100) {
      const msg = "Name must be between 2 and 100 characters.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!/^[a-zA-Z\s\-]+$/.test(name)) {
      const msg = "Name can only contain letters, spaces, and hyphens.";
      setError(msg);
      toast.error(msg);
      return;
    }

    // 2. Email Validation
    const email = (formData.email || "").trim();
    if (!email) {
      const msg = "Email address is required.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (email.length > 100) {
      const msg = "Email address cannot exceed 100 characters.";
      setError(msg);
      toast.error(msg);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      toast.error(msg);
      return;
    }

    // 3. Subject Validation
    const subject = (formData.subject || "").trim();
    if (!subject) {
      const msg = "Subject is required.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (subject.length < 3 || subject.length > 200) {
      const msg = "Subject must be between 3 and 200 characters.";
      setError(msg);
      toast.error(msg);
      return;
    }

    // 4. Message Validation
    const message = (formData.message || "").trim();
    if (!message) {
      const msg = "Message is required.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (message.length < 10 || message.length > 5000) {
      const msg = "Message must be between 10 and 5000 characters.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE}/api/contact`, { name, email, subject, message });
      setIsSubmitted(true);
      toast.success("Message sent successfully! ✅");

      // Reset form after 4 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    } catch (err) {
      console.error("Contact form send error:", err);
      const msg = err?.response?.data?.error || "Failed to send message. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ Modal Data
  const faqContent = {
    profile: {
      title: "How to Create a Perfect Profile",
      icon: <FiInfo className="text-xl sm:text-2xl" />,
      badgeClass: "bg-pink-50 text-[#FF1493] border-pink-100",
      tips: [
        { label: "Be Genuine & Authentic", text: "Fill in your answers truthfully. Real compatibility relies on alignment, not simulation." },
        { label: "High-Quality Pictures", desc: "Select 3-5 clear, friendly photos showing you in your natural, everyday environments." },
        { label: "Fill Out the Prompts", desc: "Completing daily rhythm details directly helps our matching engine calculate higher alignment scores." }
      ]
    },
    safety: {
      title: "Privacy & Safety Guidelines",
      icon: <FiShield className="text-xl sm:text-2xl" />,
      badgeClass: "bg-blue-50 text-[#4D6D9E] border-blue-100",
      tips: [
        { label: "Keep Contact Details Private", desc: "Do not disclose phone numbers, home addresses, or business coordinates early on." },
        { label: "Public First Dates", desc: "Always organize initial meetings in highly populated, public locations. Arrange your own transit." },
        { label: "Report Flagged Accounts", desc: "If someone exhibits aggressive, toxic, or promotional behavior, immediately flag them using the report button." }
      ]
    },
    billing: {
      title: "Billing & Subscription Help",
      icon: <FiCreditCard className="text-xl sm:text-2xl" />,
      badgeClass: "bg-purple-50 text-purple-600 border-purple-100",
      tips: [
        { label: "Flexible Plan Upgrades", desc: "Modify, upgrade, or pause your membership details in Profile Settings > Account & Billing." },
        { label: "Highly Secure Gateway", desc: "Transactions are processed using end-to-end industry standard bank-level encryption protocols." },
        { label: "Direct Billing Support", desc: "Need assistance with invoices, payouts, or subscription refunds? Email us directly at billing@neratech.com." }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF2A6D] bg-pink-50 px-3.5 py-1.5 rounded-full mb-4 inline-block">
            Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002060] mb-4 tracking-tight">
            Get In Touch
          </h1>
          <div className="h-1 w-20 bg-[#FF2A6D] mx-auto mb-6 rounded-full"></div>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and our dedicated support team will respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Form Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50/20 rounded-full blur-3xl z-0"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Send us a Message</h2>

              {isSubmitted ? (
                <div className="text-center py-12 animate-bounce-in">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-500">We appreciate you reaching out. We will get back to you soon.</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl mb-5 text-xs text-center font-medium animate-pulse">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF2A6D] focus:ring-4 focus:ring-pink-50/50 transition-all duration-200 text-sm placeholder:text-slate-400"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF2A6D] focus:ring-4 focus:ring-pink-50/50 transition-all duration-200 text-sm placeholder:text-slate-400"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF2A6D] focus:ring-4 focus:ring-pink-50/50 transition-all duration-200 text-sm placeholder:text-slate-400"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF2A6D] focus:ring-4 focus:ring-pink-50/50 transition-all duration-200 text-sm placeholder:text-slate-400 resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 px-6 bg-[#FF2A6D] hover:bg-[#e0105a] text-white font-bold rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm transition-all duration-200 text-sm flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending Message...
                        </div>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Contact Info & Help Panel */}
          <div className="space-y-6 md:space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-pink-50 text-[#FF2A6D] border border-pink-100 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                  <FiPhone size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 tracking-tight">Call Us</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">Mon-Fri from 9am to 6pm</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-50 text-[#4D6D9E] border border-blue-100 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                  <FiMail size={20} />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 tracking-tight">Email Us</h3>
                <p className="text-slate-600 text-sm">info@neratech.com</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">We'll reply within 24 hours</p>
              </div>
            </div>

            {/* Visit Office Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1 tracking-tight">Visit Our Office</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    123 Dating Street, Suite 100<br />
                    London, UK
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Help Accordion-like Card */}
            <div className="bg-gradient-to-br from-[#002060] to-[#1e3a8a] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>

              <h3 className="font-bold text-lg mb-5 tracking-tight font-sans">Quick Help & FAQs</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveFaq('profile')}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="text-slate-200 bg-white/15 p-1.5 rounded-lg">
                    <FiInfo size={16} />
                  </div>
                  <span className="text-sm font-medium">How to create a perfect profile?</span>
                </button>
                <button
                  onClick={() => setActiveFaq('safety')}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="text-slate-200 bg-white/15 p-1.5 rounded-lg">
                    <FiShield size={16} />
                  </div>
                  <span className="text-sm font-medium">Privacy and safety guidelines</span>
                </button>
                <button
                  onClick={() => setActiveFaq('billing')}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="text-slate-200 bg-white/15 p-1.5 rounded-lg">
                    <FiCreditCard size={16} />
                  </div>
                  <span className="text-sm font-medium">Billing and subscription help</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Popup Modal */}
      {activeFaq && faqContent[activeFaq] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setActiveFaq(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveFaq(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              aria-label="Close modal"
            >
              <FiX size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${faqContent[activeFaq].badgeClass}`}>
                {faqContent[activeFaq].icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {faqContent[activeFaq].title}
              </h3>
            </div>

            {/* Modal Content - List of Tips */}
            <div className="space-y-4">
              {faqContent[activeFaq].tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 shadow-sm">
                    <FiCheck size={12} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-0.5">
                      {tip.label}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {tip.desc || tip.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Action Footer */}
            <div className="mt-8">
              <button
                onClick={() => setActiveFaq(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all duration-200"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;

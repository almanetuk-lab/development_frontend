import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaCookie, 
  FaUserCheck, 
  FaGlobeAmericas,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaDatabase,
  FaUserShield,
  FaBuilding,
  FaUserTie,
  FaChartLine,
  FaRobot,
  FaUsers,
  FaExclamationTriangle,
  FaKey,
  FaTrash,
  FaGoogle,
  FaLinkedin,
  FaFileContract,
  FaCheckCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';

const PrivacyPolicy = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Hero */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-inner">
            <FaShieldAlt className="text-3xl" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl font-semibold text-pink-600 mb-2">
            Intentional Connections
          </p>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-6">
            A brand of <span className="font-semibold text-slate-800">Neratech Ltd</span> (United Kingdom). This Privacy Policy explains transparently how we collect, use, store, protect, and delete your personal data in accordance with UK GDPR, the Data Protection Act 2018, the UK Online Safety Act, and third-party authentication policies (Google API Services and LinkedIn OpenID OAuth).
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs md:text-sm">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full font-medium border border-blue-200">
              <FaShieldAlt className="text-xs" /> UK GDPR & DPA 2018 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full font-medium border border-emerald-200">
              <FaLock className="text-xs" /> 256-Bit SSL Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3.5 py-1.5 rounded-full font-medium border border-red-200">
              <FaGoogle className="text-xs" /> Google OAuth Verified
            </span>
            <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3.5 py-1.5 rounded-full font-medium border border-sky-200">
              <FaLinkedin className="text-xs" /> LinkedIn OpenID Verified
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full font-medium border border-slate-200">
              Last Updated: March 2026
            </span>
          </div>
        </div>

        {/* Key Organization & Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                  <FaBuilding />
                </div>
                <h3 className="font-bold text-slate-900">Data Controller</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong className="text-slate-800">Neratech Ltd</strong><br />
                Registered in England and Wales<br />
                225 B, Woodgrange Drive, Southend-On-Sea, Essex, SS1 2SG, UK
              </p>
            </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-600">
                  <FaEnvelope />
                </div>
                <h3 className="font-bold text-slate-900">Privacy & Support</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct Contact:<br />
                <a href="mailto:support@intentionalconnections.app" className="text-blue-600 hover:underline font-medium block">
                  support@intentionalconnections.app
                </a>
                <a href="mailto:neratechuk@gmail.com" className="text-blue-600 hover:underline font-medium block">
                  neratechuk@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600">
                  <FaUserShield />
                </div>
                <h3 className="font-bold text-slate-900">Supervisory Authority</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Registered under the UK Data Protection Act with the Information Commissioner's Office (ICO).
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation Anchor Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-8 sticky top-4 z-20 backdrop-blur-md bg-white/95">
          <div className="flex items-center gap-2 overflow-x-auto text-xs md:text-sm py-1 scrollbar-thin">
            <span className="font-semibold text-slate-700 whitespace-nowrap px-2">Jump to:</span>
            <button onClick={() => scrollToSection('google-data-policy')} className="whitespace-nowrap px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-full font-medium transition-colors border border-red-200 flex items-center gap-1">
              <FaGoogle className="text-xs" /> Google User Data
            </button>
            <button onClick={() => scrollToSection('linkedin-data-policy')} className="whitespace-nowrap px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-full font-medium transition-colors border border-sky-200 flex items-center gap-1">
              <FaLinkedin className="text-xs" /> LinkedIn User Data
            </button>
            <button onClick={() => scrollToSection('data-we-collect')} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors">
              Data We Collect
            </button>
            <button onClick={() => scrollToSection('how-we-use-data')} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors">
              How We Use Data
            </button>
            <button onClick={() => scrollToSection('data-security')} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors">
              Storage & Security
            </button>
            <button onClick={() => scrollToSection('user-rights')} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors">
              Your Rights & Deletion
            </button>
            <button onClick={() => scrollToSection('cookie-policy')} className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors">
              Cookies Policy
            </button>
          </div>
        </div>

        {/* Highlighted Section: GOOGLE USER DATA & OAUTH 2.0 POLICY */}
        <div id="google-data-policy" className="bg-white rounded-2xl border-2 border-red-200 shadow-md p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-bl-lg">
            Google OAuth Disclosure
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 p-3 rounded-xl text-red-600">
              <FaGoogle className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Google User Data & OAuth 2.0 Compliance Policy
              </h2>
              <p className="text-slate-500 text-sm">
                Specific disclosures for users authenticating via Google Sign-In
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
            <p>
              When you choose to register or log into <strong>Intentional Connections</strong> using your Google account via Google OAuth 2.0, our application requests access to specific Google user information to facilitate secure identity verification and profile creation.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" /> 1. What Google User Data We Access & Collect
              </h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700">
                <li><strong>Primary Google Email Address:</strong> Used as your unique account identifier and for critical account safety communications.</li>
                <li><strong>Full Name (Given Name and Family Name):</strong> Used to pre-populate your user display name on Intentional Connections.</li>
                <li><strong>Profile Picture / Avatar URL:</strong> Used to set your initial profile image (which you may change or remove at any time).</li>
                <li><strong>Google Unique User ID:</strong> Used exclusively to authenticate your identity securely across future sign-ins.</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" /> 2. How We Use Google User Data
              </h3>
              <p>
                We use the Google user data strictly for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700">
                <li>Authenticating and logging you into your Intentional Connections account securely without requiring separate password management.</li>
                <li>Setting up your initial user profile.</li>
                <li>Sending essential account notifications, security alerts, and customer support communications.</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" /> 3. Data Protection, Sharing & Prohibited Uses
              </h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700">
                <li><strong>No Sale of Data:</strong> We do NOT sell, rent, or trade Google user data to data brokers, advertisers, or third parties under any circumstances.</li>
                <li><strong>No Advertising Profiling:</strong> We do NOT use Google user data to build advertising profiles or serve personalized external advertisements.</li>
                <li><strong>No AI Model Training:</strong> Google user data is NEVER used to train external generalized third-party Large Language Models (LLMs) or artificial intelligence engines.</li>
                <li><strong>Secure Storage:</strong> All Google data is encrypted in transit using Transport Layer Security (TLS/SSL) and stored in secure, access-controlled databases in full compliance with UK GDPR standards.</li>
              </ul>
            </div>

            {/* Google API Services User Data Policy Limited Use Statement */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-5 text-red-950">
              <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <FaShieldAlt className="text-red-600" /> Google API Services User Data Policy Compliance Statement
              </h4>
              <p className="font-medium text-xs md:text-sm leading-relaxed">
                Intentional Connections' use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-700 inline-flex items-center gap-1">Google API Services User Data Policy <FaExternalLinkAlt className="text-xs" /></a>, including the <strong>Limited Use</strong> requirements.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaTrash className="text-red-500" /> 4. How to Revoke Access & Delete Google Data
              </h3>
              <p>
                You maintain complete control over your Google data at all times:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700">
                <li>
                  <strong>Revoking Google Access:</strong> You can disconnect and revoke Intentional Connections' access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Account Security Permissions</a>.
                </li>
                <li>
                  <strong>Deleting Your Account & Data:</strong> You can delete your account directly inside the app by going to <em>Settings &gt; Account &gt; Delete Account</em>, or by submitting a deletion request to <a href="mailto:support@intentionalconnections.app" className="text-blue-600 underline font-medium">support@intentionalconnections.app</a>. Upon deletion, all associated Google authentication identifiers and profile records are permanently purged or anonymized within 30 days.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Highlighted Section: LINKEDIN USER DATA & OAUTH 2.0 POLICY */}
        <div id="linkedin-data-policy" className="bg-white rounded-2xl border-2 border-sky-200 shadow-md p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#0A66C2] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-bl-lg">
            LinkedIn OpenID Disclosure
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-sky-50 p-3 rounded-xl text-[#0A66C2]">
              <FaLinkedin className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                LinkedIn User Data & OpenID Sign-In Policy
              </h2>
              <p className="text-slate-500 text-sm">
                Specific disclosures for users authenticating via LinkedIn Sign-In
              </p>
            </div>
          </div>

          <div className="space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
            <p>
              When you choose to register or log into <strong>Intentional Connections</strong> with your LinkedIn account using LinkedIn OpenID Connect (`openid`, `profile`, `email`), our application receives basic profile information to verify your identity and establish your account.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" /> 1. What LinkedIn Data We Collect
              </h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700">
                <li><strong>Verified Email Address:</strong> Used as your unique account login and for platform notifications.</li>
                <li><strong>First Name & Last Name:</strong> Used to set your name and initial profile display on the platform.</li>
                <li><strong>Profile Picture URL:</strong> Used to populate your member avatar (which you can change or replace at any time).</li>
                <li><strong>LinkedIn Member / Subject ID:</strong> An encrypted identifier used solely to authenticate your login sessions.</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" /> 2. How We Use & Protect LinkedIn Data
              </h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700">
                <li><strong>Authentication Only:</strong> LinkedIn data is used strictly for user login, session management, and profile creation.</li>
                <li><strong>No Professional Data Scraping:</strong> We do NOT access your LinkedIn connections, private messages, job history, or employment networks.</li>
                <li><strong>No Commercial Resale or Advertising:</strong> We never sell, lease, or monetize your LinkedIn data to third parties, recruitment agencies, or data brokers.</li>
                <li><strong>Encrypted Storage:</strong> All LinkedIn authentication tokens and user attributes are transmitted over SSL/TLS and stored in encrypted databases.</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaTrash className="text-red-500" /> 3. How to Revoke LinkedIn Access & Delete Data
              </h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-700">
                <li>
                  <strong>Revoking LinkedIn Access:</strong> You can manage or revoke access at any time through your <a href="https://www.linkedin.com/psettings/permitted-services" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">LinkedIn Permitted Services / Apps Settings</a>.
                </li>
                <li>
                  <strong>Account Deletion:</strong> You can request immediate erasure of your account and all associated LinkedIn profile data by contacting <a href="mailto:support@intentionalconnections.app" className="text-blue-600 underline font-medium">support@intentionalconnections.app</a> or selecting Delete Account in Settings.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Continuous Privacy Policy Content Sections */}
        <div className="space-y-6">

          {/* Section 1: Who We Are */}
          <section id="who-we-are" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                <FaBuilding />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. Who We Are & Data Controller</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                <strong>Intentional Connections</strong> is a digital platform dedicated to authentic, meaningful social connections. Intentional Connections is operated and owned by <strong>Neratech Ltd</strong>, a private limited company registered in England and Wales.
              </p>
              <p>
                Neratech Ltd acts as the primary <strong>Data Controller</strong> under the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018 for all personal data collected and processed via the website, mobile platforms, and related services.
              </p>
              <p>
                <strong>Nominated Privacy Lead Contact:</strong><br />
                Email: <a href="mailto:neratechuk@gmail.com" className="text-blue-600 underline">neratechuk@gmail.com</a> / <a href="mailto:support@intentionalconnections.app" className="text-blue-600 underline">support@intentionalconnections.app</a><br />
                Address: 225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG
              </p>
            </div>
          </section>

          {/* Section 2: Data We Collect */}
          <section id="data-we-collect" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
                <FaDatabase />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. Categories of Data We Collect</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">A. Information You Provide Directly:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                  <li><strong>Account Credentials:</strong> Email address, password (stored as cryptographic hashes), username.</li>
                  <li><strong>Profile Details:</strong> Bio, interests, location, preferences, lifestyle indicators, and photos you choose to upload.</li>
                  <li><strong>Communications:</strong> Messages, chat history, and interactions exchanged with other members.</li>
                  <li><strong>Support Communications:</strong> Inquiries, safety reports, and feedback submitted to our support team.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-1">B. Information Received from Third-Party Sign-In Providers (Google / LinkedIn):</h3>
                <p className="text-slate-600">
                  When you authenticate via Google Sign-In or LinkedIn OpenID, we receive profile information (name, email, profile picture, user identifier) in accordance with the permissions you grant during authentication.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-1">C. Technical and Usage Data Collected Automatically:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2 text-slate-600">
                  <li>IP address, browser type, operating system, device characteristics.</li>
                  <li>Log timestamps, session durations, referring URLs, and feature interactions.</li>
                  <li>Security logs used to detect abnormal activity, brute force attempts, and fraudulent registrations.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Legal Basis & How We Use Data */}
          <section id="how-we-use-data" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                <FaFileContract />
              </div>
              <h2 className="text-xl font-bold text-slate-900">3. Legal Basis & Purposes of Data Processing</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>Under UK GDPR Article 6, we process your personal data on the following lawful bases:</p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs md:text-sm divide-y divide-slate-200 border border-slate-200 rounded-lg">
                  <thead className="bg-slate-50 text-slate-800 font-semibold">
                    <tr>
                      <th className="p-3">Purpose of Processing</th>
                      <th className="p-3">Data Used</th>
                      <th className="p-3">Lawful Basis (UK GDPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Account creation, login & service delivery</td>
                      <td className="p-3 text-slate-600">Email, Google/LinkedIn ID, Name, Profile data</td>
                      <td className="p-3 text-slate-600">Performance of Contract (Art. 6(1)(b))</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Age assurance & safety enforcement</td>
                      <td className="p-3 text-slate-600">Age confirmation, moderation logs</td>
                      <td className="p-3 text-slate-600">Legal Obligation (UK Online Safety Act) & Legitimate Interest</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Pattern Sense™ self-insight metadata</td>
                      <td className="p-3 text-slate-600">Response rhythms, interaction metrics</td>
                      <td className="p-3 text-slate-600">Consent & Legitimate Interest (Opt-out anytime)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800">Payment & subscription management</td>
                      <td className="p-3 text-slate-600">Transaction records (via Stripe/payment gateway)</td>
                      <td className="p-3 text-slate-600">Performance of Contract & Legal Compliance (Tax/Accounting)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: Age Assurance & UK Online Safety Act */}
          <section id="age-assurance" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-50 p-2.5 rounded-lg text-rose-600">
                <FaUserCheck />
              </div>
              <h2 className="text-xl font-bold text-slate-900">4. Age Assurance & UK Online Safety Act</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                Intentional Connections is exclusively intended for adults aged <strong>18 and above</strong>. To comply with the UK Online Safety Act 2023 and protect minors:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-600">
                <li>We utilize highly effective age assurance protocols.</li>
                <li>Where biometric age estimation or document verification is deployed, it requires your explicit consent.</li>
                <li>Biometric templates (if processed) are calculated as irreversibly encrypted mathematical vectors and are never stored long-term or shared.</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Pattern Sense™ & AI Safeguards */}
          <section id="pattern-sense" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600">
                <FaRobot />
              </div>
              <h2 className="text-xl font-bold text-slate-900">5. Pattern Sense™ & Automated Safeguards</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                <strong>Pattern Sense™</strong> provides constructive self-insight to users based on rhythm and balance (e.g. reply latency and message engagement proportions).
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-600">
                <li><strong>No Content Inspection:</strong> Pattern Sense™ does not inspect private conversational contents for marketing or external profiling.</li>
                <li><strong>No Ranking Algorithms:</strong> We do not secretly rank or shadow-ban profiles based on arbitrary desirability scores.</li>
                <li><strong>Opt-Out Mechanism:</strong> You can reset or disable Pattern Sense™ analytics at any time via your account settings.</li>
                <li><strong>Human Intervention:</strong> Any safety-related account restriction triggered by automated moderation is subject to manual human appeal upon user request.</li>
              </ul>
            </div>
          </section>

          {/* Section 6: Data Storage, Retention & Security */}
          <section id="data-security" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600">
                <FaLock />
              </div>
              <h2 className="text-xl font-bold text-slate-900">6. Storage, Data Retention & Security Measures</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                We implement industry-grade technical and organizational safeguards to ensure your information is defended against unauthorized access, destruction, alteration, or disclosure:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-slate-600">
                <li><strong>Encryption:</strong> Data in transit is secured using modern TLS 1.3/SSL encryption protocols. Passwords and critical tokens are hashed using robust salt functions.</li>
                <li><strong>Server Locations:</strong> Primary databases and application servers are hosted within secure, ISO-certified data centers in the United Kingdom and the European Union.</li>
                <li><strong>Retention Schedule:</strong>
                  <ul className="list-circle list-inside ml-4 mt-1 space-y-1 text-slate-500">
                    <li>Active account records: Retained while your account remains active.</li>
                    <li>Deleted accounts: Profile data, photos, and messages are permanently deleted within 30 days of an account closure request.</li>
                    <li>Financial transaction logs: Retained for 6 years strictly to fulfill UK statutory tax and accounting obligations.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: User Rights Under UK GDPR */}
          <section id="user-rights" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-50 p-2.5 rounded-lg text-purple-600">
                <FaUserShield />
              </div>
              <h2 className="text-xl font-bold text-slate-900">7. Your Statutory Rights Under UK GDPR</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>You have statutory rights regarding your personal information, including:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Right of Access</strong>
                  Request a copy of the personal data we hold about you.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Right to Rectification</strong>
                  Request correction of inaccurate or incomplete profile details.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Right to Erasure ("To Be Forgotten")</strong>
                  Request permanent deletion of your profile and data.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Right to Data Portability</strong>
                  Obtain your data in a structured, machine-readable format.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Right to Object & Restrict</strong>
                  Object to specific processing activities or withdraw consent anytime.
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Right to Lodge a Complaint</strong>
                  Escalate concerns to the UK Information Commissioner's Office (ICO).
                </div>
              </div>
              <p className="text-slate-600 pt-2">
                To exercise any of these rights, contact us at <a href="mailto:support@intentionalconnections.app" className="text-blue-600 underline font-medium">support@intentionalconnections.app</a>. We fulfill verified requests within 30 days without charge.
              </p>
            </div>
          </section>

          {/* Section 8: Cookie Policy & Tracking */}
          <section id="cookie-policy" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
                <FaCookie />
              </div>
              <h2 className="text-xl font-bold text-slate-900">8. Cookies & Tracking Technologies Policy</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-4">
              <p>
                We use cookies and similar browser storage mechanisms to provide essential services, maintain authenticated sessions, and ensure platform safety in compliance with PECR and UK GDPR.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1">1. Strictly Necessary Cookies (Always Active)</h3>
                  <p className="text-slate-600 text-sm">
                    Required for secure authentication, session persistence, CSRF protection, and load balancing. These cookies do not require prior consent under UK law.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1">2. Functional & Preference Cookies</h3>
                  <p className="text-slate-600 text-sm">
                    Remember your interface choices, theme preferences, and localized settings for an enhanced user experience.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-1">3. Statistical & Analytics Cookies (First-Party / Low-Risk)</h3>
                  <p className="text-slate-600 text-sm">
                    First-party aggregated metrics used to detect technical bugs and improve system reliability without cross-site tracking or profiling.
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-sm">
                You can manage or disable cookie preferences at any time using your web browser settings or our in-app Cookie Preference Center.
              </p>
            </div>
          </section>

          {/* Section 9: Contact & Complaints */}
          <section id="contact-us" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                <FaEnvelope />
              </div>
              <h2 className="text-xl font-bold text-slate-900">9. Contact Information & Updates</h2>
            </div>
            <div className="text-slate-700 text-sm md:text-base leading-relaxed space-y-3">
              <p>
                If you have questions, inquiries, or complaints regarding this Privacy Policy or our data handling practices, please contact our Privacy Team:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-1">
                <p><strong>Entity:</strong> Neratech Ltd (Intentional Connections)</p>
                <p><strong>Email:</strong> <a href="mailto:support@intentionalconnections.app" className="text-blue-600 underline">support@intentionalconnections.app</a> / <a href="mailto:neratechuk@gmail.com" className="text-blue-600 underline">neratechuk@gmail.com</a></p>
                <p><strong>Registered Address:</strong> 225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG</p>
                <p><strong>Supervisory Authority:</strong> UK Information Commissioner's Office (ICO) — <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://ico.org.uk</a></p>
              </div>
              <p className="text-slate-500 text-xs mt-4">
                We reserve the right to update this Privacy Policy periodically to reflect legal amendments, technological improvements, or operational changes. The latest version will always be maintained at <code>https://intentionalconnections.app/privacy-policy</code>.
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
// PrivacyPolicyFull.jsx
import React, { useState } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaShieldAlt, 
  FaCookie, 
  FaUserCheck, 
  FaGlobeAmericas,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaDatabase,
  FaUserShield,
  FaQuestionCircle,
  FaCog,
  FaSlidersH,
  FaChartBar,
  FaBullhorn,
  FaEraser,
  FaTable,
  FaUserCog,
  FaSyncAlt,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaUserTie,
  FaChartLine,
  FaRobot,
  FaUsers,
  FaExclamationTriangle,
  FaKey,
  FaTrash,
  FaFileContract
} from 'react-icons/fa';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedCookieSections, setExpandedCookieSections] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [visibleSections, setVisibleSections] = useState(2);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCookieSection = (section) => {
    setExpandedCookieSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleViewMore = () => {
    if (showAll) {
      setVisibleSections(2);
      setShowAll(false);
    } else {
      setVisibleSections(sections.length);
      setShowAll(true);
    }
  };

  // Cookie Policy subsections
  const cookieSubSections = [
    {
      id: 'cookie-what',
      title: "What Are Cookies?",
      icon: <FaQuestionCircle className="text-blue-600" />,
      content: "Cookies are small text files stored on your device when you access our website or platform. They help us operate the service securely, meet our legal safety obligations, remember your preferences, and support core platform functionality, including features such as Pattern Sense™.",
      note: "For simplicity, this policy also covers similar technologies such as local storage, SDKs, and server-side identifiers, collectively referred to as 'cookies'."
    },
    {
      id: 'cookie-how',
      title: "How We Use Cookies",
      icon: <FaCog className="text-purple-600" />,
      content: "In accordance with UK GDPR, PECR, and the Data Use and Access Act 2025, we categorize cookies based on necessity, purpose, and your right to control them."
    },
    {
      id: 'cookie-necessary',
      title: "Strictly Necessary Cookies (Always Active)",
      icon: <FaLock className="text-green-600" />,
      content: "These cookies are essential to operate the platform and do not require prior consent under UK law.",
      points: [
        "Secure authentication and session management",
        "Preventing fraud and unauthorized access",
        "Platform security and stability",
        "Storing consent and privacy preferences",
        "Confirming completion of mandatory age assurance under the UK Online Safety Act"
      ],
      note: "Legal basis: Contractual necessity and legitimate interests. Without these cookies, the platform cannot function securely."
    },
    {
      id: 'cookie-functional',
      title: "Functional Cookies (User Preferences)",
      icon: <FaSlidersH className="text-yellow-600" />,
      content: "These cookies enhance your experience by remembering choices you make.",
      points: [
        "Interface preferences (e.g. language, theme)",
        "Accessibility settings",
        "Pattern Sense™ local functionality used to display your self-insight information"
      ],
      note: "These cookies are optional. Disabling them may reduce usability but will not prevent basic access."
    },
    {
      id: 'cookie-analytics',
      title: "Statistical & Analytics Cookies (Low-Risk, First-Party)",
      icon: <FaChartBar className="text-indigo-600" />,
      content: "We use first-party, anonymized analytics cookies to understand how users interact with the platform so we can improve usability and performance.",
      points: [
        "No cross-site tracking",
        "No individual profiling",
        "No sale of analytics data",
        "Used only for service improvement"
      ],
      note: "Under the Data Use and Access Act 2025, these cookies are considered low-risk statistical cookies. You may object to or disable these cookies at any time via the Preference Center."
    },
    {
      id: 'cookie-marketing',
      title: "Marketing & Lead Attribution Cookies (Consent Required)",
      icon: <FaBullhorn className="text-pink-600" />,
      content: "We use marketing cookies only with your explicit consent. These cookies help us:",
      points: [
        "Understand how users discover Intentional Connections",
        "Measure campaign effectiveness",
        "Optimize advertising spend",
        "Track sign-ups resulting from ads (lead attribution only)"
      ],
      note: "Important safeguards: Marketing cookies are disabled by default, no behavioral profiling for dating or matching purposes, no sale of data to third parties, used solely for attribution and performance measurement. We implement Consent Mode v2, ensuring your preferences are respected across advertising partners. Third-party partners may include providers such as Google, Meta, or LinkedIn, acting as independent controllers under their own privacy policies."
    },
    {
      id: 'cookie-pattern',
      title: "Pattern Sense™ and the 'Clean Slate' Option",
      icon: <FaEraser className="text-teal-600" />,
      content: "Pattern Sense™ uses limited interaction metadata to provide self-insight.",
      points: [
        "Any locally stored Pattern Sense™ cookies are deleted immediately",
        "Interaction habits are no longer processed for self-insight",
        "Core platform access remains available, with reduced insight functionality"
      ],
      note: "This ensures you can reset your experience at any time."
    },
    {
      id: 'cookie-summary',
      title: "Summary of Key Cookies",
      icon: <FaTable className="text-orange-600" />,
      table: {
        header: ["Cookie Name", "Category", "Provider", "Purpose", "Duration"],
        rows: [
          ["__ic_auth", "Necessary", "Internal", "Secure login and session", "Session"],
          ["__ic_age_check", "Necessary", "Internal", "Confirms age assurance completed", "Up to 12 months"],
          ["__ps_habit_data", "Functional", "Internal", "Supports Pattern Sense™ display", "30 days"],
          ["_gcl_au", "Marketing", "Google Ads", "Lead attribution", "90 days"],
          ["_fbp", "Marketing", "Meta", "Campaign measurement", "3 months"]
        ]
      },
      note: "Actual cookies may vary depending on device and region."
    },
    {
      id: 'cookie-manage',
      title: "Managing Your Cookie Preferences",
      icon: <FaUserCog className="text-cyan-600" />,
      content: "You remain in control at all times.",
      points: [
        "Consent Banner: Choose Accept All, Reject All, or Customize",
        "Preference Center: Update settings anytime via Account > Privacy",
        "Global Privacy Control (GPC): We honor GPC signals from supported browsers"
      ],
      note: "Changes apply prospectively and can be updated at any time."
    },
    {
      id: 'cookie-changes',
      title: "Changes to This Policy",
      icon: <FaSyncAlt className="text-blue-700" />,
      content: "We may update this Cookies Policy to reflect:",
      points: [
        "Legal or regulatory changes",
        "Platform updates",
        "Changes in analytics or marketing tools"
      ],
      note: "The latest version will always be available on our website."
    },
    {
      id: 'cookie-contact',
      title: "Contact",
      icon: <FaEnvelope className="text-green-700" />,
      content: "For cookie-related or privacy questions, contact our Nominated Privacy Lead:",
      points: ["support@intentionalconnections.app"]
    }
  ];

  const sections = [
    {
      id: 'introduction',
      title: 'PRIVACY POLICY',
      icon: <FaShieldAlt className="text-blue-600" />,
      header: true,
      content: (
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            PRIVACY POLICY
          </h1>
          <h2 className="text-lg md:text-xl text-blue-600 font-semibold mb-2">
            Intentional Connections
          </h2>
          <p className="text-gray-600 mb-2">A brand of Neratech Ltd (UK)</p>
          <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg">
            <p className="text-sm md:text-base">Last updated: January 2026</p>
          </div>
        </div>
      )
    },
    {
      id: 'who-we-are',
      title: '1. Who We Are',
      icon: <FaBuilding className="text-green-600" />,
      content: `Intentional Connections is a digital social connection platform operated by Neratech Ltd, a company registered in England and Wales.

Intentional Connections operates as a brand name of Neratech Ltd. All data processing activities are carried out by Neratech Ltd as the data controller.`
    },
    {
      id: 'privacy-oversight',
      title: '2. Privacy Oversight',
      icon: <FaUserTie className="text-purple-600" />,
      content: `We have appointed a Nominated Privacy Lead to oversee data protection compliance and privacy governance.

**Privacy contact:**
Email: neratechuk@gmail.com

We do not appoint an independent Data Protection Officer, as we are not legally required to do so under UK GDPR. Our privacy governance structure aligns with our ICO registration.`
    },
    {
      id: 'what-data',
      title: '3. What Data We Collect',
      icon: <FaDatabase className="text-yellow-600" />,
      content: `We collect only the data necessary to operate the platform safely and effectively.

**3.1 Data You Provide**
• Account details (name, age confirmation, location)
• Profile information and preferences
• Photos or media you upload
• Messages and interactions with other users
• Subscription and payment details (processed via third-party providers)

**3.2 Data Collected Automatically**
• Login timestamps and session data
• Interaction metadata (message timing, frequency, balance)
• Device and usage information
• Safety and abuse reports`
    },
    {
      id: 'age-assurance',
      title: '4. Age Assurance and Biometric Processing',
      icon: <FaUserCheck className="text-red-600" />,
      content: `**4.1 Mandatory Age Assurance**
Access to Intentional Connections is restricted to users aged 18 or over.
To comply with the UK Online Safety Act, we use Highly Effective Age Assurance, which may include:
• Facial age estimation technology
• Document-based verification as an alternative
Self-declaration alone is not sufficient.

**4.2 Explicit Consent and Alternatives**
Where biometric age estimation is used:
• Processing occurs only with your explicit consent
• Alternative verification methods are available for users who prefer not to use biometric estimation

**4.3 Biometric Templates**
Biometric data is processed as one-way mathematical hashes.
These hashes cannot be reverse-engineered to reconstruct identity and are not retained longer than necessary to prove compliance.`
    },
    {
      id: 'safety',
      title: '5. Safety and Online Protection (UK Online Safety Act)',
      icon: <FaShieldAlt className="text-indigo-600" />,
      content: `**5.1 Proactive Duty of Care**
We take proactive measures to prevent Priority Illegal Content, including:
• Non-consensual intimate images (cyberflashing)
• Harassment and abuse
• Fraud and impersonation

**5.2 Automated Detection with Human Oversight**
Automated systems may be used to detect and flag potential violations.
No enforcement action is final without the option for human review.

**5.3 Right to Human Intervention**
If your account is restricted following automated detection, you have the right to contest the decision and request a manual review.`
    },
    {
      id: 'pattern-sense',
      title: '6. Pattern Sense™ and Behavioral Insights',
      icon: <FaChartLine className="text-pink-600" />,
      content: `**6.1 What Pattern Sense™ Is**
Pattern Sense™ provides self-insight based on interaction metadata such as:
• Response timing
• Message balance
• Engagement rhythm
It does not analyze message content.

**6.2 What Pattern Sense™ Is Not**
• It does not rank users
• It does not determine visibility
• It does not make automated decisions about account status

**6.3 Opt-Out and Limited Functionality**
You may opt out of Pattern Sense™ processing at any time.
Opting out results in limited functionality, including reduced insights and simplified discovery features.`
    },
    {
      id: 'ai-use',
      title: '7. AI Use and Model Improvement',
      icon: <FaRobot className="text-teal-600" />,
      content: `**7.1 Safety Automation**
We use automated systems for:
• Content safety detection
• Fraud and abuse prevention
• Platform integrity

**7.2 Model Training**
We may use anonymized metadata and verified outcomes to train and audit internal models.

We do not:
• Use personal data to train external third-party LLMs without anonymization
• Sell personal data for advertising or profiling`
    },
    {
      id: 'visibility',
      title: '8. Visibility and Community Signals',
      icon: <FaUsers className="text-orange-600" />,
      content: `User visibility is influenced by human interaction dynamics, such as responsiveness and mutual engagement.

We do not use opaque AI scoring, desirability ratings, or demographic profiling to hide or promote users.`
    },
    {
      id: 'your-rights',
      title: '9. Your Rights',
      icon: <FaKey className="text-cyan-600" />,
      content: `You have the right to:
• Access your data
• Correct inaccuracies
• Request deletion
• Object to certain processing
• Request human review of automated safety decisions`
    },
    {
      id: 'complaints',
      title: '10. Complaints Procedure',
      icon: <FaExclamationTriangle className="text-red-700" />,
      content: `You are encouraged to contact our Nominated Privacy Lead first if you have a data protection concern.

We aim to acknowledge complaints promptly and, in all cases, within 30 days as required by law.

You may escalate unresolved concerns to the Information Commissioner's Office (ICO).`
    },
    {
      id: 'data-retention',
      title: '11. Data Retention',
      icon: <FaTrash className="text-gray-600" />,
      content: `When you delete your account:
• Profile data is deleted or anonymized within 30 days
• Messages and media are deleted unless required for active investigations
• Safety and abuse records may be retained for up to 12 months
• Financial records are retained for 6 years (legal requirement)
• Backup data is overwritten within 30 days

Access to retained data is restricted and audited.`
    },
    {
      id: 'changes',
      title: '12. Changes to This Policy',
      icon: <FaSyncAlt className="text-blue-700" />,
      content: `We may update this Privacy Policy to reflect legal or operational changes.

Continued use of the platform constitutes acceptance of the updated policy.`
    },
    {
      id: 'contact',
      title: '13. Contact',
      icon: <FaEnvelope className="text-green-700" />,
      content: `For privacy-related inquiries, contact us at:`,
      points: [
        <a 
          key="privacy-email"
          href="mailto:support@intentionalconnections.app" 
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          support@intentionalconnections.app
        </a>
      ]
    },
    {
      id: 'cookie-policy',
      title: 'COOKIE POLICY',
      icon: <FaCookie className="text-green-700" />,
      isCookiePolicy: true,
      cookiePolicyHeader: (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full mb-4">
            <FaCookie className="text-green-700 text-2xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            COOKIE POLICY
          </h1>
          <h2 className="text-lg md:text-xl text-blue-600 font-semibold mb-2">
            Intentional Connections
          </h2>
          <p className="text-gray-600 mb-2">A brand of Neratech Ltd (United Kingdom)</p>
          <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg">
            <p className="text-sm md:text-base">Last updated: January 2026</p>
          </div>
        </div>
      )
    },
    {
      id: 'data-processing',
      title: 'Data Processing Tools',
      icon: <FaDatabase className="text-purple-600" />,
      content: `Tools used to Process Data:

(a) Use of Analysis Programs and Remarketing
Intentional Connections analyses members' online behavior. We create anonymous user profiles to improve our service to you. For this we use Google Analytics (with, among other things, the feature Universal Analytics).

(b) Use of Google DoubleClick
Intentional Connections uses the remarketing technology of Google (Google DoubleClick). Through this technology, users who have already visited the Intentional Connections site and have shown interest in the service are again targeted with advertising on the pages owned by the Google partner network.

(c) Facebook Plugins
We use social plugins ("plugins") provided by the social network Facebook.com.

(d) Use Google+ Social Plugins
We use the "+1" the social network Google Plus.

(e) Use of Twitter Social Plugins
We use social plugins ("plugins") from the social network Twitter.com.

(f) Outbrain
Outbrain is a premium discovery platform that helps connect marketers to their target audience through personalized recommendations.

(g) Piwik
This website uses Piwik, a web analytics open-source software.

(h) Ve Interactive
We use the services of Ve Interactive DACH GmbH.

(i) Zendesk
We use the chat program Zendesk Chat, a service of Zendesk, Inc.

(j) Use of payment processors
Stripe and Adyen process payment data for our paid memberships.`
    },
    {
      id: 'data-storage',
      title: 'Data Storage & Security',
      icon: <FaLock className="text-red-600" />,
      content: `**Storing and retention period**
We will only store your personal data for as long as is necessary to fulfill our contractual and legal obligations, or for longer periods only where permitted by applicable law.

When you close your account, we will delete all information we hold about you. If a complete deletion of your data is not possible or not necessary for legal reasons, the data concerned will be blocked for further processing.

**Tools used to safeguard your Data**
We use technological, organizational, and physical protection measures designed to protect against unauthorized use, disclosure or access of the personal information we collect. All information you submit to us at registration or login is encrypted.

The encryption technique we use is SSL (Secure Socket Layer). It is an accepted and widely used technology. In view of our personal information collection, technical precautions have been taken to store your personal information in a secure environment.

Access to your information is limited to only a few selected employees and service providers and will be granted only for carrying out the purposes identified in this policy, quality control and review of complaints, and for thwarting fraud.

Personal information we collect is stored in the EU.`
    },
    {
      id: 'user-rights',
      title: 'User Rights Under GDPR',
      icon: <FaUserShield className="text-indigo-600" />,
      content: `According to the GDPR you have the following rights in relation to your information, which you may exercise at any time in written form.

• **The right to be informed**
The right to be informed encompasses the data controller's obligation to provide 'fair processing information', typically through a privacy notice.

• **The right of access**
The right of access gives the data subject the right to request information regarding his/her personal data from the data controller.

• **The right to rectification**
It gives data subjects the right to require the controller to rectify inaccuracies about their personal data.

• **The right to erasure/right to be forgotten**
The right to erasure allows the data subject to require the controller to remove or delete their personal data from their system.

• **The right to restrict processing**
The right to restriction of processing allows data subjects to demand from controllers to stop processing their personal data.

• **The right to data portability**
The right to data portability gives the data subject the right to require the controller to provide information in a structured, commonly used and machine-readable form.

• **The right to object**
The right to object allows data subjects to prevent controllers from further processing of their personal data if there are no legitimate grounds for the processing of the data.

• **The right to withdraw consent at any time**
You have the right to withdraw your consent at any time. Withdrawing consent will be made easy by us.

• **The right to lodge a complaint with a supervisory authority**
If we do not respond to your request within a month, you have the right to lodge a complaint at the supervisory authority, and seek a judicial remedy.`
    }
  ];

  const displaySections = showAll ? sections : sections.slice(0, visibleSections);

  const renderCookieSubSection = (subSection) => {
    return (
      <div key={subSection.id} className="bg-gray-50 rounded-lg p-4 md:p-6 mb-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white p-2 rounded-lg">
            {subSection.icon}
          </div>
          <h4 className="text-lg font-bold text-gray-800">{subSection.title}</h4>
        </div>
        
        {subSection.content && (
          <p className="text-gray-700 mb-4">{subSection.content}</p>
        )}
        
        {subSection.points && (
          <ul className="space-y-2 mb-4 ml-4">
            {subSection.points.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-600">{point}</span>
              </li>
            ))}
          </ul>
        )}
        
        {subSection.table && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {subSection.table.header.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subSection.table.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {subSection.note && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mt-4">
            <p className="text-gray-700">{subSection.note}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-200">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Intentional Connections Privacy Policy
            </h1>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <FaShieldAlt />
                <span className="font-semibold">UK GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <FaLock />
                <span className="font-semibold">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                <FaGlobeAmericas />
                <span className="font-semibold">UK Based</span>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              This Privacy Policy explains how Intentional Connections collects, uses, and protects your personal information in accordance with UK law.
            </p>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-bold text-gray-800">Registered Office</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Neratech Ltd<br />
              Registered in England and Wales<br />
              Company Number: [To be provided]
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaEnvelope className="text-green-600 text-xl" />
              </div>
              <h3 className="font-bold text-gray-800">Privacy Contact</h3>
            </div>
            <p className="text-gray-600 text-sm">
              <a 
                href="mailto:neratechuk@gmail.com" 
                className="text-blue-600 hover:text-blue-800 hover:underline block mb-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                neratechuk@gmail.com
              </a>
              <a 
                href="mailto:support@intentionalconnections.app" 
                className="text-blue-600 hover:text-blue-800 hover:underline block"
                target="_blank"
                rel="noopener noreferrer"
              >
                support@intentionalconnections.app
              </a>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <FaPhone className="text-red-600 text-xl" />
              </div>
              <h3 className="font-bold text-gray-800">ICO Registration</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Registered with Information<br />
              Commissioner's Office (ICO)<br />
              UK Data Protection Authority
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-4">
          {displaySections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              {section.header ? (
                <div className="p-6">
                  {section.content}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-800">{section.title}</h3>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">
                          {expandedSections[section.id] ? 'Click to collapse' : 'Click to expand'}
                        </p>
                      </div>
                    </div>
                    {expandedSections[section.id] ? (
                      <FaChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedSections[section.id] && (
                    <div className="px-4 md:px-6 pb-6 pt-2 border-t border-gray-100">
                      {section.isCookiePolicy ? (
                        <div>
                          {section.cookiePolicyHeader}
                          
                          <div className="space-y-6">
                            {/* Cookie Subsections */}
                            {cookieSubSections.map((subSection) => (
                              <div key={subSection.id}>
                                <button
                                  onClick={() => toggleCookieSection(subSection.id)}
                                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-2"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded">
                                      {subSection.icon}
                                    </div>
                                    <span className="font-medium text-gray-800 text-left">{subSection.title}</span>
                                  </div>
                                  {expandedCookieSections[subSection.id] ? (
                                    <FaChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  ) : (
                                    <FaChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                  )}
                                </button>
                                
                                {expandedCookieSections[subSection.id] && renderCookieSubSection(subSection)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {section.content}
                          {section.points && (
                            <div className="mt-4 space-y-2">
                              {section.points.map((point, index) => (
                                <div key={index} className="ml-4">
                                  {point}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* View More/Less Button */}
        {sections.length > 2 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleViewMore}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              {showAll ? (
                <>
                  <FaEyeSlash />
                  Show Less
                </>
              ) : (
                <>
                  <FaEye />
                  View More Sections
                </>
              )}
            </button>
            <p className="text-gray-500 text-sm mt-2">
              {showAll 
                ? `Showing all ${sections.length} sections` 
                : `Showing ${visibleSections} of ${sections.length} sections`
              }
            </p>
          </div>
        )}

        {/* Important Notice */}
        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg mt-1 flex-shrink-0">
              <FaShieldAlt className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Important Notice</h3>
              <p className="text-gray-700">
                This Privacy Policy is periodically reviewed and updated. Please check back regularly for any changes. 
                If you have any questions about how we handle your data, please contact our Nominated Privacy Lead.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Last Updated: January 2026
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Version: 2026.1
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Effective Immediately
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;





















































// import React, { useState } from 'react';
// import { 
//   FaChevronDown, 
//   FaChevronUp, 
//   FaShieldAlt, 
//   FaCookie, 
//   FaUserCheck, 
//   FaGlobeAmericas,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaLock,
//   FaDatabase,
//   FaUserShield,
//   FaQuestionCircle, // New
//   FaCog, // New
//   FaSlidersH, // New
//   FaChartBar, // New
//   FaBullhorn, // New
//   FaEraser, // New
//   FaTable, // New
//   FaUserCog, // New
//   FaSyncAlt,// New
//   FaEye,
//   FaEyeSlash
// } from 'react-icons/fa';

// const PrivacyPolicy = () => {
//   const [expandedSections, setExpandedSections] = useState({});
//   const [showAll, setShowAll] = useState(false);
//   const [visibleSections, setVisibleSections] = useState(2);

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handleViewMore = () => {
//     if (showAll) {
//       setVisibleSections(2);
//       setShowAll(false);
//     } else {
//       setVisibleSections(sections.length);
//       setShowAll(true);
//     }
//   };

//   const sections = [
//     {
//       id: 'introduction',
//       title: 'Introduction',
//       icon: <FaShieldAlt className="text-blue-600" />,
//       content: `Spark Networks Services GmbH cares about your personal data, which is why we have drafted this Privacy Policy for you. This Privacy Policy is meant to help you understand what data we collect, why we collect it, what we do with it and how we safeguard it. We encourage you to read this Privacy Policy carefully when using our websites or services or transacting business with us.
      
// All personal data collected from you will be processed in accordance with this Privacy Policy. If you have any further questions please contact us, our contact information can be found at the bottom of this Privacy Policy.

// EliteSingles is an internet-based service which brings people together who are looking for a long-lasting relationship. To successfully provide this service, we collect and use your personal information.

// Please note that this Privacy Policy applies to all our services, including the Website and the Apps (together, the "Services"). When using our Services, you may find links to other websites, apps and services, or tools that enable you to share information with other websites, apps and services. We are not responsible for the privacy practices of these other websites, apps and services and we recommend that you review the privacy policies of each of these websites, apps or services before sharing any personal data.

// If you do not agree to any of the provisions of this Privacy Policy, you should not use our Services.`
//     },
//     {
//       id: 'personal-info',
//       title: 'Your Personal Information',
//       icon: <FaUserCheck className="text-green-600" />,
//       content: `All the personal information we collect is related to providing and improving our Services and its features and falls into three general categories:
// • Information you provide to us
// • Information collected automatically
// • Information we obtain from third parties

// In many cases, personal information is only used in pseudonym form or anonymously.

// What Personal Information we collect:

// 1. Without Registration
// When you visit our websites, we store the following data by default:
// • IP address (Internet Protocol address) of the accessing computer
// • The website from which you visit us (referrer)
// • The sites that you visit from our website
// • The date and time of your visit
// • The type of browser settings
// • Operating System

// This data is used by us for statistical purposes without reference to individuals.

// 2. With Registration
// We only use the personal information that you actively provide us (e.g. contact information for registration, profile information or photos). In many cases, you can decide what personal information you reveal about yourself in your profile and / or in your search activity.

// We provide Free Memberships and Paid Memberships.

// Free Membership
// With the Free Membership you will be prompted to provide the following details, without which registration cannot be completed:
// • Gender
// • Gender of the partner you are seeking
// • E-mail address
// • Password

// Our personality test follows your registration. First, we ask for the following information to identify suitable partners:
// • Postal code
// • Date of birth
// • Height
// • Marital Status
// • Education
// • Occupation
// • Income

// During the personality test, you will be asked to answer a series of personal questions (e.g. partner preferences, personal characteristics and desired traits in a partner).`

//     },

//     {
//   id: 1,
//   title: "COOKIE POLICY",
//   icon: <FaCookie className="text-green-700" />,
//   content: null,
//   points: [
//     <span key="brand" className="text-lg font-bold text-gray-800">
//       Intentional Connections
//     </span>,
//     <span key="company" className="text-gray-600">
//       A brand of Neratech Ltd (United Kingdom)
//     </span>,
//     <div key="date" className="bg-gray-800 text-white px-3 py-1 rounded inline-block mt-1">
//       <span className="text-sm">Last updated: January 2026</span>
//     </div>
//   ]
// },
// {
//   id: 2,
//   title: "What Are Cookies?",
//   icon: <FaQuestionCircle className="text-blue-600" />,
//   content: "Cookies are small text files stored on your device when you access our website or platform. They help us operate the service securely, meet our legal safety obligations, remember your preferences, and support core platform functionality, including features such as Pattern Sense™.",
//   note: "For simplicity, this policy also covers similar technologies such as local storage, SDKs, and server-side identifiers, collectively referred to as 'cookies'."
// },
// {
//   id: 3,
//   title: "How We Use Cookies",
//   icon: <FaCog className="text-purple-600" />,
//   content: "In accordance with UK GDPR, PECR, and the Data Use and Access Act 2025, we categorize cookies based on necessity, purpose, and your right to control them."
// },
// {
//   id: 4,
//   title: "Strictly Necessary Cookies (Always Active)",
//   icon: <FaShieldAlt className="text-red-600" />,
//   content: "These cookies are essential to operate the platform and do not require prior consent under UK law.",
//   points: [
//     "Secure authentication and session management",
//     "Preventing fraud and unauthorized access",
//     "Platform security and stability",
//     "Storing consent and privacy preferences",
//     "Confirming completion of mandatory age assurance under the UK Online Safety Act"
//   ],
//   note: "Legal basis: Contractual necessity and legitimate interests. Without these cookies, the platform cannot function securely."
// },
// {
//   id: 5,
//   title: "Functional Cookies (User Preferences)",
//   icon: <FaSlidersH className="text-yellow-600" />,
//   content: "These cookies enhance your experience by remembering choices you make.",
//   points: [
//     "Interface preferences (e.g. language, theme)",
//     "Accessibility settings",
//     "Pattern Sense™ local functionality used to display your self-insight information"
//   ],
//   note: "These cookies are optional. Disabling them may reduce usability but will not prevent basic access."
// },
// {
//   id: 6,
//   title: "Statistical & Analytics Cookies (Low-Risk, First-Party)",
//   icon: <FaChartBar className="text-indigo-600" />,
//   content: "We use first-party, anonymized analytics cookies to understand how users interact with the platform so we can improve usability and performance.",
//   points: [
//     "No cross-site tracking",
//     "No individual profiling",
//     "No sale of analytics data",
//     "Used only for service improvement"
//   ],
//   note: "Under the Data Use and Access Act 2025, these cookies are considered low-risk statistical cookies. You may object to or disable these cookies at any time via the Preference Center."
// },
// {
//   id: 7,
//   title: "Marketing & Lead Attribution Cookies (Consent Required)",
//   icon: <FaBullhorn className="text-pink-600" />,
//   content: "We use marketing cookies only with your explicit consent.",
//   points: [
//     "Understand how users discover Intentional Connections",
//     "Measure campaign effectiveness",
//     "Optimize advertising spend",
//     "Track sign-ups resulting from ads (lead attribution only)"
//   ],
//   note: "Marketing cookies are disabled by default. No behavioral profiling for dating or matching purposes. No sale of data to third parties. Used solely for attribution and performance measurement. We implement Consent Mode v2, ensuring your preferences are respected across advertising partners."
// },
// {
//   id: 8,
//   title: "Pattern Sense™ and the 'Clean Slate' Option",
//   icon: <FaEraser className="text-teal-600" />,
//   content: "Pattern Sense™ uses limited interaction metadata to provide self-insight.",
//   points: [
//     "Any locally stored Pattern Sense™ cookies are deleted immediately",
//     "Interaction habits are no longer processed for self-insight",
//     "Core platform access remains available, with reduced insight functionality"
//   ],
//   note: "This ensures you can reset your experience at any time."
// },
// {
//   id: 9,
//   title: "Summary of Key Cookies",
//   icon: <FaTable className="text-orange-600" />,
//   content: null,
//   table: [
//     {
//       header: ["Cookie Name", "Category", "Provider", "Purpose", "Duration"],
//       rows: [
//         ["__ic_auth", "Necessary", "Internal", "Secure login and session", "Session"],
//         ["__ic_age_check", "Necessary", "Internal", "Confirms age assurance completed", "Up to 12 months"],
//         ["__ps_habit_data", "Functional", "Internal", "Supports Pattern Sense™ display", "30 days"],
//         ["_gcl_au", "Marketing", "Google Ads", "Lead attribution", "90 days"],
//         ["_fbp", "Marketing", "Meta", "Campaign measurement", "3 months"]
//       ]
//     }
//   ],
//   note: "Actual cookies may vary depending on device and region."
// },
// {
//   id: 10,
//   title: "Managing Your Cookie Preferences",
//   icon: <FaUserCog className="text-cyan-600" />,
//   content: "You remain in control at all times.",
//   points: [
//     "Consent Banner: Choose Accept All, Reject All, or Customize",
//     "Preference Center: Update settings anytime via Account > Privacy",
//     "Global Privacy Control (GPC): We honor GPC signals from supported browsers"
//   ],
//   note: "Changes apply prospectively and can be updated at any time."
// },
// {
//   id: 11,
//   title: "Changes to This Policy",
//   icon: <FaSyncAlt className="text-gray-600" />,
//   content: "We may update this Cookies Policy to reflect:",
//   points: [
//     "Legal or regulatory changes",
//     "Platform updates",
//     "Changes in analytics or marketing tools"
//   ],
//   note: "The latest version will always be available on our website."
// },
// {
//   id: 12,
//   title: "Contact",
//   icon: <FaEnvelope className="text-blue-700" />,
//   content: "For cookie-related or privacy questions, contact our Nominated Privacy Lead:",
//   points: [
//     <a 
//       key="cookie-email"
//       href="mailto:support@intentionalconnections.app" 
//       className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       support@intentionalconnections.app
//     </a>
//   ]
// },

//     {
//       id: 'cookies',
//       title: 'Cookies & Tracking Technologies',
//       icon: <FaCookie className="text-yellow-600" />,
//       content: `We use "cookies" to make your interaction with the platforms individually identifiable and optimized. A cookie is a text file that is either stored temporarily in the computer's memory ("session cookies") or saved on the hard drive ("permanent cookie"). 

// Types of Cookies We Use:

// Session Cookies: we mostly use "session cookies", which are not stored on your hard drive and are deleted when the browser is closed. Session cookies are used for login authentication and to balance the system load.

// Partner and Affiliate Cookies:** we use these cookies if you access our Services via an external advertising space. These cookies are used to settle accounts with our cooperation partners and do not contain personal information from you.

// Permanent cookies: we use "permanent cookies" to save your personal use settings. This allows for personalization and improves the we service, because you can find your personal settings again on subsequent visits.

// Cookie Categories:

// Strictly Necessary Cookies
// These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.

// Performance Cookies
// These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.

// Functional Cookies
// These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.

// Targeting Cookies
// These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.`
//     },
//     {
//       id: 'data-processing',
//       title: 'Data Processing Tools',
//       icon: <FaDatabase className="text-purple-600" />,
//       content: `Tools used to Process Data:

// (a) Use of Analysis Programs and Remarketing
// Intentional Connections analyses members' online behavior. We create anonymous user profiles to improve our service to you. For this we use Google Analytics (with, among other things, the feature Universal Analytics).

// (b) Use of Google DoubleClick
// Intentional Connections uses the remarketing technology of Google (Google DoubleClick). Through this technology, users who have already visited the Intentional Connections site and have shown interest in the service are again targeted with advertising on the pages owned by the Google partner network.

// (c) Facebook Plugins
// We use social plugins ("plugins") provided by the social network Facebook.com.

// (d) Use Google+ Social Plugins
// We use the "+1" the social network Google Plus.

// () Use of Twitter Social Plugins
// We use social plugins ("plugins") from the social network Twitter.com.

// (f) Outbrain
// Outbrain is a premium discovery platform that helps connect marketers to their target audience through personalized recommendations.

// (g) Piwik
// This website uses Piwik, a web analytics open-source software.

// (h) Ve Interactive
// We use the services of Ve Interactive DACH GmbH.

// (i) Zendesk
// We use the chat program Zendesk Chat, a service of Zendesk, Inc.

// (j) Use of payment processors
// Stripe and Adyen process payment data for our paid memberships.`
//     },
//     {
//       id: 'data-storage',
//       title: 'Data Storage & Security',
//       icon: <FaLock className="text-red-600" />,
//       content: `**Storing and retention period**
// We will only store your personal data for as long as is necessary to fulfill our contractual and legal obligations, or for longer periods only where permitted by applicable law.

// When you close your account, we will delete all information we hold about you. If a complete deletion of your data is not possible or not necessary for legal reasons, the data concerned will be blocked for further processing.

// Tools used to safeguard your Data
// We use technological, organizational, and physical protection measures designed to protect against unauthorized use, disclosure or access of the personal information we collect. All information you submit to us at registration or login is encrypted.

// The encryption technique we use is SSL (Secure Socket Layer). It is an accepted and widely used technology. In view of our personal information collection, technical precautions have been taken to store your personal information in a secure environment.

// Access to your information is limited to only a few selected employees and service providers and will be granted only for carrying out the purposes identified in this policy, quality control and review of complaints, and for thwarting fraud.

// Personal information we collect is stored in the EU.`
//     },
//     {
//       id: 'user-rights',
//       title: 'User Rights Under GDPR',
//       icon: <FaUserShield className="text-indigo-600" />,
//       content: `According to the GDPR you have the following rights in relation to your information, which you may exercise at any time in written form.

// • The right to be informed
// The right to be informed encompasses the data controller's obligation to provide 'fair processing information', typically through a privacy notice.

// • The right of access
// The right of access gives the data subject the right to request information regarding his/her personal data from the data controller.

// • The right to rectification
// It gives data subjects the right to require the controller to rectify inaccuracies about their personal data.

// • The right to erasure/right to be forgotten
// The right to erasure allows the data subject to require the controller to remove or delete their personal data from their system.

// • The right to restrict processing
// The right to restriction of processing allows data subjects to demand from controllers to stop processing their personal data.

// • The right to data portability
// The right to data portability gives the data subject the right to require the controller to provide information in a structured, commonly used and machine-readable form.

// • The right to object
// The right to object allows data subjects to prevent controllers from further processing of their personal data if there are no legitimate grounds for the processing of the data.

// • The right to withdraw consent at any time
// You have the right to withdraw your consent at any time. Withdrawing consent will be made easy by us.

// • The right to lodge a complaint with a supervisory authority
// If we do not respond to your request within a month, you have the right to lodge a complaint at the supervisory authority, and seek a judicial remedy.`
//     },
//     {
//       id: 'contact',
//       title: 'Contact Information',
//       icon: <FaEnvelope className="text-pink-600" />,
//       content: `United Kingdom Contact:
// 123 Dating Street
// Suite 100
// Uk

// Email: https:support.intentionalconnections.app

// **United States Contact:**
// EliteSingles Customer Care –
// Spark Networks Services GmbH
// Attn: Legal
// 3400 N. Ashton Blvd, Suite 175
// Lehi, UT 84043
// United Kindum

// Email: https:support.intentionalconnections.app

// Data Protection Officer:
// EliteSingles has its own Data Protection Officer, who is responsible for all matters related to privacy and data protection. This Data Protection Officer can be reached at dataprotection@elitesingles.co.uk

//  Updated:
// Berlin, May 2026`
//     }
//   ];

//   const displaySections = showAll ? sections : sections.slice(0, visibleSections);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
        
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-200">
//           <div className="text-center">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
//               Intentional Connections Privacy Policy
//             </h1>
//             <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
//               <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
//                 <FaShieldAlt />
//                 <span className="font-semibold">GDPR Compliant</span>
//               </div>
//               <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
//                 <FaLock />
//                 <span className="font-semibold">SSL Encrypted</span>
//               </div>
//               <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
//                 <FaGlobeAmericas />
//                 <span className="font-semibold">Global Coverage</span>
//               </div>
//             </div>
//             <p className="text-gray-600 text-lg">
//               This Privacy Policy explains how Intentional Connections collects, uses, and protects your personal information.
//             </p>
//           </div>
//         </div>

//         {/* Quick Info Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <FaMapMarkerAlt className="text-blue-600 text-xl" />
//               </div>
//               <h3 className="font-bold text-gray-800">UK Headquarters</h3>
//             </div>
//             <p className="text-gray-600 text-sm">
//               Correspondence address
// 225 B, Woodgrange Drive,    <br /> Southend-On-Sea, Essex, England, SS1 2SG<br />
          
              
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <FaEnvelope className="text-green-600 text-xl" />
//               </div>
//               <h3 className="font-bold text-gray-800">Contact Email</h3>
//             </div>
//             <p className="text-gray-600 text-sm">
//               UK: https:www.intentionalconnections.app/privacy<br />
//               Uk: cancellation@intentionalconnections.app
//             </p>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-red-100 p-3 rounded-lg">
//                 <FaPhone className="text-red-600 text-xl" />
//               </div>
//               <h3 className="font-bold text-gray-800">Support</h3>
//             </div>
//             <p className="text-gray-600 text-sm">
//               24/7 Customer Support<br />
//               Data Protection Officer Available<br />
//               Quick Response Guaranteed
//             </p>
//           </div>
//         </div>

//         {/* Policy Sections */}
//         <div className="space-y-4">
//           {displaySections.map((section) => (
//             <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//               <button
//                 onClick={() => toggleSection(section.id)}
//                 className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="bg-gray-100 p-3 rounded-lg">
//                     {section.icon}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
//                     <p className="text-gray-500 text-sm mt-1">
//                       {expandedSections[section.id] ? 'Click to collapse' : 'Click to expand'}
//                     </p>
//                   </div>
//                 </div>
//                 {expandedSections[section.id] ? (
//                   <FaChevronUp className="h-5 w-5 text-gray-500" />
//                 ) : (
//                   <FaChevronDown className="h-5 w-5 text-gray-500" />
//                 )}
//               </button>
              
//               {expandedSections[section.id] && (
//                 <div className="px-6 pb-6 pt-2 border-t border-gray-100">
//                   <div className="text-gray-700 whitespace-pre-line leading-relaxed">
//                     {section.content}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* View More/Less Button */}
//         {sections.length > 2 && (
//           <div className="mt-8 text-center">
//             <button
//               onClick={handleViewMore}
//               className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
//             >
//               {showAll ? (
//                 <>
//                   <FaEyeSlash />
//                   Show Less
//                 </>
//               ) : (
//                 <>
//                   <FaEye />
//                   View More Sections
//                 </>
//               )}
//             </button>
//             <p className="text-gray-500 text-sm mt-2">
//               {showAll 
//                 ? `Showing all ${sections.length} sections` 
//                 : `Showing ${visibleSections} of ${sections.length} sections`
//               }
//             </p>
//           </div>
//         )}

//         {/* Important Notice */}
//         <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
//           <div className="flex items-start gap-3">
//             <div className="bg-yellow-100 p-2 rounded-lg mt-1">
//               <FaShieldAlt className="text-yellow-600" />
//             </div>
//             <div>
//               <h3 className="font-bold text-gray-800 text-lg mb-2">Important Notice</h3>
//               <p className="text-gray-700">
//                 This Privacy Policy is periodically reviewed and updated. Please check back regularly for any changes. 
//                 If you have any questions about how we handle your data, please contact our Data Protection Officer.
//               </p>
//               <div className="mt-4 flex flex-wrap gap-2">
//                 <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
//                   Last Updated: May 2026
//                 </span>
//                 <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                   Version: 2026.1
//                 </span>
//                 <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
//                   Effective Immediately
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Download Option */}
//         {/* <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div>
//               <h3 className="font-bold text-gray-800 text-lg">Need a Copy?</h3>
//               <p className="text-gray-600">Download this Privacy Policy for your records</p>
//             </div>
//             <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
//               <FaDownload />
//               Download PDF
//             </button>
//           </div>
//         </div> */}

    
//       </div>
//     </div>
//   );
// };

// export default PrivacyPolicy;
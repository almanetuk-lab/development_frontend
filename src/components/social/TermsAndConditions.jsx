// TermsAndConditions.jsx
import React from 'react';
import { 
  FaFileContract,
  FaCheckCircle,
  FaEye,
  FaUserCheck,
  FaHandshake,
  FaChartLine,
  FaRobot,
  FaCreditCard,
  FaShieldAlt,
  FaBalanceScale,
  FaCopyright,
  FaBan,
  FaGavel,
  FaEnvelope
} from 'react-icons/fa';

const TermsAndConditions = () => {
  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      icon: <FaCheckCircle className="text-green-600" />,
      content: "By accessing or using Intentional Connections, you confirm that:",
      points: [
        "You are at least 18 years old",
        "You have read and agree to these Terms",
        "You comply with applicable UK laws"
      ]
    },
    {
      id: 2,
      title: "Nature of the Platform",
      icon: <FaEye className="text-blue-600" />,
      content: "Intentional Connections is a social connection platform, not:",
      points: [
        "A dating agency",
        "A matchmaking guarantee",
        "A relationship advisory service"
      ],
      note: "Connections are shaped by user choice and interaction, not automated matching."
    },
    {
      id: 3,
      title: "Eligibility and Age Assurance",
      icon: <FaUserCheck className="text-purple-600" />,
      content: "Access is conditional upon completing Highly Effective Age Assurance.",
      warning: "Failure to complete verification may result in restricted access."
    },
    {
      id: 4,
      title: "User Conduct and Intentionality",
      icon: <FaHandshake className="text-yellow-600" />,
      content: "You agree to:",
      points: [
        "Act respectfully and honestly",
        "Avoid harassment, fraud, or misuse",
        "Maintain one account only"
      ],
      note: "Low activity or slow replies are not violations and do not result in penalties."
    },
    {
      id: 5,
      title: "Visibility and Discovery",
      icon: <FaEye className="text-indigo-600" />,
      content: "Visibility reflects community interaction, not hidden algorithms.",
      note: "We do not shadow-ban users or apply arbitrary suppression."
    },
    {
      id: 6,
      title: "Pattern Sense™",
      icon: <FaChartLine className="text-pink-600" />,
      content: "Pattern Sense™ provides informational feedback only.",
      points: [
        "Rank users",
        "Affect visibility",
        "Make enforcement decisions"
      ],
      note: "Opting out limits access to certain insights and discovery features."
    },
    {
      id: 7,
      title: "AI, Safety, and Appeals",
      icon: <FaRobot className="text-red-600" />,
      content: "We use automated systems to detect illegal content and protect users.",
      note: "You have the right to appeal any automated safety restriction and request human review."
    },
    {
      id: 8,
      title: "Subscriptions and Billing",
      icon: <FaCreditCard className="text-teal-600" />,
      content: null,
      points: [
        "Subscriptions renew automatically",
        "Cancellation takes effect at the end of the billing cycle",
        "No partial refunds unless required by law"
      ]
    },
    {
      id: 9,
      title: "Data and Privacy",
      icon: <FaShieldAlt className="text-cyan-600" />,
      content: "Your use of the platform is governed by our Privacy Policy, which forms part of these Terms."
    },
    {
      id: 10,
      title: "Limitation of Liability",
      icon: <FaBalanceScale className="text-orange-600" />,
      content: "To the fullest extent permitted by law:",
      points: [
        "We are not responsible for user conduct",
        "We do not guarantee outcomes"
      ],
      note: "Our total liability shall not exceed the amount paid by you in the preceding 12 months, except where liability cannot be excluded by law."
    },
    {
      id: 11,
      title: "Intellectual Property",
      icon: <FaCopyright className="text-green-700" />,
      content: "All branding, systems, and proprietary features (including Pattern Sense™) are owned by Neratech Ltd."
    },
    {
      id: 12,
      title: "Termination",
      icon: <FaBan className="text-red-700" />,
      content: "We may suspend or terminate accounts that violate these Terms or applicable law, subject to appeal rights where applicable."
    },
    {
      id: 13,
      title: "Governing Law",
      icon: <FaGavel className="text-gray-700" />,
      content: "These Terms are governed by the laws of England and Wales.",
      note: "Courts of England and Wales have exclusive jurisdiction."
    },
    {
  id: 14,
  title: "Contact",
  icon: <FaEnvelope className="text-blue-700" />,
  content: null,
  points: [
    <>
      Email: <a href="mailto:support@intentionalconnections.app" className="text-blue-600 hover:underline">support@intentionalconnections.app</a>
    </>,
    "Address: 225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG"
  ]
}
    // {
    //   id: 14,
    //   title: "Contact",
    //   icon: <FaEnvelope className="text-blue-700" />,
    //   content: null,
    //   points: [
    //     "Email:  support@intentionalconnections.app",
    //     "Address: 225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG"
    //   ]
    // }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-full mb-4">
            <FaFileContract className="text-gray-700 text-xl md:text-2xl" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            TERMS AND CONDITIONS
          </h1>
          <h2 className="text-lg md:text-xl text-blue-600 font-semibold mb-2">
            Intentional Connections
          </h2>
          <p className="text-gray-600 mb-2">A brand of Neratech Ltd (UK)</p>
          <div className="inline-block bg-gray-800 text-white px-4 py-2 rounded-lg">
            <p className="text-sm md:text-base">Last updated: January 2026</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-300 mb-8 md:mb-12"></div>

        {/* Sections */}
        <div className="space-y-6 md:space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg p-5 md:p-8 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    {section.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  {/* Section Number and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-100 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {section.id}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      {section.title}
                    </h3>
                  </div>
                  
                  {/* Main Content */}
                  {section.content && (
                    <p className="text-gray-700 mb-4 md:mb-6">
                      {section.content}
                    </p>
                  )}
                  
                  {/* Points List */}
                  {section.points && (
                    <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 ml-4">
                      {section.points.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          {section.id === 6 ? (
                            <>
                              <span className="text-red-500 mt-1">✗</span>
                              <span className="text-gray-600">Does not: {point}</span>
                            </>
                          ) : (
                            <>
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-gray-600">{point}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Warning Note */}
                  {section.warning && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-4">
                      <p className="text-red-700 font-medium">
                        ⚠️ {section.warning}
                      </p>
                    </div>
                  )}
                  
                  {/* Regular Note */}
                  {section.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                      <p className="text-gray-700">
                        {section.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Divider for mobile */}
              {section.id < sections.length && (
                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-100"></div>
              )}
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div className="mt-8 md:mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg md:rounded-xl p-6 md:p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FaBalanceScale className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3">Important Legal Note</h3>
              <p className="text-blue-100">
                By using Intentional Connections, you agree to follow these Terms. Violations may lead to 
                account removal and, in some cases, legal consequences. Intentional Connections fully 
                cooperates with law enforcement when investigating illegal activities.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-8 md:mt-12 text-center">
          <div className="text-gray-500 text-sm">
            <p>© 2026 Intentional Connections. A brand of Neratech Ltd (UK). All rights reserved.</p>
            <p className="mt-2">Registered in England and Wales | Company Number: [To be provided]</p>
          </div> 
        </div>*/}
      </div>
    </div>
  );
};

export default TermsAndConditions;












// import React from 'react';
// import { 
//   FaFileContract,
//   FaUserShield,
//   FaBan,
//   FaCreditCard,
//   FaSync,
//   FaTimesCircle,
//   FaBalanceScale,
//   FaExclamationTriangle,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt
// } from 'react-icons/fa';

// const TermsAndConditions = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//             <FaFileContract className="text-gray-700 text-2xl" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
//             Terms & Conditions
//           </h1>
//           <p className="text-gray-600">Intentional connections United Kingdom</p>
//           <p className="text-gray-500 text-sm mt-2">
//             For information on how to use the service or for a simple cancellation of your membership, please see our help section. If you have any questions, please contact our customer care team.
//           </p>
//         </div>

//         {/* Section 1: INTRODUCTION */}
//         <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <span className="font-bold text-blue-600">1</span>
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">INTRODUCTION</h2>
//           </div>
          
//           <div className="space-y-4 text-gray-700">
//             <p>
//               <strong>1.1</strong>
// 225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG and  ("you," "your," or "yourself").
//             </p>
            
//             <p>
//               <strong>1.2</strong> We are proud to provide online personals services for single adults to meet each other.
//             </p>
            
//             <p>
//               <strong>1.3</strong> These Terms & Conditions, combined with our Privacy Policy, form a legally binding Agreement between you and us ("Agreement").
//             </p>
            
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <p className="font-medium mb-2">Our details are:</p>
//               <div className="space-y-2">
//                 <p className="font-bold">Spark Networks Services GmbH</p>
//                 <div className="flex items-start gap-2">
//                   <FaMapMarkerAlt className="text-gray-500 mt-1" />
//                   <p>Correspondence address
// 225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG</p>
//                 </div>
//                 <p></p>
//               </div>
//             </div>
            
//             <p>
//               <strong>1.4</strong> We are responsible for the content of this website.
//             </p>
            
//             <p>
//               <strong>1.5</strong> The Agreement, as it may be amended from time to time, applies to all users of any our Services.
//             </p>
            
//             <p>
//               <strong>1.6</strong> If you become a Member, you will be able to access the Services associated with the Company product(s) for which you hold a Membership. If you meet certain requirements, the Company may in its discretion make your profile visible to Users of other Websites and Apps operated by the Company for which you do not have a Membership.
//             </p>
            
//             <p>
//               <strong>1.7</strong> The Agreement also applies to you use of all features, widgets, plug-ins, applications, content, downloads and/or other services that:
//             </p>
//             <div className="ml-6">
//               <p><strong>1.7.1</strong> we own and control and make available to you; or</p>
//               <p><strong>1.7.2</strong> also post a link to this Agreement.</p>
//             </div>
            
//             <p>
//               <strong>1.8</strong> You are reminded to abide by all applicable laws. You also undertake not to use our Services for unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libellous, hateful, or racially or ethnically offensive purposes (or for purposes which are otherwise objectionable).
//             </p>
            
//             <p>
//               <strong>1.9</strong> If you violate these Terms & Conditions, we may terminate your access to our Services.
//             </p>
            
//             <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <FaExclamationTriangle className="text-yellow-600 mt-1" />
//                 <div>
//                   <p className="font-bold text-gray-800 mb-2">
//                     IF YOU PURCHASE A MEMBERSHIP, YOU HAVE A RIGHT OF WITHDRAWAL WHICH YOU CAN EXERCISE WITHIN 14 (FOURTEEN) DAYS FROM YOUR PAID SUBSCRIPTION TO THE SERVICES, WITHOUT PENALTY FOR NO REASON.
//                   </p>
//                   <p className="font-bold text-gray-800">
//                     YOUR RIGHT OF WITHDRAWAL EXPIRES 14 (FOURTEEN) DAYS AFTER THE CONTRACT CONCLUSION DATE.
//                   </p>
//                   <p className="text-gray-600 mt-2">
//                     PLEASE READ SECTION 12 FOR MORE INFORMATION.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section 2: DEFINITIONS */}
//         <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-green-100 p-3 rounded-lg">
//               <span className="font-bold text-green-600">2</span>
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">DEFINITIONS</h2>
//           </div>
          
//           <div className="space-y-4 text-gray-700">
//             <p><strong>2.1</strong> In these Terms & Conditions:</p>
            
//             <div className="space-y-3 ml-4">
//               <p><strong>2.2</strong> "Apps" refers, individually and collectively, to each and all of the Mobile Apps, Desktop Apps, and Web Apps.</p>
//               <p><strong>2.3</strong> "Desktop Apps" means the desktop applications published by the Company and which may be offered from time to time.</p>
//               <p><strong>2.4</strong> "Member" means any person whose Membership to has been accepted by the Company and whose Membership remains valid for the time being. The term 'Member' includes free Members and paying Members, as the context requires.</p>
//               <p><strong>2.5</strong> "Membership" means your entitlement to one or more Services by virtue of being a Member. Such entitlement may vary depending on whether the Membership is a paid Membership or a free Membership (and the relevant Company product for which you have a Membership).</p>
//               <p><strong>2.6</strong> "Mobile Apps" means the iOS application and the Android application or any other mobile/tablet device software applications published by the Company and which may be offered from time to time.</p>
//               <p><strong>2.7</strong> "Privacy Policy" means the privacy policy available at https://www.intentionalconnections.co.uk/privacy, which combined with the Terms & Conditions represent the Agreement between you and the Company.</p>
//               <p><strong>2.8</strong> "Services" means any and all of the services provided by the Company by any means (including, but not limited to, the Websites, the Apps, or any other technology).</p>
//               <p><strong>2.9</strong> "Terms & Conditions" means these terms and conditions which, together with the Privacy Policy, represent the Agreement between you and the Company, as varied and as amended by the Company at its full discretion at any time and published on the Websites.</p>
//               <p><strong>2.10</strong> "User" means any Member and/or Visitor.</p>
//               <p><strong>2.11</strong> "Visitor" means any person who browses the Services.</p>
//               <p><strong>2.12</strong> "Web Apps" means the web applications published by the Company and which may be offered from time to time.</p>
//               <p><strong>2.13</strong> "Website(s)" means, individually or collectively, the websites operated by the Company.</p>
//               <p><strong>2.14</strong> As the context may require, words in the singular may be read as the plural and the plural as the singular.</p>
//             </div>
//           </div>
//         </div>

//         {/* Section 3: YOUR PRIVACY */}
//         <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-purple-100 p-3 rounded-lg">
//               <FaUserShield className="text-purple-600" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">3. YOUR PRIVACY – COLLECTION AND RETENTION OF PERSONAL INFORMATION</h2>
//           </div>
          
//           <div className="space-y-4 text-gray-700">
//             <p>
//               <strong>3.1</strong> We are bound by European privacy laws. We explain what we do and don't do with your data in our Privacy Policy at: https://www.intentionalconnections.co.uk/privacy
//             </p>
            
//             <p>
//               <strong>3.2</strong> We do not always encrypt your messages, and we reserve the right to monitor those messages and other content for compliance with our Terms & Conditions (for example, where the content of your messages is reported for breaching our Terms & Conditions).
//             </p>
//           </div>
//         </div>

//         {/* Section 4: ACCOUNTS AND SECURITY */}
//         <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="bg-red-100 p-3 rounded-lg">
//               <FaBan className="text-red-600" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">4. ACCOUNTS AND SECURITY</h2>
//           </div>
          
//           <div className="space-y-4 text-gray-700">
//             <p><strong>4.1</strong> To access the Services, you must have an account.</p>
//             <p><strong>4.2</strong> You must maintain, and are responsible for, the confidentiality of your logon and password.</p>
//             <p><strong>4.3</strong> If requested, you must provide us with a form of identification to verify your identity.</p>
//             <p><strong>4.4</strong> The Services are open to everyone – subject to approval of an application by the Company according to these Terms & Conditions.</p>
//             <p><strong>4.5</strong> The Company requires all Users to undertake to abide by the Privacy Policy and these Terms & Conditions, including, in particular, by agreeing to the Code of Conduct at Section 6 below.</p>
            
//             <p><strong>4.6</strong> You may not use our Services if:</p>
            
//             <div className="ml-6 space-y-4">
//               <div>
//                 <p><strong>4.6.1</strong> You are under the age of 18.</p>
//                 <p className="ml-4 text-gray-600">
//                   Children are not eligible to use our Services, and we ask that anyone under the age of 18 years old not submit any personal information to us. Our Services are not directed at anyone under the age of 18 years old. We also do not collect or maintain personally identifiable information from those Users who we know are under the age of 18 years old. Should we learn or be notified that we have collected information from Users under the age of 18 years old, we will immediately delete such personally identifiable information;
//                 </p>
//               </div>
              
//               <div>
//                 <p><strong>4.6.2</strong> You have ever been convicted of a violent or sexually related criminal offence.</p>
//                 <p className="ml-4 text-gray-600">
//                   We do not conduct criminal background screenings of our Users, nor are we able to personally identify each User. The Company cannot be held liable for false declarations made by a Member. It is thus important to take certain common-sense precautions when meeting with another Member. For example, consider informing a close friend or relative of any meeting and plan your first meeting in a public place.
//                 </p>
//               </div>
              
//               <p><strong>4.6.3</strong> You have previously been banned from using our Services or similar services.</p>
//             </div>
            
//             <p>
//               <strong>4.7</strong> The Company cannot be held liable for actions of any nature committed by any User, including any such actions in the course of any events which are organised by the Company or by others using the Services.
//             </p>
//           </div>
//         </div>

//         {/* Contact Information Box */}
//         <div className="bg-gray-100 rounded-xl p-6 md:p-8 mb-8 border border-gray-300">
//           <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Care Contact</h3>
//           <div className="space-y-3">
//             <div className="flex items-start gap-3">
//               <FaEnvelope className="text-gray-500 mt-1" />
//               <div>
//                 <p className="font-medium">Email:</p>
//                 <p>cancellation@intentionalconnections.co.uk</p>
//               </div>
//             </div>
            
//             <div className="flex items-start gap-3">
//               <FaMapMarkerAlt className="text-gray-500 mt-1" />
//               <div>
//                 <p className="font-medium">Postal Address:</p>
//                 <p>Customer Care – United Kingdom</p>
//                 <p></p>
//                 <p></p>
//                 <p>
// 225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Important Note */}
//         <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
//           <div className="flex items-start gap-3">
//             <FaBalanceScale className="text-blue-600 mt-1" />
//             <div>
//               <h3 className="font-bold text-gray-800 mb-2">Important Legal Note</h3>
//               <p className="text-gray-700">
//                 By using Intentional connections, you agree to follow this policy. Violations may lead to account removal and, in some cases, legal consequences. Intentional connections fully cooperates with law enforcement when investigating illegal activities.
//               </p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default TermsAndConditions;
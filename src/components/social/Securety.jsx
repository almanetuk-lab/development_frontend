// StayingSafe.jsx
import React from 'react';
import { 
  FaShieldAlt,
  FaQuestionCircle,
  FaUserSecret,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaEnvelope,
  FaExclamationTriangle
} from 'react-icons/fa';

const Securety = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaShieldAlt className="text-blue-600 text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Staying Safe
          </h1>
          <h2 className="text-xl text-blue-600 font-semibold mb-2">
            Online Dating Safety
          </h2>
          <p className="text-gray-600">
            The Intentional Connections guide to staying safe while dating online.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="text-gray-700 space-y-4">
            <p>
              While the majority of our members are sincere and honest in the information they provide, 
              as always exceptions do exist. To counteract this, Intentional Connections employs an entire 
              team of agents whose main task is to check and verify each and every profile created on our site.
            </p>
            
            <p>
              Every partner proposal you receive has been stringently checked by a human and verified. 
              This process removes the majority of these rogue accounts. In recognition of the sophistication 
              of modern day scammers, here are six additional tips on how you can confirm the authenticity 
              of a profile and protect yourself against fraud.
            </p>
          </div>
        </div>

        {/* Tip 1 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaQuestionCircle className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">1. Question unrealistic information</h2>
            </div>
          </div>
          
          <div className="text-gray-700">
            <p>
              If your partner proposal is a 22 year old surgeon, or you come across a stockbroker who claims 
              that money is not important in their life, then it is completely acceptable for you to be skeptical. 
              It is best to avoid contact if you doubt the information provided on a profile is legitimate.
            </p>
          </div>
        </div>

        {/* Tip 2 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaUserSecret className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">2. Be mindful of your personal information</h2>
            </div>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              It is natural to be excited and curious about someone we have met over the internet. 
              We want to learn all we can about them and might prefer to call them as soon as possible 
              to hear the sympathetic voice behind the emails.
            </p>
            
            <p>
              Before giving out ANY personal information such as your phone number or email address, 
              it is worth reflecting upon that fact that you cannot take this information back. 
              It is of course essential in the dating process to exchange personal information, 
              but only proceed if you feel comfortable doing so. If your partner is excessively 
              demanding it can be a warning sign.
            </p>
            
            <p>
              Some users have reported success setting up dating email accounts, used for the express 
              purpose of contacting potential partners to organize meetings.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-yellow-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">
                    Beware of users who send you a private email address or links to external website on your first communication. 
                    These are often the clearest indications of a phishing attempt.
                  </p>
                </div>
              </div>
            </div>
            
            <p>
              Intentional Connections site is designed with security in mind, and we are always 
              monitoring suspicious users' activities and will alert you accordingly. Because of this, 
              communicating via our platform is often the safest way to proceed until you get to 
              know the individual in person.
            </p>
          </div>
        </div>

        {/* Tip 3 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaMoneyBillWave className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">3. Financial requests</h2>
            </div>
          </div>
          
          <div className="text-gray-700">
            <p>
              If your partner suggestion requests for you to either make or receive any form of financial 
              payment, cease all contact immediately and report the profile to customer care. This is one 
              of the strongest indicators of a fraudulent account, and it often only becomes apparent 
              after initial contact has been made.
            </p>
          </div>
        </div>

        {/* Tip 4 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaClock className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">4. Don't rush</h2>
            </div>
          </div>
          
          <div className="text-gray-700">
            <p>
              It is important that you feel comfortable when making the decision to deepen your relationship 
              with a partner proposal. Only provide your mobile phone number if you feel safe and comfortable 
              doing so. Do not let yourself be pressured into meeting someone you are unsure of. It is important 
              to explain this to your partner, and if they do not take your wishes into account, it is best to 
              not contact them further.
            </p>
          </div>
        </div>

        {/* Tip 5 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FaUsers className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">5. Plan a safe meeting</h2>
            </div>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              Your first meeting is something to be excited about! It is one of the many steps in the process 
              of getting to know your future partner. Even if you feel you have become closer to them via email 
              and phone, you should still remember that this person is still largely a stranger to you. 
              Therefore it is important that you take the following points into consideration:
            </p>
            
            <div className="ml-6 space-y-3">
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-800">a)</span>
                <span>Choose a neutral location, such as a coffee shop or a restaurant. Do not go to their house, or invite them to yours for the first date.</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-800">b)</span>
                <span>Tell your friends, or someone you trust, that you are going on a date and with whom.</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-800">c)</span>
                <span>Try not to drink too much alcohol.</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-800">d)</span>
                <span>Do not leave your personal belongings unattended.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tip 6 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-3 rounded-lg">
              <FaEnvelope className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">6. Share your thoughts</h2>
            </div>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              In order to guarantee the authenticity of your recommended partners, we need your help. 
              Email our customer care department here if you suspect any profile contains false information 
              or is behaving in a fraudulent manner.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-gray-700">
                We wish you all the best in your search for a partner and would like you to remain safe while doing so.
              </p>
              <p className="font-bold text-gray-800 mt-2">
                The Intentional Connections team.
              </p>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default Securety;
// OnlineDatingSafety.jsx
import React from 'react';
import { 
  FaShieldAlt,
  FaExclamationTriangle,
  FaUserCheck,
  FaFlag,
  FaGavel,
  FaHeart,
  FaPhone,
  FaHospital,
  FaUserLock
} from 'react-icons/fa';

const OnlineDating = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FaShieldAlt className="text-red-600 text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Online Dating Safety Policy
          </h1>
          <p className="text-gray-600">
            Your safety is our top priority at Intentional Connections
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="text-gray-700 space-y-4">
            <p>
              At Intentional Connections, your safety is our top priority. We're committed to creating a respectful and secure online dating environment where you can connect with confidence.
            </p>
            <p>
              By using our platform, you agree to treat others with respect and never send or request money or share financial information with anyone you meet here. If you come across anyone violating these rules, please report them to us.
            </p>
            <p>
              For more tips on staying safe while dating online, check out our Terms and Conditions, Code of Conduct, and Online Dating Safety Tips.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-lg">
              <FaExclamationTriangle className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">1. What's Not Allowed</h2>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              We do not allow any of the following on our platform:
            </p>
            
            <div className="space-y-3 ml-4">
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <span className="font-medium">Threats to Safety:</span>{' '}
                  This includes any actions—online or offline—that could harm someone, such as sexual violence, harassment, stalking, assault, robbery, or any other dangerous behavior.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <span className="font-medium">Harmful or Deceptive Behavior:</span>{' '}
                  Hate speech, discrimination, fraud, misrepresentation, abuse, or content promoting violence, racism, sexism, or bigotry.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <span className="font-medium">Exploitation of Children:</span>{' '}
                  Every child deserves to grow up in a safe and protected environment. We have a strict zero-tolerance policy for any form of child exploitation, including child sexual exploitation and abuse, which is strictly prohibited and illegal. Our platform is strictly for users 18 and older.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <span className="font-medium">Unauthorized Use:</span>{' '}
                  This includes sharing personal information without consent, phishing, scams, gambling, spamming, or any other fraudulent activities.
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <span className="font-medium">Technical Misuse:</span>{' '}
                  Uploading harmful software, designed to disrupt, damage, or expropriate data or personal information. This also includes accessing unauthorized areas, bypassing security measures, or overloading the system infrastructure.
                </div>
              </div>
            </div>
            
            <p className="mt-4">
              If any behavior violates our Terms and Conditions or Code of Conduct, we will take appropriate action.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaHeart className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">2. Consent is Essential</h2>
          </div>
          
          <div className="text-gray-700">
            <p>
              Any form of sexual activity without clear consent is against both our policy and the law. Consent must be explicitly given and can be withdrawn at any time. Respect others' boundaries at all times.
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaUserCheck className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">3. Background Checks & User Verification</h2>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              By joining Intentional Connetions, you confirm that you:
            </p>
            
            <div className="space-y-2 ml-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Are at least 18 years old.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Have never been convicted of a felony or a sexual offense.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Are not required to register as a sex offender.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Have not been previously removed from our platform.</span>
              </div>
            </div>
            
            <p>
              If we find that a user violates these terms, we may take action, including removing content, suspending or banning accounts, or reporting serious concerns to law enforcement.
            </p>
            
            <p>
              While we don't routinely conduct background checks, we reserve the right to do so. You may also be asked to verify your identity through government ID checks or photo verification to help maintain trust in our community.
            </p>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaFlag className="text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">4. Reporting a Concern</h2>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              We encourage all users to report suspicious, abusive, or inappropriate activity to keep our platform safe. For detailed instructions on reporting a violation, please visit our Help Center: How do I report a concern?
            </p>
            
            <p>
              Our team reviews all reports and takes appropriate action, which may include suspending or banning users. If we identify a suspected fraudulent intent, we notify other members who have interacted with the reported individual, advising them to cease all communication.
            </p>
            
            <p>
              Rest assured; your identity will always remain confidential when making a report.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="font-medium text-gray-800">
                Please note: Reports should always be made in good faith. False or malicious complaints are not permitted.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaGavel className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">5. Appealing a Suspension</h2>
          </div>
          
          <div className="text-gray-700">
            <p>
              If your account is suspended or banned due to a policy violation, you have 30 days to appeal the decision by contacting us.
            </p>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-100 p-3 rounded-lg">
              <FaHospital className="text-pink-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">6. Safety Resources</h2>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              Please find below resources for survivors of sexual violence, domestic violence, and other crimes.
            </p>
            
            <div className="space-y-4 ml-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaPhone className="text-gray-500" />
                  <span className="font-medium">National Domestic Abuse Helpline: 0808 2000 247</span>
                </div>
                <p className="text-gray-600 text-sm ml-6">
                  24/7 confidential support for individuals experiencing domestic abuse, including safety planning and referrals to local services.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaPhone className="text-gray-500" />
                  <span className="font-medium">Childline: 0800 1111</span>
                </div>
                <p className="text-gray-600 text-sm ml-6">
                  Free, confidential support for children and young people up to 19 years of age, available 24/7 via phone and online chat.
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaHospital className="text-gray-500" />
                  <span className="font-medium">NHS Sexual Assault Referral Centres (SARCs)</span>
                </div>
                <p className="text-gray-600 text-sm ml-6">
                  Provide medical care, forensic examinations, and emotional support to individuals who have experienced sexual assault or rape.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FaUserLock className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">7. Staying Safe While Dating Online</h2>
          </div>
          
          <div className="text-gray-700 space-y-4">
            <p>
              Your safety is our top priority, and we are committed to maintaining a secure dating experience for all users. We use advanced technology and a dedicated moderation team to monitor and review content, ensuring a safe and respectful environment. However, your awareness and caution are also key.
            </p>
            
            <p>
              We urge you to stay cautious and mindful online: protect your personal information, report any suspicious activity to our team, and trust your instincts. If something feels off, take a step back and assess the situation before proceeding. While we work hard to prevent fraudulent activity, your vigilance helps keep the community safe. Reporting concerns allows us to take swift action and protect other members.
            </p>
            
            <p>
              For more detailed guidance on staying safe while dating online, please refer to our Online Dating Safety Tips.
            </p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 rounded-xl p-6 md:p-8 border border-red-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Important Notice</h2>
          <div className="text-gray-700">
            <p>
              By using our platform, you agree to follow this policy. Violations may lead to account removal and, in some cases, legal consequences. Intetional Connections fully cooperates with law enforcement when investigating illegal activities.
            </p>
          </div>
        </div>

       
      </div>
    // </div> 
  );
};

export default OnlineDating;
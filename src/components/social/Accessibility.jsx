// Accessibility.jsx
import React from 'react';
import { FaUniversalAccess } from 'react-icons/fa';

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaUniversalAccess className="text-blue-600 text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Commitment to Accessibility
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              <strong>Intentional Connections</strong> is committed to making our website's content accessible 
              and user friendly to everyone. If you have difficulty viewing or navigating the content 
              on this website, or notice any content, feature, or functionality that you believe is 
              not fully accessible to people with disabilities, please email our team at{' '}
              <a 
                href="https://support.intentionalconnections.app" 
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                https://support.intentionalconnections.app
              </a>{' '}
              with <span className="bg-yellow-100 px-2 py-1 rounded font-medium">"Accessibility Issue"</span> 
              {' '}in the subject line and provide a description of the specific feature you feel 
              is not fully accessible or a suggestion for improvement.
            </p>
            
            <p className="mb-6">
              We take your feedback seriously and will consider it as we evaluate ways to accommodate 
              all of our customers and our overall accessibility policies. Additionally, while we do not 
              control such vendors, we strongly encourage vendors of third-party digital content to provide 
              content that is accessible and user friendly.
            </p>
          </div>

          {/* Contact Box */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Email: </span>
                <a 
                  href="https://support.intentionalconnections.app" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  https://support.intentionalconnections.app
                </a>
              </div>
              <div>
                <span className="text-gray-600">Subject: </span>
                <span className="font-medium">Accessibility Issue</span>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default Accessibility;
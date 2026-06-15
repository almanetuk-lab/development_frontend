
// // src/components/Hero.jsx (Optimized for Mobile & Desktop)
import React, { useEffect ,useState } from "react";
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
        
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
        const apiUrl = `${backendUrl}/api/linkedin/auth-url`;
        
        console.log('📞 Calling backend for LinkedIn URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend LinkedIn response:', data);
        
        //  IMPORTANT: Backend { url: '...' } format में return कर रहा है
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
      {/* Container with flex layout */}
      <div className="relative  h-full flex flex-col lg:flex-row">
        {/* MOBILE: Image First (LG se pehle) */}
        <div className="lg:hidden h-[350px] md:h-[400px] w-full">
          {" "}
          {/* Increased height */}
          <div className="relative h-full w-full">
            <img
              src={bannerImage}
              alt="Connection Banner"
              className="w-full h-full object-cover"
            />
            {/* Overlay for mobile */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* LEFT SIDE: Content (50%) */}
        <div className="lg:w-1/2 h-full flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12 lg:pt-0">
          {" "}
          {/* Reduced padding */}
          {/* Main Content */}
          <div className="max-w-2xl mx-auto w-full">
            {/* Main Headline - Smaller fonts */}
            <h1
              data-aos="fade-up"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#2C3E50] leading-tight mb-4 md:mb-6"
            >
              
          Where connection fits your life
           </h1>

            {/* Subtitle - Smaller */}
             <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-base sm:text-lg md:text-xl text-[#546E7A] mb-6 md:mb-8 max-w-xl"
            >
              A platform designed around real-life compatibility, not endless
              swiping or surface-level attraction.
            </p>

            {/* Description - Smaller */}
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-sm sm:text-base text-[#546E7A] mb-8 md:mb-10 max-w-xl"
            >
              Built for adults who value ambition, personal balance and
              meaningful connection and want the freedom to explore openly and
              decide for themselves.
            </p>

            {/* Waitlist Section */}
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mb-8 md:mb-10"
            >
              {/* Social Login Buttons - Better mobile */}
               <div className="flex flex-col sm:flex-row gap-3 mb-4 md:mb-6">
                 {/* <Link
                  to="/linkedin"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-[#0077B5] text-white rounded-lg font-medium hover:opacity-90 transition shadow-sm hover:shadow-md w-full sm:w-auto text-sm md:text-base"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <FaLinkedin size={16} className="md:size-[18px]" />
                  <span>LinkedIn</span>
                </Link>  */}
            <button
                  onClick={handleLinkedInLogin}
                  disabled={linkedinLoading} 
                  className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-[#0077B5] text-white rounded-lg font-medium hover:opacity-90 transition shadow-sm hover:shadow-md w-full sm:w-auto text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {linkedinLoading ? ( 
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <FaLinkedin size={16} className="md:size-[18px]" />
                      <span>LinkedIn</span>
                    </>
                  )}
                </button>


                 <Link
                  to="/Coming-soon"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-[#000000] text-white rounded-lg font-medium hover:opacity-90 transition shadow-sm hover:shadow-md w-full sm:w-auto text-sm md:text-base"
                  onClick={() => window.scrollTo(0, 0)}
                >
                   <FaApple size={16} className="md:size-[18px]" /> 
                 <span>Apple</span> 
                 </Link> 

                <Link
                  to="/coming-soon"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm hover:shadow-md border border-gray-300 w-full sm:w-auto text-sm md:text-base"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <FaGoogle size={16} className="md:size-[18px]" />
                  <span>Google</span>
                </Link>
              </div>

              {/* OR Divider */}
              <div className="flex items-center my-4 md:my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Email Waitlist */}
              <div className="max-w-md">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4D6D9E] focus:border-transparent shadow-sm text-sm md:text-base"
                  />

                  <Link
                    onClick={() => window.scrollTo(0, 0)}
                    to="/register"
                    className="px-4 py-2.5 md:px-6 md:py-3 bg-[#4D6D9E] text-white font-semibold rounded-lg hover:bg-[#3A5A8F] transition shadow-sm hover:shadow-md whitespace-nowrap text-sm md:text-base inline-block text-center"
                  >
                    Join Waitlist
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-2 md:mt-3">
                  We'll notify you when we launch. No spam, ever.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP: Image Right Side (50%) - Increased height */}
        <div className="hidden lg:block lg:w-1/2 h-full">
          <div className="relative h-full w-full">
            <img
              src={bannerImage}
              alt="Connection Banner"
              className="w-full h-full object-cover object-center"
            />
            {/* Optional overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}





























































































































































































































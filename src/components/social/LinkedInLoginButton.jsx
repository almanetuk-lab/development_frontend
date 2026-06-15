
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LinkedInLoginButton = () => {
    const navigate = useNavigate();

    const handleLinkedInLogin = async () => {
        try {
            // Fetch Auth URL from Backend (Prevents hardcoded Client ID issues)
            const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
            const response = await fetch(`${backendUrl}/api/linkedin/auth-url`);
            const data = await response.json();

            if (data.url) {
                console.log('🔗 Redirecting to LinkedIn:', data.url);
                window.location.href = data.url;
            } else {
                throw new Error('Failed to get LinkedIn Auth URL');
            }
        } catch (error) {
            console.error('❌ LinkedIn Login Error:', error);
            alert('Failed to initiate LinkedIn login. Please try again.');
        }
    };

    return (
        <button
            onClick={handleLinkedInLogin}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '14px 28px',
                backgroundColor: '#0077B5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '350px',
                margin: '15px 0',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                borderRadius: '4px',
                padding: '2px'
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0077B5"/>
                </svg>
            </div>
            <span>Continue with LinkedIn</span>
        </button>
    );
};


export default LinkedInLoginButton;

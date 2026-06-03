import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../context/UseProfileContext';
const LinkedInCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateProfile, refreshProfile } = useUserProfile();
    const [status, setStatus] = useState('Processing login...');

useEffect(() => {
    const handleCallback = async () => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('LinkedIn error:', error);
            navigate('/login?error=linkedin_failed');
            return;
        }

        if (!code) {
            console.error('No authorization code received');
            navigate('/login?error=no_code');
            return;
        }

        try {
            setStatus('Verifying LinkedIn authentication...');
            
            //  CORRECT Backend URL
            const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
            const apiUrl = `${backendUrl}/api/linkedin/callback?code=${code}`;
            
            console.log('🔗 Sending code to backend:', apiUrl);
            
            const response = await fetch(apiUrl);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Backend response:', data);
            
            //  Check response structure
            if (data.success && data.token) {
                // Save tokens
                localStorage.setItem('accessToken', data.token);
                
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
                
                if (data.user) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    updateProfile(data.user);
                }
                
                console.log('✅ LinkedIn login successful,refreshing profile...');
            
                refreshProfile();
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'Login failed');
            }
            
        } catch (error) {
            console.error('❌ LinkedIn callback error:', error);
        
            
                // Extract more detail if possible
                let errorMessage = 'Authentication failed';
                if (error.message.includes('Backend error: 429')) {
                    errorMessage = 'LinkedIn rate limit reached. Please wait a few minutes before trying again.';
                } else if (error.message.includes('Backend error: 500')) {
                    errorMessage = 'Server synchronization error. Please try again or contact support.';
                } else if (error.message) {
                    errorMessage = error.message;
                }

                setStatus(`Error: ${errorMessage}`);
                setTimeout(() => {
                    navigate('/login?error=auth_failed');
                }, 3000);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <div className="spinner"></div>
            <h2>{status}</h2>
            <style>{`.spinner { border: 4px solid #f3f3f3; border-top: 4px solid #0077B5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default LinkedInCallback;

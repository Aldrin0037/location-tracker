'use client';

import { useState, useEffect } from 'react';
import { setCookie, hasConsentCookie } from '../lib/utils';

interface CookieBannerProps {
  onAccept?: () => void;
}

export default function CookieBanner({ onAccept }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    // Check if consent is already given
    if (!hasConsentCookie()) {
      setIsVisible(true);
    }
  }, []);
  
  const handleAccept = () => {
    setIsClosing(true);
    setCookie('consent', 'accepted', 365);
    
    setTimeout(() => {
      setIsVisible(false);
      if (onAccept) {
        onAccept();
      }
    }, 300);
  };
  
  if (!isVisible) return null;
  
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md text-white py-4 px-6 z-50 transition-all duration-300 ${
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          🍪 This site uses cookies and collects data to provide you with the best experience. 
          By continuing, you agree to our data collection practices.
        </p>
        <button
          onClick={handleAccept}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}


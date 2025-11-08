'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CookieBanner from '../components/CookieBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { useCookieConsent } from '../hooks/useCookieConsent';

export default function SharePage() {
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const { hasConsent, giveConsent } = useCookieConsent();
  const { captureLocation, sendTrackingData } = useLocationTracking();
  
  useEffect(() => {
    if (hasConsent) {
      initializeTracking();
    }
  }, [hasConsent]);
  
  const initializeTracking = async () => {
    try {
      await captureLocation(window.location.href);
      await sendTrackingData('/api/track', window.location.href);
      setTimeout(() => setContentUnlocked(true), 2000);
    } catch (err) {
      setContentUnlocked(true);
    }
  };
  
  return (
    <Layout>
      <CookieBanner onAccept={() => giveConsent()} />
      
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            📽️ Shared Content
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View shared media
          </p>
        </header>
        
        {!contentUnlocked ? (
          <div className="card text-center">
            <LoadingSpinner text="Loading content..." />
          </div>
        ) : (
          <div className="card animate-fadeIn">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Content would be displayed here
              </p>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Shared Media Title
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                This is where embedded content or shared media would appear.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}


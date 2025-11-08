'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import EmbedContent from '../components/EmbedContent';
import LocationGate from '../components/LocationGate';

export default function SharePage() {
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const [pageConfig, setPageConfig] = useState<any>(null);
  
  useEffect(() => {
    loadPageConfig();
  }, []);
  
  const loadPageConfig = async () => {
    try {
      const response = await fetch('/api/page-config/share');
      const data = await response.json();
      
      if (data.success) {
        setPageConfig(data.page);
      }
    } catch (error) {
      console.error('Failed to load page config:', error);
    }
  };
  
  const config = pageConfig || {
    title: 'Shared Content 📽️',
    subtitle: 'View shared media',
    loadingText: 'Loading content...',
    content: {
      type: 'embed',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {!contentUnlocked ? (
          <LocationGate
            onUnlock={() => setContentUnlocked(true)}
            title="🔒 Shared Content Access"
            description="This shared content is location-protected. Share your location to unlock and view."
            pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
          />
        ) : (
          <>
            <header className="text-center mb-12 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {config.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {config.subtitle}
              </p>
            </header>
            
            <div className="animate-fadeIn">
              <EmbedContent
                embedUrl={config.content?.embedUrl}
                html={config.content?.html}
                title={config.title}
              />
              
              {config.content?.message && (
                <div className="card mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-200 text-center">
                    {config.content.message}
                  </p>
                </div>
              )}
            </div>
            
            <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Thank you for visiting!</p>
            </footer>
          </>
        )}
      </div>
    </Layout>
  );
}


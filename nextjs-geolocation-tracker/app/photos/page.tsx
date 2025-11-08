'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import LocationGate from '../components/LocationGate';
import { TrackingPage } from '../types';

export default function PhotosPage() {
  const [pageConfig, setPageConfig] = useState<TrackingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentUnlocked, setContentUnlocked] = useState(false);
  
  useEffect(() => {
    loadPageConfig();
  }, []);
  
  const loadPageConfig = async () => {
    try {
      const response = await fetch('/api/page-config/photos');
      const data = await response.json();
      
      if (data.success) {
        setPageConfig(data.page);
        document.title = data.page.title;
      } else {
        setError('Content not available');
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load content');
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (!pageConfig) return null;
    
    const { content } = pageConfig;
    
    if (content.type === 'photos' && content.items) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((item, index) => (
            <div key={index} className="card overflow-hidden animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {item.caption}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">Content type not supported</p>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading..." />
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {!contentUnlocked ? (
          <LocationGate
            onUnlock={() => setContentUnlocked(true)}
            title={pageConfig?.title ? `🔒 ${pageConfig.title}` : '🔒 Location Required'}
            description={pageConfig?.subtitle || 'This content is location-protected. Share your location to unlock and view.'}
            pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
          />
        ) : (
          <>
            <header className="text-center mb-12 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {pageConfig?.title || 'Loading...'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {pageConfig?.subtitle || 'Please wait...'}
              </p>
            </header>
            
            <div className="animate-fadeIn">
              {renderContent()}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}


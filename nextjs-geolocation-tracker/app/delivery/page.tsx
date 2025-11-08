'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import LocationGate from '../components/LocationGate';
import { TrackingPage } from '../types';

export default function DeliveryPage() {
  const [pageConfig, setPageConfig] = useState<TrackingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentUnlocked, setContentUnlocked] = useState(false);
  
  useEffect(() => {
    loadPageConfig();
  }, []);
  
  const loadPageConfig = async () => {
    try {
      const response = await fetch('/api/page-config/delivery');
      const data = await response.json();
      
      if (data.success) {
        setPageConfig(data.page);
        document.title = data.page.title;
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner text="Loading..." />
      </Layout>
    );
  }
  
  const content = pageConfig?.content;
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {!contentUnlocked ? (
          <LocationGate
            onUnlock={() => setContentUnlocked(true)}
            title="🔒 Package Delivery Tracking"
            description="Verify your location to access delivery details and tracking information."
            pageUrl={typeof window !== 'undefined' ? window.location.href : ''}
          />
        ) : (
          <>
            <header className="text-center mb-12 animate-fadeIn">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {pageConfig?.title || '📦 Package Delivery'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {pageConfig?.subtitle || 'Track your delivery'}
              </p>
            </header>
            
            {content?.type === 'delivery' ? (
          <div className="card animate-fadeIn">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600 dark:text-gray-400">Tracking Number</span>
                <span className="font-mono font-semibold">{content.trackingNumber}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {content.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-600 dark:text-gray-400">Estimated Arrival</span>
                <span className="font-semibold">{content.estimatedTime}</span>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <p className="text-amber-800 dark:text-amber-200">
                  📦 {content.message}
                </p>
              </div>
              
              <button className="w-full btn-primary">
                Confirm Receipt
              </button>
            </div>
          </div>
            ) : (
              <div className="card">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Delivery information not available
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}


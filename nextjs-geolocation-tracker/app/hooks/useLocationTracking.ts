'use client';

import { useState, useEffect } from 'react';
import { DeviceInfo } from '../types';

interface LocationState {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  error?: string;
  isLoading: boolean;
}

export function useLocationTracking(autoStart: boolean = false) {
  const [locationState, setLocationState] = useState<LocationState>({
    isLoading: false
  });
  
  const captureLocation = async (pageUrl?: string): Promise<boolean> => {
    setLocationState({ isLoading: true });
    
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setLocationState({
          isLoading: false,
          error: 'Geolocation is not supported by your browser'
        });
        resolve(false);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            isLoading: false
          };
          
          setLocationState(locationData);
          resolve(true);
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          setLocationState({
            isLoading: false,
            error: errorMessage
          });
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };
  
  const sendTrackingData = async (endpoint: string = '/api/track', pageUrl?: string) => {
    try {
      const deviceInfo: DeviceInfo = {
        fingerprint: generateFingerprint(),
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: locationState.latitude,
          longitude: locationState.longitude,
          accuracy: locationState.accuracy,
          altitude: locationState.altitude,
          heading: locationState.heading,
          speed: locationState.speed,
          timestamp: new Date().toISOString(),
          deviceInfo,
          pageUrl: pageUrl || window.location.href,
          referrer: document.referrer,
          gpsError: locationState.error
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending tracking data:', error);
      return { success: false, error: 'Failed to send tracking data' };
    }
  };
  
  useEffect(() => {
    if (autoStart) {
      captureLocation();
    }
  }, [autoStart]);
  
  return {
    ...locationState,
    captureLocation,
    sendTrackingData
  };
}

function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    canvas.toDataURL()
  ].join('|||');
  
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}


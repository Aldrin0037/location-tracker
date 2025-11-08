'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Track } from '../types';

interface UseRealTimeTrackingOptions {
  pollingInterval?: number; // in milliseconds
  autoStart?: boolean;
}

export function useRealTimeTracking(options: UseRealTimeTrackingOptions = {}) {
  const { pollingInterval = 5000, autoStart = false } = options;
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isTracking, setIsTracking] = useState(autoStart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTracks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/tracks', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }

      const data = await response.json();

      if (data.success) {
        setTracks(data.tracks);
        setLastUpdate(new Date());
      } else {
        throw new Error(data.message || 'Failed to fetch tracks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching tracks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startTracking = useCallback(() => {
    if (isTracking) return;

    setIsTracking(true);
    fetchTracks(); // Fetch immediately

    intervalRef.current = setInterval(() => {
      fetchTracks();
    }, pollingInterval);
  }, [isTracking, fetchTracks, pollingInterval]);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoStart, startTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    tracks,
    isTracking,
    isLoading,
    error,
    lastUpdate,
    startTracking,
    stopTracking,
    refresh
  };
}

// Hook for live location updates (using Geolocation API)
export function useLiveLocation(options: { enableHighAccuracy?: boolean; timeout?: number } = {}) {
  const { enableHighAccuracy = true, timeout = 10000 } = options;
  
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsWatching(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition(pos);
        setError(null);
      },
      (err) => {
        setError(err.message);
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge: 0
      }
    );
  }, [enableHighAccuracy, timeout]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsWatching(false);
  }, []);

  const getCurrentPosition = useCallback(async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos);
          resolve(pos);
        },
        (err) => {
          setError(err.message);
          reject(err);
        },
        {
          enableHighAccuracy,
          timeout
        }
      );
    });
  }, [enableHighAccuracy, timeout]);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    position,
    error,
    isWatching,
    startWatching,
    stopWatching,
    getCurrentPosition
  };
}


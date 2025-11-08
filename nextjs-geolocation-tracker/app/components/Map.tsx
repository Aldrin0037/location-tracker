'use client';

import { useEffect, useRef, useState } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    label?: string;
    color?: string;
  }>;
  height?: string;
  className?: string;
}

export default function Map({
  latitude,
  longitude,
  zoom = 13,
  markers = [],
  height = '400px',
  className = ''
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && (window as any).google) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps');
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      const google = (window as any).google;
      
      // Initialize map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add main marker
      new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Current Location',
        animation: google.maps.Animation.DROP
      });

      // Add additional markers
      markers.forEach((marker, index) => {
        new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: map,
          label: marker.label || `${index + 1}`,
          title: marker.label || `Location ${index + 1}`
        });
      });

      // Fit bounds if multiple markers
      if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend({ lat: latitude, lng: longitude });
        markers.forEach(marker => {
          bounds.extend({ lat: marker.lat, lng: marker.lng });
        });
        map.fitBounds(bounds);
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, [isLoaded, latitude, longitude, zoom, markers]);

  // Fallback to OpenStreetMap if Google Maps fails or no API key
  if (error || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`relative ${className}`} style={{ height }}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
          className="rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-700"
          >
            View Larger Map
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-lg ${className}`}
      style={{ height }}
    >
      {!isLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}


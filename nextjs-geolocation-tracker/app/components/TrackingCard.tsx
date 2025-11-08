'use client';

import { Track } from '../types';
import { useState } from 'react';
import Map from './Map';

interface TrackingCardProps {
  track: Track;
  showMap?: boolean;
  onDelete?: (id: string) => void;
}

export default function TrackingCard({ track, showMap = false, onDelete }: TrackingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasGPS = track.latitude && track.longitude;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDate(track.timestamp);

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {hasGPS ? '📍' : '🌐'}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {hasGPS ? 'GPS Location' : 'IP Location'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {date} at {time}
              </p>
            </div>
          </div>
        </div>
        
        {onDelete && (
          <button
            onClick={() => onDelete(track.id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Delete track"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Location Info */}
      <div className="space-y-3">
        {/* IP Address */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-medium w-24">
            IP Address:
          </span>
          <span className="text-gray-800 dark:text-gray-200 text-sm font-mono">
            {track.clientIP}
          </span>
        </div>

        {/* IP Location */}
        {track.ipLocation && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium w-24">
              IP Location:
            </span>
            <span className="text-gray-800 dark:text-gray-200 text-sm">
              {track.ipLocation.city}, {track.ipLocation.region}, {track.ipLocation.country}
            </span>
          </div>
        )}

        {/* GPS Coordinates */}
        {hasGPS && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium w-24">
              GPS:
            </span>
            <span className="text-gray-800 dark:text-gray-200 text-sm font-mono">
              {track.latitude?.toFixed(6)}, {track.longitude?.toFixed(6)}
            </span>
          </div>
        )}

        {/* Accuracy */}
        {track.accuracy && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium w-24">
              Accuracy:
            </span>
            <span className="text-gray-800 dark:text-gray-200 text-sm">
              ±{Math.round(track.accuracy)}m
            </span>
          </div>
        )}

        {/* User Agent */}
        {track.deviceInfo?.userAgent && (
          <div className="flex items-start gap-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium w-24 flex-shrink-0">
              Device:
            </span>
            <span className="text-gray-800 dark:text-gray-200 text-sm break-all">
              {track.deviceInfo.userAgent.length > 80 && !isExpanded
                ? `${track.deviceInfo.userAgent.substring(0, 80)}...`
                : track.deviceInfo.userAgent}
            </span>
          </div>
        )}

        {track.deviceInfo?.userAgent && track.deviceInfo.userAgent.length > 80 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Map */}
      {showMap && hasGPS && (
        <div className="mt-4">
          <Map
            latitude={track.latitude!}
            longitude={track.longitude!}
            height="250px"
          />
        </div>
      )}

      {/* Actions */}
      {hasGPS && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href={`https://www.google.com/maps?q=${track.latitude},${track.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            <span>🗺️</span>
            <span>View on Google Maps</span>
            <span>↗</span>
          </a>
        </div>
      )}
    </div>
  );
}


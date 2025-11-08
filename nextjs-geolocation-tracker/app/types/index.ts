// Type definitions for the Geolocation Tracker application

export interface IPLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  isp: string;
}

export interface DeviceInfo {
  fingerprint: string;
  platform?: string;
  userAgent?: string;
  language?: string;
  screenResolution?: string;
  timezone?: string;
}

export interface TrackData {
  id?: string;
  clientIP: string;
  ipLocation: IPLocation | null;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: string;
  deviceInfo?: DeviceInfo;
  pageUrl?: string;
  referrer?: string;
  gpsError?: string;
}

export interface Track extends TrackData {
  id: string;
  timestamp: string;
}

export interface PageContent {
  type: 'photos' | 'delivery' | 'embed' | 'custom';
  items?: Array<{
    url: string;
    caption: string;
    description: string;
  }>;
  trackingNumber?: string;
  status?: string;
  estimatedTime?: string;
  message?: string;
  embedUrl?: string;
  html?: string;
}

export interface TrackingPage {
  enabled: boolean;
  url: string;
  theme: string;
  title: string;
  subtitle: string;
  loadingText: string;
  content: PageContent;
  embedCode?: string | null;
}

export interface Config {
  trackingPages: Record<string, TrackingPage>;
}

export interface TrackingStats {
  totalTracks: number;
  last24Hours: number;
  uniqueIPs: number;
  gpsEnabled: number;
  avgAccuracy: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AdminStats {
  totalTracks: number;
  last24Hours: number;
  uniqueIPs: number;
  gpsEnabled: number;
}


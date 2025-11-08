// Utility functions for the Geolocation Tracker

import { Config } from '../types';
import { promises as fs } from 'fs';
import path from 'path';
import { headers } from 'next/headers';

const CONFIG_FILE = path.join(process.cwd(), 'config.json');

// Extract client IP from request headers
export function getClientIP(request?: Request): string {
  if (!request) {
    return 'Unknown';
  }

  // In Next.js API routes, we can use headers() function
  try {
    const headersList = headers();
    
    // Check various headers that might contain the real IP
    const forwarded = headersList.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    const realIp = headersList.get('x-real-ip');
    if (realIp) {
      return realIp;
    }
    
    // Fallback options
    const cfConnectingIp = headersList.get('cf-connecting-ip'); // Cloudflare
    if (cfConnectingIp) {
      return cfConnectingIp;
    }
    
    const trueClientIp = headersList.get('true-client-ip'); // Cloudflare/Akamai
    if (trueClientIp) {
      return trueClientIp;
    }
    
    return 'Unknown';
  } catch (error) {
    console.error('Error extracting IP:', error);
    return 'Unknown';
  }
}

// Load configuration from config.json
export async function loadConfig(): Promise<Config> {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    const config: Config = JSON.parse(data);
    return config;
  } catch (error) {
    console.error('Failed to load config:', error);
    return { trackingPages: {} };
  }
}

// Save configuration to config.json
export async function saveConfig(config: Config): Promise<boolean> {
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('✅ Configuration saved');
    return true;
  } catch (error) {
    console.error('Failed to save config:', error);
    return false;
  }
}

// Get page configuration by URL path
export async function getPageConfig(pagePath: string): Promise<any> {
  const config = await loadConfig();
  
  if (!config || !config.trackingPages) {
    return null;
  }
  
  // Find matching page configuration
  const page = Object.values(config.trackingPages).find(p => p.url === pagePath);
  
  if (!page || !page.enabled) {
    return null;
  }
  
  return page;
}

// Validate admin credentials
export function validateAdminCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  return username === adminUsername && password === adminPassword;
}

// Generate device fingerprint (client-side utility)
export function generateDeviceFingerprint(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  
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
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
}

// Format timestamp for display
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Rate limiting helper (in-memory store for demo)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 5 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up expired rate limit records
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}

// Set cookie (client-side utility)
export function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Get cookie (client-side utility)
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Check if cookie consent is given
export function hasConsentCookie(): boolean {
  return getCookie('consent') === 'accepted';
}


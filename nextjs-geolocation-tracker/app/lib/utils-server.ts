// Server-side utility functions (Node.js only)

import { Config } from '../types';
import { promises as fs } from 'fs';
import path from 'path';
import { headers } from 'next/headers';

const CONFIG_FILE = path.join(process.cwd(), 'config.json');

// Extract client IP from request headers
export async function getClientIP(request?: Request): Promise<string> {
  if (!request) {
    return 'Unknown';
  }

  // In Next.js API routes, we can use headers() function
  try {
    const headersList = await headers();
    
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
  const adminUsername = process.env.ADMIN_USERNAME || 'Aldrin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Aldrin0921!';
  
  return username === adminUsername && password === adminPassword;
}


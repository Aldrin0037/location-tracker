// Database module for Geolocation Tracker (TypeScript)
// Uses JSON file storage for development/demo purposes
// For production, consider using PostgreSQL, MongoDB, or Supabase

import { promises as fs } from 'fs';
import path from 'path';
import { Track, TrackData, AdminStats } from '../types';

const DB_FILE = path.join(process.cwd(), 'tracking-data.json');

interface Database {
  tracks: Track[];
}

// Initialize database file if it doesn't exist
export async function initializeDatabase(): Promise<void> {
  try {
    await fs.access(DB_FILE);
  } catch {
    // File doesn't exist, create it
    await fs.writeFile(DB_FILE, JSON.stringify({ tracks: [] }, null, 2));
    console.log('📊 Database initialized');
  }
}

// Read all tracking data
export async function getAllTracks(): Promise<Track[]> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const db: Database = JSON.parse(data);
    return db.tracks;
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

// Add a new tracking entry
export async function addTrack(trackData: TrackData): Promise<{ success: boolean; trackingId?: string; error?: string }> {
  try {
    await initializeDatabase();
    const data = await fs.readFile(DB_FILE, 'utf8');
    const db: Database = JSON.parse(data);
    
    // Generate unique ID
    const trackId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTrack: Track = {
      id: trackId,
      timestamp: new Date().toISOString(),
      ...trackData
    };
    
    db.tracks.push(newTrack);
    
    // Write back to file
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    
    console.log(`✅ Track saved: ${trackId}`);
    return { success: true, trackingId: trackId };
  } catch (error: any) {
    console.error('Error saving track:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

// Get tracks by device fingerprint
export async function getTracksByFingerprint(fingerprint: string): Promise<Track[]> {
  const tracks = await getAllTracks();
  return tracks.filter(track => 
    track.deviceInfo && track.deviceInfo.fingerprint === fingerprint
  );
}

// Get recent tracks (last N)
export async function getRecentTracks(limit: number = 50): Promise<Track[]> {
  const tracks = await getAllTracks();
  return tracks
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// Get tracks within date range
export async function getTracksByDateRange(startDate: Date, endDate: Date): Promise<Track[]> {
  const tracks = await getAllTracks();
  return tracks.filter(track => {
    const trackDate = new Date(track.timestamp);
    return trackDate >= new Date(startDate) && trackDate <= new Date(endDate);
  });
}

// Delete old tracks (data retention)
export async function deleteOldTracks(daysOld: number = 90): Promise<{ deleted: number; error?: string }> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const db: Database = JSON.parse(data);
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const originalCount = db.tracks.length;
    db.tracks = db.tracks.filter(track => 
      new Date(track.timestamp) > cutoffDate
    );
    
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    
    const deletedCount = originalCount - db.tracks.length;
    console.log(`🗑️ Deleted ${deletedCount} old tracks`);
    
    return { deleted: deletedCount };
  } catch (error: any) {
    console.error('Error deleting old tracks:', error);
    return { deleted: 0, error: error?.message || 'Unknown error' };
  }
}

// Get statistics
export async function getStats(): Promise<AdminStats> {
  const tracks = await getAllTracks();
  
  // Calculate unique IPs
  const uniqueIPs = new Set(tracks.map(t => t.clientIP)).size;
  
  // Tracks with GPS
  const gpsEnabled = tracks.filter(t => t.latitude && t.longitude).length;
  
  // Last 24 hours
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);
  const last24Hours = tracks.filter(t => new Date(t.timestamp) > oneDayAgo).length;
  
  return {
    totalTracks: tracks.length,
    uniqueIPs,
    gpsEnabled,
    last24Hours
  };
}

// Export all data as JSON
export async function exportData(): Promise<Track[]> {
  return await getAllTracks();
}

// Alias for getAllTracks (used by analytics API)
export async function readTracks(): Promise<Track[]> {
  return await getAllTracks();
}

// Clear all tracking data
export async function clearAllTracks(): Promise<{ success: boolean; error?: string }> {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify({ tracks: [] }, null, 2));
    console.log('🗑️ All tracking data cleared');
    return { success: true };
  } catch (error: any) {
    console.error('Error clearing tracks:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

// Initialize database on module load (for server-side only)
if (typeof window === 'undefined') {
  initializeDatabase().catch(console.error);
}


// Simple JSON-based database for development
// For production, replace with MongoDB, PostgreSQL, etc.

const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, 'tracking-data.json');

// Initialize database file if it doesn't exist
async function initializeDatabase() {
    try {
        await fs.access(DB_FILE);
    } catch {
        // File doesn't exist, create it
        await fs.writeFile(DB_FILE, JSON.stringify({ tracks: [] }, null, 2));
        console.log('📊 Database initialized');
    }
}

// Read all tracking data
async function getAllTracks() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        return JSON.parse(data).tracks;
    } catch (error) {
        console.error('Error reading database:', error);
        return [];
    }
}

// Add a new tracking entry
async function addTrack(trackData) {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        const db = JSON.parse(data);
        
        // Generate unique ID
        const trackId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newTrack = {
            id: trackId,
            timestamp: new Date().toISOString(),
            ...trackData
        };
        
        db.tracks.push(newTrack);
        
        // Write back to file
        await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
        
        console.log(`✅ Track saved: ${trackId}`);
        return { success: true, trackingId: trackId };
    } catch (error) {
        console.error('Error saving track:', error);
        return { success: false, error: error.message };
    }
}

// Get tracks by device fingerprint
async function getTracksByFingerprint(fingerprint) {
    const tracks = await getAllTracks();
    return tracks.filter(track => 
        track.deviceInfo && track.deviceInfo.fingerprint === fingerprint
    );
}

// Get recent tracks (last N)
async function getRecentTracks(limit = 50) {
    const tracks = await getAllTracks();
    return tracks
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

// Get tracks within date range
async function getTracksByDateRange(startDate, endDate) {
    const tracks = await getAllTracks();
    return tracks.filter(track => {
        const trackDate = new Date(track.timestamp);
        return trackDate >= new Date(startDate) && trackDate <= new Date(endDate);
    });
}

// Delete old tracks (data retention)
async function deleteOldTracks(daysOld = 90) {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        const db = JSON.parse(data);
        
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
    } catch (error) {
        console.error('Error deleting old tracks:', error);
        return { error: error.message };
    }
}

// Get statistics
async function getStats() {
    const tracks = await getAllTracks();
    
    const uniqueDevices = new Set(
        tracks
            .filter(t => t.deviceInfo && t.deviceInfo.fingerprint)
            .map(t => t.deviceInfo.fingerprint)
    ).size;
    
    const tracksWithGPS = tracks.filter(t => t.latitude && t.longitude).length;
    const tracksIPOnly = tracks.length - tracksWithGPS;
    
    return {
        totalTracks: tracks.length,
        uniqueDevices,
        tracksWithGPS,
        tracksIPOnly,
        gpsSuccessRate: tracks.length > 0 ? ((tracksWithGPS / tracks.length) * 100).toFixed(1) : 0
    };
}

// Export all data as JSON
async function exportData() {
    const tracks = await getAllTracks();
    return tracks;
}

// Initialize on module load
initializeDatabase();

module.exports = {
    getAllTracks,
    addTrack,
    getTracksByFingerprint,
    getRecentTracks,
    getTracksByDateRange,
    deleteOldTracks,
    getStats,
    exportData
};


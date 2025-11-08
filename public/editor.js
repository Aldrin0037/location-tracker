// Content Editor JavaScript

let currentConfig = null;
let currentPageKey = null;

// Load configuration on page load
async function loadConfig() {
    try {
        const response = await fetch('/api/admin/config');
        const data = await response.json();
        
        if (data.success) {
            currentConfig = data.config;
            renderPages();
        } else {
            showError('Failed to load configuration');
        }
    } catch (error) {
        showError('Error loading configuration: ' + error.message);
    }
}

// Render all pages
function renderPages() {
    const grid = document.getElementById('pagesGrid');
    grid.innerHTML = '';
    
    if (!currentConfig || !currentConfig.trackingPages) {
        grid.innerHTML = '<p>No pages configured</p>';
        return;
    }
    
    Object.entries(currentConfig.trackingPages).forEach(([key, page]) => {
        const card = createPageCard(key, page);
        grid.appendChild(card);
    });
}

// Create page card
function createPageCard(key, page) {
    const card = document.createElement('div');
    card.className = 'page-card';
    
    const statusBadge = page.enabled 
        ? '<span class="badge badge-success">Active</span>'
        : '<span class="badge badge-warning">Disabled</span>';
    
    card.innerHTML = `
        <h3>
            ${getThemeIcon(page.theme)} ${page.title}
            ${statusBadge}
        </h3>
        <div class="page-url">${page.url}</div>
        <div class="page-info">
            <p><strong>Theme:</strong> ${formatTheme(page.theme)}</p>
            <p><strong>Type:</strong> ${page.content.type}</p>
            ${page.enabled ? `<p><strong>Share URL:</strong> https://your-domain.com${page.url}</p>` : ''}
        </div>
        <div class="page-actions">
            <button class="btn btn-primary btn-small" onclick="editPage('${key}')">
                ✏️ Edit
            </button>
            <button class="btn btn-secondary btn-small" onclick="togglePage('${key}')">
                ${page.enabled ? '❌ Disable' : '✅ Enable'}
            </button>
            ${page.enabled ? `
                <button class="btn btn-secondary btn-small" onclick="copyURL('${page.url}')">
                    📋 Copy URL
                </button>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Get theme icon
function getThemeIcon(theme) {
    const icons = {
        gallery: '📸',
        delivery: '📦',
        video: '🎥',
        custom: '⚙️'
    };
    return icons[theme] || '📄';
}

// Format theme name
function formatTheme(theme) {
    const names = {
        gallery: 'Photo Gallery',
        delivery: 'Package Delivery',
        video: 'Video/Embed',
        custom: 'Custom HTML'
    };
    return names[theme] || theme;
}

// Edit page
function editPage(key) {
    currentPageKey = key;
    const page = currentConfig.trackingPages[key];
    
    document.getElementById('pageKey').value = key;
    document.getElementById('pageEnabled').checked = page.enabled;
    document.getElementById('pageUrl').value = page.url;
    document.getElementById('pageTitle').value = page.title;
    document.getElementById('pageSubtitle').value = page.subtitle;
    document.getElementById('pageLoadingText').value = page.loadingText;
    document.getElementById('pageTheme').value = page.theme;
    document.getElementById('pageEmbedCode').value = page.embedCode || '';
    
    updateThemeFields(page);
    
    document.getElementById('editModal').style.display = 'block';
}

// Update theme-specific fields
function updateThemeFields(existingPage = null) {
    const theme = document.getElementById('pageTheme').value;
    const themeFields = document.getElementById('themeFields');
    
    const page = existingPage || (currentPageKey ? currentConfig.trackingPages[currentPageKey] : null);
    
    if (theme === 'gallery') {
        themeFields.innerHTML = `
            <div class="form-group">
                <label>Photo URLs (one per line)</label>
                <textarea id="photoUrls" rows="6" placeholder="https://example.com/photo1.jpg">${page && page.content.items ? page.content.items.map(item => item.url).join('\n') : ''}</textarea>
                <div class="form-hint">Enter image URLs (Unsplash, Imgur, your own hosting, etc.)</div>
            </div>
            <div class="form-group">
                <label>Photo Captions (one per line, match photo count)</label>
                <textarea id="photoCaptions" rows="6" placeholder="Summer Vacation 🌞">${page && page.content.items ? page.content.items.map(item => item.caption).join('\n') : ''}</textarea>
            </div>
        `;
    } else if (theme === 'delivery') {
        const content = page ? page.content : {};
        themeFields.innerHTML = `
            <div class="form-group">
                <label>Tracking Number</label>
                <input type="text" id="trackingNumber" value="${content.trackingNumber || 'TD-2024-112358'}" placeholder="TD-2024-112358">
            </div>
            <div class="form-group">
                <label>Delivery Status</label>
                <input type="text" id="deliveryStatus" value="${content.status || 'Out for Delivery'}" placeholder="Out for Delivery">
            </div>
            <div class="form-group">
                <label>Estimated Time</label>
                <input type="text" id="estimatedTime" value="${content.estimatedTime || 'Today by 5:00 PM'}" placeholder="Today by 5:00 PM">
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea id="deliveryMessage" rows="3">${content.message || 'Your package is on the way!'}</textarea>
            </div>
        `;
    } else if (theme === 'video') {
        const content = page ? page.content : {};
        themeFields.innerHTML = `
            <div class="form-group">
                <label>Video/Embed URL</label>
                <input type="text" id="embedUrl" value="${content.embedUrl || ''}" placeholder="https://www.youtube.com/embed/...">
                <div class="form-hint">YouTube embed URL, Vimeo, etc.</div>
            </div>
        `;
    } else if (theme === 'custom') {
        const content = page ? page.content : {};
        themeFields.innerHTML = `
            <div class="form-group">
                <label>Custom HTML Content</label>
                <textarea id="customHTML" rows="10" placeholder="<h2>Your Custom HTML</h2><p>Any HTML content here!</p>">${content.html || ''}</textarea>
                <div class="form-hint">Add any HTML content - text, images, videos, etc.</div>
            </div>
        `;
    }
}

// Toggle page enabled/disabled
async function togglePage(key) {
    currentConfig.trackingPages[key].enabled = !currentConfig.trackingPages[key].enabled;
    await saveConfig();
}

// Copy URL to clipboard
function copyURL(url) {
    const fullURL = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullURL).then(() => {
        showSuccess(`URL copied: ${fullURL}`);
    }).catch(err => {
        showError('Failed to copy URL');
    });
}

// Close modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentPageKey = null;
}

// Handle form submission
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const key = document.getElementById('pageKey').value;
    const theme = document.getElementById('pageTheme').value;
    
    // Build content object based on theme
    let content = {};
    
    if (theme === 'gallery') {
        const urls = document.getElementById('photoUrls').value.split('\n').filter(u => u.trim());
        const captions = document.getElementById('photoCaptions').value.split('\n').filter(c => c.trim());
        
        content = {
            type: 'photos',
            items: urls.map((url, i) => ({
                url: url.trim(),
                caption: captions[i] || 'Photo',
                description: captions[i] || 'Photo'
            }))
        };
    } else if (theme === 'delivery') {
        content = {
            type: 'delivery',
            trackingNumber: document.getElementById('trackingNumber').value,
            status: document.getElementById('deliveryStatus').value,
            estimatedTime: document.getElementById('estimatedTime').value,
            message: document.getElementById('deliveryMessage').value
        };
    } else if (theme === 'video') {
        content = {
            type: 'embed',
            embedUrl: document.getElementById('embedUrl').value
        };
    } else if (theme === 'custom') {
        content = {
            type: 'custom',
            html: document.getElementById('customHTML').value
        };
    }
    
    // Update configuration
    currentConfig.trackingPages[key] = {
        enabled: document.getElementById('pageEnabled').checked,
        url: document.getElementById('pageUrl').value,
        theme: theme,
        title: document.getElementById('pageTitle').value,
        subtitle: document.getElementById('pageSubtitle').value,
        loadingText: document.getElementById('pageLoadingText').value,
        content: content,
        embedCode: document.getElementById('pageEmbedCode').value || null
    };
    
    await saveConfig();
    closeModal();
});

// Save configuration
async function saveConfig() {
    try {
        const response = await fetch('/api/admin/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ config: currentConfig })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Configuration saved successfully!');
            renderPages();
        } else {
            showError('Failed to save configuration');
        }
    } catch (error) {
        showError('Error saving configuration: ' + error.message);
    }
}

// Show success message
function showSuccess(message) {
    const el = document.getElementById('successMessage');
    el.textContent = '✅ ' + message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

// Show error message
function showError(message) {
    const el = document.getElementById('errorMessage');
    el.textContent = '❌ ' + message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Initialize
loadConfig();


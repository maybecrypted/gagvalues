let currentPage = 'stocks';
let stockData = null;
let previousStockData = null;
let weatherData = null;
let valuesData = null;
let lastUpdated = null;
let countdownInterval = null;
let stockCheckInterval = null;
let weatherCountdownInterval = null;

// Generate dynamic image ID based on item name
function generateImageId(itemName) {
    return itemName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

// Generate dynamic image URL
function getDynamicImageUrl(itemName) {
    const imageId = generateImageId(itemName);
    return `https://api.joshlei.com/v2/growagarden/image/${imageId}`;
}

// Fetch item info from API
async function fetchItemInfo(itemName) {
    try {
        const itemId = generateImageId(itemName);
        const response = await fetch(`https://api.joshlei.com/v2/growagarden/info/${itemId}`);
        
        if (!response.ok) {
            console.warn(`Info not found for ${itemName} (${itemId})`);
            return `No description available for ${itemName}`;
        }
        
        const data = await response.json();
        return data.description || `No description available for ${itemName}`;
    } catch (error) {
        console.warn(`Error fetching info for ${itemName}:`, error);
        return `No description available for ${itemName}`;
    }
}

// Show/hide controls based on current page
function updateControlsVisibility() {
    const controls = document.getElementById('controls');
    if (controls) {
        if (currentPage === 'stocks') {
            controls.classList.remove('hidden');
        } else {
            controls.classList.add('hidden');
        }
    }
}

// Page switching with proper cleanup
function switchPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    // Show selected page
    document.getElementById(page + '-page').classList.add('active');
    event.target.classList.add('active');
    
    currentPage = page;
    
    // Update controls visibility
    updateControlsVisibility();
    
    // Clean up intervals
    cleanupIntervals();
    
    // Load data based on current page
    switch (page) {
        case 'stocks':
            if (!stockData) {
                loadStockData();
            } else {
                updateStockDisplay();
                updateStockCountdowns();
                updateStockSectionCountdowns();
            }
            startStockMonitoring();
            break;
        case 'weather':
            if (!weatherData) {
                loadWeatherData();
            } else {
                updateWeatherDisplay();
                startWeatherCountdowns();
            }
            break;
        case 'values':
            if (!valuesData) {
                loadValuesData();
            } else {
                updateValuesDisplay();
            }
            break;
    }
}

// Clean up all intervals
function cleanupIntervals() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    if (stockCheckInterval) {
        clearInterval(stockCheckInterval);
        stockCheckInterval = null;
    }
    if (weatherCountdownInterval) {
        clearInterval(weatherCountdownInterval);
        weatherCountdownInterval = null;
    }
}

// Refresh current page
function refresh() {
    switch (currentPage) {
        case 'stocks':
            loadStockData();
            break;
        case 'weather':
            loadWeatherData();
            break;
        case 'values':
            loadValuesData();
            break;
    }
}

// Load stock data with error handling
async function loadStockData() {
    previousStockData = stockData;
    
    try {
        const response = await fetch('https://api.joshlei.com/v2/growagarden/stock');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        stockData = await response.json();
        lastUpdated = new Date();
        
        if (hasStockChanged(previousStockData, stockData)) {
            updateStockDisplay();
        }
        
        updateLastUpdatedText();
        
    } catch (error) {
        console.error('Stock data load error:', error);
        showError('stock', error.message);
    }
}

// Check if stock data has actually changed
function hasStockChanged(oldData, newData) {
    if (!oldData || !newData) return true;
    
    const categories = ['seed_stock', 'gear_stock', 'egg_stock', 'cosmetic_stock'];
    
    for (const category of categories) {
        const oldItems = oldData[category] || [];
        const newItems = newData[category] || [];
        
        if (oldItems.length !== newItems.length) return true;
        
        for (let i = 0; i < oldItems.length; i++) {
            if (oldItems[i].quantity !== newItems[i].quantity ||
                oldItems[i].display_name !== newItems[i].display_name) {
                return true;
            }
        }
    }
    
    return false;
}

// Start intelligent stock monitoring
function startStockMonitoring() {
    stockCheckInterval = setInterval(() => {
        if (currentPage === 'stocks') {
            loadStockData();
        }
    }, 30000);
}

// Load weather data
async function loadWeatherData() {
    try {
        const response = await fetch('https://api.joshlei.com/v2/growagarden/weather');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        weatherData = await response.json();
        lastUpdated = new Date();
        
        updateWeatherDisplay();
        startWeatherCountdowns();
        
    } catch (error) {
        console.error('Weather data load error:', error);
        showError('weather', error.message);
    }
}

// Load values data with API info integration
async function loadValuesData() {
    try {
        // Show loading state
        const container = document.getElementById('values-content');
        if (container) {
            container.innerHTML = '<div class="loading">Loading values data and fetching descriptions...</div>';
        }
        
        const response = await fetch('./values-database.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const rawData = await response.json();
        
        // Fetch info for each item from the API
        const itemsWithInfo = await Promise.all(
            rawData.map(async (item) => {
                const info = await fetchItemInfo(item.name);
                return {
                    ...item,
                    info: info,
                    image: getDynamicImageUrl(item.name)
                };
            })
        );
        
        valuesData = itemsWithInfo;
        lastUpdated = new Date();
        
        updateValuesDisplay();
        
    } catch (error) {
        console.error('Values data load error:', error);
        showError('values', error.message);
    }
}

// Update stock display with smooth animations
function updateStockDisplay() {
    if (!stockData) return;
    
    updateStockSection('seed', stockData.seed_stock);
    updateStockSection('gear', stockData.gear_stock);
    updateStockSection('egg', stockData.egg_stock);
    updateStockSection('cosmetic', stockData.cosmetic_stock);
}

function updateStockSection(type, items) {
    const itemsContainer = document.getElementById(type + '-items');
    const countElement = document.getElementById(type + '-count');
    
    if (!itemsContainer || !countElement) return;
    
    countElement.textContent = `${items.length} items`;
    
    itemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        itemsContainer.innerHTML = '<div class="empty">No items available</div>';
        return;
    }
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <img class="item-icon" 
                 src="${item.icon}" 
                 alt="${item.display_name}"
                 loading="lazy"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzBGMEYwRiIvPjxwYXRoIGQ9Ik0xNiAxMFYyMk0xMCAxNkgyMiIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4='">
            <div class="item-details">
                <div class="item-name">${item.display_name}</div>
                <div class="item-quantity">${item.quantity.toLocaleString()} available</div>
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });
}

// Update weather display
function updateWeatherDisplay() {
    if (!weatherData) return;
    
    const activeWeather = weatherData.weather.filter(w => w.active);
    const allWeather = weatherData.weather;
    
    updateWeatherSection('active-weather', activeWeather, true);
    updateWeatherSection('all-weather', allWeather, false);
}

function updateWeatherSection(type, items, isActive) {
    const itemsContainer = document.getElementById(type + '-items');
    const countElement = document.getElementById(type + '-count');
    
    if (!itemsContainer || !countElement) return;
    
    countElement.textContent = `${items.length} ${isActive ? 'active' : 'events'}`;
    
    itemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        itemsContainer.innerHTML = `<div class="empty">No ${isActive ? 'active weather' : 'weather events'}</div>`;
        return;
    }
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = item.active ? 'item weather-item active' : 'item weather-item';
        
        let durationText = '';
        if (isActive && item.active && item.end_duration_unix) {
            const countdownId = `weather-countdown-${item.weather_name.replace(/\s+/g, '-')}`;
            durationText = `<div class="weather-duration" id="${countdownId}">Time left: ${formatTimeLeft(item.end_duration_unix)}</div>`;
        } else if (item.duration && item.duration > 0) {
            durationText = `<div class="weather-duration">Duration: ${formatDuration(item.duration)}</div>`;
        }
        
        itemElement.innerHTML = `
            <img class="item-icon" 
                 src="${item.icon}" 
                 alt="${item.weather_name}"
                 loading="lazy"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzBGMEYwRiIvPjxwYXRoIGQ9Ik0xOCAxMGgtMS4yNkE4IDggMCAxIDAgOSAyMGg5YTUgNSAwIDAgMCAwLTEweiIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4='">
            <div class="item-details">
                <div class="item-name">${item.weather_name}</div>
                <div class="weather-status ${item.active ? 'weather-active' : 'weather-inactive'}">
                    ${item.active ? 'Active' : 'Inactive'}
                </div>
                ${durationText}
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });
}

// Start weather countdowns
function startWeatherCountdowns() {
    if (weatherCountdownInterval) {
        clearInterval(weatherCountdownInterval);
    }

    weatherCountdownInterval = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        if (!weatherData || !Array.isArray(weatherData.weather)) return;

        weatherData.weather.forEach(item => {
            if (item.active && item.end_duration_unix) {
                const id = `weather-countdown-${item.weather_name.replace(/\s+/g, '-')}`;
                const el = document.getElementById(id);
                if (el) {
                    const timeLeft = item.end_duration_unix - now;
                    if (timeLeft <= 0) {
                        el.textContent = "Time left: Ending soon";
                    } else {
                        el.textContent = `Time left: ${formatDuration(timeLeft)}`;
                    }
                }
            }
        });
    }, 1000);
}

// Update values display with proper image handling
function updateValuesDisplay() {
    if (!valuesData) return;
    
    const container = document.getElementById('values-content');
    container.innerHTML = '';
    
    if (valuesData.length === 0) {
        container.innerHTML = '<div class="empty">No value data available</div>';
        return;
    }
    
    valuesData.forEach(item => {
        const cardElement = document.createElement('div');
        cardElement.className = 'value-card';
        
        // Create image container with placeholder
        const imageContainer = document.createElement('div');
        imageContainer.className = 'value-image-container';
        
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = 'Loading image...';
        
        const img = document.createElement('img');
        img.className = 'value-image loading';
        img.src = item.image;
        img.alt = item.name;
        img.loading = 'lazy';
        
        // Handle image load/error events
        img.onload = () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
            placeholder.classList.add('hidden');
        };
        
        img.onerror = () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iOCIgZmlsbD0iIzBGMEYwRiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
            img.classList.remove('loading');
            img.classList.add('loaded');
            placeholder.classList.add('hidden');
        };
        
        imageContainer.appendChild(placeholder);
        imageContainer.appendChild(img);
        
        // Create card content
        const cardContent = document.createElement('div');
        cardContent.innerHTML = `
            <div class="value-name">${item.name}</div>
            <div class="value-info">${item.info}</div>
            <div class="value-stats">
                <div class="value-stat">
                    <span class="stat-label">Rarity:</span>
                    <span class="stat-value rarity-${item.rarity.toLowerCase().replace(/\s+/g, '-')}">${item.rarity}</span>
                </div>
                <div class="value-stat">
                    <span class="stat-label">Demand:</span>
                    <span class="stat-value demand-${item.demand.toLowerCase().replace(/\s+/g, '-')}">${item.demand}</span>
                </div>
                <div class="value-stat">
                    <span class="stat-label">Value:</span>
                    <span class="stat-value">${item.value}</span>
                </div>
            </div>
        `;
        
        cardElement.appendChild(imageContainer);
        cardElement.appendChild(cardContent);
        container.appendChild(cardElement);
    });
}

// Show error with better styling
function showError(type, message) {
    let container;
    switch (type) {
        case 'stock':
            container = document.getElementById('seed-items').parentElement.parentElement;
            break;
        case 'weather':
            container = document.getElementById('active-weather-items').parentElement.parentElement;
            break;
        case 'values':
            container = document.getElementById('values-content');
            break;
    }
    
    if (container) {
        container.innerHTML = `
            <div class="error">
                Error: ${message}
                <br>
                <button onclick="refresh()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; cursor: pointer; transition: background 0.2s;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Update last updated text (only for stocks page)
function updateLastUpdatedText() {
    if (currentPage === 'stocks') {
        updateStockCountdowns();
    }
}

// Update stock countdowns
function updateStockCountdowns() {
    const element = document.getElementById('last-updated');
    if (!element) return;
    
    const updateCountdown = () => {
        const timeRemaining = getTimeUntilNextUTCUpdate(5);
        element.textContent = `Refreshes in: ${formatCountdown(timeRemaining)}`;
    };

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Update individual stock section countdowns
function updateStockSectionCountdowns() {
    const sections = [
        { id: 'seed-subtitle', interval: 5 },
        { id: 'gear-subtitle', interval: 5 },
        { id: 'egg-subtitle', interval: 30 },
        { id: 'cosmetic-subtitle', interval: 240, fixedHours: [0, 4, 8, 12, 16, 20] }
    ];
    
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            const updateSectionCountdown = () => {
                const timeRemaining = getTimeUntilNextUTCUpdate(section.interval, section.fixedHours);
                element.textContent = `Updates in: ${formatCountdown(timeRemaining)}`;
            };
            
            updateSectionCountdown();
            setInterval(updateSectionCountdown, 1000);
        }
    });
}

// Utility functions for countdown timers
function getTimeUntilNextUTCUpdate(intervalMinutes, fixedHours = null) {
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

    if (fixedHours) {
        const next = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), utcNow.getUTCDate()));
        for (let i = 0; i < fixedHours.length; i++) {
            if (utcNow.getUTCHours() < fixedHours[i]) {
                next.setUTCHours(fixedHours[i], 0, 0, 0);
                return next - utcNow;
            }
        }
        next.setUTCDate(next.getUTCDate() + 1);
        next.setUTCHours(fixedHours[0], 0, 0, 0);
        return next - utcNow;
    } else {
        const totalMinutes = utcNow.getUTCHours() * 60 + utcNow.getUTCMinutes();
        const nextTotalMinutes = Math.ceil(totalMinutes / intervalMinutes) * intervalMinutes;
        const nextHours = Math.floor(nextTotalMinutes / 60);
        const nextMinutes = nextTotalMinutes % 60;

        const next = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), utcNow.getUTCDate(), nextHours, nextMinutes, 0));
        if (next <= utcNow) {
            next.setUTCMinutes(next.getUTCMinutes() + intervalMinutes);
        }

        return next - utcNow;
    }
}

function formatCountdown(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

function formatDuration(seconds) {
    if (seconds < 60) {
        return `${seconds}s`;
    } else if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
}

function formatTimeLeft(endUnix) {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endUnix - now;
    
    if (timeLeft <= 0) {
        return "Ending soon";
    }
    
    return formatDuration(timeLeft);
}

// Initialize on page load with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        updateControlsVisibility(); // Set initial visibility
        loadStockData();
        startStockMonitoring();
        updateStockSectionCountdowns();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Clean up intervals on page unload
window.addEventListener('beforeunload', () => {
    cleanupIntervals();
});

// Handle visibility change to pause/resume monitoring
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cleanupIntervals();
    } else if (currentPage === 'stocks') {
        startStockMonitoring();
        updateStockCountdowns();
    } else if (currentPage === 'weather') {
        startWeatherCountdowns();
    }
});

// Weather Dashboard
// Level 4 Mini-Project

// Configuration
const CONFIG = {
    API_KEY: 'your_api_key_here', // Replace with your OpenWeatherMap API key
    API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    DEFAULT_CITY: 'London',
    UNITS: 'metric',
    LANGUAGE: 'en',
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
};

// Main application
class WeatherApp {
    constructor() {
        this.weatherDisplay = null;
        this.searchComponent = null;
        this.settingsComponent = null;
        this.weatherService = null;
        this.cacheManager = null;
        this.retryLogic = null;
        this.errorHandler = null;
        this.currentCity = CONFIG.DEFAULT_CITY;
        this.settings = null;
    }
    
    async init() {
        try {
            // Initialize components
            this.initializeComponents();
            
            // Load settings
            this.settings = this.loadSettings();
            
            // Initialize services
            this.initializeServices();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load initial weather
            await this.loadWeather();
            
            console.log('Weather Dashboard initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Weather Dashboard:', error);
            this.showError('Failed to initialize application');
        }
    }
    
    initializeComponents() {
        // Initialize weather display
        this.weatherDisplay = new WeatherDisplay(document.getElementById('weather-display'));
        
        // Initialize search component
        this.searchComponent = new SearchComponent(document.getElementById('search-container'), {
            placeholder: 'Search for a city...',
            minLength: 2,
            debounceDelay: 300,
            maxResults: 10,
            showRecent: true,
            showFavorites: true
        });
        
        // Initialize settings component
        this.settingsComponent = new SettingsComponent(document.getElementById('settings-container'), {
            showUnits: true,
            showLanguage: true,
            showTheme: true,
            showNotifications: true,
            showCache: true
        });
    }
    
    initializeServices() {
        // Initialize cache manager
        this.cacheManager = new CacheManager(CONFIG.CACHE_DURATION);
        
        // Initialize retry logic
        this.retryLogic = new RetryLogic({
            maxRetries: CONFIG.MAX_RETRIES,
            baseDelay: CONFIG.RETRY_DELAY,
            maxDelay: 10000,
            backoffMultiplier: 2
        });
        
        // Initialize error handler
        this.errorHandler = new ErrorHandler({
            showNotifications: true,
            logErrors: true,
            retryOnError: true
        });
        
        // Initialize weather service
        this.weatherService = new WeatherService(CONFIG.API_KEY, {
            baseURL: CONFIG.API_BASE_URL,
            units: this.settings.units.temperature,
            language: this.settings.language,
            cache: this.cacheManager,
            retryLogic: this.retryLogic,
            errorHandler: this.errorHandler
        });
    }
    
    setupEventListeners() {
        // Search component events
        this.searchComponent.container.addEventListener('citySelected', (e) => {
            this.currentCity = e.detail.city;
            this.loadWeather();
        });
        
        this.searchComponent.container.addEventListener('citySearch', async (e) => {
            await this.handleCitySearch(e.detail.query);
        });
        
        // Settings component events
        this.settingsComponent.container.addEventListener('settingChange', (e) => {
            this.handleSettingChange(e.detail.type, e.detail.data);
        });
        
        // Weather display events
        this.weatherDisplay.container.addEventListener('weatherRefresh', (e) => {
            this.loadWeather();
        });
        
        this.weatherDisplay.container.addEventListener('weatherFavorite', (e) => {
            this.handleWeatherFavorite(e.detail.city, e.detail.isFavorite);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        // Online/offline events
        window.addEventListener('online', () => {
            this.handleOnlineStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.handleOnlineStatus(false);
        });
    }
    
    async loadWeather() {
        if (!this.weatherDisplay || !this.weatherService) return;
        
        try {
            this.weatherDisplay.showLoading();
            
            // Fetch current weather and forecast in parallel
            const [currentWeather, forecast] = await Promise.all([
                this.weatherService.getCurrentWeather(this.currentCity),
                this.weatherService.getForecast(this.currentCity)
            ]);
            
            // Update weather display
            this.weatherDisplay.updateWeather(currentWeather, forecast);
            
            // Update page title
            document.title = `Weather - ${currentWeather.name}`;
            
        } catch (error) {
            console.error('Error loading weather:', error);
            this.weatherDisplay.showError(error);
        }
    }
    
    async handleCitySearch(query) {
        try {
            const results = await this.weatherService.searchCities(query);
            this.searchComponent.setSearchResults(results);
        } catch (error) {
            console.error('Error searching cities:', error);
            this.searchComponent.showError('Search failed. Please try again.');
        }
    }
    
    handleSettingChange(type, data) {
        switch (type) {
            case 'units':
                this.updateUnits(data);
                break;
            case 'language':
                this.updateLanguage(data);
                break;
            case 'theme':
                this.updateTheme(data);
                break;
            case 'notifications':
                this.updateNotifications(data);
                break;
            case 'cache':
                this.updateCacheSettings(data);
                break;
            case 'cacheCleared':
                this.handleCacheCleared();
                break;
            case 'reset':
                this.handleSettingsReset();
                break;
        }
    }
    
    updateUnits(units) {
        // Update weather service units
        this.weatherService.units = units.temperature;
        
        // Reload weather with new units
        this.loadWeather();
    }
    
    updateLanguage(language) {
        // Update weather service language
        this.weatherService.language = language;
        
        // Reload weather with new language
        this.loadWeather();
    }
    
    updateTheme(theme) {
        // Apply theme to body
        document.body.className = `theme-${theme}`;
        
        // Update weather display theme
        if (this.weatherDisplay) {
            this.weatherDisplay.setTheme(theme);
        }
    }
    
    updateNotifications(notifications) {
        // Update notification settings
        if (notifications.enabled) {
            this.requestNotificationPermission();
        }
    }
    
    updateCacheSettings(cacheSettings) {
        // Update cache manager settings
        if (this.cacheManager) {
            this.cacheManager.defaultTTL = cacheSettings.duration * 60 * 1000;
        }
    }
    
    handleCacheCleared() {
        // Show success message
        this.showNotification('Cache cleared successfully', 'success');
    }
    
    handleSettingsReset() {
        // Reload weather with default settings
        this.loadWeather();
    }
    
    handleWeatherFavorite(city, isFavorite) {
        if (isFavorite) {
            this.searchComponent.addToFavorites({ name: city, country: '' });
            this.showNotification(`${city} added to favorites`, 'success');
        } else {
            this.searchComponent.removeFromFavorites({ name: city, country: '' });
            this.showNotification(`${city} removed from favorites`, 'info');
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.searchComponent.focus();
        }
        
        // Escape to close search results
        if (e.key === 'Escape') {
            this.searchComponent.hideResults();
        }
        
        // F5 or Ctrl/Cmd + R to refresh
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
            e.preventDefault();
            this.loadWeather();
        }
    }
    
    handleOnlineStatus(isOnline) {
        if (isOnline) {
            this.showNotification('Connection restored', 'success');
            // Reload weather when back online
            this.loadWeather();
        } else {
            this.showNotification('Connection lost. Some features may not work.', 'warning');
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification('Notifications enabled', 'success');
                }
            });
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-overlay';
        errorDiv.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
    
    loadSettings() {
        const defaultSettings = {
            units: {
                temperature: 'metric',
                wind: 'metric',
                pressure: 'hPa'
            },
            language: 'en',
            theme: 'auto',
            accentColor: '#007bff',
            notifications: {
                enabled: false,
                weatherAlerts: true,
                dailyForecast: false,
                time: '08:00'
            },
            cache: {
                enabled: true,
                duration: 5
            }
        };
        
        try {
            const stored = localStorage.getItem('weatherSettings');
            return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
        } catch (error) {
            console.error('Error loading settings:', error);
            return defaultSettings;
        }
    }
    
    // Public API methods
    getCurrentWeather() {
        return this.weatherDisplay?.getCurrentWeather();
    }
    
    getForecast() {
        return this.weatherDisplay?.getForecast();
    }
    
    getSettings() {
        return this.settingsComponent?.getAllSettings();
    }
    
    setCity(city) {
        this.currentCity = city;
        this.loadWeather();
    }
    
    refresh() {
        this.loadWeather();
    }
    
    destroy() {
        // Clean up components
        if (this.weatherDisplay) {
            this.weatherDisplay.destroy();
        }
        if (this.searchComponent) {
            this.searchComponent.destroy();
        }
        if (this.settingsComponent) {
            this.settingsComponent.destroy();
        }
        
        // Clean up services
        if (this.cacheManager) {
            this.cacheManager.destroy();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const app = new WeatherApp();
    await app.init();
    
    // Make app globally available for debugging
    window.weatherApp = app;
});
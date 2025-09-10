// Settings Component
// Level 4 Mini-Project

class SettingsComponent {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            showUnits: true,
            showLanguage: true,
            showTheme: true,
            showNotifications: true,
            showCache: true,
            ...options
        };
        this.settings = this.loadSettings();
        this.isOpen = false;
    }
    
    // Initialize settings component
    init() {
        this.createSettingsHTML();
        this.attachEventListeners();
        this.updateSettingsDisplay();
    }
    
    // Create settings HTML
    createSettingsHTML() {
        this.container.innerHTML = `
            <div class="settings-container">
                <button class="settings-toggle" title="Settings">
                    <i class="icon-settings"></i>
                </button>
                
                <div class="settings-panel" style="display: none;">
                    <div class="settings-header">
                        <h3>Settings</h3>
                        <button class="settings-close">
                            <i class="icon-close"></i>
                        </button>
                    </div>
                    
                    <div class="settings-content">
                        ${this.options.showUnits ? this.createUnitsSection() : ''}
                        ${this.options.showLanguage ? this.createLanguageSection() : ''}
                        ${this.options.showTheme ? this.createThemeSection() : ''}
                        ${this.options.showNotifications ? this.createNotificationsSection() : ''}
                        ${this.options.showCache ? this.createCacheSection() : ''}
                        
                        <div class="settings-actions">
                            <button class="btn-reset">Reset to Defaults</button>
                            <button class="btn-export">Export Settings</button>
                            <button class="btn-import">Import Settings</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create units section
    createUnitsSection() {
        return `
            <div class="settings-section">
                <h4>Units</h4>
                <div class="setting-item">
                    <label for="temperature-unit">Temperature</label>
                    <select id="temperature-unit" class="setting-select">
                        <option value="metric" ${this.settings.units.temperature === 'metric' ? 'selected' : ''}>Celsius (°C)</option>
                        <option value="imperial" ${this.settings.units.temperature === 'imperial' ? 'selected' : ''}>Fahrenheit (°F)</option>
                        <option value="kelvin" ${this.settings.units.temperature === 'kelvin' ? 'selected' : ''}>Kelvin (K)</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label for="wind-unit">Wind Speed</label>
                    <select id="wind-unit" class="setting-select">
                        <option value="metric" ${this.settings.units.wind === 'metric' ? 'selected' : ''}>m/s</option>
                        <option value="imperial" ${this.settings.units.wind === 'imperial' ? 'selected' : ''}>mph</option>
                        <option value="knots" ${this.settings.units.wind === 'knots' ? 'selected' : ''}>knots</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label for="pressure-unit">Pressure</label>
                    <select id="pressure-unit" class="setting-select">
                        <option value="hPa" ${this.settings.units.pressure === 'hPa' ? 'selected' : ''}>hPa</option>
                        <option value="mmHg" ${this.settings.units.pressure === 'mmHg' ? 'selected' : ''}>mmHg</option>
                        <option value="inHg" ${this.settings.units.pressure === 'inHg' ? 'selected' : ''}>inHg</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    // Create language section
    createLanguageSection() {
        return `
            <div class="settings-section">
                <h4>Language</h4>
                <div class="setting-item">
                    <label for="language">Language</label>
                    <select id="language" class="setting-select">
                        <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="es" ${this.settings.language === 'es' ? 'selected' : ''}>Español</option>
                        <option value="fr" ${this.settings.language === 'fr' ? 'selected' : ''}>Français</option>
                        <option value="de" ${this.settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
                        <option value="it" ${this.settings.language === 'it' ? 'selected' : ''}>Italiano</option>
                        <option value="pt" ${this.settings.language === 'pt' ? 'selected' : ''}>Português</option>
                        <option value="ru" ${this.settings.language === 'ru' ? 'selected' : ''}>Русский</option>
                        <option value="ja" ${this.settings.language === 'ja' ? 'selected' : ''}>日本語</option>
                        <option value="ko" ${this.settings.language === 'ko' ? 'selected' : ''}>한국어</option>
                        <option value="zh" ${this.settings.language === 'zh' ? 'selected' : ''}>中文</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    // Create theme section
    createThemeSection() {
        return `
            <div class="settings-section">
                <h4>Theme</h4>
                <div class="setting-item">
                    <label for="theme">Theme</label>
                    <select id="theme" class="setting-select">
                        <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                        <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        <option value="auto" ${this.settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label for="accent-color">Accent Color</label>
                    <input type="color" id="accent-color" class="setting-color" value="${this.settings.accentColor}">
                </div>
            </div>
        `;
    }
    
    // Create notifications section
    createNotificationsSection() {
        return `
            <div class="settings-section">
                <h4>Notifications</h4>
                <div class="setting-item">
                    <label class="setting-checkbox-label">
                        <input type="checkbox" id="notifications-enabled" class="setting-checkbox" ${this.settings.notifications.enabled ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Enable Notifications
                    </label>
                </div>
                <div class="setting-item">
                    <label class="setting-checkbox-label">
                        <input type="checkbox" id="weather-alerts" class="setting-checkbox" ${this.settings.notifications.weatherAlerts ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Weather Alerts
                    </label>
                </div>
                <div class="setting-item">
                    <label class="setting-checkbox-label">
                        <input type="checkbox" id="daily-forecast" class="setting-checkbox" ${this.settings.notifications.dailyForecast ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Daily Forecast
                    </label>
                </div>
                <div class="setting-item">
                    <label for="notification-time">Notification Time</label>
                    <input type="time" id="notification-time" class="setting-time" value="${this.settings.notifications.time}">
                </div>
            </div>
        `;
    }
    
    // Create cache section
    createCacheSection() {
        return `
            <div class="settings-section">
                <h4>Cache</h4>
                <div class="setting-item">
                    <label for="cache-duration">Cache Duration (minutes)</label>
                    <input type="number" id="cache-duration" class="setting-number" min="1" max="60" value="${this.settings.cache.duration}">
                </div>
                <div class="setting-item">
                    <label class="setting-checkbox-label">
                        <input type="checkbox" id="cache-enabled" class="setting-checkbox" ${this.settings.cache.enabled ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Enable Caching
                    </label>
                </div>
                <div class="setting-item">
                    <button class="btn-clear-cache">Clear Cache</button>
                    <span class="cache-info">${this.getCacheInfo()}</span>
                </div>
            </div>
        `;
    }
    
    // Attach event listeners
    attachEventListeners() {
        const toggleBtn = this.container.querySelector('.settings-toggle');
        const closeBtn = this.container.querySelector('.settings-close');
        const panel = this.container.querySelector('.settings-panel');
        
        // Toggle panel
        toggleBtn.addEventListener('click', () => this.togglePanel());
        closeBtn.addEventListener('click', () => this.closePanel());
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && this.isOpen) {
                this.closePanel();
            }
        });
        
        // Settings changes
        this.attachSettingListeners();
        
        // Action buttons
        this.attachActionListeners();
    }
    
    // Attach setting listeners
    attachSettingListeners() {
        // Units
        const tempUnit = this.container.querySelector('#temperature-unit');
        const windUnit = this.container.querySelector('#wind-unit');
        const pressureUnit = this.container.querySelector('#pressure-unit');
        
        if (tempUnit) {
            tempUnit.addEventListener('change', (e) => {
                this.settings.units.temperature = e.target.value;
                this.saveSettings();
                this.emitSettingChange('units', this.settings.units);
            });
        }
        
        if (windUnit) {
            windUnit.addEventListener('change', (e) => {
                this.settings.units.wind = e.target.value;
                this.saveSettings();
                this.emitSettingChange('units', this.settings.units);
            });
        }
        
        if (pressureUnit) {
            pressureUnit.addEventListener('change', (e) => {
                this.settings.units.pressure = e.target.value;
                this.saveSettings();
                this.emitSettingChange('units', this.settings.units);
            });
        }
        
        // Language
        const language = this.container.querySelector('#language');
        if (language) {
            language.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
                this.saveSettings();
                this.emitSettingChange('language', this.settings.language);
            });
        }
        
        // Theme
        const theme = this.container.querySelector('#theme');
        const accentColor = this.container.querySelector('#accent-color');
        
        if (theme) {
            theme.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.saveSettings();
                this.emitSettingChange('theme', this.settings.theme);
            });
        }
        
        if (accentColor) {
            accentColor.addEventListener('change', (e) => {
                this.settings.accentColor = e.target.value;
                this.saveSettings();
                this.emitSettingChange('accentColor', this.settings.accentColor);
            });
        }
        
        // Notifications
        const notificationsEnabled = this.container.querySelector('#notifications-enabled');
        const weatherAlerts = this.container.querySelector('#weather-alerts');
        const dailyForecast = this.container.querySelector('#daily-forecast');
        const notificationTime = this.container.querySelector('#notification-time');
        
        if (notificationsEnabled) {
            notificationsEnabled.addEventListener('change', (e) => {
                this.settings.notifications.enabled = e.target.checked;
                this.saveSettings();
                this.emitSettingChange('notifications', this.settings.notifications);
            });
        }
        
        if (weatherAlerts) {
            weatherAlerts.addEventListener('change', (e) => {
                this.settings.notifications.weatherAlerts = e.target.checked;
                this.saveSettings();
                this.emitSettingChange('notifications', this.settings.notifications);
            });
        }
        
        if (dailyForecast) {
            dailyForecast.addEventListener('change', (e) => {
                this.settings.notifications.dailyForecast = e.target.checked;
                this.saveSettings();
                this.emitSettingChange('notifications', this.settings.notifications);
            });
        }
        
        if (notificationTime) {
            notificationTime.addEventListener('change', (e) => {
                this.settings.notifications.time = e.target.value;
                this.saveSettings();
                this.emitSettingChange('notifications', this.settings.notifications);
            });
        }
        
        // Cache
        const cacheDuration = this.container.querySelector('#cache-duration');
        const cacheEnabled = this.container.querySelector('#cache-enabled');
        
        if (cacheDuration) {
            cacheDuration.addEventListener('change', (e) => {
                this.settings.cache.duration = parseInt(e.target.value);
                this.saveSettings();
                this.emitSettingChange('cache', this.settings.cache);
            });
        }
        
        if (cacheEnabled) {
            cacheEnabled.addEventListener('change', (e) => {
                this.settings.cache.enabled = e.target.checked;
                this.saveSettings();
                this.emitSettingChange('cache', this.settings.cache);
            });
        }
    }
    
    // Attach action listeners
    attachActionListeners() {
        const resetBtn = this.container.querySelector('.btn-reset');
        const exportBtn = this.container.querySelector('.btn-export');
        const importBtn = this.container.querySelector('.btn-import');
        const clearCacheBtn = this.container.querySelector('.btn-clear-cache');
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSettings());
        }
        
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importSettings());
        }
        
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => this.clearCache());
        }
    }
    
    // Toggle panel
    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }
    
    // Open panel
    openPanel() {
        const panel = this.container.querySelector('.settings-panel');
        panel.style.display = 'block';
        this.isOpen = true;
        
        // Update cache info
        this.updateCacheInfo();
    }
    
    // Close panel
    closePanel() {
        const panel = this.container.querySelector('.settings-panel');
        panel.style.display = 'none';
        this.isOpen = false;
    }
    
    // Update settings display
    updateSettingsDisplay() {
        // Update all form elements to reflect current settings
        Object.keys(this.settings).forEach(category => {
            if (typeof this.settings[category] === 'object') {
                Object.keys(this.settings[category]).forEach(key => {
                    const element = this.container.querySelector(`#${key}`);
                    if (element) {
                        if (element.type === 'checkbox') {
                            element.checked = this.settings[category][key];
                        } else {
                            element.value = this.settings[category][key];
                        }
                    }
                });
            } else {
                const element = this.container.querySelector(`#${category}`);
                if (element) {
                    element.value = this.settings[category];
                }
            }
        });
    }
    
    // Update cache info
    updateCacheInfo() {
        const cacheInfo = this.container.querySelector('.cache-info');
        if (cacheInfo) {
            cacheInfo.textContent = this.getCacheInfo();
        }
    }
    
    // Get cache info
    getCacheInfo() {
        try {
            const cacheSize = this.calculateCacheSize();
            return `Cache size: ${cacheSize}`;
        } catch (error) {
            return 'Cache size: Unknown';
        }
    }
    
    // Calculate cache size
    calculateCacheSize() {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (key.startsWith('weather_')) {
                totalSize += localStorage[key].length;
            }
        }
        
        if (totalSize < 1024) {
            return `${totalSize} B`;
        } else if (totalSize < 1024 * 1024) {
            return `${(totalSize / 1024).toFixed(1)} KB`;
        } else {
            return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
        }
    }
    
    // Load settings
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
    
    // Save settings
    saveSettings() {
        try {
            localStorage.setItem('weatherSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    // Reset settings
    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            this.settings = this.loadSettings();
            this.saveSettings();
            this.updateSettingsDisplay();
            this.emitSettingChange('reset', this.settings);
        }
    }
    
    // Export settings
    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'weather-settings.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    // Import settings
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedSettings = JSON.parse(e.target.result);
                        this.settings = { ...this.settings, ...importedSettings };
                        this.saveSettings();
                        this.updateSettingsDisplay();
                        this.emitSettingChange('import', this.settings);
                        alert('Settings imported successfully!');
                    } catch (error) {
                        alert('Error importing settings: Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }
    
    // Clear cache
    clearCache() {
        if (confirm('Are you sure you want to clear the cache?')) {
            try {
                // Clear weather-related cache
                for (let key in localStorage) {
                    if (key.startsWith('weather_')) {
                        localStorage.removeItem(key);
                    }
                }
                
                // Emit cache cleared event
                this.emitSettingChange('cacheCleared', null);
                
                // Update cache info
                this.updateCacheInfo();
                
                alert('Cache cleared successfully!');
            } catch (error) {
                alert('Error clearing cache');
            }
        }
    }
    
    // Emit setting change event
    emitSettingChange(type, data) {
        const event = new CustomEvent('settingChange', {
            detail: { type, data }
        });
        this.container.dispatchEvent(event);
    }
    
    // Get setting value
    getSetting(category, key) {
        if (key) {
            return this.settings[category]?.[key];
        }
        return this.settings[category];
    }
    
    // Set setting value
    setSetting(category, key, value) {
        if (key) {
            if (!this.settings[category]) {
                this.settings[category] = {};
            }
            this.settings[category][key] = value;
        } else {
            this.settings[category] = value;
        }
        this.saveSettings();
        this.emitSettingChange(category, this.settings[category]);
    }
    
    // Get all settings
    getAllSettings() {
        return { ...this.settings };
    }
    
    // Destroy component
    destroy() {
        this.container.innerHTML = '';
        this.settings = null;
        this.isOpen = false;
    }
}

// Export class
window.SettingsComponent = SettingsComponent;



// Weather Card Component
// Level 4 Mini-Project

class WeatherCard {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            showDetails: true,
            showForecast: false,
            showAlerts: false,
            theme: 'default',
            ...options
        };
        this.weatherData = null;
        this.isLoading = false;
        this.error = null;
    }
    
    // Render weather card
    render(weatherData) {
        this.weatherData = weatherData;
        this.error = null;
        
        if (!weatherData) {
            this.renderError('No weather data available');
            return;
        }
        
        try {
            const cardHTML = this.createCardHTML(weatherData);
            this.container.innerHTML = cardHTML;
            this.attachEventListeners();
        } catch (error) {
            console.error('Error rendering weather card:', error);
            this.renderError('Failed to render weather data');
        }
    }
    
    // Create card HTML
    createCardHTML(data) {
        const { main, weather, wind, visibility, sys, name, dt } = data;
        const weatherInfo = weather[0];
        const time = new Date(dt * 1000);
        
        return `
            <div class="weather-card ${this.options.theme}" data-city="${name}">
                <div class="weather-header">
                    <h2 class="city-name">${name}</h2>
                    <div class="weather-time">${this.formatTime(time)}</div>
                </div>
                
                <div class="weather-main">
                    <div class="weather-icon">
                        <img src="${this.getWeatherIconURL(weatherInfo.icon)}" 
                             alt="${weatherInfo.description}" 
                             class="weather-icon-img">
                    </div>
                    <div class="weather-temp">
                        <span class="temp-value">${Math.round(main.temp)}</span>
                        <span class="temp-unit">°C</span>
                    </div>
                    <div class="weather-description">
                        ${weatherInfo.description}
                    </div>
                </div>
                
                ${this.options.showDetails ? this.createDetailsHTML(main, wind, visibility, sys) : ''}
                
                ${this.options.showForecast ? this.createForecastHTML(data.forecast) : ''}
                
                ${this.options.showAlerts ? this.createAlertsHTML(data.alerts) : ''}
                
                <div class="weather-actions">
                    <button class="btn-refresh" onclick="this.refreshWeather()">
                        <i class="icon-refresh"></i> Refresh
                    </button>
                    <button class="btn-favorite" onclick="this.toggleFavorite()">
                        <i class="icon-heart"></i> Favorite
                    </button>
                </div>
            </div>
        `;
    }
    
    // Create details HTML
    createDetailsHTML(main, wind, visibility, sys) {
        return `
            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-label">Feels like</span>
                    <span class="detail-value">${Math.round(main.feels_like)}°C</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">${main.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pressure</span>
                    <span class="detail-value">${main.pressure} hPa</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind</span>
                    <span class="detail-value">${wind.speed} m/s ${this.getWindDirection(wind.deg)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Visibility</span>
                    <span class="detail-value">${(visibility / 1000).toFixed(1)} km</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sunrise</span>
                    <span class="detail-value">${this.formatTime(new Date(sys.sunrise * 1000))}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sunset</span>
                    <span class="detail-value">${this.formatTime(new Date(sys.sunset * 1000))}</span>
                </div>
            </div>
        `;
    }
    
    // Create forecast HTML
    createForecastHTML(forecast) {
        if (!forecast || !forecast.list) return '';
        
        const forecastItems = forecast.list.slice(0, 5).map(item => {
            const time = new Date(item.dt * 1000);
            const weather = item.weather[0];
            
            return `
                <div class="forecast-item">
                    <div class="forecast-time">${this.formatTime(time)}</div>
                    <div class="forecast-icon">
                        <img src="${this.getWeatherIconURL(weather.icon)}" 
                             alt="${weather.description}" 
                             class="forecast-icon-img">
                    </div>
                    <div class="forecast-temp">
                        ${Math.round(item.main.temp)}°C
                    </div>
                    <div class="forecast-desc">
                        ${weather.description}
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="weather-forecast">
                <h3>5-Day Forecast</h3>
                <div class="forecast-list">
                    ${forecastItems}
                </div>
            </div>
        `;
    }
    
    // Create alerts HTML
    createAlertsHTML(alerts) {
        if (!alerts || alerts.length === 0) return '';
        
        const alertItems = alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-description">${alert.description}</div>
                <div class="alert-time">${this.formatTime(new Date(alert.start * 1000))}</div>
            </div>
        `).join('');
        
        return `
            <div class="weather-alerts">
                <h3>Weather Alerts</h3>
                <div class="alerts-list">
                    ${alertItems}
                </div>
            </div>
        `;
    }
    
    // Render loading state
    renderLoading() {
        this.isLoading = true;
        this.container.innerHTML = `
            <div class="weather-card loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading weather data...</div>
            </div>
        `;
    }
    
    // Render error state
    renderError(message) {
        this.error = message;
        this.container.innerHTML = `
            <div class="weather-card error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                <button class="btn-retry" onclick="this.retry()">
                    <i class="icon-refresh"></i> Retry
                </button>
            </div>
        `;
    }
    
    // Attach event listeners
    attachEventListeners() {
        const refreshBtn = this.container.querySelector('.btn-refresh');
        const favoriteBtn = this.container.querySelector('.btn-favorite');
        const retryBtn = this.container.querySelector('.btn-retry');
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshWeather());
        }
        
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }
        
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.retry());
        }
    }
    
    // Refresh weather data
    async refreshWeather() {
        if (this.isLoading) return;
        
        this.renderLoading();
        
        try {
            // Emit refresh event
            this.container.dispatchEvent(new CustomEvent('weatherRefresh', {
                detail: { city: this.weatherData?.name }
            }));
        } catch (error) {
            console.error('Error refreshing weather:', error);
            this.renderError('Failed to refresh weather data');
        }
    }
    
    // Toggle favorite status
    toggleFavorite() {
        const favoriteBtn = this.container.querySelector('.btn-favorite');
        const isFavorite = favoriteBtn.classList.contains('favorited');
        
        if (isFavorite) {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.innerHTML = '<i class="icon-heart"></i> Favorite';
        } else {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="icon-heart-filled"></i> Favorited';
        }
        
        // Emit favorite event
        this.container.dispatchEvent(new CustomEvent('weatherFavorite', {
            detail: { 
                city: this.weatherData?.name, 
                isFavorite: !isFavorite 
            }
        }));
    }
    
    // Retry after error
    retry() {
        this.refreshWeather();
    }
    
    // Update weather data
    updateWeather(newData) {
        this.render(newData);
    }
    
    // Set theme
    setTheme(theme) {
        this.options.theme = theme;
        if (this.weatherData) {
            this.render(this.weatherData);
        }
    }
    
    // Toggle details visibility
    toggleDetails() {
        this.options.showDetails = !this.options.showDetails;
        if (this.weatherData) {
            this.render(this.weatherData);
        }
    }
    
    // Toggle forecast visibility
    toggleForecast() {
        this.options.showForecast = !this.options.showForecast;
        if (this.weatherData) {
            this.render(this.weatherData);
        }
    }
    
    // Toggle alerts visibility
    toggleAlerts() {
        this.options.showAlerts = !this.options.showAlerts;
        if (this.weatherData) {
            this.render(this.weatherData);
        }
    }
    
    // Utility methods
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
    
    getWeatherIconURL(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
    
    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
    
    // Get current weather data
    getWeatherData() {
        return this.weatherData;
    }
    
    // Check if loading
    isLoading() {
        return this.isLoading;
    }
    
    // Check if has error
    hasError() {
        return this.error !== null;
    }
    
    // Get error message
    getError() {
        return this.error;
    }
    
    // Destroy component
    destroy() {
        this.container.innerHTML = '';
        this.weatherData = null;
        this.error = null;
        this.isLoading = false;
    }
}

// Export class
window.WeatherCard = WeatherCard;


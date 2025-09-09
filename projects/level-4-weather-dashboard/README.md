# Level 4 Mini-Project: Weather Dashboard

## Project Overview

Build a comprehensive weather dashboard that demonstrates advanced asynchronous JavaScript concepts including promises, async/await, error handling, and Web APIs. This project will showcase how to create a responsive, real-time weather application using modern JavaScript patterns.

## Learning Objectives

- Master asynchronous JavaScript with promises and async/await
- Implement robust error handling and retry logic
- Use the Fetch API for HTTP communication
- Handle real-time data updates and user interactions
- Apply performance optimization techniques
- Build responsive user interfaces with async data

## Project Requirements

### Core Features

1. **Weather Data Display**
   - Current weather conditions
   - 5-day weather forecast
   - Hourly weather updates
   - Weather alerts and warnings

2. **Location Services**
   - Geolocation API integration
   - City search functionality
   - Favorite locations management
   - Location-based weather updates

3. **Real-time Updates**
   - Auto-refresh weather data
   - Live weather animations
   - Real-time notifications
   - Background sync

4. **User Interface**
   - Responsive design
   - Dark/light theme toggle
   - Interactive weather maps
   - Customizable dashboard

### Technical Requirements

- Use modern JavaScript (ES6+)
- Implement proper error handling
- Use async/await for all asynchronous operations
- Implement retry logic and circuit breakers
- Use Web APIs (Geolocation, Fetch, Web Storage)
- Include comprehensive error handling
- Follow performance best practices

## Project Structure

```
level-4-weather-dashboard/
├── README.md
├── index.html
├── styles.css
├── script.js
├── src/
│   ├── api/
│   │   ├── weather-api.js
│   │   ├── geolocation-api.js
│   │   └── storage-api.js
│   ├── components/
│   │   ├── weather-card.js
│   │   ├── forecast-list.js
│   │   ├── location-search.js
│   │   └── theme-toggle.js
│   ├── utils/
│   │   ├── error-handler.js
│   │   ├── retry-logic.js
│   │   ├── cache-manager.js
│   │   └── performance-monitor.js
│   └── services/
│       ├── weather-service.js
│       ├── location-service.js
│       └── notification-service.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── sounds/
└── tests/
    ├── api.test.js
    ├── components.test.js
    └── utils.test.js
```

## Implementation Guide

### Phase 1: API Integration

1. **Weather API Setup**
   - Integrate with OpenWeatherMap API
   - Implement error handling and retry logic
   - Add request caching and rate limiting

2. **Geolocation API**
   - Get user's current location
   - Handle location permissions
   - Implement fallback location services

3. **Storage API**
   - Save user preferences
   - Cache weather data
   - Manage favorite locations

### Phase 2: Core Components

1. **Weather Display**
   - Current weather card
   - Forecast list component
   - Weather icons and animations

2. **Location Management**
   - Search functionality
   - Location selection
   - Favorite locations

3. **User Interface**
   - Responsive layout
   - Theme switching
   - Loading states

### Phase 3: Advanced Features

1. **Real-time Updates**
   - Auto-refresh functionality
   - Live weather animations
   - Background sync

2. **Performance Optimization**
   - Request caching
   - Lazy loading
   - Performance monitoring

3. **Error Handling**
   - Comprehensive error handling
   - User-friendly error messages
   - Offline functionality

### Phase 4: Testing and Polish

1. **Unit Testing**
   - API service tests
   - Component tests
   - Utility function tests

2. **Integration Testing**
   - End-to-end workflows
   - Error scenarios
   - Performance testing

3. **User Experience**
   - Accessibility improvements
   - Mobile optimization
   - Performance tuning

## API Integration

### Weather API

```javascript
// OpenWeatherMap API integration
const WEATHER_API_KEY = 'your-api-key';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = WEATHER_API_BASE;
        this.cache = new Map();
        this.retryCount = 3;
    }
    
    async getCurrentWeather(lat, lon) {
        const url = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
        return await this.fetchWithRetry(url);
    }
    
    async getForecast(lat, lon) {
        const url = `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
        return await this.fetchWithRetry(url);
    }
    
    async searchCity(query) {
        const url = `${this.baseURL}/find?q=${query}&appid=${this.apiKey}&units=metric`;
        return await this.fetchWithRetry(url);
    }
}
```

### Geolocation API

```javascript
class GeolocationService {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
    }
    
    async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentPosition = position;
                    resolve(position);
                },
                (error) => {
                    reject(new Error(`Geolocation error: ${error.message}`));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }
    
    watchPosition(callback) {
        if (!navigator.geolocation) {
            throw new Error('Geolocation is not supported');
        }
        
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = position;
                callback(position);
            },
            (error) => {
                console.error('Geolocation watch error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }
    
    clearWatch() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }
}
```

## Error Handling

### Retry Logic

```javascript
class RetryLogic {
    constructor(maxRetries = 3, baseDelay = 1000) {
        this.maxRetries = maxRetries;
        this.baseDelay = baseDelay;
    }
    
    async execute(fn) {
        let lastError;
        
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (i === this.maxRetries - 1) {
                    throw lastError;
                }
                
                const delay = this.baseDelay * Math.pow(2, i);
                await this.delay(delay);
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

### Circuit Breaker

```javascript
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000) {
        this.threshold = threshold;
        this.timeout = timeout;
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED';
    }
    
    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.timeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }
    
    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }
    
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.threshold) {
            this.state = 'OPEN';
        }
    }
}
```

## Performance Optimization

### Request Caching

```javascript
class CacheManager {
    constructor(ttl = 300000) { // 5 minutes default
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    get(key) {
        const item = this.cache.get(key);
        
        if (item && Date.now() - item.timestamp < this.ttl) {
            return item.data;
        }
        
        if (item) {
            this.cache.delete(key);
        }
        
        return null;
    }
    
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    clear() {
        this.cache.clear();
    }
}
```

### Performance Monitoring

```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }
    
    startTiming(name) {
        this.metrics.set(name, {
            start: performance.now(),
            end: null,
            duration: null
        });
    }
    
    endTiming(name) {
        const metric = this.metrics.get(name);
        
        if (metric) {
            metric.end = performance.now();
            metric.duration = metric.end - metric.start;
        }
    }
    
    getMetrics() {
        return Array.from(this.metrics.entries()).map(([name, metric]) => ({
            name,
            duration: metric.duration
        }));
    }
}
```

## Testing Strategy

### Unit Tests

```javascript
// weather-api.test.js
describe('WeatherAPI', () => {
    let weatherAPI;
    
    beforeEach(() => {
        weatherAPI = new WeatherAPI('test-api-key');
    });
    
    test('should fetch current weather', async () => {
        const mockResponse = { temperature: 20, condition: 'sunny' };
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });
        
        const result = await weatherAPI.getCurrentWeather(40.7128, -74.0060);
        
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('weather'));
    });
    
    test('should handle API errors', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
        
        await expect(weatherAPI.getCurrentWeather(40.7128, -74.0060))
            .rejects.toThrow('API Error');
    });
});
```

### Integration Tests

```javascript
// weather-dashboard.test.js
describe('Weather Dashboard Integration', () => {
    test('should load weather data on page load', async () => {
        // Mock geolocation
        const mockPosition = {
            coords: { latitude: 40.7128, longitude: -74.0060 }
        };
        
        navigator.geolocation = {
            getCurrentPosition: jest.fn().mockImplementation((success) => {
                success(mockPosition);
            })
        };
        
        // Mock weather API
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ temperature: 20, condition: 'sunny' })
        });
        
        // Load dashboard
        await loadWeatherDashboard();
        
        // Verify weather data is displayed
        expect(document.querySelector('.weather-temperature')).toHaveTextContent('20°C');
    });
});
```

## Success Criteria

- [ ] Weather data loads successfully
- [ ] Location services work properly
- [ ] Error handling is comprehensive
- [ ] Performance is optimized
- [ ] User interface is responsive
- [ ] Real-time updates work
- [ ] Offline functionality works
- [ ] Tests pass
- [ ] Code is well-documented

## Bonus Features

- Weather alerts and notifications
- Interactive weather maps
- Weather data export
- Social sharing
- Voice weather updates
- Weather widgets
- Custom themes
- Weather history

## Resources

- [OpenWeatherMap API](https://openweathermap.org/api)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)


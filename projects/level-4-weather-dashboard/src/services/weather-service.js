// Weather Service
// Level 4 Mini-Project

class WeatherService {
    constructor(apiKey, options = {}) {
        this.apiKey = apiKey;
        this.baseURL = options.baseURL || 'https://api.openweathermap.org/data/2.5';
        this.units = options.units || 'metric';
        this.language = options.language || 'en';
        this.cache = options.cache || null;
        this.retryLogic = options.retryLogic || null;
        this.errorHandler = options.errorHandler || null;
    }
    
    // Get current weather for a city
    async getCurrentWeather(city) {
        const cacheKey = `current_${city}_${this.units}`;
        
        // Check cache first
        if (this.cache && this.cache.has(cacheKey)) {
            console.log('Returning cached current weather data');
            return this.cache.get(cacheKey);
        }
        
        const url = `${this.baseURL}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${this.units}&lang=${this.language}`;
        
        try {
            const data = await this.makeRequest(url);
            
            // Cache the result
            if (this.cache) {
                this.cache.set(cacheKey, data, 300000); // 5 minutes
            }
            
            return data;
        } catch (error) {
            if (this.errorHandler) {
                this.errorHandler.handle(error, 'getCurrentWeather', { city });
            }
            throw error;
        }
    }
    
    // Get 5-day weather forecast
    async getForecast(city) {
        const cacheKey = `forecast_${city}_${this.units}`;
        
        // Check cache first
        if (this.cache && this.cache.has(cacheKey)) {
            console.log('Returning cached forecast data');
            return this.cache.get(cacheKey);
        }
        
        const url = `${this.baseURL}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${this.units}&lang=${this.language}`;
        
        try {
            const data = await this.makeRequest(url);
            
            // Cache the result
            if (this.cache) {
                this.cache.set(cacheKey, data, 600000); // 10 minutes
            }
            
            return data;
        } catch (error) {
            if (this.errorHandler) {
                this.errorHandler.handle(error, 'getForecast', { city });
            }
            throw error;
        }
    }
    
    // Get weather by coordinates
    async getWeatherByCoords(lat, lon) {
        const cacheKey = `coords_${lat}_${lon}_${this.units}`;
        
        // Check cache first
        if (this.cache && this.cache.has(cacheKey)) {
            console.log('Returning cached weather data by coordinates');
            return this.cache.get(cacheKey);
        }
        
        const url = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.units}&lang=${this.language}`;
        
        try {
            const data = await this.makeRequest(url);
            
            // Cache the result
            if (this.cache) {
                this.cache.set(cacheKey, data, 300000); // 5 minutes
            }
            
            return data;
        } catch (error) {
            if (this.errorHandler) {
                this.errorHandler.handle(error, 'getWeatherByCoords', { lat, lon });
            }
            throw error;
        }
    }
    
    // Get weather for multiple cities
    async getMultipleCitiesWeather(cities) {
        const promises = cities.map(city => this.getCurrentWeather(city));
        
        try {
            const results = await Promise.allSettled(promises);
            return results.map((result, index) => ({
                city: cities[index],
                success: result.status === 'fulfilled',
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason : null
            }));
        } catch (error) {
            if (this.errorHandler) {
                this.errorHandler.handle(error, 'getMultipleCitiesWeather', { cities });
            }
            throw error;
        }
    }
    
    // Search cities by name
    async searchCities(query) {
        const cacheKey = `search_${query}`;
        
        // Check cache first
        if (this.cache && this.cache.has(cacheKey)) {
            console.log('Returning cached search results');
            return this.cache.get(cacheKey);
        }
        
        const url = `${this.baseURL}/find?q=${encodeURIComponent(query)}&appid=${this.apiKey}&units=${this.units}`;
        
        try {
            const data = await this.makeRequest(url);
            
            // Cache the result
            if (this.cache) {
                this.cache.set(cacheKey, data, 1800000); // 30 minutes
            }
            
            return data;
        } catch (error) {
            if (this.errorHandler) {
                this.errorHandler.handle(error, 'searchCities', { query });
            }
            throw error;
        }
    }
    
    // Get weather alerts
    async getWeatherAlerts(city) {
        const cacheKey = `alerts_${city}`;
        
        // Check cache first
        if (this.cache && this.cache.has(cacheKey)) {
            console.log('Returning cached weather alerts');
            return this.cache.get(cacheKey);
        }
        
        const url = `${this.baseURL}/onecall?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${this.units}&lang=${this.language}`;
        
        try {
            const data = await this.makeRequest(url);
            
            // Cache the result
            if (this.cache) {
                this.cache.set(cacheKey, data, 300000); // 5 minutes
            }
            
            return data;
        } catch (error) {
            if (this.errorHandler) {
                this.errorHandler.handle(error, 'getWeatherAlerts', { city });
            }
            throw error;
        }
    }
    
    // Make HTTP request with retry logic
    async makeRequest(url) {
        const makeRequest = async () => {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        };
        
        if (this.retryLogic) {
            return await this.retryLogic.execute(makeRequest);
        } else {
            return await makeRequest();
        }
    }
    
    // Get weather icon URL
    getWeatherIconURL(iconCode, size = '2x') {
        return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
    }
    
    // Format temperature
    formatTemperature(temp, unit = this.units) {
        const symbol = unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K';
        return `${Math.round(temp)}${symbol}`;
    }
    
    // Format wind speed
    formatWindSpeed(speed, unit = this.units) {
        const unitStr = unit === 'metric' ? 'm/s' : unit === 'imperial' ? 'mph' : 'm/s';
        return `${speed} ${unitStr}`;
    }
    
    // Format pressure
    formatPressure(pressure) {
        return `${pressure} hPa`;
    }
    
    // Format humidity
    formatHumidity(humidity) {
        return `${humidity}%`;
    }
    
    // Format visibility
    formatVisibility(visibility) {
        return `${(visibility / 1000).toFixed(1)} km`;
    }
    
    // Get weather description
    getWeatherDescription(weather) {
        return weather.map(w => w.description).join(', ');
    }
    
    // Get UV index description
    getUVIndexDescription(uvIndex) {
        if (uvIndex <= 2) return 'Low';
        if (uvIndex <= 5) return 'Moderate';
        if (uvIndex <= 7) return 'High';
        if (uvIndex <= 10) return 'Very High';
        return 'Extreme';
    }
    
    // Get wind direction
    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
    
    // Get weather condition category
    getWeatherCategory(weather) {
        const main = weather[0].main.toLowerCase();
        
        if (main.includes('clear')) return 'clear';
        if (main.includes('cloud')) return 'cloudy';
        if (main.includes('rain')) return 'rainy';
        if (main.includes('snow')) return 'snowy';
        if (main.includes('thunder')) return 'stormy';
        if (main.includes('mist') || main.includes('fog')) return 'foggy';
        
        return 'unknown';
    }
    
    // Get weather emoji
    getWeatherEmoji(weather) {
        const category = this.getWeatherCategory(weather);
        
        const emojis = {
            clear: '☀️',
            cloudy: '☁️',
            rainy: '🌧️',
            snowy: '❄️',
            stormy: '⛈️',
            foggy: '🌫️',
            unknown: '🌤️'
        };
        
        return emojis[category] || emojis.unknown;
    }
    
    // Get background color based on weather
    getWeatherBackgroundColor(weather) {
        const category = this.getWeatherCategory(weather);
        
        const colors = {
            clear: '#87CEEB',
            cloudy: '#B0C4DE',
            rainy: '#4682B4',
            snowy: '#F0F8FF',
            stormy: '#2F4F4F',
            foggy: '#D3D3D3',
            unknown: '#E6E6FA'
        };
        
        return colors[category] || colors.unknown;
    }
    
    // Get weather advice
    getWeatherAdvice(weather, temp) {
        const category = this.getWeatherCategory(weather);
        const advice = [];
        
        if (category === 'clear' && temp > 30) {
            advice.push('Wear sunscreen and stay hydrated');
        } else if (category === 'rainy') {
            advice.push('Bring an umbrella and waterproof clothing');
        } else if (category === 'snowy') {
            advice.push('Dress warmly and watch for icy conditions');
        } else if (category === 'stormy') {
            advice.push('Stay indoors if possible, avoid open areas');
        } else if (category === 'foggy') {
            advice.push('Drive carefully, visibility is reduced');
        }
        
        if (temp < 0) {
            advice.push('Dress warmly, risk of frostbite');
        } else if (temp > 35) {
            advice.push('Avoid prolonged outdoor activities');
        }
        
        return advice;
    }
    
    // Get time of day
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }
    
    // Get greeting based on time and weather
    getGreeting(weather) {
        const timeOfDay = this.getTimeOfDay();
        const category = this.getWeatherCategory(weather);
        
        const greetings = {
            morning: {
                clear: 'Good morning! What a beautiful day to start!',
                cloudy: 'Good morning! A bit cloudy but still a great day!',
                rainy: 'Good morning! Don\'t forget your umbrella!',
                snowy: 'Good morning! A winter wonderland awaits!',
                stormy: 'Good morning! Stay safe in this weather!',
                foggy: 'Good morning! Drive carefully in the fog!',
                unknown: 'Good morning!'
            },
            afternoon: {
                clear: 'Good afternoon! Perfect weather for outdoor activities!',
                cloudy: 'Good afternoon! A pleasant day with some clouds!',
                rainy: 'Good afternoon! Perfect weather for staying cozy indoors!',
                snowy: 'Good afternoon! Enjoy the winter scenery!',
                stormy: 'Good afternoon! Stay safe in this storm!',
                foggy: 'Good afternoon! Be careful in the fog!',
                unknown: 'Good afternoon!'
            },
            evening: {
                clear: 'Good evening! A beautiful sunset awaits!',
                cloudy: 'Good evening! A peaceful evening with some clouds!',
                rainy: 'Good evening! Perfect weather for a cozy evening!',
                snowy: 'Good evening! A magical winter evening!',
                stormy: 'Good evening! Stay safe in this weather!',
                foggy: 'Good evening! Drive carefully in the fog!',
                unknown: 'Good evening!'
            },
            night: {
                clear: 'Good night! Clear skies for stargazing!',
                cloudy: 'Good night! A peaceful night with some clouds!',
                rainy: 'Good night! Perfect weather for sleeping!',
                snowy: 'Good night! A quiet winter night!',
                stormy: 'Good night! Stay safe in this storm!',
                foggy: 'Good night! Be careful in the fog!',
                unknown: 'Good night!'
            }
        };
        
        return greetings[timeOfDay][category] || greetings[timeOfDay].unknown;
    }
}

// Export class
window.WeatherService = WeatherService;



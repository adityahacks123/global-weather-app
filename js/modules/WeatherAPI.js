// Weather API Module
class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geocodingUrl = 'https://api.openweathermap.org/geo/1.0';
    }

    async getCityCoordinates(cityName) {
        try {
            const response = await fetch(
                `${this.geocodingUrl}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to get coordinates');
            }

            const data = await response.json();
            return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
        } catch (error) {
            console.error('Error getting coordinates:', error);
            return null;
        }
    }

    async getCitySuggestions(query) {
        try {
            const response = await fetch(
                `${this.geocodingUrl}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();
            return data.map(city => ({
                name: city.name,
                country: city.country,
                state: city.state,
                lat: city.lat,
                lon: city.lon
            }));
        } catch (error) {
            console.error('Error getting suggestions:', error);
            return [];
        }
    }

    async getWeatherData(lat, lon) {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    }

    async getCityFromCoordinates(lat, lon) {
        try {
            const response = await fetch(
                `${this.geocodingUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to get city name');
            }

            const data = await response.json();
            if (data.length > 0) {
                const city = data[0];
                return `${city.name}, ${city.country}`;
            }
            return null;
        } catch (error) {
            console.error('Error getting city name:', error);
            return null;
        }
    }

    processWeatherData(data, cityName) {
        return {
            id: Date.now(),
            city: cityName,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            windDirection: this.getWindDirection(data.wind.deg),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            visibility: data.visibility / 1000, // Convert to km
            sunrise: new Date(data.sys.sunrise * 1000),
            sunset: new Date(data.sys.sunset * 1000),
            timestamp: new Date()
        };
    }

    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-clouds',
            '04n': 'fas fa-clouds',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        return iconMap[iconCode] || 'fas fa-cloud';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherAPI;
} else {
    window.WeatherAPI = WeatherAPI;
} 
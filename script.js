// Main Weather App - Modular Structure
class WeatherApp {
    constructor() {
        this.apiKey = '35a53c8cd572c107295d066e8bef02c4';
        this.weatherAPI = new WeatherAPI(this.apiKey);
        this.ui = new UI();
        this.storage = new Storage();
        this.currentImage = null;
        this.currentTheme = 'light';
        this.isLocationLoading = false;
    }

    async init() {
        try {
            // Initialize modules
            this.initTheme();
            this.bindEvents();
            this.loadFromLocalStorage();
            
            console.log('Weather App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    bindEvents() {
        // Bind UI events
        this.ui.bindSearchEvents(this.weatherAPI, this);
        this.ui.bindThemeEvents();
        this.ui.bindLocationEvents(this.weatherAPI, this);
        this.ui.bindImageEvents();

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.ui.hideSuggestions();
            }
        });
    }

    initTheme() {
        const savedTheme = this.storage.getTheme();
        this.ui.setTheme(savedTheme);
    }

    async searchWeather(cityName) {
        if (!cityName.trim()) return;

        this.ui.showLoading();
        this.ui.hideError();

        try {
            const coordinates = await this.weatherAPI.getCityCoordinates(cityName);
            const weatherData = await this.weatherAPI.getWeatherData(coordinates.lat, coordinates.lon);
            const processedData = this.weatherAPI.processWeatherData(weatherData, cityName);
            
            this.ui.addWeatherCard(processedData);
            this.storage.saveWeatherData(processedData);
            this.storage.saveSearchHistory(cityName);
            
            this.ui.elements.cityInput.value = '';
            
        } catch (error) {
            console.error('Error searching weather:', error);
            
            let errorMessage = 'Failed to fetch weather data. Please try again.';
            
            if (error.message.includes('City not found')) {
                errorMessage = 'City not found. Please check the spelling and try again.';
            } else if (error.message.includes('401')) {
                errorMessage = 'API key error. Please check your OpenWeatherMap API key.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            }
            
            this.ui.showError(errorMessage);
        } finally {
            this.ui.hideLoading();
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = this.storage.getWeatherData();
            if (savedData.length > 0) {
                this.ui.hideWelcomeMessage();
                // Optionally restore saved weather cards
                // savedData.forEach(data => this.ui.addWeatherCard(data));
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    // Global functions for HTML onclick handlers
    removeImage() {
        this.ui.removeImage();
    }

    selectCity(cityName, lat, lon) {
        this.ui.selectCity(cityName, lat, lon);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = new WeatherApp();
        await app.init();
        
        // Make app globally accessible for HTML onclick handlers
        window.app = app;
        window.ui = app.ui;
        window.weatherAPI = app.weatherAPI;
        
        console.log('Weather App loaded successfully');
    } catch (error) {
        console.error('Error loading Weather App:', error);
    }
});

// Global utility functions
function removeImage() {
    if (window.ui) {
        window.ui.removeImage();
    }
}

function selectCity(cityName, lat, lon) {
    if (window.ui) {
        window.ui.selectCity(cityName, lat, lon);
    }
} 
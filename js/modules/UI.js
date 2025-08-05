// UI Module - DOM manipulation and UI functions
class UI {
    constructor() {
        this.elements = {
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            suggestions: document.getElementById('suggestions'),
            weatherContainer: document.getElementById('weatherContainer'),
            loading: document.getElementById('loading'),
            errorMessage: document.getElementById('errorMessage'),
            welcomeMessage: document.getElementById('welcomeMessage'),
            themeToggle: document.getElementById('themeToggle'),
            locationBtn: document.getElementById('locationBtn'),
            uploadArea: document.getElementById('uploadArea'),
            imagePreview: document.getElementById('imagePreview'),
            analyzeBtn: document.getElementById('analyzeBtn'),
            aiAnalysisResults: document.getElementById('aiAnalysisResults')
        };
    }

    // Search and Suggestions
    bindSearchEvents(weatherAPI, app) {
        this.elements.cityInput.addEventListener('input', (e) => {
            this.handleInputChange(e.target.value, weatherAPI);
        });

        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch(weatherAPI, app);
        });

        this.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(weatherAPI, app);
            }
        });
    }

    async handleInputChange(value, weatherAPI) {
        if (value.length < 2) {
            this.hideSuggestions();
            return;
        }

        try {
            const suggestions = await weatherAPI.getCitySuggestions(value);
            this.displaySuggestions(suggestions);
        } catch (error) {
            console.error('Error getting suggestions:', error);
        }
    }

    displaySuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.elements.suggestions.innerHTML = suggestions
            .map(city => `
                <div class="suggestion-item" onclick="ui.selectCity('${city.name}, ${city.country}', ${city.lat}, ${city.lon})">
                    <strong>${city.name}</strong>
                    ${city.state ? `, ${city.state}` : ''}, ${city.country}
                </div>
            `)
            .join('');

        this.elements.suggestions.style.display = 'block';
    }

    hideSuggestions() {
        this.elements.suggestions.style.display = 'none';
    }

    selectCity(cityName, lat, lon) {
        this.elements.cityInput.value = cityName;
        this.hideSuggestions();
        // Trigger search with coordinates
        if (window.weatherAPI) {
            this.searchWithCoordinates(lat, lon, cityName);
        } else {
            // Fallback to regular search
            this.handleSearch(window.weatherAPI, window.app);
        }
    }

    async handleSearch(weatherAPI, app) {
        const cityName = this.elements.cityInput.value.trim();
        if (!cityName) return;

        this.hideSuggestions();
        try {
            await app.searchWeather(cityName);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Failed to search weather. Please try again.');
        }
    }

    async searchWithCoordinates(lat, lon, cityName) {
        try {
            // We need to pass weatherAPI from the main app
            const weatherData = await window.weatherAPI.getWeatherData(lat, lon);
            const processedData = window.weatherAPI.processWeatherData(weatherData, cityName);
            this.addWeatherCard(processedData);
            this.elements.cityInput.value = '';
        } catch (error) {
            this.showError('Failed to fetch weather data');
        }
    }

    // Weather Cards
    addWeatherCard(weatherData) {
        const card = this.createWeatherCard(weatherData);
        this.elements.weatherContainer.appendChild(card);
        this.hideWelcomeMessage();
        this.saveToLocalStorage();
    }

    createWeatherCard(weatherData) {
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.setAttribute('data-id', weatherData.id);

        const sunrise = weatherData.sunrise.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        const sunset = weatherData.sunset.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });

        card.innerHTML = `
            <div class="weather-header">
                <h3>${weatherData.city}</h3>
                <button class="remove-btn" onclick="ui.removeWeatherCard(${weatherData.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="weather-main">
                <div class="temperature">${weatherData.temperature}°C</div>
                <div class="weather-icon">
                    <i class="${this.getWeatherIcon(weatherData.icon)}"></i>
                </div>
                <div class="weather-description">${weatherData.description}</div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <span>Feels Like</span>
                    <span>${weatherData.feelsLike}°C</span>
                </div>
                <div class="detail-item">
                    <span>Humidity</span>
                    <span>${weatherData.humidity}%</span>
                </div>
                <div class="detail-item">
                    <span>Wind Speed</span>
                    <span>${weatherData.windSpeed} km/h</span>
                </div>
                <div class="detail-item">
                    <span>Wind Direction</span>
                    <span>${weatherData.windDirection}</span>
                </div>
                <div class="detail-item">
                    <span>Pressure</span>
                    <span>${weatherData.pressure} hPa</span>
                </div>
                <div class="detail-item">
                    <span>Visibility</span>
                    <span>${weatherData.visibility} km</span>
                </div>
                <div class="detail-item">
                    <span>Sunrise</span>
                    <span>${sunrise}</span>
                </div>
                <div class="detail-item">
                    <span>Sunset</span>
                    <span>${sunset}</span>
                </div>
            </div>
        `;

        return card;
    }

    removeWeatherCard(id) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            card.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                card.remove();
                this.saveToLocalStorage();
                if (this.elements.weatherContainer.children.length === 0) {
                    this.showWelcomeMessage();
                }
            }, 300);
        }
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

    // Loading and Error States
    showLoading() {
        this.elements.loading.style.display = 'block';
        this.hideError();
    }

    hideLoading() {
        this.elements.loading.style.display = 'none';
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        this.hideLoading();
    }

    hideError() {
        this.elements.errorMessage.style.display = 'none';
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        document.querySelector('.container').insertBefore(successDiv, document.querySelector('.search-section'));
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Welcome Message
    showWelcomeMessage() {
        this.elements.welcomeMessage.style.display = 'block';
    }

    hideWelcomeMessage() {
        this.elements.welcomeMessage.style.display = 'none';
    }

    // Theme Management
    bindThemeEvents() {
        this.elements.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    setTheme(theme) {
        document.body.className = `theme-${theme}`;
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('theme-light') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Location Features
    bindLocationEvents(weatherAPI, app) {
        this.elements.locationBtn.addEventListener('click', () => {
            this.getUserLocation(weatherAPI, app);
        });
    }

    async getUserLocation(weatherAPI, app) {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.updateLocationButton(true);

        try {
            const position = await this.getCurrentPosition();
            const cityName = await weatherAPI.getCityFromCoordinates(position.coords.latitude, position.coords.longitude);
            
            if (cityName) {
                this.elements.cityInput.value = cityName;
                await app.searchWeather(cityName);
                this.showSuccess(`Location detected: ${cityName}`);
            } else {
                this.showError('Could not determine city name from coordinates');
            }
        } catch (error) {
            this.handleLocationError(error);
        } finally {
            this.updateLocationButton(false);
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            });
        });
    }

    handleLocationError(error) {
        let message = 'Failed to get your location';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = 'Location access denied. Please enable location services.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable.';
                break;
            case error.TIMEOUT:
                message = 'Location request timed out.';
                break;
        }
        
        this.showError(message);
    }

    updateLocationButton(isLoading) {
        const btn = this.elements.locationBtn;
        const icon = btn.querySelector('i');
        
        if (isLoading) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
        } else {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-map-marker-alt"></i> My Location';
        }
    }

    // AI Vision Features
    bindImageEvents() {
        this.elements.uploadArea.addEventListener('click', () => {
            this.triggerFileInput();
        });

        this.elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.add('dragover');
        });

        this.elements.uploadArea.addEventListener('dragleave', () => {
            this.elements.uploadArea.classList.remove('dragover');
        });

        this.elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        this.elements.analyzeBtn.addEventListener('click', () => {
            this.analyzeImage();
        });
    }

    triggerFileInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        };
        input.click();
    }

    handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayImagePreview(e.target.result);
            this.currentImage = file;
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview(imageSrc) {
        this.elements.imagePreview.innerHTML = `
            <img src="${imageSrc}" alt="Uploaded image">
            <div class="image-controls">
                <button class="analyze-btn" id="analyzeBtn">
                    <i class="fas fa-brain"></i> Analyze Image
                </button>
                <button class="remove-btn" onclick="ui.removeImage()">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        this.elements.imagePreview.style.display = 'block';
    }

    removeImage() {
        this.elements.imagePreview.style.display = 'none';
        this.elements.aiAnalysisResults.style.display = 'none';
        this.currentImage = null;
    }

    async analyzeImage() {
        if (!this.currentImage) return;

        this.elements.analyzeBtn.disabled = true;
        this.elements.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

        try {
            const analysis = await this.performImageAnalysis();
            this.updateAnalysisResults(analysis);
            this.elements.aiAnalysisResults.style.display = 'block';
        } catch (error) {
            this.showError('Failed to analyze image');
        } finally {
            this.elements.analyzeBtn.disabled = false;
            this.elements.analyzeBtn.innerHTML = '<i class="fas fa-brain"></i> Analyze Image';
        }
    }

    async performImageAnalysis() {
        // Simulated AI analysis
        await this.delay(2000);
        
        const conditions = ['Clear', 'Cloudy', 'Partly Cloudy', 'Overcast'];
        const visibilities = ['Excellent', 'Good', 'Moderate', 'Poor'];
        const lightings = ['Bright', 'Normal', 'Dim', 'Dark'];
        
        return {
            skyCondition: conditions[Math.floor(Math.random() * conditions.length)],
            visibility: visibilities[Math.floor(Math.random() * visibilities.length)],
            lighting: lightings[Math.floor(Math.random() * lightings.length)],
            temperatureEstimate: Math.floor(Math.random() * 40) + 5,
            insights: this.generateAIInsights()
        };
    }

    generateAIInsights() {
        const insights = [
            "Based on the sky conditions, today appears to be a great day for outdoor activities.",
            "The lighting conditions suggest optimal visibility for photography.",
            "Temperature patterns indicate comfortable weather conditions.",
            "Atmospheric conditions are favorable for clear visibility.",
            "Weather patterns show stable conditions with minimal precipitation risk."
        ];
        return insights[Math.floor(Math.random() * insights.length)];
    }

    updateAnalysisResults(analysis) {
        this.elements.aiAnalysisResults.innerHTML = `
            <div class="analysis-grid">
                <div class="analysis-item">
                    <div class="analysis-icon">
                        <i class="fas fa-cloud"></i>
                    </div>
                    <h4>Sky Condition</h4>
                    <p>${analysis.skyCondition}</p>
                </div>
                <div class="analysis-item">
                    <div class="analysis-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <h4>Visibility</h4>
                    <p>${analysis.visibility}</p>
                </div>
                <div class="analysis-item">
                    <div class="analysis-icon">
                        <i class="fas fa-sun"></i>
                    </div>
                    <h4>Lighting</h4>
                    <p>${analysis.lighting}</p>
                </div>
                <div class="analysis-item">
                    <div class="analysis-icon">
                        <i class="fas fa-thermometer-half"></i>
                    </div>
                    <h4>Temperature Estimate</h4>
                    <p>${analysis.temperatureEstimate}°C</p>
                </div>
            </div>
            <div class="ai-insights">
                <h3><i class="fas fa-lightbulb"></i> AI Insights</h3>
                <p>${analysis.insights}</p>
            </div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Local Storage
    saveToLocalStorage() {
        const weatherCards = Array.from(this.elements.weatherContainer.children).map(card => {
            const city = card.querySelector('h3').textContent;
            const temperature = card.querySelector('.temperature').textContent;
            const description = card.querySelector('.weather-description').textContent;
            return { city, temperature, description };
        });
        localStorage.setItem('weatherCards', JSON.stringify(weatherCards));
    }

    loadFromLocalStorage() {
        const savedCards = localStorage.getItem('weatherCards');
        if (savedCards) {
            const cards = JSON.parse(savedCards);
            if (cards.length > 0) {
                this.hideWelcomeMessage();
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
} else {
    window.UI = UI;
} 
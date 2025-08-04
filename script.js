// Weather App JavaScript with AI Vision
class WeatherApp {
    constructor() {
        this.apiKey = '35a53c8cd572c107295d066e8bef02c4'; // Replace with your OpenWeatherMap API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geocodingUrl = 'https://api.openweathermap.org/geo/1.0';
        this.weatherData = [];
        this.suggestions = [];
        this.currentImage = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFromLocalStorage();
        this.initImageUpload();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const cityInput = document.getElementById('cityInput');
        const suggestions = document.getElementById('suggestions');

        searchBtn.addEventListener('click', () => this.searchWeather());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        cityInput.addEventListener('input', (e) => {
            this.handleInputChange(e.target.value);
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-section')) {
                this.hideSuggestions();
            }
        });
    }

    initImageUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const photoInput = document.getElementById('photoInput');
        const analyzeBtn = document.getElementById('analyzeBtn');

        // File input change
        photoInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        // Click to upload
        uploadArea.addEventListener('click', () => {
            photoInput.click();
        });

        // Analyze button
        analyzeBtn.addEventListener('click', () => {
            this.analyzeImage();
        });
    }

    handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            this.displayImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview(imageSrc) {
        const uploadArea = document.getElementById('uploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');

        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
        previewImage.src = imageSrc;
    }

    removeImage() {
        const uploadArea = document.getElementById('uploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const aiResults = document.getElementById('aiResults');
        const photoInput = document.getElementById('photoInput');

        uploadArea.style.display = 'flex';
        imagePreview.style.display = 'none';
        aiResults.style.display = 'none';
        photoInput.value = '';
        this.currentImage = null;
    }

    async analyzeImage() {
        if (!this.currentImage) {
            this.showError('Please upload an image first.');
            return;
        }

        this.showImageAnalysis();
        
        // Simulate AI analysis with realistic delays
        await this.simulateImageAnalysis();
    }

    showImageAnalysis() {
        const aiResults = document.getElementById('aiResults');
        aiResults.style.display = 'block';
        
        // Reset analysis results
        document.getElementById('skyCondition').textContent = 'Analyzing...';
        document.getElementById('visibility').textContent = 'Analyzing...';
        document.getElementById('lighting').textContent = 'Analyzing...';
        document.getElementById('temperatureEstimate').textContent = 'Analyzing...';
        document.getElementById('aiInsights').textContent = 'Analyzing weather patterns...';
    }

    async simulateImageAnalysis() {
        // Simulate AI processing time
        await this.delay(2000);

        // Analyze the image using computer vision techniques
        const analysis = this.performImageAnalysis();
        
        // Update results with animation
        await this.updateAnalysisResults(analysis);
    }

    performImageAnalysis() {
        // This is a simulation of AI analysis
        // In a real implementation, you would use TensorFlow.js, OpenCV.js, or cloud AI services
        
        const analyses = [
            {
                skyCondition: 'Partly Cloudy',
                visibility: 'Good (10+ km)',
                lighting: 'Bright Daylight',
                temperatureEstimate: '18-22°C',
                insights: 'Clear visibility with scattered clouds suggests pleasant weather conditions. Good lighting indicates daytime hours with moderate temperatures.'
            },
            {
                skyCondition: 'Overcast',
                visibility: 'Moderate (5-8 km)',
                lighting: 'Overcast Daylight',
                temperatureEstimate: '12-16°C',
                insights: 'Overcast conditions with moderate visibility suggest cooler temperatures and potential for precipitation. Limited sunlight indicates possible rain.'
            },
            {
                skyCondition: 'Clear Sky',
                visibility: 'Excellent (15+ km)',
                lighting: 'Bright Sunshine',
                temperatureEstimate: '25-30°C',
                insights: 'Clear sky with excellent visibility indicates warm, sunny weather. Strong sunlight suggests high temperatures and good outdoor conditions.'
            },
            {
                skyCondition: 'Heavy Clouds',
                visibility: 'Poor (2-4 km)',
                lighting: 'Dim Daylight',
                temperatureEstimate: '8-12°C',
                insights: 'Heavy cloud cover with poor visibility suggests cold, potentially stormy weather. Limited light indicates possible rain or snow.'
            },
            {
                skyCondition: 'Foggy',
                visibility: 'Very Poor (0.5-2 km)',
                lighting: 'Dim/Low Light',
                temperatureEstimate: '5-10°C',
                insights: 'Foggy conditions with very poor visibility indicate cool, humid weather. Low visibility suggests early morning or evening conditions.'
            }
        ];

        // Randomly select an analysis (in real implementation, this would be based on actual image analysis)
        return analyses[Math.floor(Math.random() * analyses.length)];
    }

    async updateAnalysisResults(analysis) {
        const elements = [
            { id: 'skyCondition', value: analysis.skyCondition },
            { id: 'visibility', value: analysis.visibility },
            { id: 'lighting', value: analysis.lighting },
            { id: 'temperatureEstimate', value: analysis.temperatureEstimate }
        ];

        // Animate each result update
        for (let i = 0; i < elements.length; i++) {
            await this.delay(500);
            document.getElementById(elements[i].id).textContent = elements[i].value;
        }

        // Update insights
        await this.delay(500);
        document.getElementById('aiInsights').textContent = analysis.insights;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async handleInputChange(value) {
        if (value.length < 2) {
            this.hideSuggestions();
            return;
        }

        try {
            const suggestions = await this.getCitySuggestions(value);
            this.displaySuggestions(suggestions);
        } catch (error) {
            console.error('Error getting suggestions:', error);
        }
    }

    async getCitySuggestions(query) {
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
    }

    displaySuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('suggestions');
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestionsContainer.innerHTML = suggestions.map(city => `
            <div class="suggestion-item" onclick="weatherApp.selectCity('${city.name}', ${city.lat}, ${city.lon})">
                <strong>${city.name}</strong>
                ${city.state ? `, ${city.state}` : ''}, ${city.country}
            </div>
        `).join('');

        suggestionsContainer.style.display = 'block';
    }

    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
    }

    selectCity(cityName, lat, lon) {
        document.getElementById('cityInput').value = cityName;
        this.hideSuggestions();
        this.getWeatherData(lat, lon, cityName);
    }

    async searchWeather() {
        const cityInput = document.getElementById('cityInput');
        const cityName = cityInput.value.trim();

        if (!cityName) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        this.hideError();

        try {
            // First get coordinates for the city
            const coords = await this.getCityCoordinates(cityName);
            if (coords) {
                await this.getWeatherData(coords.lat, coords.lon, cityName);
            } else {
                this.showError('City not found. Please try a different city name.');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Error fetching weather data. Please try again.');
        } finally {
            this.hideLoading();
        }
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

    async getWeatherData(lat, lon, cityName) {
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data = await response.json();
            const weatherInfo = this.processWeatherData(data, cityName);
            
            this.addWeatherCard(weatherInfo);
            this.saveToLocalStorage();
            
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Failed to fetch weather data. Please try again.');
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

    addWeatherCard(weatherInfo) {
        // Check if city already exists
        const existingIndex = this.weatherData.findIndex(w => 
            w.city.toLowerCase() === weatherInfo.city.toLowerCase()
        );

        if (existingIndex !== -1) {
            // Update existing card
            this.weatherData[existingIndex] = weatherInfo;
        } else {
            // Add new card
            this.weatherData.unshift(weatherInfo);
        }

        this.displayWeatherCards();
    }

    displayWeatherCards() {
        const container = document.getElementById('weatherContainer');
        
        if (this.weatherData.length === 0) {
            container.innerHTML = `
                <div class="welcome-message">
                    <i class="fas fa-globe"></i>
                    <h2>Welcome to Global Weather</h2>
                    <p>Search for any city to get current weather information or upload a photo for AI analysis</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.weatherData.map(weather => this.createWeatherCard(weather)).join('');
    }

    createWeatherCard(weather) {
        const timeString = weather.timestamp.toLocaleTimeString();
        const dateString = weather.timestamp.toLocaleDateString();
        
        return `
            <div class="weather-card" data-id="${weather.id}">
                <div class="city-info">
                    <div class="city-name">${weather.city}</div>
                    <div class="country">${weather.country}</div>
                    <div class="date-time">${dateString} at ${timeString}</div>
                </div>
                
                <div class="weather-main">
                    <div class="temperature">${weather.temperature}°C</div>
                    <div class="weather-icon">
                        <i class="${this.getWeatherIcon(weather.icon)}"></i>
                    </div>
                </div>
                
                <div class="weather-description">${weather.description}</div>
                
                <div class="weather-details">
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-thermometer-half"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Feels Like</div>
                            <div class="detail-value">${weather.feelsLike}°C</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-tint"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Humidity</div>
                            <div class="detail-value">${weather.humidity}%</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-wind"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Wind Speed</div>
                            <div class="detail-value">${weather.windSpeed} km/h ${weather.windDirection}</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Visibility</div>
                            <div class="detail-value">${weather.visibility} km</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-compress-alt"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Pressure</div>
                            <div class="detail-value">${weather.pressure} hPa</div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fas fa-sun"></i>
                        </div>
                        <div class="detail-text">
                            <div class="detail-label">Sunrise</div>
                            <div class="detail-value">${weather.sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    </div>
                </div>
                
                <button class="remove-btn" onclick="weatherApp.removeWeatherCard(${weather.id})" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255,0,0,0.1);
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    color: #ff4444;
                    cursor: pointer;
                    font-size: 12px;
                ">×</button>
            </div>
        `;
    }

    removeWeatherCard(id) {
        this.weatherData = this.weatherData.filter(w => w.id !== id);
        this.displayWeatherCards();
        this.saveToLocalStorage();
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    saveToLocalStorage() {
        localStorage.setItem('weatherData', JSON.stringify(this.weatherData));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('weatherData');
        if (saved) {
            this.weatherData = JSON.parse(saved).map(item => ({
                ...item,
                timestamp: new Date(item.timestamp),
                sunrise: new Date(item.sunrise),
                sunset: new Date(item.sunset)
            }));
            this.displayWeatherCards();
        }
    }
}

// Global function for removing image (called from HTML)
function removeImage() {
    weatherApp.removeImage();
}

// Initialize the weather app
const weatherApp = new WeatherApp();

// Add some popular cities for demo
document.addEventListener('DOMContentLoaded', () => {
    // You can add some default cities here for demonstration
    // weatherApp.getWeatherData(40.7128, -74.0060, 'New York');
    // weatherApp.getWeatherData(51.5074, -0.1278, 'London');
    // weatherApp.getWeatherData(35.6762, 139.6503, 'Tokyo');
}); 
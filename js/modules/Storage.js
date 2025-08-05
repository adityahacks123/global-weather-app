// Storage Module - Local storage operations
class Storage {
    constructor() {
        this.storageKey = 'weatherAppData';
    }

    // Save weather data to local storage
    saveWeatherData(weatherData) {
        try {
            const existingData = this.getWeatherData();
            const updatedData = [...existingData, weatherData];
            
            // Keep only last 10 weather cards
            if (updatedData.length > 10) {
                updatedData.splice(0, updatedData.length - 10);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(updatedData));
            return true;
        } catch (error) {
            console.error('Error saving weather data:', error);
            return false;
        }
    }

    // Get weather data from local storage
    getWeatherData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading weather data:', error);
            return [];
        }
    }

    // Remove specific weather card
    removeWeatherCard(cardId) {
        try {
            const existingData = this.getWeatherData();
            const updatedData = existingData.filter(card => card.id !== cardId);
            localStorage.setItem(this.storageKey, JSON.stringify(updatedData));
            return true;
        } catch (error) {
            console.error('Error removing weather card:', error);
            return false;
        }
    }

    // Clear all weather data
    clearWeatherData() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing weather data:', error);
            return false;
        }
    }

    // Save theme preference
    saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
            return true;
        } catch (error) {
            console.error('Error saving theme:', error);
            return false;
        }
    }

    // Get saved theme
    getTheme() {
        try {
            return localStorage.getItem('theme') || 'light';
        } catch (error) {
            console.error('Error loading theme:', error);
            return 'light';
        }
    }

    // Save search history
    saveSearchHistory(cityName) {
        try {
            const history = this.getSearchHistory();
            const updatedHistory = [cityName, ...history.filter(city => city !== cityName)].slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            return true;
        } catch (error) {
            console.error('Error saving search history:', error);
            return false;
        }
    }

    // Get search history
    getSearchHistory() {
        try {
            const history = localStorage.getItem('searchHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error loading search history:', error);
            return [];
        }
    }

    // Save AI analysis results
    saveAIAnalysis(analysis) {
        try {
            const timestamp = new Date().toISOString();
            const analysisData = {
                ...analysis,
                timestamp,
                id: Date.now()
            };
            
            const existingAnalyses = this.getAIAnalyses();
            const updatedAnalyses = [analysisData, ...existingAnalyses].slice(0, 5);
            
            localStorage.setItem('aiAnalyses', JSON.stringify(updatedAnalyses));
            return true;
        } catch (error) {
            console.error('Error saving AI analysis:', error);
            return false;
        }
    }

    // Get AI analysis history
    getAIAnalyses() {
        try {
            const analyses = localStorage.getItem('aiAnalyses');
            return analyses ? JSON.parse(analyses) : [];
        } catch (error) {
            console.error('Error loading AI analyses:', error);
            return [];
        }
    }

    // Save user preferences
    savePreferences(preferences) {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(preferences));
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    }

    // Get user preferences
    getPreferences() {
        try {
            const preferences = localStorage.getItem('userPreferences');
            return preferences ? JSON.parse(preferences) : {
                units: 'metric',
                language: 'en',
                notifications: true,
                autoLocation: false
            };
        } catch (error) {
            console.error('Error loading preferences:', error);
            return {
                units: 'metric',
                language: 'en',
                notifications: true,
                autoLocation: false
            };
        }
    }

    // Save favorite cities
    saveFavoriteCities(cities) {
        try {
            localStorage.setItem('favoriteCities', JSON.stringify(cities));
            return true;
        } catch (error) {
            console.error('Error saving favorite cities:', error);
            return false;
        }
    }

    // Get favorite cities
    getFavoriteCities() {
        try {
            const cities = localStorage.getItem('favoriteCities');
            return cities ? JSON.parse(cities) : [];
        } catch (error) {
            console.error('Error loading favorite cities:', error);
            return [];
        }
    }

    // Add city to favorites
    addFavoriteCity(city) {
        try {
            const favorites = this.getFavoriteCities();
            if (!favorites.find(fav => fav.name === city.name)) {
                favorites.push(city);
                this.saveFavoriteCities(favorites);
            }
            return true;
        } catch (error) {
            console.error('Error adding favorite city:', error);
            return false;
        }
    }

    // Remove city from favorites
    removeFavoriteCity(cityName) {
        try {
            const favorites = this.getFavoriteCities();
            const updatedFavorites = favorites.filter(city => city.name !== cityName);
            this.saveFavoriteCities(updatedFavorites);
            return true;
        } catch (error) {
            console.error('Error removing favorite city:', error);
            return false;
        }
    }

    // Check if storage is available
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            const total = 0;
            const used = 0;
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    used += localStorage[key].length + key.length;
                }
            }
            
            return {
                used: used,
                available: 5 * 1024 * 1024 - used, // 5MB limit
                percentage: (used / (5 * 1024 * 1024)) * 100
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return null;
        }
    }

    // Export all data
    exportData() {
        try {
            const data = {
                weatherData: this.getWeatherData(),
                searchHistory: this.getSearchHistory(),
                aiAnalyses: this.getAIAnalyses(),
                preferences: this.getPreferences(),
                favoriteCities: this.getFavoriteCities(),
                theme: this.getTheme(),
                exportDate: new Date().toISOString()
            };
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Error exporting data:', error);
            return null;
        }
    }

    // Import data
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.weatherData) localStorage.setItem(this.storageKey, JSON.stringify(data.weatherData));
            if (data.searchHistory) localStorage.setItem('searchHistory', JSON.stringify(data.searchHistory));
            if (data.aiAnalyses) localStorage.setItem('aiAnalyses', JSON.stringify(data.aiAnalyses));
            if (data.preferences) localStorage.setItem('userPreferences', JSON.stringify(data.preferences));
            if (data.favoriteCities) localStorage.setItem('favoriteCities', JSON.stringify(data.favoriteCities));
            if (data.theme) localStorage.setItem('theme', data.theme);
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all app data
    clearAllData() {
        try {
            const keys = [
                this.storageKey,
                'searchHistory',
                'aiAnalyses',
                'userPreferences',
                'favoriteCities',
                'theme'
            ];
            
            keys.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
} else {
    window.Storage = Storage;
} 
// Search Component
// Level 4 Mini-Project

class SearchComponent {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            placeholder: 'Search for a city...',
            minLength: 2,
            debounceDelay: 300,
            maxResults: 10,
            showRecent: true,
            showFavorites: true,
            ...options
        };
        this.searchInput = null;
        this.resultsContainer = null;
        this.recentSearches = this.loadRecentSearches();
        this.favoriteCities = this.loadFavoriteCities();
        this.searchTimeout = null;
        this.currentResults = [];
        this.selectedIndex = -1;
    }
    
    // Initialize search component
    init() {
        this.createSearchHTML();
        this.attachEventListeners();
        this.setupKeyboardNavigation();
    }
    
    // Create search HTML
    createSearchHTML() {
        this.container.innerHTML = `
            <div class="search-container">
                <div class="search-input-wrapper">
                    <input type="text" 
                           class="search-input" 
                           placeholder="${this.options.placeholder}"
                           autocomplete="off">
                    <button class="search-clear" style="display: none;">
                        <i class="icon-close"></i>
                    </button>
                    <button class="search-submit">
                        <i class="icon-search"></i>
                    </button>
                </div>
                <div class="search-results" style="display: none;">
                    <div class="search-results-content"></div>
                </div>
            </div>
        `;
        
        this.searchInput = this.container.querySelector('.search-input');
        this.resultsContainer = this.container.querySelector('.search-results');
    }
    
    // Attach event listeners
    attachEventListeners() {
        // Input events
        this.searchInput.addEventListener('input', (e) => this.handleInput(e));
        this.searchInput.addEventListener('focus', () => this.handleFocus());
        this.searchInput.addEventListener('blur', () => this.handleBlur());
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Button events
        const clearBtn = this.container.querySelector('.search-clear');
        const submitBtn = this.container.querySelector('.search-submit');
        
        clearBtn.addEventListener('click', () => this.clearSearch());
        submitBtn.addEventListener('click', () => this.submitSearch());
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.hideResults();
            }
        });
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        this.searchInput.addEventListener('keydown', (e) => {
            if (!this.resultsContainer.style.display || this.resultsContainer.style.display === 'none') {
                return;
            }
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateDown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateUp();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.selectResult();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.hideResults();
                    break;
            }
        });
    }
    
    // Handle input
    handleInput(e) {
        const query = e.target.value.trim();
        
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Show/hide clear button
        const clearBtn = this.container.querySelector('.search-clear');
        clearBtn.style.display = query ? 'block' : 'none';
        
        if (query.length < this.options.minLength) {
            this.hideResults();
            return;
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, this.options.debounceDelay);
    }
    
    // Handle focus
    handleFocus() {
        const query = this.searchInput.value.trim();
        
        if (query.length >= this.options.minLength) {
            this.showResults();
        } else if (this.options.showRecent && this.recentSearches.length > 0) {
            this.showRecentSearches();
        } else if (this.options.showFavorites && this.favoriteCities.length > 0) {
            this.showFavoriteCities();
        }
    }
    
    // Handle blur
    handleBlur() {
        // Delay hiding to allow for clicks on results
        setTimeout(() => {
            this.hideResults();
        }, 150);
    }
    
    // Handle keydown
    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.submitSearch();
        }
    }
    
    // Perform search
    async performSearch(query) {
        try {
            // Show loading state
            this.showLoading();
            
            // Emit search event
            const searchEvent = new CustomEvent('citySearch', {
                detail: { query }
            });
            this.container.dispatchEvent(searchEvent);
            
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        }
    }
    
    // Show loading state
    showLoading() {
        this.resultsContainer.innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">Searching...</div>
            </div>
        `;
        this.showResults();
    }
    
    // Show search results
    showResults(results = []) {
        this.currentResults = results;
        this.selectedIndex = -1;
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        const resultsHTML = results.slice(0, this.options.maxResults).map((result, index) => `
            <div class="search-result" data-index="${index}">
                <div class="result-main">
                    <div class="result-name">${result.name}</div>
                    <div class="result-country">${result.country}</div>
                </div>
                <div class="result-details">
                    <div class="result-coords">${result.lat.toFixed(2)}, ${result.lon.toFixed(2)}</div>
                    <div class="result-state">${result.state || ''}</div>
                </div>
            </div>
        `).join('');
        
        this.resultsContainer.innerHTML = resultsHTML;
        this.showResults();
        
        // Attach click listeners to results
        this.attachResultListeners();
    }
    
    // Show recent searches
    showRecentSearches() {
        if (this.recentSearches.length === 0) return;
        
        const recentHTML = this.recentSearches.map((search, index) => `
            <div class="search-result recent" data-index="${index}">
                <div class="result-main">
                    <div class="result-name">${search.name}</div>
                    <div class="result-country">${search.country}</div>
                </div>
                <div class="result-details">
                    <div class="result-time">${this.formatTime(search.timestamp)}</div>
                </div>
            </div>
        `).join('');
        
        this.resultsContainer.innerHTML = `
            <div class="search-section">
                <div class="section-title">Recent Searches</div>
                ${recentHTML}
            </div>
        `;
        this.showResults();
        this.attachResultListeners();
    }
    
    // Show favorite cities
    showFavoriteCities() {
        if (this.favoriteCities.length === 0) return;
        
        const favoritesHTML = this.favoriteCities.map((city, index) => `
            <div class="search-result favorite" data-index="${index}">
                <div class="result-main">
                    <div class="result-name">${city.name}</div>
                    <div class="result-country">${city.country}</div>
                </div>
                <div class="result-details">
                    <div class="result-favorite">⭐</div>
                </div>
            </div>
        `).join('');
        
        this.resultsContainer.innerHTML = `
            <div class="search-section">
                <div class="section-title">Favorite Cities</div>
                ${favoritesHTML}
            </div>
        `;
        this.showResults();
        this.attachResultListeners();
    }
    
    // Show no results
    showNoResults() {
        this.resultsContainer.innerHTML = `
            <div class="search-no-results">
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">No cities found</div>
                <div class="no-results-hint">Try a different search term</div>
            </div>
        `;
        this.showResults();
    }
    
    // Show error
    showError(message) {
        this.resultsContainer.innerHTML = `
            <div class="search-error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
            </div>
        `;
        this.showResults();
    }
    
    // Attach result listeners
    attachResultListeners() {
        const results = this.resultsContainer.querySelectorAll('.search-result');
        
        results.forEach((result, index) => {
            result.addEventListener('click', () => {
                this.selectResult(index);
            });
            
            result.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
        });
    }
    
    // Navigate down
    navigateDown() {
        const results = this.resultsContainer.querySelectorAll('.search-result');
        if (results.length === 0) return;
        
        this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
        this.updateSelection();
    }
    
    // Navigate up
    navigateUp() {
        const results = this.resultsContainer.querySelectorAll('.search-result');
        if (results.length === 0) return;
        
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection();
    }
    
    // Update selection
    updateSelection() {
        const results = this.resultsContainer.querySelectorAll('.search-result');
        
        results.forEach((result, index) => {
            result.classList.toggle('selected', index === this.selectedIndex);
        });
    }
    
    // Select result
    selectResult(index = this.selectedIndex) {
        if (index < 0 || index >= this.currentResults.length) return;
        
        const result = this.currentResults[index];
        this.selectCity(result);
    }
    
    // Select city
    selectCity(city) {
        // Add to recent searches
        this.addToRecentSearches(city);
        
        // Clear search
        this.clearSearch();
        
        // Emit city selected event
        const selectEvent = new CustomEvent('citySelected', {
            detail: { city }
        });
        this.container.dispatchEvent(selectEvent);
    }
    
    // Add to recent searches
    addToRecentSearches(city) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(item => 
            item.name !== city.name || item.country !== city.country
        );
        
        // Add to beginning
        this.recentSearches.unshift({
            ...city,
            timestamp: Date.now()
        });
        
        // Keep only last 10
        this.recentSearches = this.recentSearches.slice(0, 10);
        
        // Save to localStorage
        this.saveRecentSearches();
    }
    
    // Add to favorites
    addToFavorites(city) {
        // Check if already exists
        const exists = this.favoriteCities.some(item => 
            item.name === city.name && item.country === city.country
        );
        
        if (!exists) {
            this.favoriteCities.push(city);
            this.saveFavoriteCities();
        }
    }
    
    // Remove from favorites
    removeFromFavorites(city) {
        this.favoriteCities = this.favoriteCities.filter(item => 
            !(item.name === city.name && item.country === city.country)
        );
        this.saveFavoriteCities();
    }
    
    // Clear search
    clearSearch() {
        this.searchInput.value = '';
        this.hideResults();
        this.searchInput.focus();
    }
    
    // Submit search
    submitSearch() {
        const query = this.searchInput.value.trim();
        
        if (query.length >= this.options.minLength) {
            this.performSearch(query);
        }
    }
    
    // Show results
    showResults() {
        this.resultsContainer.style.display = 'block';
    }
    
    // Hide results
    hideResults() {
        this.resultsContainer.style.display = 'none';
        this.selectedIndex = -1;
    }
    
    // Load recent searches
    loadRecentSearches() {
        try {
            const stored = localStorage.getItem('weatherRecentSearches');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading recent searches:', error);
            return [];
        }
    }
    
    // Save recent searches
    saveRecentSearches() {
        try {
            localStorage.setItem('weatherRecentSearches', JSON.stringify(this.recentSearches));
        } catch (error) {
            console.error('Error saving recent searches:', error);
        }
    }
    
    // Load favorite cities
    loadFavoriteCities() {
        try {
            const stored = localStorage.getItem('weatherFavoriteCities');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading favorite cities:', error);
            return [];
        }
    }
    
    // Save favorite cities
    saveFavoriteCities() {
        try {
            localStorage.setItem('weatherFavoriteCities', JSON.stringify(this.favoriteCities));
        } catch (error) {
            console.error('Error saving favorite cities:', error);
        }
    }
    
    // Format time
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    }
    
    // Set search results
    setSearchResults(results) {
        this.showResults(results);
    }
    
    // Get current query
    getCurrentQuery() {
        return this.searchInput.value.trim();
    }
    
    // Set query
    setQuery(query) {
        this.searchInput.value = query;
        this.searchInput.dispatchEvent(new Event('input'));
    }
    
    // Focus input
    focus() {
        this.searchInput.focus();
    }
    
    // Blur input
    blur() {
        this.searchInput.blur();
    }
    
    // Destroy component
    destroy() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.container.innerHTML = '';
        this.searchInput = null;
        this.resultsContainer = null;
    }
}

// Export class
window.SearchComponent = SearchComponent;



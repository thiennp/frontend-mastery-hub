// Cache Manager Utility
// Level 4 Mini-Project

class CacheManager {
    constructor(defaultTTL = 300000) { // 5 minutes default
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Cleanup every minute
    }
    
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }
        
        // Check if item has expired
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        // Update access time for LRU
        item.lastAccessed = Date.now();
        
        return item.data;
    }
    
    set(key, data, ttl = this.defaultTTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            lastAccessed: Date.now(),
            ttl
        });
    }
    
    has(key) {
        return this.get(key) !== null;
    }
    
    delete(key) {
        return this.cache.delete(key);
    }
    
    clear() {
        this.cache.clear();
    }
    
    size() {
        return this.cache.size;
    }
    
    keys() {
        return Array.from(this.cache.keys());
    }
    
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
        
        if (keysToDelete.length > 0) {
            console.log(`Cleaned up ${keysToDelete.length} expired cache entries`);
        }
    }
    
    // Get cache statistics
    getStats() {
        const now = Date.now();
        let totalSize = 0;
        let expiredCount = 0;
        let activeCount = 0;
        
        for (const [key, item] of this.cache.entries()) {
            totalSize += this.calculateItemSize(item);
            
            if (now - item.timestamp > item.ttl) {
                expiredCount++;
            } else {
                activeCount++;
            }
        }
        
        return {
            totalItems: this.cache.size,
            activeItems: activeCount,
            expiredItems: expiredCount,
            totalSize: totalSize,
            memoryUsage: this.getMemoryUsage()
        };
    }
    
    calculateItemSize(item) {
        // Rough estimation of item size
        return JSON.stringify(item).length * 2; // 2 bytes per character
    }
    
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }
    
    // LRU eviction when cache is full
    evictLRU() {
        if (this.cache.size === 0) return;
        
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, item] of this.cache.entries()) {
            if (item.lastAccessed < oldestTime) {
                oldestTime = item.lastAccessed;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            console.log(`Evicted LRU item: ${oldestKey}`);
        }
    }
    
    // Set maximum cache size
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
    }
    
    // Check if cache is full and evict if necessary
    checkAndEvict() {
        if (this.maxSize && this.cache.size >= this.maxSize) {
            this.evictLRU();
        }
    }
    
    // Set with automatic eviction
    setWithEviction(key, data, ttl = this.defaultTTL) {
        this.checkAndEvict();
        this.set(key, data, ttl);
    }
    
    // Batch operations
    setMultiple(items) {
        for (const [key, data, ttl] of items) {
            this.setWithEviction(key, data, ttl);
        }
    }
    
    getMultiple(keys) {
        const results = {};
        for (const key of keys) {
            results[key] = this.get(key);
        }
        return results;
    }
    
    // Cache with compression (simple JSON compression)
    setCompressed(key, data, ttl = this.defaultTTL) {
        try {
            const compressed = this.compress(JSON.stringify(data));
            this.setWithEviction(key, compressed, ttl);
        } catch (error) {
            console.error('Failed to compress data:', error);
            this.setWithEviction(key, data, ttl);
        }
    }
    
    getCompressed(key) {
        const compressed = this.get(key);
        if (!compressed) return null;
        
        try {
            return JSON.parse(this.decompress(compressed));
        } catch (error) {
            console.error('Failed to decompress data:', error);
            return compressed;
        }
    }
    
    compress(str) {
        // Simple compression - in a real app, you'd use a proper compression library
        return btoa(str);
    }
    
    decompress(str) {
        return atob(str);
    }
    
    // Cache with tags for easy invalidation
    setWithTags(key, data, tags = [], ttl = this.defaultTTL) {
        const item = {
            data,
            timestamp: Date.now(),
            lastAccessed: Date.now(),
            ttl,
            tags
        };
        
        this.cache.set(key, item);
        this.checkAndEvict();
    }
    
    invalidateByTag(tag) {
        const keysToDelete = [];
        
        for (const [key, item] of this.cache.entries()) {
            if (item.tags && item.tags.includes(tag)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
        console.log(`Invalidated ${keysToDelete.length} items with tag: ${tag}`);
    }
    
    // Cache warming
    async warmCache(key, dataLoader, ttl = this.defaultTTL) {
        try {
            const data = await dataLoader();
            this.setWithEviction(key, data, ttl);
            return data;
        } catch (error) {
            console.error('Cache warming failed:', error);
            throw error;
        }
    }
    
    // Cache with fallback
    async getWithFallback(key, fallbackLoader, ttl = this.defaultTTL) {
        let data = this.get(key);
        
        if (data === null) {
            try {
                data = await fallbackLoader();
                this.setWithEviction(key, data, ttl);
            } catch (error) {
                console.error('Fallback loader failed:', error);
                throw error;
            }
        }
        
        return data;
    }
    
    // Destroy cache manager
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        this.clear();
    }
}

// Advanced cache manager with different storage backends
class AdvancedCacheManager extends CacheManager {
    constructor(options = {}) {
        super(options.defaultTTL);
        this.storage = options.storage || 'memory';
        this.persistentStorage = options.persistentStorage || null;
        this.maxMemorySize = options.maxMemorySize || 50 * 1024 * 1024; // 50MB
    }
    
    set(key, data, ttl = this.defaultTTL) {
        super.set(key, data, ttl);
        
        // Persist to localStorage if available
        if (this.persistentStorage && this.storage === 'hybrid') {
            try {
                const item = {
                    data,
                    timestamp: Date.now(),
                    ttl
                };
                this.persistentStorage.setItem(`cache_${key}`, JSON.stringify(item));
            } catch (error) {
                console.warn('Failed to persist to storage:', error);
            }
        }
    }
    
    get(key) {
        let data = super.get(key);
        
        // Try to load from persistent storage if not in memory
        if (data === null && this.persistentStorage && this.storage === 'hybrid') {
            try {
                const stored = this.persistentStorage.getItem(`cache_${key}`);
                if (stored) {
                    const item = JSON.parse(stored);
                    if (Date.now() - item.timestamp < item.ttl) {
                        data = item.data;
                        // Load back into memory
                        super.set(key, data, item.ttl);
                    } else {
                        // Remove expired item
                        this.persistentStorage.removeItem(`cache_${key}`);
                    }
                }
            } catch (error) {
                console.warn('Failed to load from storage:', error);
            }
        }
        
        return data;
    }
    
    clear() {
        super.clear();
        
        // Clear persistent storage
        if (this.persistentStorage) {
            const keys = Object.keys(this.persistentStorage);
            keys.forEach(key => {
                if (key.startsWith('cache_')) {
                    this.persistentStorage.removeItem(key);
                }
            });
        }
    }
}

// Export classes
window.CacheManager = CacheManager;
window.AdvancedCacheManager = AdvancedCacheManager;


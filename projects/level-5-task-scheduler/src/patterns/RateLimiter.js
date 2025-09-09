// Rate Limiter Pattern
// Implements rate limiting for controlling request frequency

class RateLimiter {
    constructor(options = {}) {
        this.limit = options.limit || 100;
        this.window = options.window || 60000; // 1 minute
        this.algorithm = options.algorithm || 'sliding-window';
        this.keyGenerator = options.keyGenerator || (() => 'default');
        this.onLimitExceeded = options.onLimitExceeded || (() => {});
        this.onLimitReset = options.onLimitReset || (() => {});
        
        this.requests = new Map();
        this.cleanupInterval = null;
        this.startCleanup();
    }

    // Check if request is allowed
    async isAllowed(key = null) {
        const requestKey = this.keyGenerator(key);
        const now = Date.now();
        
        switch (this.algorithm) {
            case 'sliding-window':
                return this.slidingWindowCheck(requestKey, now);
            case 'token-bucket':
                return this.tokenBucketCheck(requestKey, now);
            case 'fixed-window':
                return this.fixedWindowCheck(requestKey, now);
            default:
                throw new Error(`Unsupported algorithm: ${this.algorithm}`);
        }
    }

    // Sliding window algorithm
    slidingWindowCheck(key, now) {
        if (!this.requests.has(key)) {
            this.requests.set(key, []);
        }
        
        const requests = this.requests.get(key);
        const windowStart = now - this.window;
        
        // Remove old requests
        const recentRequests = requests.filter(time => time > windowStart);
        this.requests.set(key, recentRequests);
        
        if (recentRequests.length >= this.limit) {
            this.onLimitExceeded(key, recentRequests.length, this.limit);
            return false;
        }
        
        // Add current request
        recentRequests.push(now);
        this.requests.set(key, recentRequests);
        
        return true;
    }

    // Token bucket algorithm
    tokenBucketCheck(key, now) {
        if (!this.requests.has(key)) {
            this.requests.set(key, {
                tokens: this.limit,
                lastRefill: now
            });
        }
        
        const bucket = this.requests.get(key);
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = Math.floor(timePassed / (this.window / this.limit));
        
        // Refill tokens
        bucket.tokens = Math.min(this.limit, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;
        
        if (bucket.tokens >= 1) {
            bucket.tokens--;
            return true;
        }
        
        this.onLimitExceeded(key, this.limit - bucket.tokens, this.limit);
        return false;
    }

    // Fixed window algorithm
    fixedWindowCheck(key, now) {
        const windowStart = Math.floor(now / this.window) * this.window;
        const windowKey = `${key}:${windowStart}`;
        
        if (!this.requests.has(windowKey)) {
            this.requests.set(windowKey, 0);
        }
        
        const requestCount = this.requests.get(windowKey);
        
        if (requestCount >= this.limit) {
            this.onLimitExceeded(key, requestCount, this.limit);
            return false;
        }
        
        this.requests.set(windowKey, requestCount + 1);
        return true;
    }

    // Execute function with rate limiting
    async execute(fn, key = null) {
        const isAllowed = await this.isAllowed(key);
        
        if (!isAllowed) {
            throw new Error('Rate limit exceeded');
        }
        
        return await fn();
    }

    // Get current usage for a key
    getUsage(key = null) {
        const requestKey = this.keyGenerator(key);
        const now = Date.now();
        
        switch (this.algorithm) {
            case 'sliding-window':
                return this.getSlidingWindowUsage(requestKey, now);
            case 'token-bucket':
                return this.getTokenBucketUsage(requestKey, now);
            case 'fixed-window':
                return this.getFixedWindowUsage(requestKey, now);
            default:
                return { used: 0, limit: this.limit, remaining: this.limit };
        }
    }

    getSlidingWindowUsage(key, now) {
        if (!this.requests.has(key)) {
            return { used: 0, limit: this.limit, remaining: this.limit };
        }
        
        const requests = this.requests.get(key);
        const windowStart = now - this.window;
        const recentRequests = requests.filter(time => time > windowStart);
        
        return {
            used: recentRequests.length,
            limit: this.limit,
            remaining: Math.max(0, this.limit - recentRequests.length)
        };
    }

    getTokenBucketUsage(key, now) {
        if (!this.requests.has(key)) {
            return { used: 0, limit: this.limit, remaining: this.limit };
        }
        
        const bucket = this.requests.get(key);
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = Math.floor(timePassed / (this.window / this.limit));
        const currentTokens = Math.min(this.limit, bucket.tokens + tokensToAdd);
        
        return {
            used: this.limit - currentTokens,
            limit: this.limit,
            remaining: currentTokens
        };
    }

    getFixedWindowUsage(key, now) {
        const windowStart = Math.floor(now / this.window) * this.window;
        const windowKey = `${key}:${windowStart}`;
        
        if (!this.requests.has(windowKey)) {
            return { used: 0, limit: this.limit, remaining: this.limit };
        }
        
        const used = this.requests.get(windowKey);
        
        return {
            used,
            limit: this.limit,
            remaining: Math.max(0, this.limit - used)
        };
    }

    // Get reset time for a key
    getResetTime(key = null) {
        const requestKey = this.keyGenerator(key);
        const now = Date.now();
        
        switch (this.algorithm) {
            case 'sliding-window':
                return this.getSlidingWindowResetTime(requestKey, now);
            case 'token-bucket':
                return this.getTokenBucketResetTime(requestKey, now);
            case 'fixed-window':
                return this.getFixedWindowResetTime(now);
            default:
                return now + this.window;
        }
    }

    getSlidingWindowResetTime(key, now) {
        if (!this.requests.has(key)) {
            return now;
        }
        
        const requests = this.requests.get(key);
        if (requests.length === 0) {
            return now;
        }
        
        const oldestRequest = Math.min(...requests);
        return oldestRequest + this.window;
    }

    getTokenBucketResetTime(key, now) {
        if (!this.requests.has(key)) {
            return now;
        }
        
        const bucket = this.requests.get(key);
        const timePassed = now - bucket.lastRefill;
        const tokensToAdd = Math.floor(timePassed / (this.window / this.limit));
        const currentTokens = Math.min(this.limit, bucket.tokens + tokensToAdd);
        
        if (currentTokens >= 1) {
            return now;
        }
        
        const tokensNeeded = 1 - currentTokens;
        const timeNeeded = tokensNeeded * (this.window / this.limit);
        return now + timeNeeded;
    }

    getFixedWindowResetTime(now) {
        const windowStart = Math.floor(now / this.window) * this.window;
        return windowStart + this.window;
    }

    // Start cleanup process
    startCleanup() {
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.window);
    }

    // Stop cleanup process
    stopCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    // Clean up old entries
    cleanup() {
        const now = Date.now();
        const cutoff = now - this.window * 2; // Keep 2 windows of data
        
        for (const [key, value] of this.requests) {
            if (Array.isArray(value)) {
                // Sliding window
                const recentRequests = value.filter(time => time > cutoff);
                if (recentRequests.length === 0) {
                    this.requests.delete(key);
                } else {
                    this.requests.set(key, recentRequests);
                }
            } else if (typeof value === 'object' && value.lastRefill) {
                // Token bucket
                if (value.lastRefill < cutoff) {
                    this.requests.delete(key);
                }
            } else if (typeof value === 'number') {
                // Fixed window
                const windowStart = Math.floor(now / this.window) * this.window;
                const keyWindowStart = parseInt(key.split(':')[1]);
                if (keyWindowStart < windowStart - this.window) {
                    this.requests.delete(key);
                }
            }
        }
    }

    // Get statistics
    getStats() {
        const now = Date.now();
        const stats = {
            algorithm: this.algorithm,
            limit: this.limit,
            window: this.window,
            totalKeys: this.requests.size,
            activeKeys: 0,
            totalRequests: 0
        };
        
        for (const [key, value] of this.requests) {
            if (Array.isArray(value)) {
                // Sliding window
                const recentRequests = value.filter(time => time > now - this.window);
                if (recentRequests.length > 0) {
                    stats.activeKeys++;
                    stats.totalRequests += recentRequests.length;
                }
            } else if (typeof value === 'object' && value.lastRefill) {
                // Token bucket
                if (value.lastRefill > now - this.window) {
                    stats.activeKeys++;
                    stats.totalRequests += this.limit - value.tokens;
                }
            } else if (typeof value === 'number') {
                // Fixed window
                const windowStart = Math.floor(now / this.window) * this.window;
                const keyWindowStart = parseInt(key.split(':')[1]);
                if (keyWindowStart === windowStart) {
                    stats.activeKeys++;
                    stats.totalRequests += value;
                }
            }
        }
        
        return stats;
    }

    // Reset rate limiter
    reset() {
        this.requests.clear();
        this.onLimitReset();
    }

    // Set custom key generator
    setKeyGenerator(generator) {
        if (typeof generator !== 'function') {
            throw new TypeError('Key generator must be a function');
        }
        this.keyGenerator = generator;
    }

    // Set limit exceeded callback
    setOnLimitExceeded(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Limit exceeded callback must be a function');
        }
        this.onLimitExceeded = callback;
    }

    // Set limit reset callback
    setOnLimitReset(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Limit reset callback must be a function');
        }
        this.onLimitReset = callback;
    }

    // Destroy rate limiter
    destroy() {
        this.stopCleanup();
        this.requests.clear();
    }
}

// Advanced Rate Limiter with multiple algorithms
class AdvancedRateLimiter extends RateLimiter {
    constructor(options = {}) {
        super(options);
        this.algorithms = options.algorithms || ['sliding-window', 'token-bucket'];
        this.currentAlgorithm = 0;
        this.algorithmSwitchInterval = options.algorithmSwitchInterval || 300000; // 5 minutes
        this.performanceMetrics = new Map();
        this.startAlgorithmSwitching();
    }

    async isAllowed(key = null) {
        const algorithm = this.algorithms[this.currentAlgorithm];
        const startTime = Date.now();
        
        try {
            const result = await this.executeWithAlgorithm(algorithm, key);
            this.recordPerformance(algorithm, Date.now() - startTime, true);
            return result;
        } catch (error) {
            this.recordPerformance(algorithm, Date.now() - startTime, false);
            throw error;
        }
    }

    async executeWithAlgorithm(algorithm, key) {
        const now = Date.now();
        
        switch (algorithm) {
            case 'sliding-window':
                return this.slidingWindowCheck(key, now);
            case 'token-bucket':
                return this.tokenBucketCheck(key, now);
            case 'fixed-window':
                return this.fixedWindowCheck(key, now);
            default:
                throw new Error(`Unsupported algorithm: ${algorithm}`);
        }
    }

    recordPerformance(algorithm, duration, success) {
        if (!this.performanceMetrics.has(algorithm)) {
            this.performanceMetrics.set(algorithm, {
                totalRequests: 0,
                successfulRequests: 0,
                totalDuration: 0,
                averageDuration: 0
            });
        }
        
        const metrics = this.performanceMetrics.get(algorithm);
        metrics.totalRequests++;
        if (success) {
            metrics.successfulRequests++;
        }
        metrics.totalDuration += duration;
        metrics.averageDuration = metrics.totalDuration / metrics.totalRequests;
    }

    startAlgorithmSwitching() {
        setInterval(() => {
            this.switchToBestAlgorithm();
        }, this.algorithmSwitchInterval);
    }

    switchToBestAlgorithm() {
        let bestAlgorithm = 0;
        let bestScore = 0;
        
        for (let i = 0; i < this.algorithms.length; i++) {
            const algorithm = this.algorithms[i];
            const metrics = this.performanceMetrics.get(algorithm);
            
            if (metrics && metrics.totalRequests > 0) {
                const successRate = metrics.successfulRequests / metrics.totalRequests;
                const speedScore = 1 / (metrics.averageDuration || 1);
                const score = successRate * speedScore;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestAlgorithm = i;
                }
            }
        }
        
        if (bestAlgorithm !== this.currentAlgorithm) {
            this.currentAlgorithm = bestAlgorithm;
            console.log(`Switched to algorithm: ${this.algorithms[this.currentAlgorithm]}`);
        }
    }

    getAdvancedStats() {
        const baseStats = this.getStats();
        const algorithmStats = {};
        
        for (const [algorithm, metrics] of this.performanceMetrics) {
            algorithmStats[algorithm] = {
                ...metrics,
                successRate: metrics.totalRequests > 0 ? 
                    metrics.successfulRequests / metrics.totalRequests : 0
            };
        }
        
        return {
            ...baseStats,
            currentAlgorithm: this.algorithms[this.currentAlgorithm],
            algorithmStats,
            availableAlgorithms: this.algorithms
        };
    }
}

// Rate Limiter Factory
class RateLimiterFactory {
    static create(options = {}) {
        if (options.advanced) {
            return new AdvancedRateLimiter(options);
        }
        return new RateLimiter(options);
    }

    static createForAPI(options = {}) {
        return new RateLimiter({
            limit: 100,
            window: 60000,
            algorithm: 'sliding-window',
            keyGenerator: (req) => req.ip || 'default',
            ...options
        });
    }

    static createForDatabase(options = {}) {
        return new RateLimiter({
            limit: 50,
            window: 60000,
            algorithm: 'token-bucket',
            keyGenerator: (query) => query.type || 'default',
            ...options
        });
    }

    static createForFileOperations(options = {}) {
        return new RateLimiter({
            limit: 20,
            window: 60000,
            algorithm: 'fixed-window',
            keyGenerator: (operation) => operation.type || 'default',
            ...options
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RateLimiter, AdvancedRateLimiter, RateLimiterFactory };
}


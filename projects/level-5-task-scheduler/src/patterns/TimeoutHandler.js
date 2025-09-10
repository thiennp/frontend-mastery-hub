// Timeout Handler Pattern
// Implements timeout handling for async operations

class TimeoutHandler {
    constructor(options = {}) {
        this.defaultTimeout = options.defaultTimeout || 30000;
        this.maxTimeout = options.maxTimeout || 300000; // 5 minutes
        this.minTimeout = options.minTimeout || 1000; // 1 second
        this.onTimeout = options.onTimeout || (() => {});
        this.onTimeoutWarning = options.onTimeoutWarning || (() => {});
        this.warningThreshold = options.warningThreshold || 0.8; // 80% of timeout
        this.activeTimeouts = new Map();
        this.timeoutStats = {
            totalTimeouts: 0,
            successfulTimeouts: 0,
            failedTimeouts: 0,
            averageDuration: 0,
            totalDuration: 0
        };
    }

    // Execute function with timeout
    async execute(fn, timeout = null, options = {}) {
        const actualTimeout = timeout || this.defaultTimeout;
        const timeoutId = options.id || this.generateId();
        const warningTime = Math.floor(actualTimeout * this.warningThreshold);
        
        // Validate timeout
        if (actualTimeout < this.minTimeout || actualTimeout > this.maxTimeout) {
            throw new Error(`Timeout must be between ${this.minTimeout}ms and ${this.maxTimeout}ms`);
        }
        
        const startTime = Date.now();
        let timeoutIdInternal;
        let warningTimeoutId;
        let completed = false;
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            timeoutIdInternal = setTimeout(() => {
                if (!completed) {
                    this.onTimeout(timeoutId, actualTimeout);
                    this.recordTimeout(false, Date.now() - startTime);
                    reject(new Error(`Operation timeout after ${actualTimeout}ms`));
                }
            }, actualTimeout);
        });
        
        // Create warning timeout
        if (warningTime > 0) {
            warningTimeoutId = setTimeout(() => {
                if (!completed) {
                    this.onTimeoutWarning(timeoutId, actualTimeout, warningTime);
                }
            }, warningTime);
        }
        
        // Store timeout info
        this.activeTimeouts.set(timeoutId, {
            startTime,
            timeout: actualTimeout,
            warningTime,
            timeoutId: timeoutIdInternal,
            warningTimeoutId
        });
        
        try {
            // Race between function and timeout
            const result = await Promise.race([fn(), timeoutPromise]);
            
            // Clear timeouts
            this.clearTimeout(timeoutId);
            completed = true;
            
            // Record successful completion
            this.recordTimeout(true, Date.now() - startTime);
            
            return result;
        } catch (error) {
            // Clear timeouts
            this.clearTimeout(timeoutId);
            completed = true;
            
            // Record failed completion
            this.recordTimeout(false, Date.now() - startTime);
            
            throw error;
        }
    }

    // Execute with retry on timeout
    async executeWithRetry(fn, timeout = null, retryOptions = {}) {
        const maxRetries = retryOptions.maxRetries || 3;
        const retryDelay = retryOptions.retryDelay || 1000;
        const backoffMultiplier = retryOptions.backoffMultiplier || 2;
        const maxRetryTimeout = retryOptions.maxRetryTimeout || this.maxTimeout;
        
        let lastError;
        let currentTimeout = timeout || this.defaultTimeout;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.execute(fn, currentTimeout, { id: `retry-${attempt}` });
            } catch (error) {
                lastError = error;
                
                // Check if it's a timeout error
                if (error.message.includes('timeout')) {
                    // Increase timeout for next attempt
                    currentTimeout = Math.min(currentTimeout * backoffMultiplier, maxRetryTimeout);
                    
                    // Wait before retry
                    if (attempt < maxRetries) {
                        await this.sleep(retryDelay * Math.pow(backoffMultiplier, attempt - 1));
                    }
                } else {
                    // Not a timeout error, don't retry
                    throw error;
                }
            }
        }
        
        throw lastError;
    }

    // Execute with adaptive timeout
    async executeWithAdaptiveTimeout(fn, initialTimeout = null, options = {}) {
        const learningWindow = options.learningWindow || 100; // Last 100 operations
        const timeoutMultiplier = options.timeoutMultiplier || 1.5;
        const minTimeout = options.minTimeout || this.minTimeout;
        const maxTimeout = options.maxTimeout || this.maxTimeout;
        
        // Calculate adaptive timeout based on history
        const adaptiveTimeout = this.calculateAdaptiveTimeout(learningWindow, timeoutMultiplier, minTimeout, maxTimeout);
        const actualTimeout = initialTimeout || adaptiveTimeout;
        
        return await this.execute(fn, actualTimeout, options);
    }

    // Calculate adaptive timeout based on historical data
    calculateAdaptiveTimeout(learningWindow, multiplier, minTimeout, maxTimeout) {
        const recentTimeouts = this.getRecentTimeouts(learningWindow);
        
        if (recentTimeouts.length === 0) {
            return this.defaultTimeout;
        }
        
        // Calculate average duration of successful operations
        const successfulTimeouts = recentTimeouts.filter(t => t.success);
        if (successfulTimeouts.length === 0) {
            return this.defaultTimeout;
        }
        
        const averageDuration = successfulTimeouts.reduce((sum, t) => sum + t.duration, 0) / successfulTimeouts.length;
        const adaptiveTimeout = Math.floor(averageDuration * multiplier);
        
        return Math.max(minTimeout, Math.min(adaptiveTimeout, maxTimeout));
    }

    // Get recent timeout data
    getRecentTimeouts(count) {
        const allTimeouts = Array.from(this.activeTimeouts.values());
        return allTimeouts
            .filter(t => t.completed)
            .sort((a, b) => b.endTime - a.endTime)
            .slice(0, count);
    }

    // Clear timeout
    clearTimeout(timeoutId) {
        const timeoutInfo = this.activeTimeouts.get(timeoutId);
        if (timeoutInfo) {
            clearTimeout(timeoutInfo.timeoutId);
            if (timeoutInfo.warningTimeoutId) {
                clearTimeout(timeoutInfo.warningTimeoutId);
            }
            this.activeTimeouts.delete(timeoutId);
        }
    }

    // Record timeout statistics
    recordTimeout(success, duration) {
        this.timeoutStats.totalTimeouts++;
        this.timeoutStats.totalDuration += duration;
        this.timeoutStats.averageDuration = this.timeoutStats.totalDuration / this.timeoutStats.totalTimeouts;
        
        if (success) {
            this.timeoutStats.successfulTimeouts++;
        } else {
            this.timeoutStats.failedTimeouts++;
        }
    }

    // Generate unique ID
    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Sleep utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get active timeouts
    getActiveTimeouts() {
        return Array.from(this.activeTimeouts.entries()).map(([id, info]) => ({
            id,
            startTime: info.startTime,
            timeout: info.timeout,
            elapsed: Date.now() - info.startTime,
            remaining: Math.max(0, info.timeout - (Date.now() - info.startTime))
        }));
    }

    // Get timeout statistics
    getStats() {
        return {
            ...this.timeoutStats,
            activeTimeouts: this.activeTimeouts.size,
            successRate: this.timeoutStats.totalTimeouts > 0 ? 
                this.timeoutStats.successfulTimeouts / this.timeoutStats.totalTimeouts : 0,
            failureRate: this.timeoutStats.totalTimeouts > 0 ? 
                this.timeoutStats.failedTimeouts / this.timeoutStats.totalTimeouts : 0
        };
    }

    // Clear all active timeouts
    clearAllTimeouts() {
        for (const [timeoutId] of this.activeTimeouts) {
            this.clearTimeout(timeoutId);
        }
    }

    // Set timeout callbacks
    setOnTimeout(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Timeout callback must be a function');
        }
        this.onTimeout = callback;
    }

    setOnTimeoutWarning(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Timeout warning callback must be a function');
        }
        this.onTimeoutWarning = callback;
    }

    // Reset statistics
    resetStats() {
        this.timeoutStats = {
            totalTimeouts: 0,
            successfulTimeouts: 0,
            failedTimeouts: 0,
            averageDuration: 0,
            totalDuration: 0
        };
    }

    // Destroy timeout handler
    destroy() {
        this.clearAllTimeouts();
        this.resetStats();
    }
}

// Advanced Timeout Handler with multiple strategies
class AdvancedTimeoutHandler extends TimeoutHandler {
    constructor(options = {}) {
        super(options);
        this.strategies = options.strategies || ['fixed', 'adaptive', 'exponential'];
        this.currentStrategy = 0;
        this.strategySwitchInterval = options.strategySwitchInterval || 300000; // 5 minutes
        this.strategyMetrics = new Map();
        this.startStrategySwitching();
    }

    async execute(fn, timeout = null, options = {}) {
        const strategy = this.strategies[this.currentStrategy];
        const startTime = Date.now();
        
        try {
            let result;
            
            switch (strategy) {
                case 'fixed':
                    result = await super.execute(fn, timeout, options);
                    break;
                case 'adaptive':
                    result = await this.executeWithAdaptiveTimeout(fn, timeout, options);
                    break;
                case 'exponential':
                    result = await this.executeWithExponentialTimeout(fn, timeout, options);
                    break;
                default:
                    result = await super.execute(fn, timeout, options);
            }
            
            this.recordStrategyPerformance(strategy, Date.now() - startTime, true);
            return result;
        } catch (error) {
            this.recordStrategyPerformance(strategy, Date.now() - startTime, false);
            throw error;
        }
    }

    async executeWithExponentialTimeout(fn, initialTimeout = null, options = {}) {
        const baseTimeout = initialTimeout || this.defaultTimeout;
        const maxTimeout = options.maxTimeout || this.maxTimeout;
        const multiplier = options.multiplier || 1.5;
        const maxAttempts = options.maxAttempts || 3;
        
        let currentTimeout = baseTimeout;
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await super.execute(fn, currentTimeout, { ...options, id: `exp-${attempt}` });
            } catch (error) {
                lastError = error;
                
                if (error.message.includes('timeout') && attempt < maxAttempts) {
                    currentTimeout = Math.min(currentTimeout * multiplier, maxTimeout);
                    await this.sleep(1000); // Wait 1 second between attempts
                } else {
                    throw error;
                }
            }
        }
        
        throw lastError;
    }

    recordStrategyPerformance(strategy, duration, success) {
        if (!this.strategyMetrics.has(strategy)) {
            this.strategyMetrics.set(strategy, {
                totalRequests: 0,
                successfulRequests: 0,
                totalDuration: 0,
                averageDuration: 0
            });
        }
        
        const metrics = this.strategyMetrics.get(strategy);
        metrics.totalRequests++;
        if (success) {
            metrics.successfulRequests++;
        }
        metrics.totalDuration += duration;
        metrics.averageDuration = metrics.totalDuration / metrics.totalRequests;
    }

    startStrategySwitching() {
        setInterval(() => {
            this.switchToBestStrategy();
        }, this.strategySwitchInterval);
    }

    switchToBestStrategy() {
        let bestStrategy = 0;
        let bestScore = 0;
        
        for (let i = 0; i < this.strategies.length; i++) {
            const strategy = this.strategies[i];
            const metrics = this.strategyMetrics.get(strategy);
            
            if (metrics && metrics.totalRequests > 0) {
                const successRate = metrics.successfulRequests / metrics.totalRequests;
                const speedScore = 1 / (metrics.averageDuration || 1);
                const score = successRate * speedScore;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestStrategy = i;
                }
            }
        }
        
        if (bestStrategy !== this.currentStrategy) {
            this.currentStrategy = bestStrategy;
            console.log(`Switched to timeout strategy: ${this.strategies[this.currentStrategy]}`);
        }
    }

    getAdvancedStats() {
        const baseStats = this.getStats();
        const strategyStats = {};
        
        for (const [strategy, metrics] of this.strategyMetrics) {
            strategyStats[strategy] = {
                ...metrics,
                successRate: metrics.totalRequests > 0 ? 
                    metrics.successfulRequests / metrics.totalRequests : 0
            };
        }
        
        return {
            ...baseStats,
            currentStrategy: this.strategies[this.currentStrategy],
            strategyStats,
            availableStrategies: this.strategies
        };
    }
}

// Timeout Handler Factory
class TimeoutHandlerFactory {
    static create(options = {}) {
        if (options.advanced) {
            return new AdvancedTimeoutHandler(options);
        }
        return new TimeoutHandler(options);
    }

    static createForAPI(options = {}) {
        return new TimeoutHandler({
            defaultTimeout: 30000,
            maxTimeout: 120000,
            minTimeout: 5000,
            warningThreshold: 0.8,
            ...options
        });
    }

    static createForDatabase(options = {}) {
        return new TimeoutHandler({
            defaultTimeout: 10000,
            maxTimeout: 60000,
            minTimeout: 1000,
            warningThreshold: 0.9,
            ...options
        });
    }

    static createForFileOperations(options = {}) {
        return new TimeoutHandler({
            defaultTimeout: 5000,
            maxTimeout: 30000,
            minTimeout: 500,
            warningThreshold: 0.7,
            ...options
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TimeoutHandler, AdvancedTimeoutHandler, TimeoutHandlerFactory };
}



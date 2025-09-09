// Retry Logic Pattern
// Implements retry mechanisms with exponential backoff

class RetryLogic {
    constructor(options = {}) {
        this.maxRetries = options.maxRetries || 3;
        this.baseDelay = options.baseDelay || 1000;
        this.maxDelay = options.maxDelay || 30000;
        this.multiplier = options.multiplier || 2;
        this.jitter = options.jitter || 0.1;
        this.shouldRetry = options.shouldRetry || this.defaultShouldRetry;
        this.onRetry = options.onRetry || (() => {});
        this.onMaxRetries = options.onMaxRetries || (() => {});
        this.timeout = options.timeout || 0;
        this.retryCount = 0;
        this.lastError = null;
    }

    // Default retry condition
    defaultShouldRetry(error, attempt) {
        // Retry on network errors, timeouts, and 5xx status codes
        if (error.name === 'NetworkError' || 
            error.name === 'TimeoutError' ||
            error.message.includes('timeout') ||
            error.message.includes('network') ||
            error.message.includes('ECONNRESET') ||
            error.message.includes('ENOTFOUND')) {
            return true;
        }
        
        // Retry on 5xx status codes
        if (error.status >= 500 && error.status < 600) {
            return true;
        }
        
        // Retry on 429 (rate limit) with exponential backoff
        if (error.status === 429) {
            return true;
        }
        
        return false;
    }

    // Execute function with retry logic
    async execute(fn, context = {}) {
        this.retryCount = 0;
        this.lastError = null;
        
        for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
            try {
                // Set timeout if specified
                if (this.timeout > 0) {
                    return await this.withTimeout(fn(), this.timeout);
                } else {
                    return await fn();
                }
            } catch (error) {
                this.lastError = error;
                
                // Check if we should retry
                if (attempt > this.maxRetries || !this.shouldRetry(error, attempt)) {
                    this.onMaxRetries(error, attempt, context);
                    throw error;
                }
                
                // Calculate delay with exponential backoff
                const delay = this.calculateDelay(attempt);
                
                // Call retry callback
                this.onRetry(error, attempt, delay, context);
                
                // Wait before retry
                await this.sleep(delay);
                
                this.retryCount = attempt;
            }
        }
    }

    // Calculate delay with exponential backoff and jitter
    calculateDelay(attempt) {
        const exponentialDelay = this.baseDelay * Math.pow(this.multiplier, attempt - 1);
        const cappedDelay = Math.min(exponentialDelay, this.maxDelay);
        
        // Add jitter to prevent thundering herd
        const jitterAmount = cappedDelay * this.jitter * Math.random();
        const jitteredDelay = cappedDelay + jitterAmount;
        
        return Math.floor(jitteredDelay);
    }

    // Sleep for specified milliseconds
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Execute with timeout
    async withTimeout(promise, timeoutMs) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
        });
        
        return Promise.race([promise, timeoutPromise]);
    }

    // Get retry statistics
    getStats() {
        return {
            retryCount: this.retryCount,
            maxRetries: this.maxRetries,
            lastError: this.lastError,
            isExhausted: this.retryCount >= this.maxRetries
        };
    }

    // Reset retry state
    reset() {
        this.retryCount = 0;
        this.lastError = null;
    }

    // Set custom retry condition
    setShouldRetry(condition) {
        if (typeof condition !== 'function') {
            throw new TypeError('Retry condition must be a function');
        }
        this.shouldRetry = condition;
    }

    // Set retry callback
    setOnRetry(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Retry callback must be a function');
        }
        this.onRetry = callback;
    }

    // Set max retries callback
    setOnMaxRetries(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Max retries callback must be a function');
        }
        this.onMaxRetries = callback;
    }
}

// Advanced Retry Logic with Circuit Breaker
class AdvancedRetryLogic extends RetryLogic {
    constructor(options = {}) {
        super(options);
        this.circuitBreaker = options.circuitBreaker || null;
        this.retryHistory = [];
        this.successRate = 1.0;
        this.adaptiveDelay = options.adaptiveDelay || false;
        this.minSuccessRate = options.minSuccessRate || 0.5;
    }

    async execute(fn, context = {}) {
        // Check circuit breaker
        if (this.circuitBreaker && !this.circuitBreaker.canExecute()) {
            throw new Error('Circuit breaker is open');
        }

        const startTime = Date.now();
        let result;
        
        try {
            result = await super.execute(fn, context);
            this.recordSuccess(Date.now() - startTime);
            return result;
        } catch (error) {
            this.recordFailure(error, Date.now() - startTime);
            throw error;
        }
    }

    recordSuccess(duration) {
        this.retryHistory.push({
            success: true,
            duration,
            timestamp: Date.now()
        });
        this.updateSuccessRate();
    }

    recordFailure(error, duration) {
        this.retryHistory.push({
            success: false,
            error: error.message,
            duration,
            timestamp: Date.now()
        });
        this.updateSuccessRate();
    }

    updateSuccessRate() {
        // Keep only last 100 attempts
        if (this.retryHistory.length > 100) {
            this.retryHistory = this.retryHistory.slice(-100);
        }
        
        const recentAttempts = this.retryHistory.slice(-20); // Last 20 attempts
        if (recentAttempts.length > 0) {
            const successes = recentAttempts.filter(attempt => attempt.success).length;
            this.successRate = successes / recentAttempts.length;
        }
    }

    calculateDelay(attempt) {
        let delay = super.calculateDelay(attempt);
        
        // Adaptive delay based on success rate
        if (this.adaptiveDelay && this.successRate < this.minSuccessRate) {
            delay *= 2; // Double delay if success rate is low
        }
        
        return delay;
    }

    shouldRetry(error, attempt) {
        // Don't retry if success rate is too low
        if (this.successRate < this.minSuccessRate && attempt > 1) {
            return false;
        }
        
        return super.shouldRetry(error, attempt);
    }

    getAdvancedStats() {
        const stats = this.getStats();
        const recentAttempts = this.retryHistory.slice(-20);
        
        return {
            ...stats,
            successRate: this.successRate,
            recentAttempts: recentAttempts.length,
            averageDuration: recentAttempts.length > 0 ? 
                recentAttempts.reduce((sum, attempt) => sum + attempt.duration, 0) / recentAttempts.length : 0,
            failureRate: 1 - this.successRate,
            adaptiveDelay: this.adaptiveDelay
        };
    }
}

// Retry Logic Factory
class RetryLogicFactory {
    static create(options = {}) {
        if (options.advanced) {
            return new AdvancedRetryLogic(options);
        }
        return new RetryLogic(options);
    }

    static createForAPI(options = {}) {
        return new RetryLogic({
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 10000,
            multiplier: 2,
            jitter: 0.1,
            timeout: 30000,
            shouldRetry: (error, attempt) => {
                // Retry on network errors and 5xx status codes
                if (error.name === 'NetworkError' || 
                    error.name === 'TimeoutError' ||
                    error.status >= 500) {
                    return true;
                }
                // Retry on rate limit
                if (error.status === 429) {
                    return true;
                }
                return false;
            },
            ...options
        });
    }

    static createForDatabase(options = {}) {
        return new RetryLogic({
            maxRetries: 5,
            baseDelay: 500,
            maxDelay: 5000,
            multiplier: 1.5,
            jitter: 0.2,
            shouldRetry: (error, attempt) => {
                // Retry on connection errors and deadlocks
                if (error.message.includes('connection') ||
                    error.message.includes('deadlock') ||
                    error.message.includes('timeout')) {
                    return true;
                }
                return false;
            },
            ...options
        });
    }

    static createForFileOperations(options = {}) {
        return new RetryLogic({
            maxRetries: 3,
            baseDelay: 200,
            maxDelay: 2000,
            multiplier: 2,
            jitter: 0.1,
            shouldRetry: (error, attempt) => {
                // Retry on file system errors
                if (error.code === 'EBUSY' ||
                    error.code === 'EMFILE' ||
                    error.code === 'ENFILE' ||
                    error.message.includes('permission denied')) {
                    return true;
                }
                return false;
            },
            ...options
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RetryLogic, AdvancedRetryLogic, RetryLogicFactory };
}


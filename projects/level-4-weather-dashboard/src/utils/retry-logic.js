// Retry Logic Utility
// Level 4 Mini-Project

class RetryLogic {
    constructor(maxRetries = 3, baseDelay = 1000, maxDelay = 10000) {
        this.maxRetries = maxRetries;
        this.baseDelay = baseDelay;
        this.maxDelay = maxDelay;
        this.retryCount = 0;
    }
    
    async execute(fn, context = '') {
        let lastError;
        
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                this.retryCount = attempt;
                
                if (attempt > 0) {
                    console.log(`Retry attempt ${attempt} for ${context}`);
                }
                
                const result = await fn();
                
                // Reset retry count on success
                this.retryCount = 0;
                return result;
                
            } catch (error) {
                lastError = error;
                
                // Don't retry on the last attempt
                if (attempt === this.maxRetries) {
                    break;
                }
                
                // Check if error is retryable
                if (!this.shouldRetry(error)) {
                    throw error;
                }
                
                // Calculate delay with exponential backoff
                const delay = this.calculateDelay(attempt);
                console.log(`Retrying in ${delay}ms...`);
                
                await this.delay(delay);
            }
        }
        
        // All retries failed
        console.error(`All ${this.maxRetries + 1} attempts failed for ${context}`);
        throw lastError;
    }
    
    shouldRetry(error) {
        // Don't retry on certain error types
        const nonRetryableErrors = [
            'ValidationError',
            'AuthenticationError',
            'PermissionError'
        ];
        
        if (nonRetryableErrors.includes(error.name)) {
            return false;
        }
        
        // Don't retry on 4xx errors (except 429 - rate limit)
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
            return false;
        }
        
        // Retry on network errors, 5xx errors, and rate limits
        return true;
    }
    
    calculateDelay(attempt) {
        // Exponential backoff with jitter
        const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.1 * exponentialDelay;
        const delay = Math.min(exponentialDelay + jitter, this.maxDelay);
        
        return Math.floor(delay);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    getRetryCount() {
        return this.retryCount;
    }
    
    reset() {
        this.retryCount = 0;
    }
}

// Advanced retry logic with different strategies
class AdvancedRetryLogic extends RetryLogic {
    constructor(options = {}) {
        super(options.maxRetries, options.baseDelay, options.maxDelay);
        this.strategy = options.strategy || 'exponential';
        this.customDelays = options.customDelays || [];
    }
    
    calculateDelay(attempt) {
        switch (this.strategy) {
            case 'linear':
                return this.baseDelay * (attempt + 1);
                
            case 'exponential':
                return super.calculateDelay(attempt);
                
            case 'custom':
                return this.customDelays[attempt] || this.maxDelay;
                
            case 'fibonacci':
                return this.fibonacciDelay(attempt);
                
            default:
                return super.calculateDelay(attempt);
        }
    }
    
    fibonacciDelay(attempt) {
        const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
        const delay = fibonacci[Math.min(attempt, fibonacci.length - 1)] * this.baseDelay;
        return Math.min(delay, this.maxDelay);
    }
}

// Retry logic with circuit breaker pattern
class RetryWithCircuitBreaker extends RetryLogic {
    constructor(options = {}) {
        super(options.maxRetries, options.baseDelay, options.maxDelay);
        this.circuitBreaker = new CircuitBreaker(
            options.failureThreshold || 5,
            options.timeout || 60000
        );
    }
    
    async execute(fn, context = '') {
        return this.circuitBreaker.execute(async () => {
            return super.execute(fn, context);
        });
    }
}

// Circuit Breaker implementation
class CircuitBreaker {
    constructor(failureThreshold = 5, timeout = 60000) {
        this.failureThreshold = failureThreshold;
        this.timeout = timeout;
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    }
    
    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.timeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }
    
    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }
    
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    
    getState() {
        return this.state;
    }
    
    reset() {
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED';
    }
}

// Retry logic with different policies for different error types
class PolicyBasedRetryLogic {
    constructor() {
        this.policies = new Map();
        this.setupDefaultPolicies();
    }
    
    setupDefaultPolicies() {
        // Network errors - retry with exponential backoff
        this.policies.set('NETWORK_ERROR', {
            maxRetries: 3,
            baseDelay: 1000,
            strategy: 'exponential'
        });
        
        // API errors - retry with linear backoff
        this.policies.set('API_ERROR', {
            maxRetries: 2,
            baseDelay: 2000,
            strategy: 'linear'
        });
        
        // Rate limit errors - retry with custom delays
        this.policies.set('RATE_LIMIT_ERROR', {
            maxRetries: 5,
            baseDelay: 1000,
            strategy: 'custom',
            customDelays: [1000, 2000, 5000, 10000, 30000]
        });
    }
    
    async execute(fn, errorType = 'NETWORK_ERROR', context = '') {
        const policy = this.policies.get(errorType) || this.policies.get('NETWORK_ERROR');
        const retryLogic = new AdvancedRetryLogic(policy);
        
        return retryLogic.execute(fn, context);
    }
    
    addPolicy(errorType, policy) {
        this.policies.set(errorType, policy);
    }
}

// Export classes
window.RetryLogic = RetryLogic;
window.AdvancedRetryLogic = AdvancedRetryLogic;
window.RetryWithCircuitBreaker = RetryWithCircuitBreaker;
window.CircuitBreaker = CircuitBreaker;
window.PolicyBasedRetryLogic = PolicyBasedRetryLogic;


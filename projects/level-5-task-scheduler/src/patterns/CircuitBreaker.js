// Circuit Breaker Pattern
// Implements circuit breaker for fault tolerance

class CircuitBreaker {
    constructor(options = {}) {
        this.threshold = options.threshold || 5;
        this.timeout = options.timeout || 60000;
        this.resetTimeout = options.resetTimeout || 30000;
        this.monitoringPeriod = options.monitoringPeriod || 10000;
        this.minimumRequests = options.minimumRequests || 5;
        
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.successCount = 0;
        this.lastFailureTime = 0;
        this.lastSuccessTime = 0;
        this.requestCount = 0;
        this.failureRate = 0;
        
        this.metrics = {
            totalRequests: 0,
            totalFailures: 0,
            totalSuccesses: 0,
            stateChanges: 0,
            lastStateChange: Date.now()
        };
        
        this.onStateChange = options.onStateChange || (() => {});
        this.onFailure = options.onFailure || (() => {});
        this.onSuccess = options.onSuccess || (() => {});
        this.shouldFail = options.shouldFail || this.defaultShouldFail;
        
        // Start monitoring
        this.startMonitoring();
    }

    // Default failure condition
    defaultShouldFail(error) {
        // Consider network errors, timeouts, and 5xx status codes as failures
        if (error.name === 'NetworkError' || 
            error.name === 'TimeoutError' ||
            error.message.includes('timeout') ||
            error.message.includes('network') ||
            error.message.includes('ECONNRESET') ||
            error.message.includes('ENOTFOUND')) {
            return true;
        }
        
        // Consider 5xx status codes as failures
        if (error.status >= 500 && error.status < 600) {
            return true;
        }
        
        return false;
    }

    // Execute function with circuit breaker protection
    async execute(fn, context = {}) {
        if (!this.canExecute()) {
            throw new Error(`Circuit breaker is ${this.state}`);
        }

        const startTime = Date.now();
        this.metrics.totalRequests++;
        this.requestCount++;

        try {
            const result = await fn();
            this.onSuccess(result, context);
            this.recordSuccess();
            return result;
        } catch (error) {
            this.onFailure(error, context);
            this.recordFailure(error);
            throw error;
        }
    }

    // Check if execution is allowed
    canExecute() {
        const now = Date.now();
        
        switch (this.state) {
            case 'CLOSED':
                return true;
                
            case 'OPEN':
                // Check if reset timeout has passed
                if (now - this.lastFailureTime >= this.resetTimeout) {
                    this.setState('HALF_OPEN');
                    return true;
                }
                return false;
                
            case 'HALF_OPEN':
                return true;
                
            default:
                return false;
        }
    }

    // Record successful execution
    recordSuccess() {
        this.successCount++;
        this.lastSuccessTime = Date.now();
        this.metrics.totalSuccesses++;
        
        if (this.state === 'HALF_OPEN') {
            // If we're in half-open state and got a success, close the circuit
            this.setState('CLOSED');
        }
    }

    // Record failed execution
    recordFailure(error) {
        if (!this.shouldFail(error)) {
            return; // Don't count this as a failure
        }
        
        this.failureCount++;
        this.lastFailureTime = Date.now();
        this.metrics.totalFailures++;
        
        this.updateFailureRate();
        
        if (this.state === 'CLOSED' && this.shouldOpen()) {
            this.setState('OPEN');
        } else if (this.state === 'HALF_OPEN') {
            // If we're in half-open state and got a failure, open the circuit
            this.setState('OPEN');
        }
    }

    // Check if circuit should open
    shouldOpen() {
        // Need minimum requests before considering opening
        if (this.requestCount < this.minimumRequests) {
            return false;
        }
        
        // Check failure count threshold
        if (this.failureCount >= this.threshold) {
            return true;
        }
        
        // Check failure rate threshold
        if (this.failureRate > 0.5) { // 50% failure rate
            return true;
        }
        
        return false;
    }

    // Update failure rate
    updateFailureRate() {
        if (this.requestCount > 0) {
            this.failureRate = this.failureCount / this.requestCount;
        }
    }

    // Set circuit breaker state
    setState(newState) {
        if (this.state !== newState) {
            const oldState = this.state;
            this.state = newState;
            this.metrics.stateChanges++;
            this.metrics.lastStateChange = Date.now();
            
            this.onStateChange(newState, oldState);
            
            // Reset counters when closing
            if (newState === 'CLOSED') {
                this.resetCounters();
            }
        }
    }

    // Reset counters
    resetCounters() {
        this.failureCount = 0;
        this.successCount = 0;
        this.requestCount = 0;
        this.failureRate = 0;
    }

    // Start monitoring
    startMonitoring() {
        setInterval(() => {
            this.monitor();
        }, this.monitoringPeriod);
    }

    // Monitor circuit breaker health
    monitor() {
        const now = Date.now();
        
        // Reset counters periodically to prevent stale data
        if (now - this.metrics.lastStateChange > this.monitoringPeriod * 2) {
            this.resetCounters();
        }
        
        // Auto-close circuit if it's been open too long
        if (this.state === 'OPEN' && now - this.lastFailureTime > this.timeout) {
            this.setState('HALF_OPEN');
        }
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Get metrics
    getMetrics() {
        return {
            ...this.metrics,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            requestCount: this.requestCount,
            failureRate: this.failureRate,
            lastFailureTime: this.lastFailureTime,
            lastSuccessTime: this.lastSuccessTime,
            uptime: Date.now() - this.metrics.lastStateChange
        };
    }

    // Get health status
    getHealth() {
        const metrics = this.getMetrics();
        const now = Date.now();
        
        return {
            state: this.state,
            healthy: this.state === 'CLOSED',
            failureRate: this.failureRate,
            lastFailure: now - this.lastFailureTime,
            lastSuccess: now - this.lastSuccessTime,
            canExecute: this.canExecute(),
            uptime: metrics.uptime
        };
    }

    // Force state change
    forceState(state) {
        if (['CLOSED', 'OPEN', 'HALF_OPEN'].includes(state)) {
            this.setState(state);
        } else {
            throw new Error(`Invalid state: ${state}`);
        }
    }

    // Reset circuit breaker
    reset() {
        this.setState('CLOSED');
        this.resetCounters();
        this.metrics = {
            totalRequests: 0,
            totalFailures: 0,
            totalSuccesses: 0,
            stateChanges: 0,
            lastStateChange: Date.now()
        };
    }

    // Set custom failure condition
    setShouldFail(condition) {
        if (typeof condition !== 'function') {
            throw new TypeError('Failure condition must be a function');
        }
        this.shouldFail = condition;
    }

    // Set state change callback
    setOnStateChange(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('State change callback must be a function');
        }
        this.onStateChange = callback;
    }

    // Set failure callback
    setOnFailure(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Failure callback must be a function');
        }
        this.onFailure = callback;
    }

    // Set success callback
    setOnSuccess(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Success callback must be a function');
        }
        this.onSuccess = callback;
    }

    // Get statistics
    getStats() {
        const metrics = this.getMetrics();
        const totalRequests = metrics.totalRequests;
        
        return {
            state: this.state,
            totalRequests,
            totalFailures: metrics.totalFailures,
            totalSuccesses: metrics.totalSuccesses,
            failureRate: totalRequests > 0 ? metrics.totalFailures / totalRequests : 0,
            successRate: totalRequests > 0 ? metrics.totalSuccesses / totalRequests : 0,
            stateChanges: metrics.stateChanges,
            uptime: metrics.uptime,
            healthy: this.state === 'CLOSED'
        };
    }
}

// Advanced Circuit Breaker with multiple thresholds
class AdvancedCircuitBreaker extends CircuitBreaker {
    constructor(options = {}) {
        super(options);
        this.thresholds = options.thresholds || {
            failureCount: 5,
            failureRate: 0.5,
            responseTime: 5000
        };
        this.responseTimeThreshold = options.responseTimeThreshold || 5000;
        this.responseTimes = [];
        this.maxResponseTimeSamples = options.maxResponseTimeSamples || 100;
    }

    async execute(fn, context = {}) {
        if (!this.canExecute()) {
            throw new Error(`Circuit breaker is ${this.state}`);
        }

        const startTime = Date.now();
        this.metrics.totalRequests++;
        this.requestCount++;

        try {
            const result = await fn();
            const duration = Date.now() - startTime;
            
            this.recordResponseTime(duration);
            this.onSuccess(result, context);
            this.recordSuccess();
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.recordResponseTime(duration);
            this.onFailure(error, context);
            this.recordFailure(error);
            throw error;
        }
    }

    recordResponseTime(duration) {
        this.responseTimes.push(duration);
        
        // Keep only last N samples
        if (this.responseTimes.length > this.maxResponseTimeSamples) {
            this.responseTimes = this.responseTimes.slice(-this.maxResponseTimeSamples);
        }
    }

    shouldOpen() {
        // Check failure count threshold
        if (this.failureCount >= this.thresholds.failureCount) {
            return true;
        }
        
        // Check failure rate threshold
        if (this.failureRate > this.thresholds.failureRate) {
            return true;
        }
        
        // Check response time threshold
        if (this.responseTimes.length > 0) {
            const avgResponseTime = this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
            if (avgResponseTime > this.thresholds.responseTime) {
                return true;
            }
        }
        
        return false;
    }

    getAdvancedMetrics() {
        const baseMetrics = this.getMetrics();
        const avgResponseTime = this.responseTimes.length > 0 ? 
            this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length : 0;
        
        return {
            ...baseMetrics,
            responseTimes: this.responseTimes,
            averageResponseTime: avgResponseTime,
            maxResponseTime: Math.max(...this.responseTimes, 0),
            minResponseTime: Math.min(...this.responseTimes, Infinity),
            thresholds: this.thresholds
        };
    }
}

// Circuit Breaker Factory
class CircuitBreakerFactory {
    static create(options = {}) {
        if (options.advanced) {
            return new AdvancedCircuitBreaker(options);
        }
        return new CircuitBreaker(options);
    }

    static createForAPI(options = {}) {
        return new CircuitBreaker({
            threshold: 5,
            timeout: 60000,
            resetTimeout: 30000,
            minimumRequests: 5,
            shouldFail: (error) => {
                return error.status >= 500 || 
                       error.name === 'NetworkError' || 
                       error.name === 'TimeoutError';
            },
            ...options
        });
    }

    static createForDatabase(options = {}) {
        return new CircuitBreaker({
            threshold: 3,
            timeout: 30000,
            resetTimeout: 15000,
            minimumRequests: 3,
            shouldFail: (error) => {
                return error.message.includes('connection') ||
                       error.message.includes('deadlock') ||
                       error.message.includes('timeout');
            },
            ...options
        });
    }

    static createForFileOperations(options = {}) {
        return new CircuitBreaker({
            threshold: 5,
            timeout: 30000,
            resetTimeout: 10000,
            minimumRequests: 3,
            shouldFail: (error) => {
                return error.code === 'EBUSY' ||
                       error.code === 'EMFILE' ||
                       error.code === 'ENFILE';
            },
            ...options
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CircuitBreaker, AdvancedCircuitBreaker, CircuitBreakerFactory };
}


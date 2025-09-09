// Metrics Utility
// Provides performance monitoring and metrics collection

class Metrics {
    constructor(options = {}) {
        this.metrics = new Map();
        this.counters = new Map();
        this.timers = new Map();
        this.gauges = new Map();
        this.histograms = new Map();
        this.enableStorage = options.enableStorage || false;
        this.retentionPeriod = options.retentionPeriod || 24 * 60 * 60 * 1000; // 24 hours
        this.maxDataPoints = options.maxDataPoints || 1000;
        
        this.startTime = Date.now();
        this.lastCleanup = Date.now();
        
        // Auto-cleanup every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    // Counter methods
    increment(name, value = 1, tags = {}) {
        const key = this.createKey(name, tags);
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + value);
        this.recordMetric('counter', name, value, tags);
    }

    decrement(name, value = 1, tags = {}) {
        this.increment(name, -value, tags);
    }

    getCounter(name, tags = {}) {
        const key = this.createKey(name, tags);
        return this.counters.get(key) || 0;
    }

    // Timer methods
    startTimer(name, tags = {}) {
        const key = this.createKey(name, tags);
        const timer = {
            startTime: Date.now(),
            tags
        };
        this.timers.set(key, timer);
        return timer;
    }

    endTimer(name, tags = {}) {
        const key = this.createKey(name, tags);
        const timer = this.timers.get(key);
        
        if (!timer) {
            console.warn(`Timer not found: ${name}`);
            return null;
        }
        
        const duration = Date.now() - timer.startTime;
        this.timers.delete(key);
        
        this.recordMetric('timer', name, duration, tags);
        return duration;
    }

    time(name, fn, tags = {}) {
        const timer = this.startTimer(name, tags);
        try {
            const result = fn();
            if (result && typeof result.then === 'function') {
                return result.then(
                    (value) => {
                        this.endTimer(name, tags);
                        return value;
                    },
                    (error) => {
                        this.endTimer(name, tags);
                        throw error;
                    }
                );
            } else {
                this.endTimer(name, tags);
                return result;
            }
        } catch (error) {
            this.endTimer(name, tags);
            throw error;
        }
    }

    async timeAsync(name, fn, tags = {}) {
        const timer = this.startTimer(name, tags);
        try {
            const result = await fn();
            this.endTimer(name, tags);
            return result;
        } catch (error) {
            this.endTimer(name, tags);
            throw error;
        }
    }

    // Gauge methods
    setGauge(name, value, tags = {}) {
        const key = this.createKey(name, tags);
        this.gauges.set(key, value);
        this.recordMetric('gauge', name, value, tags);
    }

    getGauge(name, tags = {}) {
        const key = this.createKey(name, tags);
        return this.gauges.get(key) || 0;
    }

    // Histogram methods
    recordHistogram(name, value, tags = {}) {
        const key = this.createKey(name, tags);
        const histogram = this.histograms.get(key) || {
            values: [],
            count: 0,
            sum: 0,
            min: Infinity,
            max: -Infinity
        };
        
        histogram.values.push(value);
        histogram.count++;
        histogram.sum += value;
        histogram.min = Math.min(histogram.min, value);
        histogram.max = Math.max(histogram.max, value);
        
        // Keep only last maxDataPoints
        if (histogram.values.length > this.maxDataPoints) {
            histogram.values = histogram.values.slice(-this.maxDataPoints);
        }
        
        this.histograms.set(key, histogram);
        this.recordMetric('histogram', name, value, tags);
    }

    getHistogram(name, tags = {}) {
        const key = this.createKey(name, tags);
        const histogram = this.histograms.get(key);
        
        if (!histogram) {
            return null;
        }
        
        const sortedValues = [...histogram.values].sort((a, b) => a - b);
        const len = sortedValues.length;
        
        return {
            count: histogram.count,
            sum: histogram.sum,
            min: histogram.min === Infinity ? 0 : histogram.min,
            max: histogram.max === -Infinity ? 0 : histogram.max,
            mean: histogram.sum / histogram.count,
            median: len % 2 === 0 ? 
                (sortedValues[len / 2 - 1] + sortedValues[len / 2]) / 2 : 
                sortedValues[Math.floor(len / 2)],
            p95: sortedValues[Math.floor(len * 0.95)],
            p99: sortedValues[Math.floor(len * 0.99)]
        };
    }

    // Custom metric recording
    recordMetric(type, name, value, tags = {}) {
        const metric = {
            type,
            name,
            value,
            tags,
            timestamp: Date.now()
        };
        
        const key = this.createKey(name, tags);
        if (!this.metrics.has(key)) {
            this.metrics.set(key, []);
        }
        
        const metrics = this.metrics.get(key);
        metrics.push(metric);
        
        // Keep only last maxDataPoints
        if (metrics.length > this.maxDataPoints) {
            metrics.splice(0, metrics.length - this.maxDataPoints);
        }
        
        if (this.enableStorage) {
            this.storeMetric(metric);
        }
    }

    // Utility methods
    createKey(name, tags) {
        const tagStr = Object.keys(tags)
            .sort()
            .map(key => `${key}:${tags[key]}`)
            .join(',');
        return tagStr ? `${name}:${tagStr}` : name;
    }

    getMetrics(name = null, tags = null) {
        if (name) {
            const key = this.createKey(name, tags || {});
            return this.metrics.get(key) || [];
        }
        
        const allMetrics = [];
        for (const metrics of this.metrics.values()) {
            allMetrics.push(...metrics);
        }
        
        return allMetrics.sort((a, b) => a.timestamp - b.timestamp);
    }

    getSummary() {
        const summary = {
            uptime: Date.now() - this.startTime,
            counters: Object.fromEntries(this.counters),
            gauges: Object.fromEntries(this.gauges),
            histograms: {},
            totalMetrics: 0
        };
        
        // Calculate histogram summaries
        for (const [key, histogram] of this.histograms) {
            summary.histograms[key] = this.getHistogram(histogram.name, histogram.tags);
        }
        
        // Count total metrics
        for (const metrics of this.metrics.values()) {
            summary.totalMetrics += metrics.length;
        }
        
        return summary;
    }

    getRate(name, tags = {}, windowMs = 60000) {
        const key = this.createKey(name, tags);
        const metrics = this.metrics.get(key) || [];
        const now = Date.now();
        const windowStart = now - windowMs;
        
        const recentMetrics = metrics.filter(m => m.timestamp >= windowStart);
        return recentMetrics.length / (windowMs / 1000); // per second
    }

    getAverage(name, tags = {}, windowMs = 60000) {
        const key = this.createKey(name, tags);
        const metrics = this.metrics.get(key) || [];
        const now = Date.now();
        const windowStart = now - windowMs;
        
        const recentMetrics = metrics.filter(m => m.timestamp >= windowStart);
        if (recentMetrics.length === 0) return 0;
        
        const sum = recentMetrics.reduce((acc, m) => acc + m.value, 0);
        return sum / recentMetrics.length;
    }

    // Storage methods
    storeMetric(metric) {
        try {
            const stored = localStorage.getItem('metrics_data');
            const data = stored ? JSON.parse(stored) : [];
            data.push(metric);
            
            // Keep only last maxDataPoints
            if (data.length > this.maxDataPoints) {
                data.splice(0, data.length - this.maxDataPoints);
            }
            
            localStorage.setItem('metrics_data', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to store metric:', error);
        }
    }

    loadMetrics() {
        try {
            const stored = localStorage.getItem('metrics_data');
            if (stored) {
                const data = JSON.parse(stored);
                data.forEach(metric => {
                    const key = this.createKey(metric.name, metric.tags);
                    if (!this.metrics.has(key)) {
                        this.metrics.set(key, []);
                    }
                    this.metrics.get(key).push(metric);
                });
            }
        } catch (error) {
            console.error('Failed to load metrics:', error);
        }
    }

    // Cleanup methods
    cleanup() {
        const now = Date.now();
        const cutoff = now - this.retentionPeriod;
        
        // Clean up old metrics
        for (const [key, metrics] of this.metrics) {
            const recentMetrics = metrics.filter(m => m.timestamp >= cutoff);
            if (recentMetrics.length === 0) {
                this.metrics.delete(key);
            } else {
                this.metrics.set(key, recentMetrics);
            }
        }
        
        this.lastCleanup = now;
    }

    clear() {
        this.metrics.clear();
        this.counters.clear();
        this.timers.clear();
        this.gauges.clear();
        this.histograms.clear();
        
        if (this.enableStorage) {
            localStorage.removeItem('metrics_data');
        }
    }

    export(format = 'json') {
        const data = this.getSummary();
        
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.exportToCSV();
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    exportToCSV() {
        const metrics = this.getMetrics();
        if (metrics.length === 0) return '';
        
        const headers = ['timestamp', 'type', 'name', 'value', 'tags'];
        const rows = metrics.map(metric => [
            new Date(metric.timestamp).toISOString(),
            metric.type,
            metric.name,
            metric.value,
            JSON.stringify(metric.tags)
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// Create a default metrics instance
window.metrics = new Metrics({
    enableStorage: false,
    retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
    maxDataPoints: 1000
});


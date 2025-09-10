# Advanced Async Patterns

## Overview

This article explores advanced asynchronous programming patterns that solve complex real-world problems. These patterns build upon the fundamentals of callbacks, promises, and async/await to create robust, scalable, and maintainable asynchronous code.

## Table of Contents

1. [Promise Cancellation](#promise-cancellation)
2. [Retry Logic and Exponential Backoff](#retry-logic-and-exponential-backoff)
3. [Timeout Handling](#timeout-handling)
4. [Async Generators](#async-generators)
5. [Event Emitters and Async Patterns](#event-emitters-and-async-patterns)
6. [Worker Threads and Async Operations](#worker-threads-and-async-operations)
7. [Queue Management](#queue-management)
8. [Rate Limiting](#rate-limiting)
9. [Circuit Breaker Pattern](#circuit-breaker-pattern)
10. [Bulk Operations and Batching](#bulk-operations-and-batching)

## Promise Cancellation

### 1. AbortController for Fetch

```typescript
// Basic AbortController usage
async function fetchWithCancellation(url: string, signal: AbortSignal): Promise<Response> {
    const response = await fetch(url, { signal });
    
    if (signal.aborted) {
        throw new Error('Request was cancelled');
    }
    
    return response;
}

// Usage
const controller = new AbortController();
const promise = fetchWithCancellation('/api/data', controller.signal);

// Cancel after 5 seconds
setTimeout(() => {
    controller.abort();
    console.log('Request cancelled');
}, 5000);

try {
    const response = await promise;
    console.log('Response:', response);
} catch (error) {
    if (error.name === 'AbortError') {
        console.log('Request was cancelled');
    } else {
        console.error('Request failed:', error);
    }
}
```

### 2. Custom Cancellable Promise

```typescript
// Custom cancellable promise implementation
class CancellablePromise<T> extends Promise<T> {
    private isCancelled = false;
    private cancelHandlers: (() => void)[] = [];

    constructor(
        executor: (
            resolve: (value: T) => void,
            reject: (reason?: any) => void,
            onCancel: (handler: () => void) => void
        ) => void
    ) {
        super((resolve, reject) => {
            executor(
                (value) => {
                    if (!this.isCancelled) {
                        resolve(value);
                    }
                },
                (reason) => {
                    if (!this.isCancelled) {
                        reject(reason);
                    }
                },
                (handler) => {
                    this.cancelHandlers.push(handler);
                }
            );
        });
    }

    cancel(): void {
        if (!this.isCancelled) {
            this.isCancelled = true;
            this.cancelHandlers.forEach(handler => handler());
        }
    }

    get cancelled(): boolean {
        return this.isCancelled;
    }
}

// Usage
const cancellablePromise = new CancellablePromise<string>((resolve, reject, onCancel) => {
    const timeout = setTimeout(() => {
        resolve('Operation completed');
    }, 5000);

    onCancel(() => {
        clearTimeout(timeout);
        console.log('Operation cancelled');
    });
});

// Cancel after 2 seconds
setTimeout(() => {
    cancellablePromise.cancel();
}, 2000);

try {
    const result = await cancellablePromise;
    console.log('Result:', result);
} catch (error) {
    console.error('Error:', error);
}
```

## Retry Logic and Exponential Backoff

### 1. Basic Retry Pattern

```typescript
// Basic retry with exponential backoff
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    maxDelay: number = 10000
): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            
            if (attempt === maxRetries) {
                throw lastError;
            }
            
            const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
            const jitter = Math.random() * 0.1 * delay; // Add jitter to prevent thundering herd
            
            console.log(`Attempt ${attempt} failed, retrying in ${delay + jitter}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay + jitter));
        }
    }
    
    throw lastError!;
}

// Usage
const result = await retryWithBackoff(
    () => fetch('/api/data').then(response => response.json()),
    3,
    1000,
    10000
);
```

### 2. Advanced Retry with Conditions

```typescript
// Advanced retry with custom conditions
interface RetryOptions {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    shouldRetry: (error: Error, attempt: number) => boolean;
    onRetry: (error: Error, attempt: number, delay: number) => void;
}

async function advancedRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions
): Promise<T> {
    const { maxRetries, baseDelay, maxDelay, shouldRetry, onRetry } = options;
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            
            if (attempt === maxRetries || !shouldRetry(lastError, attempt)) {
                throw lastError;
            }
            
            const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
            onRetry(lastError, attempt, delay);
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError!;
}

// Usage
const result = await advancedRetry(
    () => fetch('/api/data').then(response => response.json()),
    {
        maxRetries: 5,
        baseDelay: 1000,
        maxDelay: 30000,
        shouldRetry: (error, attempt) => {
            // Don't retry on 4xx errors (except 429)
            if (error.message.includes('4') && !error.message.includes('429')) {
                return false;
            }
            return attempt < 5;
        },
        onRetry: (error, attempt, delay) => {
            console.log(`Retry ${attempt}: ${error.message} (waiting ${delay}ms)`);
        }
    }
);
```

## Timeout Handling

### 1. Promise Timeout

```typescript
// Promise timeout utility
async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string = 'Operation timeout'
): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
}

// Usage
try {
    const result = await withTimeout(
        fetch('/api/slow-endpoint').then(response => response.json()),
        5000,
        'API request timeout'
    );
    console.log('Result:', result);
} catch (error) {
    if (error.message === 'API request timeout') {
        console.log('Request timed out');
    } else {
        console.error('Request failed:', error);
    }
}
```

### 2. Timeout with Cleanup

```typescript
// Timeout with cleanup
async function withTimeoutAndCleanup<T>(
    promise: Promise<T>,
    timeoutMs: number,
    cleanup: () => void | Promise<void>
): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(async () => {
            await cleanup();
            reject(new Error('Operation timeout'));
        }, timeoutMs);
    });
    
    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutId);
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Usage
const result = await withTimeoutAndCleanup(
    fetch('/api/data').then(response => response.json()),
    5000,
    async () => {
        console.log('Cleaning up resources...');
        // Perform cleanup operations
    }
);
```

## Async Generators

### 1. Basic Async Generator

```typescript
// Async generator for streaming data
async function* fetchUsersStream(userIds: number[]): AsyncGenerator<User, void, unknown> {
    for (const id of userIds) {
        try {
            const user = await fetchUser(id);
            yield user;
        } catch (error) {
            console.error(`Failed to fetch user ${id}:`, error);
            // Continue with next user
        }
    }
}

// Usage
async function processUsersStream(userIds: number[]): Promise<User[]> {
    const users: User[] = [];
    
    for await (const user of fetchUsersStream(userIds)) {
        users.push(user);
        console.log('Processed user:', user.name);
    }
    
    return users;
}
```

### 2. Async Generator with Backpressure

```typescript
// Async generator with backpressure control
async function* fetchDataWithBackpressure<T>(
    dataSource: () => Promise<T[]>,
    batchSize: number = 10
): AsyncGenerator<T, void, unknown> {
    let offset = 0;
    let hasMore = true;
    
    while (hasMore) {
        try {
            const batch = await dataSource();
            const items = batch.slice(offset, offset + batchSize);
            
            if (items.length === 0) {
                hasMore = false;
                break;
            }
            
            for (const item of items) {
                yield item;
            }
            
            offset += batchSize;
        } catch (error) {
            console.error('Error fetching batch:', error);
            hasMore = false;
        }
    }
}

// Usage
async function processLargeDataset(): Promise<void> {
    for await (const item of fetchDataWithBackpressure(
        () => fetch('/api/data').then(response => response.json()),
        100
    )) {
        console.log('Processing item:', item);
        // Process item here
    }
}
```

## Event Emitters and Async Patterns

### 1. Async Event Emitter

```typescript
// Async event emitter
class AsyncEventEmitter {
    private events: { [key: string]: Function[] } = {};
    private asyncEvents: { [key: string]: Function[] } = {};

    on(event: string, listener: Function): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    async onAsync(event: string, listener: Function): Promise<void> {
        if (!this.asyncEvents[event]) {
            this.asyncEvents[event] = [];
        }
        this.asyncEvents[event].push(listener);
    }

    async emit(event: string, ...args: any[]): Promise<void> {
        // Emit synchronous listeners
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }

        // Emit asynchronous listeners
        if (this.asyncEvents[event]) {
            await Promise.all(
                this.asyncEvents[event].map(listener => listener(...args))
            );
        }
    }

    async emitSequential(event: string, ...args: any[]): Promise<void> {
        // Emit synchronous listeners
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }

        // Emit asynchronous listeners sequentially
        if (this.asyncEvents[event]) {
            for (const listener of this.asyncEvents[event]) {
                await listener(...args);
            }
        }
    }
}

// Usage
const emitter = new AsyncEventEmitter();

emitter.on('data', (data) => {
    console.log('Sync listener:', data);
});

emitter.onAsync('data', async (data) => {
    console.log('Async listener:', data);
    await processData(data);
});

await emitter.emit('data', { id: 1, name: 'Test' });
```

### 2. Promise-based Event Emitter

```typescript
// Promise-based event emitter
class PromiseEventEmitter {
    private events: { [key: string]: Function[] } = {};

    once(event: string): Promise<any> {
        return new Promise((resolve) => {
            const listener = (...args: any[]) => {
                this.off(event, listener);
                resolve(args.length === 1 ? args[0] : args);
            };
            this.on(event, listener);
        });
    }

    on(event: string, listener: Function): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event: string, listener: Function): void {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener);
        }
    }

    emit(event: string, ...args: any[]): void {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }
}

// Usage
const promiseEmitter = new PromiseEventEmitter();

// Wait for specific event
const data = await promiseEmitter.once('data');
console.log('Received data:', data);

// Emit event
promiseEmitter.emit('data', { id: 1, name: 'Test' });
```

## Worker Threads and Async Operations

### 1. Web Worker for Heavy Computations

```typescript
// Main thread
class WorkerManager {
    private workers: Worker[] = [];
    private taskQueue: Array<{ id: string, task: any, resolve: Function, reject: Function }> = [];
    private activeWorkers = 0;
    private maxWorkers = navigator.hardwareConcurrency || 4;

    async executeTask<T>(task: any): Promise<T> {
        return new Promise((resolve, reject) => {
            const taskId = Math.random().toString(36).substr(2, 9);
            this.taskQueue.push({ id: taskId, task, resolve, reject });
            this.processQueue();
        });
    }

    private processQueue(): void {
        if (this.taskQueue.length === 0 || this.activeWorkers >= this.maxWorkers) {
            return;
        }

        const { id, task, resolve, reject } = this.taskQueue.shift()!;
        const worker = this.getWorker();

        worker.postMessage({ id, task });
        this.activeWorkers++;

        worker.onmessage = (event) => {
            const { taskId, result, error } = event.data;
            
            if (taskId === id) {
                this.activeWorkers--;
                this.returnWorker(worker);
                
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(result);
                }
                
                this.processQueue();
            }
        };
    }

    private getWorker(): Worker {
        if (this.workers.length > 0) {
            return this.workers.pop()!;
        }
        
        return new Worker('worker.js');
    }

    private returnWorker(worker: Worker): void {
        this.workers.push(worker);
    }
}

// Usage
const workerManager = new WorkerManager();

const result = await workerManager.executeTask({
    type: 'heavyComputation',
    data: [1, 2, 3, 4, 5]
});
```

### 2. Worker Pool Pattern

```typescript
// Worker pool for managing multiple workers
class WorkerPool {
    private workers: Worker[] = [];
    private availableWorkers: Worker[] = [];
    private taskQueue: Array<{ task: any, resolve: Function, reject: Function }> = [];

    constructor(poolSize: number = 4) {
        for (let i = 0; i < poolSize; i++) {
            const worker = new Worker('worker.js');
            worker.onmessage = (event) => {
                this.handleWorkerMessage(worker, event);
            };
            this.workers.push(worker);
            this.availableWorkers.push(worker);
        }
    }

    async execute<T>(task: any): Promise<T> {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({ task, resolve, reject });
            this.processQueue();
        });
    }

    private processQueue(): void {
        if (this.taskQueue.length === 0 || this.availableWorkers.length === 0) {
            return;
        }

        const { task, resolve, reject } = this.taskQueue.shift()!;
        const worker = this.availableWorkers.pop()!;
        
        worker.postMessage(task);
        
        // Store resolve/reject for this worker
        (worker as any).pendingResolve = resolve;
        (worker as any).pendingReject = reject;
    }

    private handleWorkerMessage(worker: Worker, event: MessageEvent): void {
        const { result, error } = event.data;
        
        if (error) {
            (worker as any).pendingReject(new Error(error));
        } else {
            (worker as any).pendingResolve(result);
        }
        
        // Return worker to pool
        this.availableWorkers.push(worker);
        this.processQueue();
    }

    terminate(): void {
        this.workers.forEach(worker => worker.terminate());
        this.workers = [];
        this.availableWorkers = [];
    }
}
```

## Queue Management

### 1. Priority Queue

```typescript
// Priority queue for async operations
interface QueueItem<T> {
    priority: number;
    task: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: Error) => void;
}

class PriorityQueue<T> {
    private queue: QueueItem<T>[] = [];
    private processing = false;
    private concurrency = 3;
    private activeCount = 0;

    async add(
        task: () => Promise<T>,
        priority: number = 0
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({ priority, task, resolve, reject });
            this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
            this.process();
        });
    }

    private async process(): Promise<void> {
        if (this.processing || this.activeCount >= this.concurrency) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0 && this.activeCount < this.concurrency) {
            const item = this.queue.shift()!;
            this.activeCount++;

            item.task()
                .then(item.resolve)
                .catch(item.reject)
                .finally(() => {
                    this.activeCount--;
                    this.process();
                });
        }

        this.processing = false;
    }
}

// Usage
const priorityQueue = new PriorityQueue<string>();

// High priority task
priorityQueue.add(() => fetch('/api/urgent').then(r => r.text()), 10);

// Low priority task
priorityQueue.add(() => fetch('/api/background').then(r => r.text()), 1);
```

### 2. Rate-Limited Queue

```typescript
// Rate-limited queue
class RateLimitedQueue<T> {
    private queue: Array<{ task: () => Promise<T>, resolve: Function, reject: Function }> = [];
    private processing = false;
    private lastProcessed = 0;
    private minInterval: number;

    constructor(minInterval: number = 1000) {
        this.minInterval = minInterval;
    }

    async add(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.process();
        });
    }

    private async process(): Promise<void> {
        if (this.processing || this.queue.length === 0) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0) {
            const now = Date.now();
            const timeSinceLastProcessed = now - this.lastProcessed;

            if (timeSinceLastProcessed < this.minInterval) {
                await new Promise(resolve => 
                    setTimeout(resolve, this.minInterval - timeSinceLastProcessed)
                );
            }

            const { task, resolve, reject } = this.queue.shift()!;
            
            try {
                const result = await task();
                resolve(result);
            } catch (error) {
                reject(error);
            }

            this.lastProcessed = Date.now();
        }

        this.processing = false;
    }
}
```

## Rate Limiting

### 1. Token Bucket Rate Limiter

```typescript
// Token bucket rate limiter
class TokenBucketRateLimiter {
    private tokens: number;
    private lastRefill: number;
    private refillRate: number;
    private capacity: number;

    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.tokens = capacity;
        this.lastRefill = Date.now();
    }

    async acquire(tokens: number = 1): Promise<void> {
        this.refill();
        
        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return;
        }
        
        // Wait for enough tokens
        const waitTime = ((tokens - this.tokens) / this.refillRate) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        this.refill();
        this.tokens -= tokens;
    }

    private refill(): void {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const tokensToAdd = (timePassed / 1000) * this.refillRate;
        
        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
}

// Usage
const rateLimiter = new TokenBucketRateLimiter(10, 2); // 10 tokens, refill 2 per second

async function makeRequest(): Promise<any> {
    await rateLimiter.acquire(1);
    return fetch('/api/data').then(response => response.json());
}
```

### 2. Sliding Window Rate Limiter

```typescript
// Sliding window rate limiter
class SlidingWindowRateLimiter {
    private requests: number[] = [];
    private windowSize: number;
    private maxRequests: number;

    constructor(windowSize: number, maxRequests: number) {
        this.windowSize = windowSize;
        this.maxRequests = maxRequests;
    }

    async acquire(): Promise<void> {
        const now = Date.now();
        const windowStart = now - this.windowSize;
        
        // Remove old requests outside the window
        this.requests = this.requests.filter(time => time > windowStart);
        
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...this.requests);
            const waitTime = oldestRequest + this.windowSize - now;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.acquire();
        }
        
        this.requests.push(now);
    }
}

// Usage
const rateLimiter = new SlidingWindowRateLimiter(60000, 100); // 100 requests per minute

async function makeRequest(): Promise<any> {
    await rateLimiter.acquire();
    return fetch('/api/data').then(response => response.json());
}
```

## Circuit Breaker Pattern

### 1. Basic Circuit Breaker

```typescript
// Circuit breaker implementation
class CircuitBreaker {
    private failureCount = 0;
    private lastFailureTime = 0;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    
    constructor(
        private threshold: number = 5,
        private timeout: number = 60000,
        private resetTimeout: number = 30000
    ) {}

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
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

    private onSuccess(): void {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }

    private onFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.threshold) {
            this.state = 'OPEN';
        }
    }

    getState(): string {
        return this.state;
    }
}

// Usage
const circuitBreaker = new CircuitBreaker(5, 60000, 30000);

try {
    const result = await circuitBreaker.execute(() => fetch('/api/data').then(r => r.json()));
    console.log('Result:', result);
} catch (error) {
    console.error('Error:', error.message);
}
```

### 2. Advanced Circuit Breaker

```typescript
// Advanced circuit breaker with metrics
class AdvancedCircuitBreaker {
    private failureCount = 0;
    private successCount = 0;
    private lastFailureTime = 0;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    private metrics: { [key: string]: number } = {};

    constructor(
        private threshold: number = 5,
        private timeout: number = 60000,
        private resetTimeout: number = 30000,
        private successThreshold: number = 3
    ) {}

    async execute<T>(fn: () => Promise<T>, operation: string = 'default'): Promise<T> {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
                this.successCount = 0;
            } else {
                throw new Error(`Circuit breaker is OPEN for operation: ${operation}`);
            }
        }
        
        const startTime = Date.now();
        
        try {
            const result = await fn();
            this.onSuccess(operation, Date.now() - startTime);
            return result;
        } catch (error) {
            this.onFailure(operation, Date.now() - startTime);
            throw error;
        }
    }

    private onSuccess(operation: string, duration: number): void {
        this.successCount++;
        this.failureCount = 0;
        
        this.metrics[`${operation}_success`] = (this.metrics[`${operation}_success`] || 0) + 1;
        this.metrics[`${operation}_duration`] = (this.metrics[`${operation}_duration`] || 0) + duration;
        
        if (this.state === 'HALF_OPEN' && this.successCount >= this.successThreshold) {
            this.state = 'CLOSED';
        }
    }

    private onFailure(operation: string, duration: number): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        this.metrics[`${operation}_failure`] = (this.metrics[`${operation}_failure`] || 0) + 1;
        
        if (this.failureCount >= this.threshold) {
            this.state = 'OPEN';
        }
    }

    getMetrics(): { [key: string]: number } {
        return { ...this.metrics };
    }

    getState(): string {
        return this.state;
    }
}
```

## Bulk Operations and Batching

### 1. Batch Processing

```typescript
// Batch processing utility
class BatchProcessor<T, R> {
    private batch: T[] = [];
    private batchSize: number;
    private flushInterval: number;
    private processor: (batch: T[]) => Promise<R[]>;
    private flushTimeout: NodeJS.Timeout | null = null;

    constructor(
        batchSize: number,
        flushInterval: number,
        processor: (batch: T[]) => Promise<R[]>
    ) {
        this.batchSize = batchSize;
        this.flushInterval = flushInterval;
        this.processor = processor;
    }

    async add(item: T): Promise<R> {
        return new Promise((resolve, reject) => {
            this.batch.push({ item, resolve, reject });
            
            if (this.batch.length >= this.batchSize) {
                this.flush();
            } else if (!this.flushTimeout) {
                this.flushTimeout = setTimeout(() => this.flush(), this.flushInterval);
            }
        });
    }

    private async flush(): Promise<void> {
        if (this.batch.length === 0) {
            return;
        }

        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
            this.flushTimeout = null;
        }

        const currentBatch = this.batch.splice(0, this.batchSize);
        
        try {
            const results = await this.processor(currentBatch.map(item => item.item));
            
            currentBatch.forEach((item, index) => {
                item.resolve(results[index]);
            });
        } catch (error) {
            currentBatch.forEach(item => {
                item.reject(error);
            });
        }
    }

    async close(): Promise<void> {
        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
        }
        await this.flush();
    }
}

// Usage
const batchProcessor = new BatchProcessor<number, string>(
    10, // batch size
    1000, // flush interval
    async (numbers) => {
        // Process batch of numbers
        return numbers.map(n => `Processed: ${n}`);
    }
);

// Add items to batch
for (let i = 0; i < 25; i++) {
    batchProcessor.add(i).then(result => console.log(result));
}

await batchProcessor.close();
```

### 2. Bulk Operations with Retry

```typescript
// Bulk operations with retry
class BulkOperationManager<T, R> {
    private operations: Array<{ item: T, resolve: Function, reject: Function }> = [];
    private batchSize: number;
    private processor: (items: T[]) => Promise<R[]>;
    private retryOptions: RetryOptions;

    constructor(
        batchSize: number,
        processor: (items: T[]) => Promise<R[]>,
        retryOptions: RetryOptions
    ) {
        this.batchSize = batchSize;
        this.processor = processor;
        this.retryOptions = retryOptions;
    }

    async add(item: T): Promise<R> {
        return new Promise((resolve, reject) => {
            this.operations.push({ item, resolve, reject });
            
            if (this.operations.length >= this.batchSize) {
                this.processBatch();
            }
        });
    }

    private async processBatch(): Promise<void> {
        if (this.operations.length === 0) {
            return;
        }

        const batch = this.operations.splice(0, this.batchSize);
        
        try {
            const results = await advancedRetry(
                () => this.processor(batch.map(op => op.item)),
                this.retryOptions
            );
            
            batch.forEach((operation, index) => {
                operation.resolve(results[index]);
            });
        } catch (error) {
            batch.forEach(operation => {
                operation.reject(error);
            });
        }
    }

    async flush(): Promise<void> {
        while (this.operations.length > 0) {
            await this.processBatch();
        }
    }
}
```

## Conclusion

Advanced async patterns provide powerful tools for building robust, scalable, and maintainable asynchronous applications. Key takeaways:

1. **Promise cancellation** allows for proper cleanup and resource management
2. **Retry logic** with exponential backoff provides resilience against transient failures
3. **Timeout handling** prevents operations from hanging indefinitely
4. **Async generators** enable streaming and backpressure control
5. **Event emitters** provide decoupled communication patterns
6. **Worker threads** offload heavy computations from the main thread
7. **Queue management** ensures proper ordering and resource utilization
8. **Rate limiting** prevents overwhelming external services
9. **Circuit breakers** provide fault tolerance and system protection
10. **Bulk operations** optimize performance for large datasets

These patterns can be combined and customized to solve complex real-world problems in asynchronous programming.

## Next Steps

In the next article, we'll create the Level 5 mini-project: Asynchronous Task Scheduler, which will demonstrate many of these advanced patterns in a practical application.



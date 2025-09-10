# Promises & Promise Chaining

## Overview

Promises provide a more elegant way to handle asynchronous operations in JavaScript. This article explores Promise fundamentals, chaining, error handling, and advanced patterns that make asynchronous code more readable and maintainable.

## Table of Contents

1. [Understanding Promises](#understanding-promises)
2. [Promise States and Lifecycle](#promise-states-and-lifecycle)
3. [Creating Promises](#creating-promises)
4. [Promise Methods](#promise-methods)
5. [Promise Chaining](#promise-chaining)
6. [Error Handling](#error-handling)
7. [Promise Utilities](#promise-utilities)
8. [Advanced Promise Patterns](#advanced-promise-patterns)
9. [Promise Performance](#promise-performance)
10. [Testing Promises](#testing-promises)

## Understanding Promises

A Promise is an object representing the eventual completion or failure of an asynchronous operation. It provides a cleaner alternative to callbacks for handling asynchronous code.

### Basic Promise Concept

```typescript
// Promise represents a future value
const promise = new Promise<string>((resolve, reject) => {
    // Asynchronous operation
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
            resolve('Operation completed successfully');
        } else {
            reject(new Error('Operation failed'));
        }
    }, 1000);
});

// Using the promise
promise
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));
```

### Promise vs Callback Comparison

```typescript
// Callback approach
function fetchDataCallback(url: string, callback: (error: Error | null, data?: any) => void): void {
    // Simulate async operation
    setTimeout(() => {
        if (url.includes('error')) {
            callback(new Error('Network error'));
        } else {
            callback(null, { data: 'Success' });
        }
    }, 1000);
}

// Promise approach
function fetchDataPromise(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (url.includes('error')) {
                reject(new Error('Network error'));
            } else {
                resolve({ data: 'Success' });
            }
        }, 1000);
    });
}

// Usage comparison
// Callback
fetchDataCallback('/api/data', (error, data) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data:', data);
    }
});

// Promise
fetchDataPromise('/api/data')
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Error:', error));
```

## Promise States and Lifecycle

A Promise can be in one of three states:

### 1. Pending
The initial state when the Promise is created and the asynchronous operation hasn't completed yet.

```typescript
const pendingPromise = new Promise<string>((resolve, reject) => {
    // Promise is in pending state
    console.log('Promise is pending');
    // No resolve or reject called yet
});

console.log(pendingPromise); // Promise { <pending> }
```

### 2. Fulfilled (Resolved)
The state when the asynchronous operation completes successfully.

```typescript
const fulfilledPromise = new Promise<string>((resolve, reject) => {
    resolve('Operation completed');
});

fulfilledPromise.then(result => {
    console.log('Promise fulfilled:', result);
});
```

### 3. Rejected
The state when the asynchronous operation fails.

```typescript
const rejectedPromise = new Promise<string>((resolve, reject) => {
    reject(new Error('Operation failed'));
});

rejectedPromise.catch(error => {
    console.log('Promise rejected:', error.message);
});
```

### State Transitions

```typescript
// Promise state transitions
class PromiseStateTracker {
    private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    private value: any = undefined;
    private reason: any = undefined;

    createPromise(): Promise<any> {
        return new Promise((resolve, reject) => {
            // Pending state
            this.state = 'pending';
            console.log('Promise state: PENDING');

            // Simulate async operation
            setTimeout(() => {
                const success = Math.random() > 0.5;
                
                if (success) {
                    // Fulfilled state
                    this.state = 'fulfilled';
                    this.value = 'Success';
                    console.log('Promise state: FULFILLED');
                    resolve(this.value);
                } else {
                    // Rejected state
                    this.state = 'rejected';
                    this.reason = new Error('Failed');
                    console.log('Promise state: REJECTED');
                    reject(this.reason);
                }
            }, 1000);
        });
    }

    getState(): string {
        return this.state;
    }
}
```

## Creating Promises

### 1. Promise Constructor

```typescript
// Basic promise creation
const basicPromise = new Promise<string>((resolve, reject) => {
    // Asynchronous operation
    setTimeout(() => {
        resolve('Hello, World!');
    }, 1000);
});

// Promise with error handling
const errorHandlingPromise = new Promise<number>((resolve, reject) => {
    const value = Math.random();
    
    if (value > 0.5) {
        resolve(value);
    } else {
        reject(new Error(`Value ${value} is too small`));
    }
});
```

### 2. Promise.resolve() and Promise.reject()

```typescript
// Promise.resolve() - creates a resolved promise
const resolvedPromise = Promise.resolve('Immediate value');

// Promise.reject() - creates a rejected promise
const rejectedPromise = Promise.reject(new Error('Immediate error'));

// Usage
resolvedPromise.then(value => console.log(value)); // "Immediate value"
rejectedPromise.catch(error => console.error(error.message)); // "Immediate error"
```

### 3. Converting Callbacks to Promises

```typescript
// Convert callback-based function to promise
function promisify<T>(
    fn: (callback: (error: Error | null, result?: T) => void) => void
): Promise<T> {
    return new Promise((resolve, reject) => {
        fn((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result!);
            }
        });
    });
}

// Example usage
function getUserById(id: number, callback: (error: Error | null, user?: User) => void): void {
    setTimeout(() => {
        if (id <= 0) {
            callback(new Error('Invalid ID'));
        } else {
            callback(null, { id, name: `User ${id}` });
        }
    }, 100);
}

// Convert to promise
const getUserByIdPromise = (id: number) => promisify<User>((callback) => getUserById(id, callback));

// Usage
getUserByIdPromise(1)
    .then(user => console.log('User:', user))
    .catch(error => console.error('Error:', error));
```

## Promise Methods

### 1. .then() Method

```typescript
// Basic .then() usage
Promise.resolve('Hello')
    .then(value => {
        console.log(value); // "Hello"
        return value + ' World';
    })
    .then(value => {
        console.log(value); // "Hello World"
        return value.length;
    })
    .then(length => {
        console.log('Length:', length); // 11
    });

// .then() with error handling
Promise.reject(new Error('Something went wrong'))
    .then(
        value => console.log('Success:', value),
        error => console.error('Error:', error.message)
    );
```

### 2. .catch() Method

```typescript
// .catch() for error handling
Promise.reject(new Error('Network error'))
    .then(value => console.log('Success:', value))
    .catch(error => {
        console.error('Caught error:', error.message);
        return 'Fallback value';
    })
    .then(value => {
        console.log('After catch:', value); // "Fallback value"
    });
```

### 3. .finally() Method

```typescript
// .finally() always executes
function fetchData(): Promise<string> {
    console.log('Starting fetch...');
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve('Data fetched successfully');
            } else {
                reject(new Error('Fetch failed'));
            }
        }, 1000);
    });
}

fetchData()
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error.message))
    .finally(() => {
        console.log('Fetch operation completed');
    });
```

## Promise Chaining

Promise chaining allows you to perform multiple asynchronous operations in sequence.

### Basic Chaining

```typescript
// Sequential promise chaining
function fetchUser(id: number): Promise<User> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
        }, 100);
    });
}

function fetchUserPosts(userId: number): Promise<Post[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: 'Post 1', userId },
                { id: 2, title: 'Post 2', userId }
            ]);
        }, 100);
    });
}

function fetchPostComments(postId: number): Promise<Comment[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, text: 'Great post!', postId },
                { id: 2, text: 'Thanks for sharing!', postId }
            ]);
        }, 100);
    });
}

// Chaining promises
fetchUser(1)
    .then(user => {
        console.log('User:', user);
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log('Posts:', posts);
        return fetchPostComments(posts[0].id);
    })
    .then(comments => {
        console.log('Comments:', comments);
    })
    .catch(error => {
        console.error('Error in chain:', error);
    });
```

### Advanced Chaining Patterns

```typescript
// Conditional chaining
function processData(data: any): Promise<any> {
    return Promise.resolve(data)
        .then(value => {
            if (typeof value === 'string') {
                return value.toUpperCase();
            }
            return value;
        })
        .then(value => {
            if (Array.isArray(value)) {
                return value.map(item => item * 2);
            }
            return value;
        })
        .then(value => {
            console.log('Processed data:', value);
            return value;
        });
}

// Parallel processing in chain
function fetchMultipleData(): Promise<{ users: User[], posts: Post[] }> {
    return Promise.resolve()
        .then(() => {
            // Fetch users and posts in parallel
            return Promise.all([
                fetchUser(1),
                fetchUser(2),
                fetchUserPosts(1)
            ]);
        })
        .then(([user1, user2, posts]) => {
            return {
                users: [user1, user2],
                posts: posts
            };
        });
}
```

## Error Handling

### 1. Error Propagation

```typescript
// Error propagation through promise chain
function step1(): Promise<string> {
    return Promise.resolve('Step 1');
}

function step2(value: string): Promise<string> {
    return Promise.resolve(value + ' -> Step 2');
}

function step3(value: string): Promise<string> {
    return Promise.reject(new Error('Step 3 failed'));
}

function step4(value: string): Promise<string> {
    return Promise.resolve(value + ' -> Step 4');
}

// Error will be caught by the final .catch()
step1()
    .then(step2)
    .then(step3) // This will reject
    .then(step4) // This won't execute
    .catch(error => {
        console.error('Error caught:', error.message); // "Step 3 failed"
    });
```

### 2. Error Recovery

```typescript
// Error recovery in promise chain
function fetchDataWithFallback(url: string): Promise<any> {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.warn('Primary fetch failed:', error.message);
            // Fallback to cached data
            return getCachedData();
        })
        .catch(error => {
            console.warn('Fallback failed:', error.message);
            // Return default data
            return { data: 'Default data' };
        });
}

function getCachedData(): Promise<any> {
    return Promise.resolve({ data: 'Cached data' });
}
```

### 3. Error Boundaries

```typescript
// Error boundary pattern
class PromiseErrorBoundary {
    static wrap<T>(promise: Promise<T>): Promise<T> {
        return promise.catch(error => {
            console.error('Promise error boundary caught:', error);
            // Log error, send to monitoring service, etc.
            throw error; // Re-throw to maintain error propagation
        });
    }
    
    static safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
        return promise.catch(error => {
            console.error('Promise error, using fallback:', error);
            return fallback;
        });
    }
}

// Usage
const safePromise = PromiseErrorBoundary.wrap(fetchData());
const safePromiseWithFallback = PromiseErrorBoundary.safe(fetchData(), { data: 'fallback' });
```

## Promise Utilities

### 1. Promise.all()

```typescript
// Promise.all() - wait for all promises to resolve
function fetchMultipleUsers(ids: number[]): Promise<User[]> {
    const promises = ids.map(id => fetchUser(id));
    
    return Promise.all(promises)
        .then(users => {
            console.log('All users fetched:', users);
            return users;
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            throw error;
        });
}

// Usage
fetchMultipleUsers([1, 2, 3])
    .then(users => console.log('Users:', users))
    .catch(error => console.error('Error:', error));
```

### 2. Promise.allSettled()

```typescript
// Promise.allSettled() - wait for all promises to settle
function fetchUsersWithPartialFailure(ids: number[]): Promise<User[]> {
    const promises = ids.map(id => 
        fetchUser(id).catch(error => {
            console.warn(`Failed to fetch user ${id}:`, error.message);
            return null;
        })
    );
    
    return Promise.allSettled(promises)
        .then(results => {
            const users = results
                .filter((result): result is PromiseFulfilledResult<User> => 
                    result.status === 'fulfilled' && result.value !== null
                )
                .map(result => result.value);
            
            console.log(`Successfully fetched ${users.length} out of ${ids.length} users`);
            return users;
        });
}
```

### 3. Promise.race()

```typescript
// Promise.race() - first promise to settle wins
function fetchWithTimeout(url: string, timeout: number = 5000): Promise<Response> {
    const fetchPromise = fetch(url);
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
    });
    
    return Promise.race([fetchPromise, timeoutPromise]);
}

// Usage
fetchWithTimeout('/api/data', 3000)
    .then(response => console.log('Response:', response))
    .catch(error => console.error('Error:', error.message));
```

### 4. Promise.any()

```typescript
// Promise.any() - first promise to resolve wins
function fetchFromMultipleSources(urls: string[]): Promise<Response> {
    const promises = urls.map(url => 
        fetch(url).catch(error => {
            console.warn(`Failed to fetch from ${url}:`, error.message);
            throw error;
        })
    );
    
    return Promise.any(promises)
        .then(response => {
            console.log('Successfully fetched from one of the sources');
            return response;
        });
}
```

## Advanced Promise Patterns

### 1. Promise Retry Pattern

```typescript
// Retry pattern for promises
function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        function attempt(): void {
            fn()
                .then(resolve)
                .catch(error => {
                    attempts++;
                    if (attempts < maxRetries) {
                        console.log(`Attempt ${attempts} failed, retrying in ${delay}ms...`);
                        setTimeout(attempt, delay * attempts);
                    } else {
                        reject(error);
                    }
                });
        }
        
        attempt();
    });
}

// Usage
retry(() => fetch('/api/data'), 3, 1000)
    .then(response => console.log('Success:', response))
    .catch(error => console.error('Failed after retries:', error));
```

### 2. Promise Cancellation

```typescript
// Promise cancellation using AbortController
function cancellableFetch(url: string, signal: AbortSignal): Promise<Response> {
    return fetch(url, { signal })
        .then(response => {
            if (signal.aborted) {
                throw new Error('Request was cancelled');
            }
            return response;
        });
}

// Usage
const controller = new AbortController();
const promise = cancellableFetch('/api/data', controller.signal);

// Cancel after 2 seconds
setTimeout(() => {
    controller.abort();
    console.log('Request cancelled');
}, 2000);

promise
    .then(response => console.log('Response:', response))
    .catch(error => console.error('Error:', error.message));
```

### 3. Promise Pool Pattern

```typescript
// Promise pool for limiting concurrent operations
class PromisePool {
    private concurrency: number;
    private running: Promise<any>[] = [];
    private queue: Array<() => Promise<any>> = [];

    constructor(concurrency: number = 3) {
        this.concurrency = concurrency;
    }

    add<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.process();
        });
    }

    private process(): void {
        if (this.running.length >= this.concurrency || this.queue.length === 0) {
            return;
        }

        const fn = this.queue.shift()!;
        const promise = fn().finally(() => {
            this.running = this.running.filter(p => p !== promise);
            this.process();
        });

        this.running.push(promise);
    }
}

// Usage
const pool = new PromisePool(2);

for (let i = 0; i < 5; i++) {
    pool.add(() => fetchUser(i))
        .then(user => console.log('User:', user))
        .catch(error => console.error('Error:', error));
}
```

## Promise Performance

### 1. Memory Management

```typescript
// Proper promise cleanup
class PromiseManager {
    private promises = new Set<Promise<any>>();

    createPromise<T>(fn: () => Promise<T>): Promise<T> {
        const promise = fn();
        this.promises.add(promise);
        
        promise.finally(() => {
            this.promises.delete(promise);
        });
        
        return promise;
    }

    cancelAll(): void {
        this.promises.forEach(promise => {
            // Note: Promises can't be cancelled directly
            // This is just for cleanup tracking
        });
        this.promises.clear();
    }
}
```

### 2. Performance Monitoring

```typescript
// Promise performance monitoring
class PromisePerformanceMonitor {
    static measure<T>(name: string, promise: Promise<T>): Promise<T> {
        const start = performance.now();
        
        return promise.finally(() => {
            const end = performance.now();
            console.log(`${name} took ${end - start}ms`);
        });
    }
    
    static timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
        return Promise.race([
            promise,
            new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Promise timeout')), ms);
            })
        ]);
    }
}

// Usage
const monitoredPromise = PromisePerformanceMonitor.measure(
    'User fetch',
    fetchUser(1)
);

const timeoutPromise = PromisePerformanceMonitor.timeout(
    fetchUser(1),
    5000
);
```

## Testing Promises

### 1. Unit Testing Promises

```typescript
// Testing promise-based functions
describe('Promise Functions', () => {
    test('should resolve with correct value', async () => {
        const promise = Promise.resolve('test value');
        await expect(promise).resolves.toBe('test value');
    });

    test('should reject with error', async () => {
        const promise = Promise.reject(new Error('test error'));
        await expect(promise).rejects.toThrow('test error');
    });

    test('should handle promise chain', async () => {
        const result = await fetchUser(1)
            .then(user => user.name)
            .then(name => name.toUpperCase());
        
        expect(result).toBe('USER 1');
    });
});
```

### 2. Mocking Promises

```typescript
// Mocking promise-based functions
jest.mock('./api', () => ({
    fetchUser: jest.fn(),
    fetchUserPosts: jest.fn()
}));

describe('Promise Chaining', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should chain promises correctly', async () => {
        const mockFetchUser = require('./api').fetchUser as jest.MockedFunction<typeof fetchUser>;
        const mockFetchUserPosts = require('./api').fetchUserPosts as jest.MockedFunction<typeof fetchUserPosts>;

        mockFetchUser.mockResolvedValue({ id: 1, name: 'User 1' });
        mockFetchUserPosts.mockResolvedValue([{ id: 1, title: 'Post 1' }]);

        const result = await fetchUser(1)
            .then(user => fetchUserPosts(user.id));

        expect(mockFetchUser).toHaveBeenCalledWith(1);
        expect(mockFetchUserPosts).toHaveBeenCalledWith(1);
        expect(result).toEqual([{ id: 1, title: 'Post 1' }]);
    });
});
```

## Conclusion

Promises provide a powerful and elegant way to handle asynchronous operations in JavaScript. Key takeaways:

1. **Promises** represent future values and have three states: pending, fulfilled, and rejected
2. **Chaining** allows sequential processing of asynchronous operations
3. **Error handling** is improved with .catch() and error propagation
4. **Utility methods** like Promise.all(), Promise.race(), and Promise.allSettled() provide powerful patterns
5. **Advanced patterns** like retry, cancellation, and pooling solve complex async scenarios
6. **Testing** promises requires special consideration for asynchronous behavior

Promises are the foundation for modern async/await syntax and provide a much cleaner alternative to callbacks for handling asynchronous operations.

## Next Steps

In the next article, we'll explore Async/Await & Error Handling, which builds upon promises to provide even more readable and maintainable asynchronous code.



# Promises & Promise Chaining: Managing Asynchronous Operations

## Introduction

Promises are a powerful abstraction for handling asynchronous operations in JavaScript. They provide a cleaner alternative to callbacks and make it easier to manage complex asynchronous workflows. Understanding promises is essential for modern JavaScript development.

## What are Promises?

A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has three states:
- **Pending**: Initial state, neither fulfilled nor rejected
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

### Basic Promise Structure

```javascript
const promise = new Promise((resolve, reject) => {
    // Asynchronous operation
    if (/* operation successful */) {
        resolve('Success!');
    } else {
        reject('Error occurred');
    }
});
```

## Creating Promises

### Basic Promise Creation

```javascript
// Simple promise
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Operation completed');
    }, 1000);
});

// Promise with rejection
const errorPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('Something went wrong'));
    }, 1000);
});

// Promise with conditional logic
const conditionalPromise = new Promise((resolve, reject) => {
    const success = Math.random() > 0.5;
    
    setTimeout(() => {
        if (success) {
            resolve('Success!');
        } else {
            reject(new Error('Random failure'));
        }
    }, 1000);
});
```

### Promise Factory Functions

```javascript
// Function that returns a promise
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(`HTTP ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network error'));
        };
        
        xhr.send();
    });
}

// Usage
fetchData('https://api.example.com/data')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### Promise.resolve() and Promise.reject()

```javascript
// Promise.resolve() creates a resolved promise
const resolvedPromise = Promise.resolve('Immediate value');

// Promise.reject() creates a rejected promise
const rejectedPromise = Promise.reject(new Error('Immediate error'));

// Converting values to promises
const valuePromise = Promise.resolve(42);
const errorPromise = Promise.reject(new Error('Something went wrong'));

// Usage
resolvedPromise.then(value => console.log(value)); // "Immediate value"
rejectedPromise.catch(error => console.error(error)); // Error: Immediate error
```

## Promise Methods

### .then()

The `.then()` method is used to handle both resolved and rejected promises.

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Success!');
    }, 1000);
});

// Basic usage
promise.then(value => {
    console.log(value); // "Success!"
});

// Handling both success and error
promise.then(
    value => console.log('Success:', value),
    error => console.error('Error:', error)
);

// Chaining
promise
    .then(value => value.toUpperCase())
    .then(upperValue => console.log(upperValue)); // "SUCCESS!"
```

### .catch()

The `.catch()` method is used to handle rejected promises.

```javascript
const errorPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('Something went wrong'));
    }, 1000);
});

// Basic error handling
errorPromise.catch(error => {
    console.error('Caught error:', error.message);
});

// Chaining with catch
errorPromise
    .then(value => console.log(value))
    .catch(error => console.error('Error:', error.message));
```

### .finally()

The `.finally()` method runs regardless of whether the promise is resolved or rejected.

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Success!');
    }, 1000);
});

promise
    .then(value => console.log(value))
    .catch(error => console.error(error))
    .finally(() => {
        console.log('This always runs');
    });
```

## Promise Chaining

### Basic Chaining

```javascript
// Sequential operations
fetchData('https://api.example.com/users')
    .then(users => {
        console.log('Users:', users);
        return fetchData('https://api.example.com/posts');
    })
    .then(posts => {
        console.log('Posts:', posts);
        return fetchData('https://api.example.com/comments');
    })
    .then(comments => {
        console.log('Comments:', comments);
    })
    .catch(error => {
        console.error('Error in chain:', error);
    });
```

### Data Transformation in Chains

```javascript
// Transforming data through the chain
fetchData('https://api.example.com/users')
    .then(response => JSON.parse(response))
    .then(users => users.filter(user => user.active))
    .then(activeUsers => activeUsers.map(user => user.name))
    .then(names => names.sort())
    .then(sortedNames => {
        console.log('Active user names:', sortedNames);
    })
    .catch(error => {
        console.error('Error processing users:', error);
    });
```

### Error Handling in Chains

```javascript
// Error handling at different levels
fetchData('https://api.example.com/users')
    .then(users => {
        if (!users.length) {
            throw new Error('No users found');
        }
        return users;
    })
    .then(users => {
        // Process users
        return users.map(user => ({ ...user, processed: true }));
    })
    .catch(error => {
        console.error('Error in user processing:', error);
        return []; // Return empty array as fallback
    })
    .then(processedUsers => {
        console.log('Processed users:', processedUsers);
    });
```

## Promise.all()

`Promise.all()` waits for all promises to resolve or any to reject.

```javascript
// Multiple parallel requests
const promise1 = fetchData('https://api.example.com/users');
const promise2 = fetchData('https://api.example.com/posts');
const promise3 = fetchData('https://api.example.com/comments');

Promise.all([promise1, promise2, promise3])
    .then(([users, posts, comments]) => {
        console.log('All data loaded:', { users, posts, comments });
    })
    .catch(error => {
        console.error('One or more requests failed:', error);
    });

// With different data types
const promises = [
    Promise.resolve(42),
    Promise.resolve('Hello'),
    Promise.resolve({ name: 'John' })
];

Promise.all(promises)
    .then(([number, string, object]) => {
        console.log(number, string, object);
    });
```

## Promise.allSettled()

`Promise.allSettled()` waits for all promises to settle (resolve or reject).

```javascript
const promises = [
    Promise.resolve('Success'),
    Promise.reject(new Error('Failure')),
    Promise.resolve('Another success')
];

Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index} succeeded:`, result.value);
            } else {
                console.log(`Promise ${index} failed:`, result.reason);
            }
        });
    });
```

## Promise.race()

`Promise.race()` returns the first promise that settles.

```javascript
// Timeout pattern
const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 5000);
});

const dataPromise = fetchData('https://api.example.com/slow-data');

Promise.race([dataPromise, timeoutPromise])
    .then(data => {
        console.log('Data loaded before timeout:', data);
    })
    .catch(error => {
        console.error('Request failed or timed out:', error);
    });

// Multiple data sources
const fastSource = fetchData('https://api.fast.com/data');
const slowSource = fetchData('https://api.slow.com/data');

Promise.race([fastSource, slowSource])
    .then(data => {
        console.log('First response received:', data);
    });
```

## Promise.any()

`Promise.any()` returns the first promise that fulfills.

```javascript
const promises = [
    Promise.reject(new Error('First failed')),
    Promise.resolve('Second succeeded'),
    Promise.reject(new Error('Third failed'))
];

Promise.any(promises)
    .then(value => {
        console.log('First success:', value); // "Second succeeded"
    })
    .catch(error => {
        console.error('All promises failed:', error);
    });
```

## Advanced Promise Patterns

### Promise Retry Pattern

```javascript
function retry(fn, maxAttempts = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        function attempt() {
            attempts++;
            
            fn()
                .then(resolve)
                .catch(error => {
                    if (attempts < maxAttempts) {
                        console.log(`Attempt ${attempts} failed, retrying...`);
                        setTimeout(attempt, delay);
                    } else {
                        reject(error);
                    }
                });
        }
        
        attempt();
    });
}

// Usage
retry(() => fetchData('https://api.example.com/data'))
    .then(data => console.log('Data loaded:', data))
    .catch(error => console.error('All attempts failed:', error));
```

### Promise Timeout Pattern

```javascript
function withTimeout(promise, timeoutMs) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
}

// Usage
withTimeout(fetchData('https://api.example.com/data'), 5000)
    .then(data => console.log('Data loaded:', data))
    .catch(error => console.error('Request failed:', error));
```

### Promise Queue Pattern

```javascript
class PromiseQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    add(promiseFactory) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promiseFactory,
                resolve,
                reject
            });
            this.process();
        });
    }
    
    process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }
        
        this.running++;
        const { promiseFactory, resolve, reject } = this.queue.shift();
        
        promiseFactory()
            .then(resolve)
            .catch(reject)
            .finally(() => {
                this.running--;
                this.process();
            });
    }
}

// Usage
const queue = new PromiseQueue(2); // Max 2 concurrent requests

queue.add(() => fetchData('https://api.example.com/data1'));
queue.add(() => fetchData('https://api.example.com/data2'));
queue.add(() => fetchData('https://api.example.com/data3'));
```

## Converting Callbacks to Promises

### Node.js Style Callbacks

```javascript
// Convert Node.js style callback to promise
function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// Usage
const fs = require('fs');
const readFile = promisify(fs.readFile);

readFile('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### XMLHttpRequest to Promise

```javascript
function fetchData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(`HTTP ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network error'));
        };
        
        xhr.send();
    });
}
```

## Error Handling Best Practices

### 1. Always Handle Errors

```javascript
// Bad: Unhandled promise rejection
fetchData('https://api.example.com/data')
    .then(data => console.log(data));

// Good: Always handle errors
fetchData('https://api.example.com/data')
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

### 2. Use Specific Error Types

```javascript
class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function fetchData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new NetworkError(`HTTP ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new NetworkError('Network error'));
        };
        
        xhr.send();
    });
}
```

### 3. Error Recovery

```javascript
function fetchDataWithFallback(url, fallbackUrl) {
    return fetchData(url)
        .catch(error => {
            console.warn('Primary request failed, trying fallback:', error);
            return fetchData(fallbackUrl);
        })
        .catch(error => {
            console.error('Both requests failed:', error);
            throw new Error('All data sources failed');
        });
}
```

## Performance Considerations

### 1. Parallel vs Sequential

```javascript
// Sequential (slower)
fetchData('https://api.example.com/users')
    .then(users => {
        return fetchData('https://api.example.com/posts');
    })
    .then(posts => {
        return fetchData('https://api.example.com/comments');
    });

// Parallel (faster)
Promise.all([
    fetchData('https://api.example.com/users'),
    fetchData('https://api.example.com/posts'),
    fetchData('https://api.example.com/comments')
]);
```

### 2. Memory Management

```javascript
// Good: Clean up references
let promise = fetchData('https://api.example.com/data');
promise = null; // Allow garbage collection

// Bad: Keeping references
const promises = [];
for (let i = 0; i < 1000; i++) {
    promises.push(fetchData(`https://api.example.com/data${i}`));
}
// This keeps all promises in memory
```

## Conclusion

Promises provide a powerful and flexible way to handle asynchronous operations in JavaScript. They eliminate callback hell, provide better error handling, and enable complex asynchronous workflows through chaining and composition.

## Key Takeaways

- Promises represent the eventual completion or failure of an asynchronous operation
- Use `.then()`, `.catch()`, and `.finally()` to handle promise states
- Chain promises to create sequential workflows
- Use `Promise.all()`, `Promise.race()`, and `Promise.allSettled()` for parallel operations
- Always handle errors in promise chains
- Convert callbacks to promises for better error handling
- Consider performance implications of parallel vs sequential operations

## Next Steps

- Learn about async/await syntax
- Understand the event loop and concurrency model
- Explore Web APIs and the Fetch API
- Practice building complex asynchronous applications
- Study error handling patterns and recovery strategies



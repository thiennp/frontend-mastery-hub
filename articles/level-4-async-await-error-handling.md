# Async/Await & Error Handling: Modern Asynchronous JavaScript

## Introduction

Async/await is a modern JavaScript syntax that makes asynchronous code look and behave more like synchronous code. It's built on top of promises and provides a cleaner, more readable way to handle asynchronous operations. Combined with proper error handling, it's the preferred approach for modern JavaScript development.

## What is Async/Await?

Async/await is syntactic sugar over promises that allows you to write asynchronous code in a more synchronous style. It makes promises easier to work with by eliminating the need for `.then()` and `.catch()` chains.

### Basic Syntax

```javascript
// Promise-based approach
function fetchData() {
    return fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

// Async/await approach
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

## Async Functions

### Basic Async Function

```javascript
// Async function declaration
async function myAsyncFunction() {
    return 'Hello from async function!';
}

// Async function expression
const myAsyncFunction = async function() {
    return 'Hello from async function!';
};

// Async arrow function
const myAsyncFunction = async () => {
    return 'Hello from async function!';
};

// Usage
myAsyncFunction().then(result => {
    console.log(result); // "Hello from async function!"
});
```

### Async Functions Always Return Promises

```javascript
async function getValue() {
    return 42;
}

// This is equivalent to:
function getValue() {
    return Promise.resolve(42);
}

// Usage
getValue().then(value => {
    console.log(value); // 42
});

// Or with async/await
async function useValue() {
    const value = await getValue();
    console.log(value); // 42
}
```

## The Await Keyword

### Basic Await Usage

```javascript
async function fetchUserData() {
    const response = await fetch('https://api.example.com/users/1');
    const user = await response.json();
    return user;
}

// Await can only be used inside async functions
async function processUser() {
    const user = await fetchUserData();
    console.log('User:', user);
    return user;
}
```

### Await with Promises

```javascript
// Await works with any promise
async function example() {
    const promise1 = Promise.resolve('First');
    const promise2 = Promise.resolve('Second');
    
    const result1 = await promise1;
    const result2 = await promise2;
    
    console.log(result1, result2); // "First Second"
}

// Await with promise chains
async function fetchAndProcess() {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    const processed = await processData(data);
    return processed;
}
```

### Sequential vs Parallel Execution

```javascript
// Sequential execution (slower)
async function sequential() {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    
    return { user, posts, comments };
}

// Parallel execution (faster)
async function parallel() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    
    return { user, posts, comments };
}

// Mixed approach
async function mixed() {
    const user = await fetchUser();
    const [posts, comments] = await Promise.all([
        fetchPosts(user.id),
        fetchComments(user.id)
    ]);
    
    return { user, posts, comments };
}
```

## Error Handling with Try-Catch

### Basic Error Handling

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw if you want calling code to handle it
    }
}
```

### Error Handling Patterns

```javascript
// Pattern 1: Handle error locally
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null; // Return fallback value
    }
}

// Pattern 2: Re-throw error for caller to handle
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Let caller handle
    }
}

// Pattern 3: Transform error
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
}
```

### Error Handling in Promise Chains

```javascript
// With async/await
async function processData() {
    try {
        const data = await fetchData();
        const processed = await processData(data);
        const result = await saveData(processed);
        return result;
    } catch (error) {
        console.error('Error in processData:', error);
        throw error;
    }
}

// Equivalent promise chain
function processData() {
    return fetchData()
        .then(data => processData(data))
        .then(processed => saveData(processed))
        .catch(error => {
            console.error('Error in processData:', error);
            throw error;
        });
}
```

## Advanced Error Handling

### Custom Error Classes

```javascript
class NetworkError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'NetworkError';
        this.status = status;
    }
}

class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

async function fetchUser(id) {
    try {
        const response = await fetch(`https://api.example.com/users/${id}`);
        
        if (!response.ok) {
            throw new NetworkError(`Failed to fetch user: ${response.status}`, response.status);
        }
        
        const user = await response.json();
        
        if (!user.id) {
            throw new ValidationError('Invalid user data', 'id');
        }
        
        return user;
    } catch (error) {
        if (error instanceof NetworkError) {
            console.error('Network error:', error.message, error.status);
        } else if (error instanceof ValidationError) {
            console.error('Validation error:', error.message, error.field);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}
```

### Error Recovery Patterns

```javascript
// Retry pattern
async function fetchWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            console.log(`Attempt ${i + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// Fallback pattern
async function fetchWithFallback(primaryUrl, fallbackUrl) {
    try {
        return await fetch(primaryUrl);
    } catch (error) {
        console.warn('Primary request failed, trying fallback:', error);
        try {
            return await fetch(fallbackUrl);
        } catch (fallbackError) {
            throw new Error(`Both requests failed: ${error.message}, ${fallbackError.message}`);
        }
    }
}

// Circuit breaker pattern
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000) {
        this.threshold = threshold;
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
        
        if (this.failureCount >= this.threshold) {
            this.state = 'OPEN';
        }
    }
}
```

## Async Iteration

### Async Generators

```javascript
async function* fetchPages(baseUrl) {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        try {
            const response = await fetch(`${baseUrl}?page=${page}`);
            const data = await response.json();
            
            if (data.items.length === 0) {
                hasMore = false;
            } else {
                yield data.items;
                page++;
            }
        } catch (error) {
            console.error('Error fetching page:', error);
            hasMore = false;
        }
    }
}

// Usage
async function processAllPages() {
    for await (const page of fetchPages('https://api.example.com/items')) {
        console.log('Processing page:', page);
        // Process each page
    }
}
```

### Async Iterators

```javascript
class AsyncDataStream {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.index = 0;
    }
    
    async *[Symbol.asyncIterator]() {
        while (this.index < this.dataSource.length) {
            const item = this.dataSource[this.index];
            this.index++;
            
            // Simulate async processing
            await new Promise(resolve => setTimeout(resolve, 100));
            yield item;
        }
    }
}

// Usage
async function processStream() {
    const stream = new AsyncDataStream([1, 2, 3, 4, 5]);
    
    for await (const item of stream) {
        console.log('Processing item:', item);
    }
}
```

## Common Patterns and Best Practices

### 1. Always Handle Errors

```javascript
// Bad: Unhandled promise rejection
async function badExample() {
    const data = await fetch('https://api.example.com/data');
    return data.json();
}

// Good: Proper error handling
async function goodExample() {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
```

### 2. Use Promise.all() for Parallel Operations

```javascript
// Bad: Sequential execution
async function sequential() {
    const user = await fetchUser();
    const posts = await fetchPosts();
    const comments = await fetchComments();
    return { user, posts, comments };
}

// Good: Parallel execution
async function parallel() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    return { user, posts, comments };
}
```

### 3. Use Promise.allSettled() for Independent Operations

```javascript
async function fetchMultipleData() {
    const results = await Promise.allSettled([
        fetchUser(),
        fetchPosts(),
        fetchComments()
    ]);
    
    const data = {};
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            data[['user', 'posts', 'comments'][index]] = result.value;
        } else {
            console.error(`Failed to fetch ${['user', 'posts', 'comments'][index]}:`, result.reason);
        }
    });
    
    return data;
}
```

### 4. Use Promise.race() for Timeouts

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
    const fetchPromise = fetch(url);
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeout);
    });
    
    return await Promise.race([fetchPromise, timeoutPromise]);
}
```

### 5. Avoid Blocking the Event Loop

```javascript
// Bad: Blocking operation
async function badProcessData(data) {
    for (const item of data) {
        // Heavy computation that blocks the event loop
        const result = heavyComputation(item);
        await saveResult(result);
    }
}

// Good: Non-blocking operation
async function goodProcessData(data) {
    for (const item of data) {
        // Yield control back to the event loop
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const result = heavyComputation(item);
        await saveResult(result);
    }
}
```

## Debugging Async/Await

### 1. Use Console.log for Debugging

```javascript
async function debugExample() {
    console.log('Starting...');
    
    try {
        console.log('Fetching data...');
        const response = await fetch('https://api.example.com/data');
        console.log('Response received:', response.status);
        
        const data = await response.json();
        console.log('Data parsed:', data);
        
        return data;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}
```

### 2. Use Debugger Statements

```javascript
async function debugWithBreakpoints() {
    debugger; // Breakpoint here
    
    const response = await fetch('https://api.example.com/data');
    debugger; // Breakpoint here
    
    const data = await response.json();
    debugger; // Breakpoint here
    
    return data;
}
```

### 3. Use Async Stack Traces

```javascript
// Enable async stack traces in Chrome DevTools
// Settings > Console > "Show timestamps" and "Show async stack traces"

async function example() {
    try {
        await step1();
    } catch (error) {
        console.error('Error with full stack trace:', error);
    }
}

async function step1() {
    await step2();
}

async function step2() {
    throw new Error('Something went wrong');
}
```

## Performance Considerations

### 1. Avoid Unnecessary Await

```javascript
// Bad: Unnecessary await
async function badExample() {
    const data = await fetchData();
    const processed = await processData(data);
    return processed;
}

// Good: Only await when necessary
async function goodExample() {
    const data = await fetchData();
    return processData(data); // processData is synchronous
}
```

### 2. Use Promise.all() for Independent Operations

```javascript
// Bad: Sequential execution
async function sequential() {
    const a = await operationA();
    const b = await operationB();
    const c = await operationC();
    return { a, b, c };
}

// Good: Parallel execution
async function parallel() {
    const [a, b, c] = await Promise.all([
        operationA(),
        operationB(),
        operationC()
    ]);
    return { a, b, c };
}
```

### 3. Consider Memory Usage

```javascript
// Bad: Keeping large objects in memory
async function badExample() {
    const largeData = await fetchLargeData();
    const processed = await processData(largeData);
    // largeData is still in memory
    return processed;
}

// Good: Clean up references
async function goodExample() {
    const largeData = await fetchLargeData();
    const processed = await processData(largeData);
    largeData = null; // Allow garbage collection
    return processed;
}
```

## Conclusion

Async/await provides a clean, readable way to handle asynchronous operations in JavaScript. Combined with proper error handling, it makes asynchronous code more maintainable and easier to debug. Understanding these patterns is essential for modern JavaScript development.

## Key Takeaways

- Async/await is syntactic sugar over promises
- Always handle errors with try-catch blocks
- Use Promise.all() for parallel operations
- Use Promise.allSettled() for independent operations
- Use Promise.race() for timeouts
- Avoid blocking the event loop
- Use proper error handling patterns
- Consider performance implications

## Next Steps

- Learn about the event loop and concurrency model
- Explore Web APIs and the Fetch API
- Practice building complex asynchronous applications
- Study error handling patterns and recovery strategies
- Understand the relationship between async/await and promises



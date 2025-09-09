# Web APIs & Fetch: Modern HTTP Communication

## Introduction

Web APIs provide a standardized way for web applications to communicate with servers and access browser functionality. The Fetch API is the modern replacement for XMLHttpRequest, offering a cleaner, promise-based interface for making HTTP requests. Understanding these APIs is essential for building modern web applications.

## What are Web APIs?

Web APIs are interfaces that allow web applications to interact with browser features and external services. They provide access to:
- HTTP communication (Fetch API)
- DOM manipulation
- File system access
- Geolocation
- Web Storage
- Web Workers
- And many more browser features

## The Fetch API

### Basic Fetch Usage

```javascript
// Basic GET request
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// With async/await
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

### Fetch Options

```javascript
// POST request with options
fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Common HTTP Methods

```javascript
// GET request
async function getData() {
    const response = await fetch('https://api.example.com/data');
    return await response.json();
}

// POST request
async function createData(data) {
    const response = await fetch('https://api.example.com/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// PUT request
async function updateData(id, data) {
    const response = await fetch(`https://api.example.com/data/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// DELETE request
async function deleteData(id) {
    const response = await fetch(`https://api.example.com/data/${id}`, {
        method: 'DELETE'
    });
    return response.ok;
}
```

## Response Handling

### Response Object Properties

```javascript
async function handleResponse() {
    const response = await fetch('https://api.example.com/data');
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('OK:', response.ok);
    console.log('Headers:', response.headers);
    console.log('URL:', response.url);
    console.log('Type:', response.type);
    console.log('Redirected:', response.redirected);
}
```

### Response Methods

```javascript
async function processResponse() {
    const response = await fetch('https://api.example.com/data');
    
    // Check if request was successful
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse response based on content type
    const contentType = response.headers.get('content-type');
    
    if (contentType.includes('application/json')) {
        return await response.json();
    } else if (contentType.includes('text/')) {
        return await response.text();
    } else if (contentType.includes('image/')) {
        return await response.blob();
    } else {
        return await response.arrayBuffer();
    }
}
```

### Error Handling

```javascript
async function fetchWithErrorHandling() {
    try {
        const response = await fetch('https://api.example.com/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error:', error.message);
        } else {
            console.error('HTTP error:', error.message);
        }
        throw error;
    }
}
```

## Advanced Fetch Patterns

### Request Interceptors

```javascript
class FetchInterceptor {
    constructor() {
        this.interceptors = [];
    }
    
    addInterceptor(interceptor) {
        this.interceptors.push(interceptor);
    }
    
    async fetch(url, options = {}) {
        let request = { url, ...options };
        
        // Apply request interceptors
        for (const interceptor of this.interceptors) {
            if (interceptor.request) {
                request = await interceptor.request(request);
            }
        }
        
        const response = await fetch(request.url, request);
        
        // Apply response interceptors
        for (const interceptor of this.interceptors) {
            if (interceptor.response) {
                return await interceptor.response(response);
            }
        }
        
        return response;
    }
}

// Usage
const api = new FetchInterceptor();

// Add authentication interceptor
api.addInterceptor({
    request: async (request) => {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers = {
                ...request.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        return request;
    }
});

// Add error handling interceptor
api.addInterceptor({
    response: async (response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    }
});
```

### Request Timeout

```javascript
function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return fetch(url, {
        ...options,
        signal: controller.signal
    }).finally(() => {
        clearTimeout(timeoutId);
    });
}

// Usage
fetchWithTimeout('https://api.example.com/data', {}, 3000)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.error('Request timed out');
        } else {
            console.error('Request failed:', error);
        }
    });
```

### Request Cancellation

```javascript
class RequestManager {
    constructor() {
        this.controllers = new Map();
    }
    
    async fetch(url, options = {}) {
        const controller = new AbortController();
        this.controllers.set(url, controller);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            this.controllers.delete(url);
            return response;
        } catch (error) {
            this.controllers.delete(url);
            throw error;
        }
    }
    
    cancel(url) {
        const controller = this.controllers.get(url);
        if (controller) {
            controller.abort();
            this.controllers.delete(url);
        }
    }
    
    cancelAll() {
        for (const controller of this.controllers.values()) {
            controller.abort();
        }
        this.controllers.clear();
    }
}

// Usage
const requestManager = new RequestManager();

// Start request
const promise = requestManager.fetch('https://api.example.com/data');

// Cancel request
requestManager.cancel('https://api.example.com/data');
```

## Common Web APIs

### Geolocation API

```javascript
// Get current position
navigator.geolocation.getCurrentPosition(
    (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
    },
    (error) => {
        console.error('Error getting location:', error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
);

// Watch position changes
const watchId = navigator.geolocation.watchPosition(
    (position) => {
        console.log('Position changed:', position.coords);
    },
    (error) => {
        console.error('Error watching position:', error);
    }
);

// Stop watching
navigator.geolocation.clearWatch(watchId);
```

### Web Storage API

```javascript
// Local Storage
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();

// Session Storage
sessionStorage.setItem('key', 'value');
const value = sessionStorage.getItem('key');
sessionStorage.removeItem('key');
sessionStorage.clear();

// Storage events
window.addEventListener('storage', (event) => {
    console.log('Storage changed:', event.key, event.newValue);
});
```

### File API

```javascript
// File input
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    
    if (file) {
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        console.log('File type:', file.type);
        
        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('File content:', e.target.result);
        };
        reader.readAsText(file);
    }
});

// Drag and drop
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    for (const file of files) {
        console.log('Dropped file:', file.name);
    }
});
```

### Web Workers API

```javascript
// Main thread
const worker = new Worker('worker.js');

worker.postMessage({ data: 'Hello from main thread' });

worker.onmessage = (event) => {
    console.log('Message from worker:', event.data);
};

worker.onerror = (error) => {
    console.error('Worker error:', error);
};

// worker.js
self.onmessage = (event) => {
    const { data } = event.data;
    
    // Do some work
    const result = data.toUpperCase();
    
    self.postMessage({ result });
};
```

## API Design Patterns

### RESTful API Client

```javascript
class APIClient {
    constructor(baseURL, options = {}) {
        this.baseURL = baseURL;
        this.defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...this.defaultOptions,
            ...options,
            headers: {
                ...this.defaultOptions.headers,
                ...options.headers
            }
        };
        
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Usage
const api = new APIClient('https://api.example.com');

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
});

// PUT request
const updatedUser = await api.put('/users/1', {
    name: 'Jane Doe',
    email: 'jane@example.com'
});

// DELETE request
await api.delete('/users/1');
```

### GraphQL Client

```javascript
class GraphQLClient {
    constructor(endpoint, options = {}) {
        this.endpoint = endpoint;
        this.defaultOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
    }
    
    async query(query, variables = {}) {
        const response = await fetch(this.endpoint, {
            ...this.defaultOptions,
            body: JSON.stringify({
                query,
                variables
            })
        });
        
        const result = await response.json();
        
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        
        return result.data;
    }
    
    async mutation(mutation, variables = {}) {
        return this.query(mutation, variables);
    }
}

// Usage
const client = new GraphQLClient('https://api.example.com/graphql');

const query = `
    query GetUsers {
        users {
            id
            name
            email
        }
    }
`;

const data = await client.query(query);
console.log(data.users);
```

## Error Handling and Retry Logic

### Retry with Exponential Backoff

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            lastError = error;
            
            if (i === maxRetries - 1) {
                throw lastError;
            }
            
            // Exponential backoff
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Usage
try {
    const response = await fetchWithRetry('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error('All retries failed:', error);
}
```

### Circuit Breaker Pattern

```javascript
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

// Usage
const circuitBreaker = new CircuitBreaker();

async function fetchData() {
    return circuitBreaker.execute(async () => {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    });
}
```

## Performance Optimization

### Request Caching

```javascript
class RequestCache {
    constructor(ttl = 300000) { // 5 minutes default
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    async fetch(url, options = {}) {
        const key = this.getCacheKey(url, options);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.data;
        }
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        
        return data;
    }
    
    getCacheKey(url, options) {
        return `${url}:${JSON.stringify(options)}`;
    }
    
    clear() {
        this.cache.clear();
    }
}

// Usage
const cache = new RequestCache();

const data1 = await cache.fetch('https://api.example.com/data');
const data2 = await cache.fetch('https://api.example.com/data'); // From cache
```

### Request Batching

```javascript
class RequestBatcher {
    constructor(batchSize = 10, delay = 100) {
        this.batchSize = batchSize;
        this.delay = delay;
        this.queue = [];
        this.timeoutId = null;
    }
    
    async add(request) {
        return new Promise((resolve, reject) => {
            this.queue.push({ request, resolve, reject });
            
            if (this.queue.length >= this.batchSize) {
                this.processBatch();
            } else if (!this.timeoutId) {
                this.timeoutId = setTimeout(() => {
                    this.processBatch();
                }, this.delay);
            }
        });
    }
    
    async processBatch() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        if (this.queue.length === 0) {
            return;
        }
        
        const batch = this.queue.splice(0, this.batchSize);
        
        try {
            const results = await Promise.all(
                batch.map(({ request }) => request())
            );
            
            batch.forEach(({ resolve }, index) => {
                resolve(results[index]);
            });
        } catch (error) {
            batch.forEach(({ reject }) => {
                reject(error);
            });
        }
    }
}

// Usage
const batcher = new RequestBatcher();

const promises = [
    batcher.add(() => fetch('https://api.example.com/data1')),
    batcher.add(() => fetch('https://api.example.com/data2')),
    batcher.add(() => fetch('https://api.example.com/data3'))
];

const results = await Promise.all(promises);
```

## Conclusion

Web APIs and the Fetch API provide powerful tools for building modern web applications. Understanding how to use these APIs effectively, handle errors, and optimize performance is essential for creating robust and efficient applications.

## Key Takeaways

- The Fetch API is the modern replacement for XMLHttpRequest
- Always handle errors and check response status
- Use appropriate HTTP methods for different operations
- Implement retry logic and circuit breakers for reliability
- Cache requests to improve performance
- Use request batching for efficiency
- Understand the different Web APIs available in browsers

## Next Steps

- Practice building applications with the Fetch API
- Learn about authentication and security
- Explore advanced patterns like request interceptors
- Study performance optimization techniques
- Understand the relationship between Web APIs and the event loop


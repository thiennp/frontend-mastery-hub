# Async/Await & Error Handling

## Overview

Async/await is a modern JavaScript syntax that makes asynchronous code look and behave more like synchronous code. This article explores async/await patterns, comprehensive error handling strategies, and best practices for writing maintainable asynchronous code.

## Table of Contents

1. [Understanding Async/Await](#understanding-asyncawait)
2. [Async Function Declarations](#async-function-declarations)
3. [Await Operator](#await-operator)
4. [Error Handling with Try/Catch](#error-handling-with-trycatch)
5. [Sequential vs Parallel Execution](#sequential-vs-parallel-execution)
6. [Async Iteration](#async-iteration)
7. [Top-Level Await](#top-level-await)
8. [Advanced Error Handling Patterns](#advanced-error-handling-patterns)
9. [Performance Considerations](#performance-considerations)
10. [Testing Async/Await](#testing-asyncawait)

## Understanding Async/Await

Async/await is syntactic sugar over Promises that makes asynchronous code more readable and easier to reason about.

### Basic Async/Await

```typescript
// Promise-based approach
function fetchUserPromise(id: number): Promise<User> {
    return fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(data => data.user);
}

// Async/await approach
async function fetchUserAsync(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return data.user;
}
```

### Comparison with Promises

```typescript
// Promise chaining
function processDataPromise(data: string): Promise<string> {
    return fetch('/api/process', {
        method: 'POST',
        body: data
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(result => result.processedData)
    .catch(error => {
        console.error('Processing failed:', error);
        throw error;
    });
}

// Async/await equivalent
async function processDataAsync(data: string): Promise<string> {
    try {
        const response = await fetch('/api/process', {
            method: 'POST',
            body: data
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        return result.processedData;
    } catch (error) {
        console.error('Processing failed:', error);
        throw error;
    }
}
```

## Async Function Declarations

### 1. Function Declarations

```typescript
// Async function declaration
async function getUserData(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
}

// Async function with error handling
async function getUserDataSafe(id: number): Promise<User | null> {
    try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}
```

### 2. Arrow Functions

```typescript
// Async arrow function
const fetchUser = async (id: number): Promise<User> => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
};

// Async arrow function with error handling
const fetchUserSafe = async (id: number): Promise<User | null> => {
    try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
};
```

### 3. Class Methods

```typescript
// Async class methods
class UserService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getUser(id: number): Promise<User> {
        const response = await fetch(`${this.baseUrl}/users/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }
        return response.json();
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create user: ${response.status}`);
        }
        
        return response.json();
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        const response = await fetch(`${this.baseUrl}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.status}`);
        }
        
        return response.json();
    }
}

// Usage
const userService = new UserService('/api');
const user = await userService.getUser(1);
```

### 4. Immediately Invoked Async Functions

```typescript
// IIFE (Immediately Invoked Function Expression)
(async () => {
    try {
        const user = await fetchUser(1);
        console.log('User:', user);
    } catch (error) {
        console.error('Error:', error);
    }
})();

// Async IIFE with return value
const result = await (async () => {
    const user = await fetchUser(1);
    const posts = await fetchUserPosts(user.id);
    return { user, posts };
})();
```

## Await Operator

The `await` keyword can only be used inside async functions and pauses execution until the Promise resolves.

### Basic Await Usage

```typescript
// Single await
async function fetchData(): Promise<any> {
    const response = await fetch('/api/data');
    return response.json();
}

// Multiple awaits (sequential)
async function fetchUserData(id: number): Promise<{ user: User, posts: Post[] }> {
    const user = await fetchUser(id);
    const posts = await fetchUserPosts(user.id);
    return { user, posts };
}

// Await with error handling
async function fetchUserDataSafe(id: number): Promise<{ user: User, posts: Post[] } | null> {
    try {
        const user = await fetchUser(id);
        const posts = await fetchUserPosts(user.id);
        return { user, posts };
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
    }
}
```

### Await with Different Promise Types

```typescript
// Await with Promise.resolve()
async function getValue(): Promise<string> {
    const value = await Promise.resolve('Hello');
    return value;
}

// Await with Promise.reject()
async function handleRejection(): Promise<string> {
    try {
        const value = await Promise.reject(new Error('Something went wrong'));
        return value;
    } catch (error) {
        console.error('Caught rejection:', error);
        return 'Fallback value';
    }
}

// Await with custom Promise
async function customPromise(): Promise<number> {
    const result = await new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve(42);
            } else {
                reject(new Error('Random failure'));
            }
        }, 1000);
    });
    
    return result;
}
```

## Error Handling with Try/Catch

### 1. Basic Try/Catch

```typescript
// Basic error handling
async function fetchUserWithErrorHandling(id: number): Promise<User | null> {
    try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}
```

### 2. Specific Error Handling

```typescript
// Specific error handling
async function fetchUserWithSpecificErrors(id: number): Promise<User | null> {
    try {
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            } else if (response.status === 500) {
                throw new Error('Server error');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        
        const user = await response.json();
        return user;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'User not found') {
                console.warn('User not found, returning null');
                return null;
            } else if (error.message === 'Server error') {
                console.error('Server error, please try again later');
                throw error; // Re-throw server errors
            } else {
                console.error('Unexpected error:', error.message);
                throw error;
            }
        }
        throw error;
    }
}
```

### 3. Error Boundaries

```typescript
// Error boundary pattern
class AsyncErrorBoundary {
    static async wrap<T>(
        fn: () => Promise<T>,
        fallback: T,
        errorHandler?: (error: Error) => void
    ): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (errorHandler) {
                errorHandler(error as Error);
            }
            return fallback;
        }
    }
    
    static async safe<T>(
        fn: () => Promise<T>,
        errorHandler?: (error: Error) => void
    ): Promise<T | null> {
        try {
            return await fn();
        } catch (error) {
            if (errorHandler) {
                errorHandler(error as Error);
            }
            return null;
        }
    }
}

// Usage
const user = await AsyncErrorBoundary.wrap(
    () => fetchUser(1),
    { id: 0, name: 'Unknown', email: 'unknown@example.com' },
    (error) => console.error('User fetch failed:', error)
);

const posts = await AsyncErrorBoundary.safe(
    () => fetchUserPosts(1),
    (error) => console.error('Posts fetch failed:', error)
);
```

## Sequential vs Parallel Execution

### 1. Sequential Execution

```typescript
// Sequential execution (slower)
async function fetchUserDataSequential(id: number): Promise<{ user: User, posts: Post[], comments: Comment[] }> {
    const user = await fetchUser(id);
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    
    return { user, posts, comments };
}
```

### 2. Parallel Execution

```typescript
// Parallel execution (faster)
async function fetchUserDataParallel(id: number): Promise<{ user: User, posts: Post[], comments: Comment[] }> {
    const [user, posts, comments] = await Promise.all([
        fetchUser(id),
        fetchUserPosts(id),
        fetchPostComments(1) // Assuming we know the post ID
    ]);
    
    return { user, posts, comments };
}
```

### 3. Mixed Sequential and Parallel

```typescript
// Mixed approach
async function fetchUserDataMixed(id: number): Promise<{ user: User, posts: Post[], comments: Comment[] }> {
    // First, fetch user and posts in parallel
    const [user, posts] = await Promise.all([
        fetchUser(id),
        fetchUserPosts(id)
    ]);
    
    // Then fetch comments for the first post
    const comments = await fetchPostComments(posts[0].id);
    
    return { user, posts, comments };
}
```

### 4. Conditional Parallel Execution

```typescript
// Conditional parallel execution
async function fetchUserDataConditional(id: number, includePosts: boolean = true): Promise<{ user: User, posts?: Post[] }> {
    const user = await fetchUser(id);
    
    if (includePosts) {
        const posts = await fetchUserPosts(user.id);
        return { user, posts };
    }
    
    return { user };
}

// Usage
const userData = await fetchUserDataConditional(1, true);
const userOnly = await fetchUserDataConditional(1, false);
```

## Async Iteration

### 1. For...of with Async

```typescript
// Sequential processing of async operations
async function processUsersSequential(userIds: number[]): Promise<User[]> {
    const users: User[] = [];
    
    for (const id of userIds) {
        try {
            const user = await fetchUser(id);
            users.push(user);
        } catch (error) {
            console.error(`Failed to fetch user ${id}:`, error);
        }
    }
    
    return users;
}
```

### 2. Parallel Processing with Map

```typescript
// Parallel processing
async function processUsersParallel(userIds: number[]): Promise<User[]> {
    const promises = userIds.map(id => fetchUser(id));
    const results = await Promise.allSettled(promises);
    
    return results
        .filter((result): result is PromiseFulfilledResult<User> => result.status === 'fulfilled')
        .map(result => result.value);
}
```

### 3. Async Generators

```typescript
// Async generator
async function* fetchUsersGenerator(userIds: number[]): AsyncGenerator<User, void, unknown> {
    for (const id of userIds) {
        try {
            const user = await fetchUser(id);
            yield user;
        } catch (error) {
            console.error(`Failed to fetch user ${id}:`, error);
        }
    }
}

// Usage
async function processUsersWithGenerator(userIds: number[]): Promise<User[]> {
    const users: User[] = [];
    
    for await (const user of fetchUsersGenerator(userIds)) {
        users.push(user);
    }
    
    return users;
}
```

## Top-Level Await

Top-level await allows you to use await at the module level without wrapping it in an async function.

### 1. Basic Top-Level Await

```typescript
// Top-level await (ES2022)
const user = await fetchUser(1);
console.log('User:', user);

// This works in modules
export const userData = await fetchUser(1);
```

### 2. Top-Level Await with Error Handling

```typescript
// Top-level await with error handling
let user: User | null = null;

try {
    user = await fetchUser(1);
} catch (error) {
    console.error('Failed to fetch user:', error);
    user = { id: 0, name: 'Unknown', email: 'unknown@example.com' };
}

export { user };
```

### 3. Conditional Top-Level Await

```typescript
// Conditional top-level await
const shouldFetchUser = process.env.NODE_ENV === 'development';

const user = shouldFetchUser ? await fetchUser(1) : null;

export { user };
```

## Advanced Error Handling Patterns

### 1. Retry Pattern

```typescript
// Retry pattern with exponential backoff
async function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
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
            
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError!;
}

// Usage
const user = await retry(() => fetchUser(1), 3, 1000);
```

### 2. Circuit Breaker Pattern

```typescript
// Circuit breaker pattern
class CircuitBreaker {
    private failureCount = 0;
    private lastFailureTime = 0;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    
    constructor(
        private threshold: number = 5,
        private timeout: number = 60000
    ) {}
    
    async execute<T>(fn: () => Promise<T>): Promise<T> {
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
}

// Usage
const circuitBreaker = new CircuitBreaker();
const user = await circuitBreaker.execute(() => fetchUser(1));
```

### 3. Timeout Pattern

```typescript
// Timeout pattern
async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timeout')), timeoutMs);
    });
    
    return Promise.race([promise, timeoutPromise]);
}

// Usage
const user = await withTimeout(fetchUser(1), 5000);
```

### 4. Fallback Pattern

```typescript
// Fallback pattern
async function fetchUserWithFallback(id: number): Promise<User> {
    try {
        return await fetchUser(id);
    } catch (error) {
        console.warn('Primary fetch failed, trying fallback:', error);
        
        try {
            return await fetchUserFromCache(id);
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            return { id, name: 'Unknown User', email: 'unknown@example.com' };
        }
    }
}

async function fetchUserFromCache(id: number): Promise<User> {
    // Mock cache implementation
    const cached = localStorage.getItem(`user_${id}`);
    if (cached) {
        return JSON.parse(cached);
    }
    throw new Error('User not in cache');
}
```

## Performance Considerations

### 1. Avoid Unnecessary Await

```typescript
// Bad: Unnecessary await
async function badExample(): Promise<void> {
    const user = await fetchUser(1);
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    
    // These could be done in parallel
    const user2 = await fetchUser(2);
    const user3 = await fetchUser(3);
}

// Good: Parallel execution
async function goodExample(): Promise<void> {
    const user = await fetchUser(1);
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    
    // These are done in parallel
    const [user2, user3] = await Promise.all([
        fetchUser(2),
        fetchUser(3)
    ]);
}
```

### 2. Use Promise.all() for Independent Operations

```typescript
// Bad: Sequential independent operations
async function badSequential(): Promise<{ users: User[], posts: Post[] }> {
    const users = await fetchUsers();
    const posts = await fetchPosts();
    return { users, posts };
}

// Good: Parallel independent operations
async function goodParallel(): Promise<{ users: User[], posts: Post[] }> {
    const [users, posts] = await Promise.all([
        fetchUsers(),
        fetchPosts()
    ]);
    return { users, posts };
}
```

### 3. Batch Operations

```typescript
// Batch operations for better performance
async function batchFetchUsers(userIds: number[]): Promise<User[]> {
    const batchSize = 10;
    const results: User[] = [];
    
    for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const batchPromises = batch.map(id => fetchUser(id));
        const batchResults = await Promise.allSettled(batchPromises);
        
        const successfulUsers = batchResults
            .filter((result): result is PromiseFulfilledResult<User> => result.status === 'fulfilled')
            .map(result => result.value);
        
        results.push(...successfulUsers);
    }
    
    return results;
}
```

## Testing Async/Await

### 1. Unit Testing Async Functions

```typescript
// Testing async functions
describe('Async Functions', () => {
    test('should fetch user successfully', async () => {
        const user = await fetchUser(1);
        expect(user).toEqual({ id: 1, name: 'User 1', email: 'user1@example.com' });
    });

    test('should handle fetch errors', async () => {
        await expect(fetchUser(999)).rejects.toThrow('User not found');
    });

    test('should handle network errors', async () => {
        // Mock fetch to throw error
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
        
        await expect(fetchUser(1)).rejects.toThrow('Network error');
    });
});
```

### 2. Testing Async Error Handling

```typescript
// Testing error handling
describe('Error Handling', () => {
    test('should return null on error', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
        
        const result = await fetchUserSafe(1);
        expect(result).toBeNull();
    });

    test('should retry on failure', async () => {
        let callCount = 0;
        global.fetch = jest.fn().mockImplementation(() => {
            callCount++;
            if (callCount < 3) {
                return Promise.reject(new Error('Network error'));
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1, name: 'User 1' })
            });
        });
        
        const user = await retry(() => fetchUser(1), 3, 100);
        expect(user).toEqual({ id: 1, name: 'User 1' });
        expect(callCount).toBe(3);
    });
});
```

### 3. Mocking Async Functions

```typescript
// Mocking async functions
jest.mock('./api', () => ({
    fetchUser: jest.fn(),
    fetchUserPosts: jest.fn()
}));

describe('Async Function Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch user data with posts', async () => {
        const mockFetchUser = require('./api').fetchUser as jest.MockedFunction<typeof fetchUser>;
        const mockFetchUserPosts = require('./api').fetchUserPosts as jest.MockedFunction<typeof fetchUserPosts>;

        mockFetchUser.mockResolvedValue({ id: 1, name: 'User 1', email: 'user1@example.com' });
        mockFetchUserPosts.mockResolvedValue([{ id: 1, title: 'Post 1', userId: 1 }]);

        const result = await fetchUserData(1);

        expect(mockFetchUser).toHaveBeenCalledWith(1);
        expect(mockFetchUserPosts).toHaveBeenCalledWith(1);
        expect(result).toEqual({
            user: { id: 1, name: 'User 1', email: 'user1@example.com' },
            posts: [{ id: 1, title: 'Post 1', userId: 1 }]
        });
    });
});
```

## Conclusion

Async/await provides a powerful and readable way to handle asynchronous operations in JavaScript. Key takeaways:

1. **Async/await** makes asynchronous code look and behave like synchronous code
2. **Error handling** is improved with try/catch blocks
3. **Sequential vs parallel** execution can be controlled based on requirements
4. **Advanced patterns** like retry, circuit breaker, and timeout provide robust error handling
5. **Performance** can be optimized by understanding when to use parallel execution
6. **Testing** async functions requires special consideration for asynchronous behavior

Async/await is the modern standard for handling asynchronous operations in JavaScript and provides a much cleaner alternative to callbacks and promise chaining.

## Next Steps

In the next article, we'll explore Advanced Async Patterns, building upon the async/await knowledge to implement sophisticated asynchronous programming patterns and solve complex real-world problems.


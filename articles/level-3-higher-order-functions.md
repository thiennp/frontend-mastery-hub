# Higher-Order Functions: Functions as First-Class Citizens

## Introduction

Higher-order functions are functions that either take other functions as arguments, return functions as their result, or both. They are a fundamental concept in functional programming and enable powerful patterns like composition, currying, and abstraction. Understanding higher-order functions is essential for writing clean, reusable, and expressive JavaScript code.

## What are Higher-Order Functions?

A higher-order function is a function that:
- **Takes one or more functions as arguments**, or
- **Returns a function as its result**, or
- **Both**

Functions that operate on other functions are called higher-order functions because they operate at a higher level of abstraction.

### Basic Examples

```javascript
// Function that takes another function as argument
function higherOrderFunction(fn) {
    return fn();
}

// Function that returns another function
function createFunction() {
    return function() {
        return "Hello from returned function!";
    };
}

// Function that both takes and returns functions
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}
```

## Functions as Arguments

### Callback Functions

```javascript
// Basic callback example
function processArray(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i], i, arr));
    }
    return result;
}

const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = processArray(numbers, x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Square each number
const squared = processArray(numbers, x => x * x);
console.log(squared); // [1, 4, 9, 16, 25]

// Convert to string
const strings = processArray(numbers, x => `Number: ${x}`);
console.log(strings); // ["Number: 1", "Number: 2", ...]
```

### Built-in Higher-Order Functions

```javascript
const numbers = [1, 2, 3, 4, 5];

// map() - transforms each element
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter() - selects elements that meet a condition
const evens = numbers.filter(x => x % 2 === 0);
console.log(evens); // [2, 4]

// reduce() - reduces array to single value
const sum = numbers.reduce((acc, x) => acc + x, 0);
console.log(sum); // 15

// forEach() - executes function for each element
numbers.forEach(x => console.log(x)); // 1, 2, 3, 4, 5

// find() - finds first element that meets condition
const found = numbers.find(x => x > 3);
console.log(found); // 4

// some() - checks if any element meets condition
const hasEven = numbers.some(x => x % 2 === 0);
console.log(hasEven); // true

// every() - checks if all elements meet condition
const allPositive = numbers.every(x => x > 0);
console.log(allPositive); // true
```

### Custom Higher-Order Functions

```javascript
// Function that applies a transformation
function transform(data, transformer) {
    if (Array.isArray(data)) {
        return data.map(transformer);
    }
    return transformer(data);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = transform(numbers, x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Function that filters based on a predicate
function filterBy(data, predicate) {
    if (Array.isArray(data)) {
        return data.filter(predicate);
    }
    return predicate(data) ? data : null;
}

const users = [
    { name: "John", age: 30, active: true },
    { name: "Jane", age: 25, active: false },
    { name: "Bob", age: 35, active: true }
];

const activeUsers = filterBy(users, user => user.active);
console.log(activeUsers); // [{ name: "John", age: 30, active: true }, { name: "Bob", age: 35, active: true }]

// Function that sorts based on a key function
function sortBy(data, keyFn) {
    return [...data].sort((a, b) => {
        const keyA = keyFn(a);
        const keyB = keyFn(b);
        return keyA > keyB ? 1 : keyA < keyB ? -1 : 0;
    });
}

const sortedUsers = sortBy(users, user => user.age);
console.log(sortedUsers); // Sorted by age
```

## Functions as Return Values

### Function Factories

```javascript
// Function that creates other functions
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function that creates validators
function createValidator(rules) {
    return function(data) {
        return rules.every(rule => rule(data));
    };
}

const isEmail = (data) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
const isRequired = (data) => data.name && data.email;
const isAdult = (data) => data.age >= 18;

const validateUser = createValidator([isEmail, isRequired, isAdult]);

const user = { name: "John", email: "john@example.com", age: 30 };
console.log(validateUser(user)); // true
```

### Partial Application

```javascript
// Function that partially applies arguments
function partial(fn, ...args) {
    return function(...remainingArgs) {
        return fn(...args, ...remainingArgs);
    };
}

function add(a, b, c) {
    return a + b + c;
}

const add5 = partial(add, 5);
const add5And10 = partial(add, 5, 10);

console.log(add5(3, 2)); // 10
console.log(add5And10(1)); // 16

// Partial application with different argument positions
function partialRight(fn, ...args) {
    return function(...remainingArgs) {
        return fn(...remainingArgs, ...args);
    };
}

const addToEnd = partialRight(add, 5);
console.log(addToEnd(1, 2)); // 8
```

### Function Decorators

```javascript
// Function that wraps other functions
function withLogging(fn) {
    return function(...args) {
        console.log(`Calling ${fn.name} with arguments:`, args);
        const result = fn(...args);
        console.log(`Result:`, result);
        return result;
    };
}

function add(a, b) {
    return a + b;
}

const loggedAdd = withLogging(add);
console.log(loggedAdd(2, 3)); // Logs the call and result

// Function that adds timing
function withTiming(fn) {
    return function(...args) {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        console.log(`${fn.name} took ${end - start} milliseconds`);
        return result;
    };
}

const timedAdd = withTiming(add);
console.log(timedAdd(2, 3)); // Logs timing information
```

## Advanced Higher-Order Functions

### Function Composition

```javascript
// Function that composes other functions
function compose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => fn(acc), value);
    };
}

function addOne(x) {
    return x + 1;
}

function multiplyByTwo(x) {
    return x * 2;
}

function square(x) {
    return x * x;
}

const composed = compose(square, multiplyByTwo, addOne);
console.log(composed(3)); // ((3 + 1) * 2)² = 64

// Pipe function (left to right composition)
function pipe(...functions) {
    return function(value) {
        return functions.reduce((acc, fn) => fn(acc), value);
    };
}

const piped = pipe(addOne, multiplyByTwo, square);
console.log(piped(3)); // ((3 + 1) * 2)² = 64
```

### Currying

```javascript
// Function that curries other functions
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        
        return function(...nextArgs) {
            return curried(...args, ...nextArgs);
        };
    };
}

function multiply(a, b, c) {
    return a * b * c;
}

const curriedMultiply = curry(multiply);
const multiplyBy2 = curriedMultiply(2);
const multiplyBy2And3 = multiplyBy2(3);

console.log(multiplyBy2And3(4)); // 24
console.log(curriedMultiply(2)(3)(4)); // 24

// Auto-currying with placeholder support
function curryWithPlaceholder(fn) {
    return function curried(...args) {
        const hasPlaceholder = args.some(arg => arg === curryWithPlaceholder.placeholder);
        
        if (args.length >= fn.length && !hasPlaceholder) {
            return fn(...args);
        }
        
        return function(...nextArgs) {
            const newArgs = args.map(arg => 
                arg === curryWithPlaceholder.placeholder ? nextArgs.shift() : arg
            );
            return curried(...newArgs, ...nextArgs);
        };
    };
}

curryWithPlaceholder.placeholder = Symbol('placeholder');
const _ = curryWithPlaceholder.placeholder;

const curriedWithPlaceholder = curryWithPlaceholder(multiply);
const multiplyBy2Placeholder = curriedWithPlaceholder(_, 2, _);
console.log(multiplyBy2Placeholder(3, 4)); // 24
```

### Memoization

```javascript
// Function that memoizes other functions
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log('Cache hit');
            return cache.get(key);
        }
        
        console.log('Cache miss');
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

function expensiveCalculation(n) {
    console.log(`Calculating for ${n}`);
    return n * n * n;
}

const memoizedCalculation = memoize(expensiveCalculation);
console.log(memoizedCalculation(5)); // Cache miss, 125
console.log(memoizedCalculation(5)); // Cache hit, 125
```

### Throttling and Debouncing

```javascript
// Function that throttles other functions
function throttle(fn, delay) {
    let lastCall = 0;
    
    return function(...args) {
        const now = Date.now();
        
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn(...args);
        }
    };
}

// Function that debounces other functions
function debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// Usage
const throttledFunction = throttle(() => console.log('Throttled'), 1000);
const debouncedFunction = debounce(() => console.log('Debounced'), 1000);
```

## Practical Applications

### Event Handling

```javascript
// Higher-order function for event handling
function createEventHandler(handler) {
    return function(event) {
        event.preventDefault();
        handler(event);
    };
}

function handleClick(event) {
    console.log('Button clicked!');
}

const clickHandler = createEventHandler(handleClick);
// document.getElementById('button').addEventListener('click', clickHandler);

// Event handler with data
function createDataHandler(data) {
    return function(event) {
        console.log('Event with data:', data);
    };
}

const dataHandler = createDataHandler({ id: 123, name: 'John' });
```

### API Wrapper

```javascript
// Higher-order function for API calls
function createApiWrapper(baseURL) {
    return function(endpoint, options = {}) {
        const url = `${baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        return fetch(url, config)
            .then(response => response.json())
            .catch(error => {
                console.error('API Error:', error);
                throw error;
            });
    };
}

const api = createApiWrapper('https://api.example.com');
const getUsers = () => api('/users');
const createUser = (userData) => api('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
});
```

### Middleware Pattern

```javascript
// Higher-order function for middleware
function createMiddleware(middlewares) {
    return function(handler) {
        return function(...args) {
            let index = 0;
            
            function next() {
                if (index < middlewares.length) {
                    const middleware = middlewares[index++];
                    return middleware(...args, next);
                }
                return handler(...args);
            }
            
            return next();
        };
    };
}

// Middleware functions
function loggingMiddleware(req, res, next) {
    console.log(`Request: ${req.method} ${req.url}`);
    return next();
}

function authMiddleware(req, res, next) {
    if (req.headers.authorization) {
        return next();
    }
    throw new Error('Unauthorized');
}

function handler(req, res) {
    return { message: 'Success' };
}

const middleware = createMiddleware([loggingMiddleware, authMiddleware]);
const wrappedHandler = middleware(handler);
```

## Functional Programming Patterns

### Map, Filter, Reduce

```javascript
// Custom implementations of map, filter, reduce
function map(array, fn) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(fn(array[i], i, array));
    }
    return result;
}

function filter(array, predicate) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

function reduce(array, fn, initialValue) {
    let accumulator = initialValue;
    let startIndex = 0;
    
    if (initialValue === undefined) {
        accumulator = array[0];
        startIndex = 1;
    }
    
    for (let i = startIndex; i < array.length; i++) {
        accumulator = fn(accumulator, array[i], i, array);
    }
    
    return accumulator;
}

// Usage
const numbers = [1, 2, 3, 4, 5];
const doubled = map(numbers, x => x * 2);
const evens = filter(numbers, x => x % 2 === 0);
const sum = reduce(numbers, (acc, x) => acc + x, 0);
```

### Function Utilities

```javascript
// Utility functions for working with functions
function once(fn) {
    let called = false;
    let result;
    
    return function(...args) {
        if (!called) {
            called = true;
            result = fn(...args);
        }
        return result;
    };
}

function retry(fn, maxAttempts = 3, delay = 1000) {
    return function(...args) {
        let attempts = 0;
        
        function attempt() {
            attempts++;
            try {
                return fn(...args);
            } catch (error) {
                if (attempts < maxAttempts) {
                    console.log(`Attempt ${attempts} failed, retrying...`);
                    setTimeout(attempt, delay);
                } else {
                    throw error;
                }
            }
        }
        
        return attempt();
    };
}

function timeout(fn, ms) {
    return function(...args) {
        return Promise.race([
            Promise.resolve(fn(...args)),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), ms)
            )
        ]);
    };
}
```

## Best Practices

### Naming Conventions

```javascript
// Good: Descriptive names for higher-order functions
function createValidator(rules) { /* ... */ }
function withLogging(fn) { /* ... */ }
function retryOnFailure(fn, maxAttempts) { /* ... */ }

// Good: Clear parameter names
function map(array, transformer) { /* ... */ }
function filter(array, predicate) { /* ... */ }
function reduce(array, reducer, initialValue) { /* ... */ }
```

### Error Handling

```javascript
// Higher-order function with error handling
function withErrorHandling(fn, errorHandler) {
    return function(...args) {
        try {
            return fn(...args);
        } catch (error) {
            return errorHandler(error, ...args);
        }
    };
}

function safeDivide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

const safeDivideWithErrorHandling = withErrorHandling(
    safeDivide,
    (error, a, b) => {
        console.error(`Error dividing ${a} by ${b}:`, error.message);
        return 0;
    }
);

console.log(safeDivideWithErrorHandling(10, 2)); // 5
console.log(safeDivideWithErrorHandling(10, 0)); // 0 (with error logged)
```

### Performance Considerations

```javascript
// Higher-order function with performance monitoring
function withPerformanceMonitoring(fn) {
    return function(...args) {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        
        console.log(`${fn.name} took ${end - start} milliseconds`);
        return result;
    };
}

// Higher-order function with caching
function withCaching(fn, cacheSize = 100) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn(...args);
        
        if (cache.size >= cacheSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}
```

## Conclusion

Higher-order functions are a powerful tool that enables functional programming patterns, code reuse, and abstraction. They allow you to write more expressive, maintainable, and flexible code by treating functions as first-class citizens.

## Key Takeaways

- Higher-order functions take functions as arguments or return functions
- They enable powerful patterns like composition, currying, and decorators
- Built-in methods like map, filter, and reduce are higher-order functions
- They promote code reuse and abstraction
- They are essential for functional programming
- Proper error handling and performance considerations are important
- They enable sophisticated patterns like middleware and event handling

## Next Steps

- Learn about function composition and currying in detail
- Explore advanced functional programming patterns
- Study monads and functors
- Practice building applications with higher-order functions
- Understand the relationship between higher-order functions and closures


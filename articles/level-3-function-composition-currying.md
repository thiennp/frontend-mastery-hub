# Function Composition & Currying: Building Complex Logic from Simple Functions

## Introduction

Function composition and currying are powerful techniques in functional programming that allow you to build complex logic by combining simple, reusable functions. These patterns promote code reusability, readability, and maintainability by breaking down complex operations into smaller, composable pieces.

## Function Composition

Function composition is the process of combining two or more functions to create a new function. The output of one function becomes the input of the next function.

### Basic Composition

```javascript
// Simple composition
function addOne(x) {
    return x + 1;
}

function multiplyByTwo(x) {
    return x * 2;
}

function square(x) {
    return x * x;
}

// Manual composition
function composed(x) {
    return square(multiplyByTwo(addOne(x)));
}

console.log(composed(3)); // ((3 + 1) * 2)² = 64

// Using arrow functions
const composed = x => square(multiplyByTwo(addOne(x)));
console.log(composed(3)); // 64
```

### Composition Utilities

```javascript
// Compose function (right to left)
function compose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => fn(acc), value);
    };
}

// Pipe function (left to right)
function pipe(...functions) {
    return function(value) {
        return functions.reduce((acc, fn) => fn(acc), value);
    };
}

// Using compose
const composed = compose(square, multiplyByTwo, addOne);
console.log(composed(3)); // ((3 + 1) * 2)² = 64

// Using pipe
const piped = pipe(addOne, multiplyByTwo, square);
console.log(piped(3)); // ((3 + 1) * 2)² = 64
```

### Advanced Composition

```javascript
// Composition with error handling
function composeWithErrorHandling(...functions) {
    return function(value) {
        try {
            return functions.reduceRight((acc, fn) => fn(acc), value);
        } catch (error) {
            console.error('Composition error:', error);
            return null;
        }
    };
}

// Composition with logging
function composeWithLogging(...functions) {
    return function(value) {
        console.log('Initial value:', value);
        
        return functions.reduceRight((acc, fn) => {
            const result = fn(acc);
            console.log(`${fn.name}(${acc}) = ${result}`);
            return result;
        }, value);
    };
}

// Composition with validation
function composeWithValidation(...functions) {
    return function(value) {
        if (value === null || value === undefined) {
            throw new Error('Invalid input value');
        }
        
        return functions.reduceRight((acc, fn) => {
            const result = fn(acc);
            if (result === null || result === undefined) {
                throw new Error(`Function ${fn.name} returned invalid value`);
            }
            return result;
        }, value);
    };
}
```

### Composition with Arrays

```javascript
// Composition for array operations
function map(fn) {
    return function(array) {
        return array.map(fn);
    };
}

function filter(predicate) {
    return function(array) {
        return array.filter(predicate);
    };
}

function reduce(reducer, initialValue) {
    return function(array) {
        return array.reduce(reducer, initialValue);
    };
}

// Composing array operations
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const processNumbers = pipe(
    filter(x => x % 2 === 0),    // [2, 4, 6, 8, 10]
    map(x => x * x),              // [4, 16, 36, 64, 100]
    reduce((acc, x) => acc + x, 0) // 220
);

console.log(processNumbers(numbers)); // 220
```

## Currying

Currying is the process of transforming a function that takes multiple arguments into a sequence of functions that each take a single argument.

### Basic Currying

```javascript
// Non-curried function
function add(a, b, c) {
    return a + b + c;
}

// Curried version
function curriedAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

// Using curried function
const result = curriedAdd(1)(2)(3);
console.log(result); // 6

// Partial application
const addOne = curriedAdd(1);
const addOneAndTwo = addOne(2);
const finalResult = addOneAndTwo(3);
console.log(finalResult); // 6
```

### Auto-Currying

```javascript
// Auto-currying function
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

// Using auto-currying
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6
```

### Currying with Placeholders

```javascript
// Currying with placeholder support
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

// Using placeholder currying
const curriedWithPlaceholder = curryWithPlaceholder(add);
const addToMiddle = curriedWithPlaceholder(_, 2, _);
console.log(addToMiddle(1, 3)); // 6
```

### Currying with Default Values

```javascript
// Currying with default values
function curryWithDefaults(fn, defaults = {}) {
    return function curried(...args) {
        const mergedArgs = { ...defaults, ...args };
        
        if (Object.keys(mergedArgs).length >= fn.length) {
            return fn(...Object.values(mergedArgs));
        }
        
        return function(...nextArgs) {
            return curried(...nextArgs);
        };
    };
}

function createUser(name, age, email, isActive = true) {
    return { name, age, email, isActive };
}

const curriedCreateUser = curryWithDefaults(createUser, { isActive: true });
const createActiveUser = curriedCreateUser(_, _, _);
const user = createActiveUser("John", 30, "john@example.com");
console.log(user); // { name: "John", age: 30, email: "john@example.com", isActive: true }
```

## Advanced Composition Patterns

### Monadic Composition

```javascript
// Maybe monad for safe composition
class Maybe {
    constructor(value) {
        this.value = value;
    }
    
    static of(value) {
        return new Maybe(value);
    }
    
    map(fn) {
        return this.value === null || this.value === undefined 
            ? Maybe.of(null)
            : Maybe.of(fn(this.value));
    }
    
    flatMap(fn) {
        return this.value === null || this.value === undefined
            ? Maybe.of(null)
            : fn(this.value);
    }
    
    getOrElse(defaultValue) {
        return this.value === null || this.value === undefined ? defaultValue : this.value;
    }
}

// Safe composition with Maybe
function safeDivide(a, b) {
    return b === 0 ? Maybe.of(null) : Maybe.of(a / b);
}

function safeSquare(x) {
    return x === null ? Maybe.of(null) : Maybe.of(x * x);
}

const result = Maybe.of(10)
    .flatMap(x => safeDivide(x, 2))
    .flatMap(safeSquare)
    .getOrElse(0);

console.log(result); // 25
```

### Pipeline Composition

```javascript
// Pipeline operator (proposed feature)
function pipeline(value, ...functions) {
    return functions.reduce((acc, fn) => fn(acc), value);
}

// Using pipeline
const result = pipeline(
    10,
    x => x * 2,
    x => x + 5,
    x => x * x
);

console.log(result); // 625

// Pipeline with error handling
function safePipeline(value, ...functions) {
    try {
        return functions.reduce((acc, fn) => {
            if (acc === null || acc === undefined) {
                return null;
            }
            return fn(acc);
        }, value);
    } catch (error) {
        console.error('Pipeline error:', error);
        return null;
    }
}
```

### Composition with Promises

```javascript
// Composition with async functions
function composeAsync(...functions) {
    return function(value) {
        return functions.reduceRight(
            (promise, fn) => promise.then(fn),
            Promise.resolve(value)
        );
    };
}

// Async functions
async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
}

async function validateUser(user) {
    if (!user.name || !user.email) {
        throw new Error('Invalid user data');
    }
    return user;
}

async function processUser(user) {
    user.processedAt = new Date();
    return user;
}

// Composing async functions
const processUserAsync = composeAsync(processUser, validateUser, fetchUser);

processUserAsync(123)
    .then(user => console.log(user))
    .catch(error => console.error(error));
```

## Practical Applications

### Data Processing Pipeline

```javascript
// Data processing with composition
function createDataProcessor() {
    const steps = [];
    
    return {
        addStep: function(step) {
            steps.push(step);
            return this;
        },
        
        process: function(data) {
            return steps.reduce((acc, step) => step(acc), data);
        }
    };
}

// Data processing steps
function filterValid(data) {
    return data.filter(item => item && item.id);
}

function addTimestamp(data) {
    return data.map(item => ({ ...item, timestamp: new Date() }));
}

function sortById(data) {
    return data.sort((a, b) => a.id - b.id);
}

function limitResults(limit) {
    return function(data) {
        return data.slice(0, limit);
    };
}

// Using the data processor
const processor = createDataProcessor()
    .addStep(filterValid)
    .addStep(addTimestamp)
    .addStep(sortById)
    .addStep(limitResults(5));

const rawData = [
    { id: 3, name: "John" },
    { id: 1, name: "Jane" },
    { id: 2, name: "Bob" },
    null,
    { id: 4, name: "Alice" }
];

const processedData = processor.process(rawData);
console.log(processedData);
```

### API Request Builder

```javascript
// API request builder with composition
function createApiBuilder() {
    let config = {
        baseURL: '',
        headers: {},
        timeout: 5000
    };
    
    return {
        baseURL: function(url) {
            config.baseURL = url;
            return this;
        },
        
        header: function(key, value) {
            config.headers[key] = value;
            return this;
        },
        
        timeout: function(ms) {
            config.timeout = ms;
            return this;
        },
        
        build: function() {
            return function(endpoint, options = {}) {
                const url = `${config.baseURL}${endpoint}`;
                const requestConfig = {
                    ...config,
                    ...options,
                    headers: { ...config.headers, ...options.headers }
                };
                
                return fetch(url, requestConfig);
            };
        }
    };
}

// Using the API builder
const api = createApiBuilder()
    .baseURL('https://api.example.com')
    .header('Content-Type', 'application/json')
    .header('Authorization', 'Bearer token')
    .timeout(10000)
    .build();

const getUsers = () => api('/users');
const createUser = (userData) => api('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
});
```

### Validation Pipeline

```javascript
// Validation pipeline with composition
function createValidator() {
    const rules = [];
    
    return {
        addRule: function(rule) {
            rules.push(rule);
            return this;
        },
        
        validate: function(data) {
            const errors = [];
            
            for (const rule of rules) {
                try {
                    rule(data);
                } catch (error) {
                    errors.push(error.message);
                }
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        }
    };
}

// Validation rules
function required(field) {
    return function(data) {
        if (!data[field]) {
            throw new Error(`${field} is required`);
        }
    };
}

function minLength(field, min) {
    return function(data) {
        if (data[field] && data[field].length < min) {
            throw new Error(`${field} must be at least ${min} characters`);
        }
    };
}

function email(field) {
    return function(data) {
        if (data[field] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field])) {
            throw new Error(`${field} must be a valid email`);
        }
    };
}

// Using the validator
const userValidator = createValidator()
    .addRule(required('name'))
    .addRule(required('email'))
    .addRule(minLength('name', 2))
    .addRule(email('email'));

const user = { name: "John", email: "john@example.com" };
const validation = userValidator.validate(user);
console.log(validation); // { isValid: true, errors: [] }
```

## Best Practices

### Function Design

```javascript
// Good: Pure functions for composition
function add(x, y) {
    return x + y;
}

function multiply(x, y) {
    return x * y;
}

// Good: Single responsibility
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatEmail(email) {
    return email.toLowerCase().trim();
}

// Good: Composable functions
const processEmail = pipe(formatEmail, validateEmail);
```

### Error Handling

```javascript
// Composition with error handling
function composeWithErrorHandling(...functions) {
    return function(value) {
        try {
            return functions.reduceRight((acc, fn) => fn(acc), value);
        } catch (error) {
            console.error('Composition error:', error);
            return null;
        }
    };
}

// Safe composition with Maybe
function safeCompose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => {
            if (acc === null || acc === undefined) {
                return null;
            }
            return fn(acc);
        }, value);
    };
}
```

### Performance Considerations

```javascript
// Memoized composition
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

// Composed function with memoization
const memoizedComposition = memoize(compose(square, multiplyByTwo, addOne));
```

## Conclusion

Function composition and currying are powerful techniques that enable you to build complex logic from simple, reusable functions. They promote code reusability, readability, and maintainability while enabling sophisticated patterns like pipelines, validation, and data processing.

## Key Takeaways

- Function composition combines functions to create new functionality
- Currying transforms multi-argument functions into single-argument functions
- These patterns promote code reusability and maintainability
- They enable powerful patterns like pipelines and validation
- Error handling and performance considerations are important
- They are essential for functional programming
- They work well with async operations and monads

## Next Steps

- Learn about monads and functors
- Explore advanced functional programming patterns
- Study reactive programming with composition
- Practice building applications with these patterns
- Understand the relationship between composition and currying


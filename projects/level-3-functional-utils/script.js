// Main JavaScript file for Functional Programming Utility Library
// Level 3 Mini-Project

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// Demo functions for each utility section

// Composition Demo
function demoComposition() {
    const resultDiv = document.getElementById('composition-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Function definitions
            const addOne = x => x + 1;
            const multiplyByTwo = x => x * 2;
            const square = x => x * x;
            
            // Compose function (right to left)
            const compose = (...functions) => value => 
                functions.reduceRight((acc, fn) => fn(acc), value);
            
            // Pipe function (left to right)
            const pipe = (...functions) => value => 
                functions.reduce((acc, fn) => fn(acc), value);
            
            const composed = compose(square, multiplyByTwo, addOne);
            const piped = pipe(addOne, multiplyByTwo, square);
            
            const input = 3;
            const composedResult = composed(input);
            const pipedResult = piped(input);
            
            resultDiv.innerHTML = `Input: ${input}
Composed (right to left): ${composedResult}
Piped (left to right): ${pipedResult}

Composition: ((3 + 1) * 2)² = 64
Pipe: ((3 + 1) * 2)² = 64`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Currying Demo
function demoCurrying() {
    const resultDiv = document.getElementById('currying-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Basic currying function
            const curry = (fn) => {
                return function curried(...args) {
                    if (args.length >= fn.length) {
                        return fn(...args);
                    }
                    return function(...nextArgs) {
                        return curried(...args, ...nextArgs);
                    };
                };
            };
            
            // Example functions
            const add = curry((a, b, c) => a + b + c);
            const multiply = curry((a, b, c) => a * b * c);
            
            // Currying examples
            const add5 = add(5);
            const add5And10 = add5(10);
            const addResult = add5And10(3);
            
            const multiplyBy2 = multiply(2);
            const multiplyBy2And3 = multiplyBy2(3);
            const multiplyResult = multiplyBy2And3(4);
            
            resultDiv.innerHTML = `Currying Examples:

Add Function: (a, b, c) => a + b + c
add(5)(10)(3) = ${addResult}

Multiply Function: (a, b, c) => a * b * c
multiply(2)(3)(4) = ${multiplyResult}

Partial Application:
add5 = add(5)
add5And10 = add5(10)
add5And10(3) = ${addResult}`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Memoization Demo
function demoMemoization() {
    const resultDiv = document.getElementById('memoization-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Memoization function
            const memoize = (fn) => {
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
            };
            
            // Expensive function
            const expensiveFunction = (n) => {
                console.log(`Calculating for ${n}...`);
                return n * n * n;
            };
            
            const memoizedFunction = memoize(expensiveFunction);
            
            // Test memoization
            const input = 5;
            const result1 = memoizedFunction(input);
            const result2 = memoizedFunction(input);
            
            resultDiv.innerHTML = `Memoization Demo:

Input: ${input}
First call: ${result1} (calculated)
Second call: ${result2} (cached)

Cache hit on second call!
Memoization prevents recalculation.`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Debounce & Throttle Demo
function demoDebounceThrottle() {
    const resultDiv = document.getElementById('debounce-throttle-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Debounce function
            const debounce = (fn, delay) => {
                let timeoutId;
                return function(...args) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => fn(...args), delay);
                };
            };
            
            // Throttle function
            const throttle = (fn, delay) => {
                let lastCall = 0;
                return function(...args) {
                    const now = Date.now();
                    if (now - lastCall >= delay) {
                        lastCall = now;
                        return fn(...args);
                    }
                };
            };
            
            // Example functions
            const searchFunction = (query) => {
                console.log(`Searching for: ${query}`);
                return `Results for: ${query}`;
            };
            
            const scrollHandler = (position) => {
                console.log(`Scroll position: ${position}`);
                return `Scrolled to: ${position}`;
            };
            
            const debouncedSearch = debounce(searchFunction, 300);
            const throttledScroll = throttle(scrollHandler, 100);
            
            resultDiv.innerHTML = `Debounce & Throttle Demo:

Debounced Search (300ms delay):
- Delays execution until 300ms after last call
- Useful for search inputs, API calls

Throttled Scroll (100ms delay):
- Limits execution to once every 100ms
- Useful for scroll events, resize events

Both functions created successfully!`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Array Methods Demo
function demoArrayMethods() {
    const resultDiv = document.getElementById('array-methods-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Custom array methods
            const map = (array, fn) => {
                const result = [];
                for (let i = 0; i < array.length; i++) {
                    result.push(fn(array[i], i, array));
                }
                return result;
            };
            
            const filter = (array, predicate) => {
                const result = [];
                for (let i = 0; i < array.length; i++) {
                    if (predicate(array[i], i, array)) {
                        result.push(array[i]);
                    }
                }
                return result;
            };
            
            const reduce = (array, fn, initialValue) => {
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
            };
            
            const numbers = [1, 2, 3, 4, 5];
            const doubled = map(numbers, x => x * 2);
            const evens = filter(numbers, x => x % 2 === 0);
            const sum = reduce(numbers, (acc, x) => acc + x, 0);
            
            resultDiv.innerHTML = `Custom Array Methods Demo:

Original array: [${numbers.join(', ')}]

Map (double each number):
[${doubled.join(', ')}]

Filter (even numbers only):
[${evens.join(', ')}]

Reduce (sum all numbers):
${sum}

All methods working correctly!`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Array Transformations Demo
function demoArrayTransformations() {
    const resultDiv = document.getElementById('array-transformations-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Array transformation functions
            const pipe = (...functions) => value => 
                functions.reduce((acc, fn) => fn(acc), value);
            
            const filter = (predicate) => (array) => array.filter(predicate);
            const map = (fn) => (array) => array.map(fn);
            const reduce = (reducer, initialValue) => (array) => 
                array.reduce(reducer, initialValue);
            
            // Composed transformation
            const processNumbers = pipe(
                filter(x => x % 2 === 0),
                map(x => x * x),
                reduce((acc, x) => acc + x, 0)
            );
            
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const result = processNumbers(numbers);
            
            resultDiv.innerHTML = `Array Transformations Demo:

Original array: [${numbers.join(', ')}]

Pipeline:
1. Filter even numbers: [2, 4, 6, 8, 10]
2. Square each number: [4, 16, 36, 64, 100]
3. Sum all numbers: ${result}

Result: ${result}`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Object Transformations Demo
function demoObjectTransformations() {
    const resultDiv = document.getElementById('object-transformations-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Object transformation functions
            const map = (fn) => (array) => array.map(fn);
            const filter = (predicate) => (array) => array.filter(predicate);
            
            const users = [
                { name: "John", age: 30, active: true },
                { name: "Jane", age: 25, active: false },
                { name: "Bob", age: 35, active: true }
            ];
            
            const activeUsers = filter(user => user.active)(users);
            const userNames = map(user => user.name)(activeUsers);
            
            resultDiv.innerHTML = `Object Transformations Demo:

Original users:
${JSON.stringify(users, null, 2)}

Filter active users:
${JSON.stringify(activeUsers, null, 2)}

Map to names:
[${userNames.join(', ')}]`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Object Validation Demo
function demoObjectValidation() {
    const resultDiv = document.getElementById('object-validation-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Validation system
            const createValidator = () => {
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
            };
            
            // Validation rules
            const userValidator = createValidator()
                .addRule(data => {
                    if (!data.name || data.name.length === 0) {
                        throw new Error('Name is required');
                    }
                })
                .addRule(data => {
                    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                        throw new Error('Valid email is required');
                    }
                })
                .addRule(data => {
                    if (!data.age || data.age < 18) {
                        throw new Error('Age must be at least 18');
                    }
                });
            
            const user = { name: "John", email: "john@example.com", age: 30 };
            const validation = userValidator.validate(user);
            
            resultDiv.innerHTML = `Object Validation Demo:

User data:
${JSON.stringify(user, null, 2)}

Validation result:
${JSON.stringify(validation, null, 2)}

Validation rules:
- Name is required
- Valid email is required
- Age must be at least 18`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Async Composition Demo
function demoAsyncComposition() {
    const resultDiv = document.getElementById('async-composition-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Async composition function
            const composeAsync = (...functions) => {
                return function(value) {
                    return functions.reduceRight(
                        (promise, fn) => promise.then(fn),
                        Promise.resolve(value)
                    );
                };
            };
            
            // Mock async functions
            const fetchUser = async (id) => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return { id, name: `User ${id}`, email: `user${id}@example.com` };
            };
            
            const validateUser = async (user) => {
                await new Promise(resolve => setTimeout(resolve, 50));
                if (!user.name || !user.email) {
                    throw new Error('Invalid user data');
                }
                return user;
            };
            
            const processUser = async (user) => {
                await new Promise(resolve => setTimeout(resolve, 50));
                return { ...user, processed: true, processedAt: new Date().toISOString() };
            };
            
            // Compose async functions
            const processUserAsync = composeAsync(processUser, validateUser, fetchUser);
            
            resultDiv.innerHTML = `Async Composition Demo:

Async functions composed:
1. fetchUser(id) - Fetches user data
2. validateUser(user) - Validates user data
3. processUser(user) - Processes user data

Composition created successfully!
Use: processUserAsync(123).then(user => console.log(user))`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Retry Logic Demo
function demoRetryLogic() {
    const resultDiv = document.getElementById('retry-logic-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Retry function
            const retry = (fn, maxAttempts = 3, delay = 1000) => {
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
            };
            
            // Mock function that sometimes fails
            const fetchData = () => {
                const success = Math.random() > 0.5;
                if (success) {
                    return "Data fetched successfully!";
                } else {
                    throw new Error("Network error");
                }
            };
            
            const retryWithBackoff = retry(fetchData, 3, 1000);
            
            resultDiv.innerHTML = `Retry Logic Demo:

Retry function created:
- Max attempts: 3
- Delay between retries: 1000ms
- Exponential backoff: No (simple delay)

Mock fetchData function:
- 50% chance of success
- Throws error on failure

Retry function ready to use!`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Validation Pipeline Demo
function demoValidationPipeline() {
    const resultDiv = document.getElementById('validation-pipeline-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Validation pipeline
            const createValidator = () => {
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
            };
            
            // Validation rules
            const userValidator = createValidator()
                .addRule(data => {
                    if (!data.name || data.name.length === 0) {
                        throw new Error('Name is required');
                    }
                })
                .addRule(data => {
                    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                        throw new Error('Valid email is required');
                    }
                })
                .addRule(data => {
                    if (!data.age || data.age < 18) {
                        throw new Error('Age must be at least 18');
                    }
                });
            
            const user = { name: "John", email: "john@example.com", age: 30 };
            const validation = userValidator.validate(user);
            
            resultDiv.innerHTML = `Validation Pipeline Demo:

Validation rules added:
1. Name is required
2. Valid email is required
3. Age must be at least 18

User data:
${JSON.stringify(user, null, 2)}

Validation result:
${JSON.stringify(validation, null, 2)}

Pipeline working correctly!`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Schema Validation Demo
function demoSchemaValidation() {
    const resultDiv = document.getElementById('schema-validation-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Schema validation
            const validateSchema = (schema, data) => {
                const errors = [];
                
                for (const [field, rules] of Object.entries(schema)) {
                    const value = data[field];
                    
                    if (rules.required && (value === undefined || value === null)) {
                        errors.push(`${field} is required`);
                        continue;
                    }
                    
                    if (value !== undefined && value !== null) {
                        if (rules.type && typeof value !== rules.type) {
                            errors.push(`${field} must be a ${rules.type}`);
                        }
                        
                        if (rules.minLength && value.length < rules.minLength) {
                            errors.push(`${field} must be at least ${rules.minLength} characters`);
                        }
                        
                        if (rules.min && value < rules.min) {
                            errors.push(`${field} must be at least ${rules.min}`);
                        }
                        
                        if (rules.pattern && !rules.pattern.test(value)) {
                            errors.push(`${field} format is invalid`);
                        }
                    }
                }
                
                return {
                    isValid: errors.length === 0,
                    errors
                };
            };
            
            // Schema definition
            const userSchema = {
                name: { type: 'string', required: true, minLength: 2 },
                email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
                age: { type: 'number', required: true, min: 18 }
            };
            
            const user = { name: "John", email: "john@example.com", age: 30 };
            const validation = validateSchema(userSchema, user);
            
            resultDiv.innerHTML = `Schema Validation Demo:

Schema definition:
${JSON.stringify(userSchema, null, 2)}

User data:
${JSON.stringify(user, null, 2)}

Validation result:
${JSON.stringify(validation, null, 2)}

Schema validation working!`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// Data Processing Demo
function demoDataProcessing() {
    const resultDiv = document.getElementById('data-processing-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // Data processing pipeline
            const createPipeline = () => {
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
            };
            
            // Processing steps
            const processUsers = createPipeline()
                .addStep(users => users.filter(user => user.active))
                .addStep(users => users.map(user => ({ ...user, processed: true })))
                .addStep(users => users.sort((a, b) => a.name.localeCompare(b.name)));
            
            const users = [
                { name: "John", email: "john@example.com", age: 30, active: true },
                { name: "Jane", email: "jane@example.com", age: 25, active: false },
                { name: "Bob", email: "bob@example.com", age: 35, active: true }
            ];
            
            const processedUsers = processUsers.process(users);
            
            resultDiv.innerHTML = `Data Processing Pipeline Demo:

Original users:
${JSON.stringify(users, null, 2)}

Processing steps:
1. Filter active users
2. Add processed flag
3. Sort by name

Processed users:
${JSON.stringify(processedUsers, null, 2)}

Pipeline working correctly!`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}

// API Builder Demo
function demoApiBuilder() {
    const resultDiv = document.getElementById('api-builder-result');
    resultDiv.innerHTML = '<div class="loading"></div> Processing...';
    resultDiv.classList.add('show');
    
    setTimeout(() => {
        try {
            // API builder
            const createApiBuilder = () => {
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
                            
                            return {
                                url,
                                config: requestConfig,
                                method: requestConfig.method || 'GET'
                            };
                        };
                    }
                };
            };
            
            // Create API builder
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
            
            resultDiv.innerHTML = `API Builder Demo:

API Configuration:
- Base URL: https://api.example.com
- Headers: Content-Type, Authorization
- Timeout: 10000ms

Generated requests:
GET /users:
${JSON.stringify(getUsers(), null, 2)}

POST /users:
${JSON.stringify(createUser({ name: "John", email: "john@example.com" }), null, 2)}

API builder working!`;
            resultDiv.className = 'result show success';
        } catch (error) {
            resultDiv.innerHTML = `Error: ${error.message}`;
            resultDiv.className = 'result show error';
        }
    }, 500);
}


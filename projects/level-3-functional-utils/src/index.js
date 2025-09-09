// Functional Programming Utility Library
// Level 3 Mini-Project

// Core Utilities
export { compose, pipe } from './core/compose.js';
export { curry, partial } from './core/curry.js';
export { memoize } from './core/memoize.js';
export { debounce, throttle } from './core/debounce.js';

// Array Utilities
export { map, filter, reduce } from './arrays/map.js';
export { transform, validate } from './arrays/transform.js';

// Object Utilities
export { mapObject, filterObject } from './objects/transform.js';
export { createValidator } from './objects/validate.js';

// Async Utilities
export { composeAsync, pipeAsync } from './async/compose.js';
export { retry, timeout } from './async/retry.js';

// Validation Utilities
export { createValidationPipeline } from './validation/pipeline.js';
export { validateSchema } from './validation/schema.js';

// Utility Functions
export { createPipeline } from './utils/pipeline.js';
export { createApiBuilder } from './utils/api-builder.js';

// Core composition functions
export function compose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => fn(acc), value);
    };
}

export function pipe(...functions) {
    return function(value) {
        return functions.reduce((acc, fn) => fn(acc), value);
    };
}

// Basic currying
export function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return function(...nextArgs) {
            return curried(...args, ...nextArgs);
        };
    };
}

// Partial application
export function partial(fn, ...args) {
    return function(...remainingArgs) {
        return fn(...args, ...remainingArgs);
    };
}

// Memoization
export function memoize(fn) {
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

// Debouncing
export function debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// Throttling
export function throttle(fn, delay) {
    let lastCall = 0;
    
    return function(...args) {
        const now = Date.now();
        
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn(...args);
        }
    };
}

// Array utilities
export function map(array, fn) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(fn(array[i], i, array));
    }
    return result;
}

export function filter(array, predicate) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

export function reduce(array, fn, initialValue) {
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

// Object utilities
export function mapObject(obj, fn) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const [newKey, newValue] = fn(key, value);
        result[newKey] = newValue;
    }
    return result;
}

export function filterObject(obj, predicate) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (predicate(key, value)) {
            result[key] = value;
        }
    }
    return result;
}

// Validation
export function createValidator() {
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

// Async composition
export function composeAsync(...functions) {
    return function(value) {
        return functions.reduceRight(
            (promise, fn) => promise.then(fn),
            Promise.resolve(value)
        );
    };
}

export function pipeAsync(...functions) {
    return function(value) {
        return functions.reduce(
            (promise, fn) => promise.then(fn),
            Promise.resolve(value)
        );
    };
}

// Retry logic
export function retry(fn, maxAttempts = 3, delay = 1000) {
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

// Timeout
export function timeout(fn, ms) {
    return function(...args) {
        return Promise.race([
            Promise.resolve(fn(...args)),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), ms)
            )
        ]);
    };
}

// Pipeline
export function createPipeline() {
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

// API Builder
export function createApiBuilder() {
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

// Schema validation
export function validateSchema(schema, data) {
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
}

// Validation pipeline
export function createValidationPipeline() {
    const validators = [];
    
    return {
        addValidator: function(validator) {
            validators.push(validator);
            return this;
        },
        validate: function(data) {
            const errors = [];
            
            for (const validator of validators) {
                const result = validator.validate(data);
                if (!result.isValid) {
                    errors.push(...result.errors);
                }
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        }
    };
}

// Utility functions
export function once(fn) {
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

export function retryWithBackoff(fn, maxAttempts = 3, baseDelay = 1000) {
    return function(...args) {
        let attempts = 0;
        
        function attempt() {
            attempts++;
            try {
                return fn(...args);
            } catch (error) {
                if (attempts < maxAttempts) {
                    const delay = baseDelay * Math.pow(2, attempts - 1);
                    console.log(`Attempt ${attempts} failed, retrying in ${delay}ms...`);
                    setTimeout(attempt, delay);
                } else {
                    throw error;
                }
            }
        }
        
        return attempt();
    };
}

export function withErrorHandling(fn, errorHandler) {
    return function(...args) {
        try {
            return fn(...args);
        } catch (error) {
            return errorHandler(error, ...args);
        }
    };
}

export function withLogging(fn) {
    return function(...args) {
        console.log(`Calling ${fn.name} with arguments:`, args);
        const result = fn(...args);
        console.log(`Result:`, result);
        return result;
    };
}

export function withTiming(fn) {
    return function(...args) {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        console.log(`${fn.name} took ${end - start} milliseconds`);
        return result;
    };
}

// Default export
export default {
    compose,
    pipe,
    curry,
    partial,
    memoize,
    debounce,
    throttle,
    map,
    filter,
    reduce,
    mapObject,
    filterObject,
    createValidator,
    composeAsync,
    pipeAsync,
    retry,
    timeout,
    createPipeline,
    createApiBuilder,
    validateSchema,
    createValidationPipeline,
    once,
    retryWithBackoff,
    withErrorHandling,
    withLogging,
    withTiming
};


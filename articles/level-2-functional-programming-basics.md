# Functional Programming Basics: Writing Clean, Predictable Code

## Introduction

Functional Programming (FP) is a programming paradigm that treats computation as the evaluation of mathematical functions. It emphasizes immutability, pure functions, and avoiding side effects. JavaScript supports functional programming concepts, making it a powerful tool for writing clean, maintainable code.

## What is Functional Programming?

Functional Programming is based on several key principles:
- **Pure Functions**: Functions that always return the same output for the same input
- **Immutability**: Data that cannot be changed after creation
- **Higher-Order Functions**: Functions that take other functions as arguments or return functions
- **Function Composition**: Building complex functions by combining simpler ones
- **Avoiding Side Effects**: Minimizing interactions with external state

## Pure Functions

### Characteristics of Pure Functions
```javascript
// Pure function - same input always produces same output
function add(a, b) {
    return a + b;
}

// Pure function - no side effects
function multiply(x, y) {
    return x * y;
}

// Pure function - doesn't modify external state
function getFullName(firstName, lastName) {
    return `${firstName} ${lastName}`;
}

// Impure function - depends on external state
let taxRate = 0.1;
function calculateTax(amount) {
    return amount * taxRate; // Depends on external variable
}

// Impure function - has side effects
function logAndAdd(a, b) {
    console.log('Adding numbers'); // Side effect
    return a + b;
}

// Impure function - modifies input
function addToArray(arr, item) {
    arr.push(item); // Modifies input array
    return arr;
}
```

### Benefits of Pure Functions
```javascript
// Easy to test
function isEven(number) {
    return number % 2 === 0;
}

// Easy to reason about
function calculateDiscount(price, discountPercent) {
    return price * (1 - discountPercent / 100);
}

// Easy to cache/memoize
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Easy to parallelize
function processNumbers(numbers) {
    return numbers.map(n => n * 2);
}
```

## Immutability

### Immutable Data
```javascript
// Immutable approach - create new objects
let person = { name: "John", age: 30 };

// Instead of modifying
// person.age = 31; // Mutates original

// Create new object
let updatedPerson = { ...person, age: 31 };
console.log(person); // { name: "John", age: 30 }
console.log(updatedPerson); // { name: "John", age: 31 }

// Immutable arrays
let numbers = [1, 2, 3, 4, 5];

// Instead of modifying
// numbers.push(6); // Mutates original

// Create new array
let newNumbers = [...numbers, 6];
console.log(numbers); // [1, 2, 3, 4, 5]
console.log(newNumbers); // [1, 2, 3, 4, 5, 6]
```

### Immutable Operations
```javascript
// Array operations that don't mutate
let numbers = [1, 2, 3, 4, 5];

// Add element
let withSix = [...numbers, 6];
let withZero = [0, ...numbers];

// Remove element
let withoutThree = numbers.filter(n => n !== 3);

// Update element
let doubled = numbers.map(n => n * 2);

// Insert element at specific index
let withSeven = [...numbers.slice(0, 2), 7, ...numbers.slice(2)];

// Object operations that don't mutate
let user = { name: "John", age: 30, city: "New York" };

// Add property
let withEmail = { ...user, email: "john@example.com" };

// Update property
let olderUser = { ...user, age: 31 };

// Remove property
let {age, ...userWithoutAge} = user;

// Nested object updates
let userWithAddress = {
    ...user,
    address: {
        ...user.address,
        street: "123 Main St"
    }
};
```

### Object.freeze() for Immutability
```javascript
// Shallow freeze
let person = Object.freeze({
    name: "John",
    age: 30,
    address: {
        city: "New York",
        country: "USA"
    }
});

// person.name = "Jane"; // Won't work in strict mode
// person.address.city = "Boston"; // This will work (shallow freeze)

// Deep freeze function
function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(prop => {
        if (obj[prop] !== null && typeof obj[prop] === 'object') {
            deepFreeze(obj[prop]);
        }
    });
    return Object.freeze(obj);
}

let deepFrozenPerson = deepFreeze({
    name: "John",
    age: 30,
    address: {
        city: "New York",
        country: "USA"
    }
});
```

## Higher-Order Functions

### Functions as Arguments
```javascript
// Higher-order function that takes a function as argument
function processArray(arr, processor) {
    return arr.map(processor);
}

// Usage
let numbers = [1, 2, 3, 4, 5];
let doubled = processArray(numbers, x => x * 2);
let squared = processArray(numbers, x => x * x);

// Built-in higher-order functions
let names = ["John", "Jane", "Bob"];

// map - transform each element
let upperNames = names.map(name => name.toUpperCase());

// filter - select elements that meet condition
let longNames = names.filter(name => name.length > 3);

// reduce - reduce array to single value
let totalLength = names.reduce((total, name) => total + name.length, 0);

// forEach - execute function for each element
names.forEach(name => console.log(`Hello, ${name}!`));
```

### Functions as Return Values
```javascript
// Function that returns a function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

// Usage
let double = createMultiplier(2);
let triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function that returns a function with closure
function createCounter(initialValue = 0) {
    let count = initialValue;
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count,
        reset: () => count = initialValue
    };
}

let counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue()); // 11
console.log(counter.decrement()); // 10
```

### Currying
```javascript
// Curried function
function add(a) {
    return function(b) {
        return a + b;
    };
}

// Usage
let add5 = add(5);
console.log(add5(3)); // 8
console.log(add(5)(3)); // 8

// Arrow function currying
const multiply = a => b => a * b;
const multiplyBy3 = multiply(3);
console.log(multiplyBy3(4)); // 12

// Practical currying example
function createValidator(rules) {
    return function(data) {
        return rules.every(rule => rule(data));
    };
}

const isEmail = (data) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
const isRequired = (data) => data.name && data.email;

const validateUser = createValidator([isEmail, isRequired]);

let user = { name: "John", email: "john@example.com" };
console.log(validateUser(user)); // true
```

## Function Composition

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
function processNumber(x) {
    return square(multiplyByTwo(addOne(x)));
}

console.log(processNumber(3)); // ((3 + 1) * 2)² = 64

// Generic compose function
function compose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => fn(acc), value);
    };
}

const processNumberComposed = compose(square, multiplyByTwo, addOne);
console.log(processNumberComposed(3)); // 64

// Pipe function (left to right)
function pipe(...functions) {
    return function(value) {
        return functions.reduce((acc, fn) => fn(acc), value);
    };
}

const processNumberPiped = pipe(addOne, multiplyByTwo, square);
console.log(processNumberPiped(3)); // 64
```

### Advanced Composition
```javascript
// Composition with multiple arguments
function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

// Partial application for composition
function partial(fn, ...args) {
    return function(...remainingArgs) {
        return fn(...args, ...remainingArgs);
    };
}

const add5 = partial(add, 5);
const multiplyBy3 = partial(multiply, 3);

const process = compose(multiplyBy3, add5);
console.log(process(10)); // (10 + 5) * 3 = 45

// Composition with error handling
function safeCompose(...functions) {
    return function(value) {
        try {
            return functions.reduceRight((acc, fn) => fn(acc), value);
        } catch (error) {
            console.error('Composition error:', error);
            return null;
        }
    };
}

const safeProcess = safeCompose(square, multiplyByTwo, addOne);
console.log(safeProcess(3)); // 64
```

## Array Methods for Functional Programming

### Map, Filter, Reduce
```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Map - transform each element
let doubled = numbers.map(n => n * 2);
let squared = numbers.map(n => n * n);

// Filter - select elements that meet condition
let evens = numbers.filter(n => n % 2 === 0);
let greaterThan5 = numbers.filter(n => n > 5);

// Reduce - reduce array to single value
let sum = numbers.reduce((acc, n) => acc + n, 0);
let product = numbers.reduce((acc, n) => acc * n, 1);
let max = numbers.reduce((acc, n) => n > acc ? n : acc, numbers[0]);

// Chaining operations
let result = numbers
    .filter(n => n % 2 === 0)  // [2, 4, 6, 8, 10]
    .map(n => n * n)           // [4, 16, 36, 64, 100]
    .reduce((acc, n) => acc + n, 0); // 220
```

### Advanced Array Methods
```javascript
let users = [
    { name: "John", age: 30, city: "New York" },
    { name: "Jane", age: 25, city: "Boston" },
    { name: "Bob", age: 35, city: "New York" },
    { name: "Alice", age: 28, city: "Chicago" }
];

// find - find first element that meets condition
let john = users.find(user => user.name === "John");

// findIndex - find index of first element that meets condition
let johnIndex = users.findIndex(user => user.name === "John");

// some - check if any element meets condition
let hasYoungUser = users.some(user => user.age < 25);

// every - check if all elements meet condition
let allAdults = users.every(user => user.age >= 18);

// flatMap - map and flatten
let cities = users.flatMap(user => [user.city, user.city.toUpperCase()]);

// groupBy (custom implementation)
function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
}

let usersByCity = groupBy(users, 'city');
```

## Recursion

### Basic Recursion
```javascript
// Factorial
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5)); // 120

// Fibonacci
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55

// Sum of array
function sumArray(arr) {
    if (arr.length === 0) return 0;
    return arr[0] + sumArray(arr.slice(1));
}

console.log(sumArray([1, 2, 3, 4, 5])); // 15
```

### Tail Recursion
```javascript
// Tail recursive factorial
function factorialTail(n, acc = 1) {
    if (n <= 1) return acc;
    return factorialTail(n - 1, n * acc);
}

console.log(factorialTail(5)); // 120

// Tail recursive sum
function sumArrayTail(arr, acc = 0) {
    if (arr.length === 0) return acc;
    return sumArrayTail(arr.slice(1), acc + arr[0]);
}

console.log(sumArrayTail([1, 2, 3, 4, 5])); // 15
```

### Recursive Data Processing
```javascript
// Flatten nested arrays
function flatten(arr) {
    return arr.reduce((acc, item) => {
        return acc.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
}

console.log(flatten([1, [2, 3], [4, [5, 6]]])); // [1, 2, 3, 4, 5, 6]

// Deep clone object
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = deepClone(obj[key]);
        });
        return cloned;
    }
}

let original = { a: 1, b: { c: 2, d: [3, 4] } };
let cloned = deepClone(original);
console.log(cloned); // { a: 1, b: { c: 2, d: [3, 4] } }
```

## Closures and Scope

### Understanding Closures
```javascript
// Basic closure
function outerFunction(x) {
    return function innerFunction(y) {
        return x + y; // x is captured from outer scope
    };
}

let add5 = outerFunction(5);
console.log(add5(3)); // 8

// Closure with multiple variables
function createCounter(initialValue = 0) {
    let count = initialValue;
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count,
        reset: () => count = initialValue
    };
}

let counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.getValue()); // 11
```

### Module Pattern
```javascript
// Module pattern using closure
const UserModule = (function() {
    let users = [];
    let nextId = 1;
    
    return {
        addUser: function(name, email) {
            const user = { id: nextId++, name, email };
            users.push(user);
            return user;
        },
        
        getUser: function(id) {
            return users.find(user => user.id === id);
        },
        
        getAllUsers: function() {
            return [...users]; // Return copy to prevent external modification
        },
        
        deleteUser: function(id) {
            users = users.filter(user => user.id !== id);
        }
    };
})();

// Usage
UserModule.addUser("John", "john@example.com");
UserModule.addUser("Jane", "jane@example.com");
console.log(UserModule.getAllUsers());
```

## Memoization

### Basic Memoization
```javascript
// Simple memoization
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

// Usage
const expensiveFunction = (n) => {
    console.log('Computing...');
    return n * n;
};

const memoizedExpensiveFunction = memoize(expensiveFunction);

console.log(memoizedExpensiveFunction(5)); // Computing... 25
console.log(memoizedExpensiveFunction(5)); // Cache hit 25
```

### Advanced Memoization
```javascript
// Memoization with cache size limit
function memoizeWithLimit(fn, limit = 100) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            // Move to end (LRU)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        
        const result = fn(...args);
        
        // Remove oldest if at limit
        if (cache.size >= limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}

// Usage
const fibonacci = memoizeWithLimit((n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}, 50);

console.log(fibonacci(40)); // Much faster with memoization
```

## Functional Utilities

### Common Utility Functions
```javascript
// Curry function
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...nextArgs) => curried(...args, ...nextArgs);
    };
}

// Partial application
function partial(fn, ...args) {
    return function(...remainingArgs) {
        return fn(...args, ...remainingArgs);
    };
}

// Compose function
function compose(...functions) {
    return function(value) {
        return functions.reduceRight((acc, fn) => fn(acc), value);
    };
}

// Pipe function
function pipe(...functions) {
    return function(value) {
        return functions.reduce((acc, fn) => fn(acc), value);
    };
}

// Debounce function
function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Throttle function
function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}
```

### Data Transformation Utilities
```javascript
// Group by function
function groupBy(array, keyFn) {
    return array.reduce((groups, item) => {
        const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
        groups[key] = groups[key] || [];
        groups[key].push(item);
        return groups;
    }, {});
}

// Sort by function
function sortBy(array, keyFn) {
    return [...array].sort((a, b) => {
        const aVal = typeof keyFn === 'function' ? keyFn(a) : a[keyFn];
        const bVal = typeof keyFn === 'function' ? keyFn(b) : b[keyFn];
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
}

// Unique by function
function uniqueBy(array, keyFn) {
    const seen = new Set();
    return array.filter(item => {
        const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Usage
let users = [
    { name: "John", age: 30, city: "New York" },
    { name: "Jane", age: 25, city: "Boston" },
    { name: "Bob", age: 35, city: "New York" },
    { name: "Alice", age: 28, city: "Chicago" }
];

let groupedByCity = groupBy(users, 'city');
let sortedByAge = sortBy(users, 'age');
let uniqueCities = uniqueBy(users, 'city');
```

## Best Practices

### Writing Functional Code
```javascript
// Good: Pure functions
function calculateTotal(items) {
    return items.reduce((total, item) => total + item.price, 0);
}

// Bad: Impure function
let total = 0;
function calculateTotal(items) {
    total = 0; // Side effect
    items.forEach(item => {
        total += item.price; // Side effect
    });
    return total;
}

// Good: Immutable operations
function addItem(cart, item) {
    return [...cart, item];
}

// Bad: Mutable operations
function addItem(cart, item) {
    cart.push(item); // Mutates input
    return cart;
}
```

### Performance Considerations
```javascript
// Good: Use appropriate array methods
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(n => n * 2); // Efficient

// Bad: Unnecessary intermediate arrays
let doubled = numbers
    .filter(n => n > 0) // Unnecessary if all numbers are positive
    .map(n => n * 2);

// Good: Use reduce for complex operations
let result = numbers.reduce((acc, n) => {
    if (n > 0) {
        acc.push(n * 2);
    }
    return acc;
}, []);

// Bad: Multiple passes
let positive = numbers.filter(n => n > 0);
let doubled = positive.map(n => n * 2);
```

## Conclusion

Functional Programming in JavaScript provides powerful tools for writing clean, maintainable, and testable code. By embracing pure functions, immutability, and higher-order functions, you can create more robust applications.

## Key Takeaways

- Pure functions are easier to test, reason about, and debug
- Immutability prevents many common bugs and makes code more predictable
- Higher-order functions enable powerful abstractions and code reuse
- Function composition allows building complex behavior from simple parts
- Recursion is a natural fit for functional programming
- Closures enable powerful patterns like modules and memoization
- Choose the right tool for the job - functional programming complements other paradigms

## Next Steps

- Practice writing pure functions and immutable data structures
- Learn about advanced functional programming concepts
- Study functional programming libraries like Lodash/FP
- Explore reactive programming with RxJS
- Build projects that demonstrate functional programming principles
- Learn about functional programming in other languages


# Function Fundamentals & Types: Mastering JavaScript Functions

## Introduction

Functions are the building blocks of JavaScript programming. They allow you to encapsulate code, create reusable logic, and build complex applications. Understanding function fundamentals is crucial for writing clean, maintainable, and efficient JavaScript code.

## What are Functions?

Functions are first-class objects in JavaScript that can be:
- **Declared** and **invoked**
- **Assigned** to variables
- **Passed** as arguments to other functions
- **Returned** from other functions
- **Stored** in data structures

## Function Types

### Function Declarations

Function declarations are hoisted and can be called before they're defined.

```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Can be called before declaration due to hoisting
console.log(greet("World")); // "Hello, World!"

// Function declaration with multiple parameters
function calculateArea(width, height) {
    return width * height;
}

// Function declaration with default parameters
function createUser(name, age = 18, isActive = true) {
    return {
        name,
        age,
        isActive,
        createdAt: new Date()
    };
}
```

### Function Expressions

Function expressions are not hoisted and must be defined before use.

```javascript
// Function expression
const greet = function(name) {
    return `Hello, ${name}!`;
};

// Named function expression
const calculateArea = function area(width, height) {
    return width * height;
};

// Function expression with default parameters
const createUser = function(name, age = 18, isActive = true) {
    return { name, age, isActive };
};

// Cannot be called before declaration
// console.log(greet("World")); // ReferenceError
```

### Arrow Functions

Arrow functions provide a concise syntax and lexical `this` binding.

```javascript
// Basic arrow function
const greet = (name) => `Hello, ${name}!`;

// Single parameter (parentheses optional)
const square = x => x * x;

// Multiple parameters
const add = (a, b) => a + b;

// Multiple statements
const processUser = (user) => {
    const processed = { ...user };
    processed.lastLogin = new Date();
    return processed;
};

// Returning object literal
const createPoint = (x, y) => ({ x, y });

// Arrow function with default parameters
const greetWithDefault = (name = "Guest") => `Hello, ${name}!`;
```

### Generator Functions

Generator functions can be paused and resumed, yielding multiple values.

```javascript
// Generator function declaration
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

// Generator function expression
const numberGenerator = function*() {
    yield 1;
    yield 2;
    yield 3;
};

// Using generator
const gen = numberGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
console.log(gen.next().done);  // true

// Generator with parameters
function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
```

### Async Functions

Async functions return promises and can use the `await` keyword.

```javascript
// Async function declaration
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// Async function expression
const fetchUserData = async function(userId) {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
};

// Async arrow function
const fetchUserData = async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
};

// Using async function
fetchUserData(123)
    .then(userData => console.log(userData))
    .catch(error => console.error(error));
```

## Function Parameters

### Default Parameters

```javascript
// Basic default parameters
function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}

// Default parameters with expressions
function createId(prefix = "id", timestamp = Date.now()) {
    return `${prefix}_${timestamp}`;
}

// Default parameters with function calls
function logMessage(message, timestamp = new Date().toISOString()) {
    console.log(`[${timestamp}] ${message}`);
}

// Default parameters with previous parameters
function createUser(name, age = 18, isActive = true, createdAt = new Date()) {
    return { name, age, isActive, createdAt };
}
```

### Rest Parameters

Rest parameters collect remaining arguments into an array.

```javascript
// Rest parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest parameters with other parameters
function createUser(name, age, ...hobbies) {
    return {
        name,
        age,
        hobbies: hobbies.length > 0 ? hobbies : ['reading']
    };
}

console.log(createUser("John", 30, "coding", "gaming", "music"));
// { name: "John", age: 30, hobbies: ["coding", "gaming", "music"] }

// Rest parameters in arrow functions
const multiply = (multiplier, ...numbers) => {
    return numbers.map(num => num * multiplier);
};

console.log(multiply(2, 1, 2, 3, 4)); // [2, 4, 6, 8]
```

### Destructuring Parameters

```javascript
// Object destructuring in parameters
function displayUser({ name, age, email }) {
    console.log(`Name: ${name}, Age: ${age}, Email: ${email}`);
}

const user = { name: "John", age: 30, email: "john@example.com" };
displayUser(user);

// Array destructuring in parameters
function processCoordinates([x, y, z = 0]) {
    return { x, y, z, distance: Math.sqrt(x*x + y*y + z*z) };
}

console.log(processCoordinates([3, 4])); // { x: 3, y: 4, z: 0, distance: 5 }

// Nested destructuring
function processOrder({ customer: { name, email }, items, total }) {
    return {
        customerName: name,
        customerEmail: email,
        itemCount: items.length,
        total
    };
}

// Destructuring with default values
function createConfig({ 
    host = "localhost", 
    port = 3000, 
    ssl = false 
} = {}) {
    return { host, port, ssl };
}

console.log(createConfig()); // { host: "localhost", port: 3000, ssl: false }
console.log(createConfig({ port: 8080 })); // { host: "localhost", port: 8080, ssl: false }
```

## Return Values

### Basic Returns

```javascript
// Simple return
function add(a, b) {
    return a + b;
}

// Early return
function divide(a, b) {
    if (b === 0) {
        return "Cannot divide by zero";
    }
    return a / b;
}

// Multiple return statements
function getGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

// Implicit return (arrow functions)
const add = (a, b) => a + b;
const square = x => x * x;
const greet = name => `Hello, ${name}!`;
```

### Returning Multiple Values

```javascript
// Returning an object
function getStats(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const average = sum / numbers.length;
    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    
    return { sum, average, max, min };
}

// Returning an array
function getCoordinates(point) {
    return [point.x, point.y, point.z || 0];
}

// Destructuring returned values
const { sum, average, max, min } = getStats([1, 2, 3, 4, 5]);
const [x, y, z] = getCoordinates({ x: 10, y: 20, z: 30 });
```

### Returning Functions

```javascript
// Function that returns a function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Arrow function returning arrow function
const createAdder = (x) => (y) => x + y;
const add5 = createAdder(5);
console.log(add5(3)); // 8

// Function that returns different functions based on input
function createCalculator(operation) {
    switch (operation) {
        case 'add':
            return (a, b) => a + b;
        case 'subtract':
            return (a, b) => a - b;
        case 'multiply':
            return (a, b) => a * b;
        case 'divide':
            return (a, b) => b !== 0 ? a / b : 'Cannot divide by zero';
        default:
            return () => 'Invalid operation';
    }
}

const add = createCalculator('add');
const divide = createCalculator('divide');
console.log(add(5, 3)); // 8
console.log(divide(10, 2)); // 5
```

## Function Context and `this`

### Understanding `this`

```javascript
// Global context
console.log(this); // Window object (in browser)

// Function context
function regularFunction() {
    console.log(this); // Window object (in non-strict mode)
}

// Method context
const obj = {
    name: "John",
    greet: function() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

obj.greet(); // "Hello, I'm John"

// Arrow function context
const obj2 = {
    name: "Jane",
    greet: () => {
        console.log(`Hello, I'm ${this.name}`); // 'this' refers to global scope
    }
};

obj2.greet(); // "Hello, I'm undefined" (in strict mode)
```

### Explicit `this` Binding

```javascript
// call() method
function greet(greeting, punctuation) {
    return `${greeting} ${this.name}${punctuation}`;
}

const person = { name: "John" };
console.log(greet.call(person, "Hello", "!")); // "Hello John!"

// apply() method
function sum() {
    return Array.from(arguments).reduce((acc, num) => acc + num, 0);
}

console.log(sum.apply(null, [1, 2, 3, 4, 5])); // 15

// bind() method
const person = {
    name: "John",
    greet: function() {
        return `Hello, I'm ${this.name}`;
    }
};

const boundGreet = person.greet.bind(person);
console.log(boundGreet()); // "Hello, I'm John"

// Partial application with bind
function multiply(a, b) {
    return a * b;
}

const double = multiply.bind(null, 2);
console.log(double(5)); // 10
```

### Arrow Functions and `this`

```javascript
// Arrow functions don't have their own 'this'
const obj = {
    name: "John",
    regularMethod: function() {
        console.log(this.name); // "John"
        
        // Arrow function inherits 'this' from parent scope
        const arrowFunction = () => {
            console.log(this.name); // "John"
        };
        arrowFunction();
    },
    
    arrowMethod: () => {
        console.log(this.name); // undefined (global scope)
    }
};

obj.regularMethod();
obj.arrowMethod();

// Practical example with event handlers
class Button {
    constructor(element) {
        this.element = element;
        this.clickCount = 0;
        
        // Arrow function preserves 'this' context
        this.element.addEventListener('click', () => {
            this.clickCount++;
            console.log(`Button clicked ${this.clickCount} times`);
        });
    }
}
```

## Function Properties and Methods

### Function Properties

```javascript
function exampleFunction(a, b, c) {
    return a + b + c;
}

// Function properties
console.log(exampleFunction.name); // "exampleFunction"
console.log(exampleFunction.length); // 3 (number of parameters)
console.log(exampleFunction.prototype); // Function prototype

// Function methods
console.log(exampleFunction.toString());
// "function exampleFunction(a, b, c) { return a + b + c; }"
```

### Custom Function Properties

```javascript
// Adding custom properties to functions
function createCounter() {
    let count = 0;
    
    function counter() {
        return ++count;
    }
    
    // Add custom properties
    counter.reset = function() {
        count = 0;
    };
    
    counter.getValue = function() {
        return count;
    };
    
    return counter;
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter.getValue()); // 2
counter.reset();
console.log(counter()); // 1
```

## Function Hoisting

### Function Declarations

```javascript
// Function declarations are hoisted
console.log(hoistedFunction()); // "This works!"

function hoistedFunction() {
    return "This works!";
}

// Equivalent to:
function hoistedFunction() {
    return "This works!";
}
console.log(hoistedFunction()); // "This works!"
```

### Function Expressions

```javascript
// Function expressions are not hoisted
// console.log(notHoisted()); // ReferenceError

const notHoisted = function() {
    return "This doesn't work!";
};

console.log(notHoisted()); // "This doesn't work!"
```

### Variable Hoisting vs Function Hoisting

```javascript
// Variable hoisting
console.log(typeof hoistedVar); // "undefined"
var hoistedVar = "I'm hoisted!";

// Function hoisting
console.log(typeof hoistedFunc); // "function"
function hoistedFunc() {
    return "I'm hoisted!";
}

// Mixed hoisting
console.log(typeof mixed); // "function" (function declaration wins)
var mixed = "I'm a variable";
function mixed() {
    return "I'm a function";
}
```

## Function Best Practices

### Naming Conventions

```javascript
// Use descriptive names
function calculateUserAge(birthDate) {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
}

// Use verb-noun pattern for actions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Use is/has/can prefixes for boolean returns
function isEven(number) {
    return number % 2 === 0;
}

function hasPermission(user, action) {
    return user.permissions.includes(action);
}

function canVote(age) {
    return age >= 18;
}
```

### Single Responsibility Principle

```javascript
// Good: Single responsibility
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

function validateUser(user) {
    return validateEmail(user.email) && validatePassword(user.password);
}

// Bad: Multiple responsibilities
function validateUserAndSendEmail(user) {
    // Validation logic
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        return false;
    }
    
    // Email sending logic
    // ... email sending code ...
    
    return true;
}
```

### Error Handling

```javascript
// Proper error handling
function divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('Both arguments must be numbers');
    }
    
    if (b === 0) {
        throw new Error('Division by zero is not allowed');
    }
    
    return a / b;
}

// Using try-catch
try {
    const result = divide(10, 2);
    console.log(result); // 5
} catch (error) {
    console.error('Error:', error.message);
}

// Error handling with default values
function safeDivide(a, b, defaultValue = 0) {
    try {
        return divide(a, b);
    } catch (error) {
        console.warn('Division failed:', error.message);
        return defaultValue;
    }
}
```

### Performance Considerations

```javascript
// Memoization for expensive calculations
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

// Expensive function
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memoized version
const memoizedFibonacci = memoize(fibonacci);

// First call is slow
console.time('fibonacci');
console.log(memoizedFibonacci(40));
console.timeEnd('fibonacci');

// Second call is fast (cached)
console.time('fibonacci');
console.log(memoizedFibonacci(40));
console.timeEnd('fibonacci');
```

## Conclusion

Understanding function fundamentals is essential for writing effective JavaScript code. Functions are versatile tools that can be used in many different ways, from simple calculations to complex application architecture.

## Key Takeaways

- Functions are first-class objects in JavaScript
- Different function types serve different purposes
- Parameters can be default, rest, or destructured
- Functions can return values, other functions, or nothing
- `this` context depends on how functions are called
- Function hoisting affects when functions can be called
- Good practices improve code readability and maintainability

## Next Steps

- Learn about scope chain and lexical scoping
- Understand closures and memory management
- Explore higher-order functions
- Study function composition and currying
- Practice building complex applications with functions


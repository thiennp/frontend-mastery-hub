# JavaScript Basics: Adding Interactivity to the Web

## Introduction

JavaScript is a dynamic, high-level programming language that brings websites to life. It enables interactive features, dynamic content updates, form validation, and complex user experiences that static HTML and CSS alone cannot provide.

## What is JavaScript?

JavaScript is a versatile programming language that runs in web browsers and on servers (Node.js). It's essential for modern web development, enabling:

- **Dynamic content**: Update page content without refreshing
- **User interactions**: Respond to clicks, form submissions, and other events
- **Data manipulation**: Process and transform data on the client side
- **API communication**: Fetch data from servers and update the UI
- **Form validation**: Check user input before submission

### Key Characteristics
- **Interpreted**: Code runs directly without compilation
- **Dynamic typing**: Variable types are determined at runtime
- **Object-oriented**: Supports classes, inheritance, and encapsulation
- **Event-driven**: Responds to user actions and system events
- **Cross-platform**: Runs in any modern web browser

## JavaScript in the Browser

### Including JavaScript
```html
<!-- External JavaScript file -->
<script src="script.js"></script>

<!-- Inline JavaScript -->
<script>
    console.log("Hello, World!");
</script>

<!-- JavaScript in HTML attributes -->
<button onclick="alert('Clicked!')">Click me</button>
```

### Script Loading
```html
<!-- Load in head (blocks rendering) -->
<script src="critical.js"></script>

<!-- Load at end of body (recommended) -->
<script src="non-critical.js"></script>

<!-- Async loading -->
<script src="async.js" async></script>

<!-- Deferred loading -->
<script src="deferred.js" defer></script>
```

## Basic Syntax

### Variables and Data Types
```javascript
// Variable declaration
let message = "Hello";           // String
const PI = 3.14159;             // Number (constant)
var oldWay = "deprecated";      // Old way (avoid)

// Data types
let text = "Hello World";       // String
let number = 42;                // Number
let boolean = true;             // Boolean
let array = [1, 2, 3];         // Array
let object = {name: "John"};    // Object
let nothing = null;             // Null
let undefined;                  // Undefined
let symbol = Symbol("id");      // Symbol (ES6+)

// Template literals
let name = "World";
let greeting = `Hello, ${name}!`;  // "Hello, World!"
```

### Operators
```javascript
// Arithmetic operators
let sum = 5 + 3;        // 8
let difference = 10 - 4; // 6
let product = 6 * 7;    // 42
let quotient = 15 / 3;  // 5
let remainder = 17 % 5; // 2
let power = 2 ** 3;     // 8

// Assignment operators
let x = 10;
x += 5;                 // x = x + 5 (15)
x -= 3;                 // x = x - 3 (12)
x *= 2;                 // x = x * 2 (24)
x /= 4;                 // x = x / 4 (6)

// Comparison operators
let isEqual = 5 === "5";        // false (strict equality)
let isLooseEqual = 5 == "5";    // true (loose equality)
let isGreater = 10 > 5;         // true
let isLessOrEqual = 3 <= 3;     // true

// Logical operators
let and = true && false;         // false
let or = true || false;          // true
let not = !true;                 // false
```

### Control Structures
```javascript
// Conditional statements
let age = 18;

if (age >= 18) {
    console.log("Adult");
} else if (age >= 13) {
    console.log("Teenager");
} else {
    console.log("Child");
}

// Ternary operator
let status = age >= 18 ? "Adult" : "Minor";

// Switch statement
let day = "Monday";
switch (day) {
    case "Monday":
        console.log("Start of week");
        break;
    case "Friday":
        console.log("End of week");
        break;
    default:
        console.log("Mid week");
}

// Loops
// For loop
for (let i = 0; i < 5; i++) {
    console.log(i);  // 0, 1, 2, 3, 4
}

// While loop
let count = 0;
while (count < 3) {
    console.log(count);
    count++;
}

// Do-while loop
let num = 0;
do {
    console.log(num);
    num++;
} while (num < 3);

// For...of loop (arrays)
let colors = ["red", "green", "blue"];
for (let color of colors) {
    console.log(color);
}

// For...in loop (object properties)
let person = {name: "John", age: 30};
for (let key in person) {
    console.log(`${key}: ${person[key]}`);
}
```

## Functions

### Function Declaration
```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Function expression
const greet = function(name) {
    return `Hello, ${name}!`;
};

// Arrow function (ES6+)
const greet = (name) => `Hello, ${name}!`;

// Arrow function with multiple parameters
const add = (a, b) => {
    let sum = a + b;
    return sum;
};

// Arrow function with single parameter
const square = x => x * x;

// Arrow function with no parameters
const getRandom = () => Math.random();
```

### Function Parameters
```javascript
// Default parameters
function greet(name = "Guest") {
    return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

// Destructuring parameters
function printUser({name, age, email}) {
    console.log(`Name: ${name}, Age: ${age}, Email: ${email}`);
}

// Call with object
printUser({name: "John", age: 30, email: "john@example.com"});
```

### Function Scope and Closures
```javascript
// Global scope
let globalVar = "I'm global";

function outerFunction() {
    let outerVar = "I'm in outer function";
    
    function innerFunction() {
        let innerVar = "I'm in inner function";
        console.log(globalVar);    // Accessible
        console.log(outerVar);     // Accessible
        console.log(innerVar);     // Accessible
    }
    
    return innerFunction;
}

const innerFunc = outerFunction();
innerFunc();  // Creates closure
```

## Arrays

### Array Creation and Manipulation
```javascript
// Creating arrays
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = ["text", 42, true, null];

// Accessing elements
let firstFruit = fruits[0];        // "apple"
let lastFruit = fruits[fruits.length - 1];  // "orange"

// Modifying arrays
fruits.push("grape");              // Add to end
fruits.unshift("strawberry");      // Add to beginning
fruits.pop();                      // Remove from end
fruits.shift();                    // Remove from beginning
fruits.splice(1, 1, "pear");      // Replace element at index 1

// Array methods
let doubled = numbers.map(x => x * 2);           // [2, 4, 6, 8, 10]
let evens = numbers.filter(x => x % 2 === 0);    // [2, 4]
let sum = numbers.reduce((acc, x) => acc + x, 0); // 15
let hasEven = numbers.some(x => x % 2 === 0);    // true
let allPositive = numbers.every(x => x > 0);      // true
```

### Array Destructuring and Spread
```javascript
// Destructuring
let [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);   // 1
console.log(second);  // 2
console.log(rest);    // [3, 4, 5]

// Spread operator
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

// Copying arrays
let original = [1, 2, 3];
let copy = [...original];  // Shallow copy
```

## Objects

### Object Creation and Properties
```javascript
// Object literal
let person = {
    name: "John",
    age: 30,
    email: "john@example.com",
    
    // Method
    greet() {
        return `Hello, I'm ${this.name}`;
    },
    
    // Arrow function (no 'this' binding)
    greetArrow: () => `Hello, I'm ${person.name}`
};

// Accessing properties
console.log(person.name);           // "John"
console.log(person["age"]);         // 30
console.log(person.greet());        // "Hello, I'm John"

// Adding/modifying properties
person.city = "New York";
person.age = 31;

// Deleting properties
delete person.email;
```

### Object Destructuring and Spread
```javascript
// Destructuring
let {name, age, city} = person;
console.log(name);  // "John"
console.log(age);   // 31

// Renaming during destructuring
let {name: fullName} = person;
console.log(fullName);  // "John"

// Default values
let {country = "USA"} = person;
console.log(country);  // "USA"

// Spread operator
let personCopy = {...person};
let extendedPerson = {...person, profession: "Developer"};
```

### Object Methods
```javascript
// Object.keys()
let keys = Object.keys(person);  // ["name", "age", "city", "greet", "greetArrow"]

// Object.values()
let values = Object.values(person);  // ["John", 31, "New York", function, function]

// Object.entries()
let entries = Object.entries(person);  // [["name", "John"], ["age", 31], ...]

// Object.assign()
let newPerson = Object.assign({}, person, {profession: "Developer"});

// Object.freeze()
Object.freeze(person);  // Prevents modifications
```

## DOM Manipulation

### Selecting Elements
```javascript
// Single element selectors
let element = document.getElementById("myId");
let element = document.querySelector(".myClass");
let element = document.querySelector("#myId");

// Multiple element selectors
let elements = document.getElementsByClassName("myClass");
let elements = document.getElementsByTagName("div");
let elements = document.querySelectorAll(".myClass");
```

### Modifying Elements
```javascript
// Content
element.textContent = "New text content";
element.innerHTML = "<strong>HTML content</strong>";

// Attributes
element.setAttribute("class", "newClass");
element.removeAttribute("oldAttribute");
element.classList.add("newClass");
element.classList.remove("oldClass");
element.classList.toggle("active");

// Styles
element.style.backgroundColor = "red";
element.style.fontSize = "16px";
element.style.cssText = "color: blue; font-size: 18px;";
```

### Creating and Removing Elements
```javascript
// Creating elements
let newDiv = document.createElement("div");
newDiv.textContent = "New element";
newDiv.className = "new-class";

// Adding elements
document.body.appendChild(newDiv);
parentElement.insertBefore(newDiv, referenceElement);

// Removing elements
parentElement.removeChild(newDiv);
newDiv.remove();  // Modern way
```

### Event Handling
```javascript
// Adding event listeners
element.addEventListener("click", function(event) {
    console.log("Element clicked!");
    console.log(event.target);
});

// Removing event listeners
function handleClick(event) {
    console.log("Clicked!");
}
element.addEventListener("click", handleClick);
element.removeEventListener("click", handleClick);

// Event object properties
element.addEventListener("click", function(event) {
    event.preventDefault();        // Prevent default behavior
    event.stopPropagation();      // Stop event bubbling
    console.log(event.type);      // "click"
    console.log(event.target);    // Element that was clicked
    console.log(event.currentTarget); // Element with event listener
});
```

## Error Handling

### Try-Catch Statements
```javascript
try {
    // Code that might throw an error
    let result = riskyOperation();
    console.log(result);
} catch (error) {
    // Handle the error
    console.error("An error occurred:", error.message);
} finally {
    // Code that always runs
    console.log("Cleanup code");
}

// Custom errors
function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero is not allowed");
    }
    return a / b;
}

try {
    let result = divide(10, 0);
} catch (error) {
    console.error("Error:", error.message);
}
```

## Asynchronous JavaScript

### Callbacks
```javascript
// Callback function
function fetchData(callback) {
    setTimeout(() => {
        const data = {id: 1, name: "John"};
        callback(null, data);
    }, 1000);
}

// Using callback
fetchData((error, data) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data:", data);
    }
});
```

### Promises
```javascript
// Creating promises
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
            resolve("Operation successful!");
        } else {
            reject("Operation failed!");
        }
    }, 1000);
});

// Using promises
myPromise
    .then(result => {
        console.log("Success:", result);
    })
    .catch(error => {
        console.error("Error:", error);
    })
    .finally(() => {
        console.log("Promise completed");
    });

// Promise chaining
fetchData()
    .then(data => processData(data))
    .then(result => displayResult(result))
    .catch(error => handleError(error));
```

### Async/Await
```javascript
// Async function
async function fetchUserData() {
    try {
        const response = await fetch('https://api.example.com/user');
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

// Using async/await
async function main() {
    try {
        const userData = await fetchUserData();
        console.log("User data:", userData);
    } catch (error) {
        console.error("Main error:", error);
    }
}

main();
```

## Modern JavaScript Features

### Template Literals
```javascript
let name = "World";
let age = 25;

// Multi-line strings
let message = `
    Hello, ${name}!
    You are ${age} years old.
    That's ${age * 365} days!
`;

// Tagged templates
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
    }, '');
}

let highlighted = highlight`Hello ${name}, you are ${age} years old!`;
```

### Destructuring Assignment
```javascript
// Array destructuring
let [a, b, c] = [1, 2, 3];

// Object destructuring
let {x, y, z} = {x: 1, y: 2, z: 3};

// Function parameter destructuring
function printCoordinates({x, y}) {
    console.log(`X: ${x}, Y: ${y}`);
}

// Nested destructuring
let {user: {name, age}} = {user: {name: "John", age: 30}};
```

### Arrow Functions
```javascript
// Single parameter
let square = x => x * x;

// Multiple parameters
let add = (a, b) => a + b;

// Multiple statements
let process = (data) => {
    let result = data.map(x => x * 2);
    return result.filter(x => x > 10);
};

// Object return
let createUser = (name, age) => ({name, age});
```

## Best Practices

### Code Organization
```javascript
// Use meaningful variable names
let userName = "John";           // Good
let u = "John";                  // Bad

// Use constants for values that don't change
const MAX_RETRY_ATTEMPTS = 3;    // Good
let maxRetryAttempts = 3;        // Bad

// Group related code
function initializeApp() {
    setupEventListeners();
    loadUserPreferences();
    startBackgroundTasks();
}
```

### Error Handling
```javascript
// Always handle potential errors
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
```

### Performance
```javascript
// Avoid DOM queries in loops
let elements = document.querySelectorAll('.item');
for (let element of elements) {
    // Work with element
}

// Use event delegation for many elements
document.addEventListener('click', function(event) {
    if (event.target.matches('.button')) {
        handleButtonClick(event.target);
    }
});
```

## Conclusion

JavaScript is a powerful language that enables dynamic, interactive web experiences. Understanding the fundamentals provides the foundation for building modern web applications and learning advanced frameworks and libraries.

## Key Takeaways

- JavaScript runs in browsers and enables dynamic web content
- Functions, arrays, and objects are core data structures
- DOM manipulation allows dynamic page updates
- Asynchronous programming handles time-consuming operations
- Modern features like arrow functions and async/await improve code quality
- Best practices ensure maintainable and performant code

## Next Steps

- Practice building interactive web pages
- Learn about ES6+ features and modern JavaScript
- Explore JavaScript frameworks (React, Vue, Angular)
- Study asynchronous programming patterns
- Build projects that combine HTML, CSS, and JavaScript

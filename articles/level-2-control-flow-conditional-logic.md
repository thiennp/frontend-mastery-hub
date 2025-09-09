# Control Flow & Conditional Logic: Mastering JavaScript Decision Making

## Introduction

Control flow is the foundation of programming logic, allowing your code to make decisions and execute different paths based on conditions. Understanding control flow is essential for writing dynamic, responsive JavaScript applications.

## What is Control Flow?

Control flow determines the order in which statements are executed in a program. It includes:
- **Conditional statements**: Make decisions based on conditions
- **Loops**: Repeat code execution
- **Branching**: Choose different execution paths
- **Exception handling**: Manage errors and edge cases

## Conditional Statements

### If-Else Statements

The most fundamental conditional structure in JavaScript.

#### Basic If Statement
```javascript
let age = 18;

if (age >= 18) {
    console.log("You are an adult");
}
```

#### If-Else Statement
```javascript
let temperature = 25;

if (temperature > 30) {
    console.log("It's hot outside");
} else {
    console.log("It's not too hot");
}
```

#### If-Else If-Else Chain
```javascript
let score = 85;

if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else if (score >= 60) {
    console.log("Grade: D");
} else {
    console.log("Grade: F");
}
```

#### Nested If Statements
```javascript
let user = {
    age: 25,
    hasLicense: true,
    hasInsurance: false
};

if (user.age >= 18) {
    if (user.hasLicense) {
        if (user.hasInsurance) {
            console.log("You can drive safely");
        } else {
            console.log("You need insurance to drive");
        }
    } else {
        console.log("You need a driver's license");
    }
} else {
    console.log("You must be 18 or older to drive");
}
```

### Ternary Operator

A concise way to write simple conditional statements.

#### Basic Ternary
```javascript
let age = 20;
let status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"
```

#### Nested Ternary
```javascript
let score = 85;
let grade = score >= 90 ? "A" : 
           score >= 80 ? "B" : 
           score >= 70 ? "C" : 
           score >= 60 ? "D" : "F";
console.log(grade); // "B"
```

#### Ternary with Function Calls
```javascript
let isLoggedIn = true;
let message = isLoggedIn ? 
    (() => {
        console.log("User is logged in");
        return "Welcome back!";
    })() : 
    "Please log in";
```

### Switch Statements

Useful for multiple conditions based on a single value.

#### Basic Switch
```javascript
let day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of the work week");
        break;
    case "Tuesday":
    case "Wednesday":
    case "Thursday":
        console.log("Mid week");
        break;
    case "Friday":
        console.log("TGIF!");
        break;
    case "Saturday":
    case "Sunday":
        console.log("Weekend!");
        break;
    default:
        console.log("Invalid day");
}
```

#### Switch with Fall-Through
```javascript
let month = 2;
let daysInMonth;

switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        daysInMonth = 31;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        daysInMonth = 30;
        break;
    case 2:
        daysInMonth = 28; // Simplified (ignoring leap year)
        break;
    default:
        daysInMonth = 0;
}
```

#### Switch with Expressions
```javascript
let score = 85;
let grade;

switch (true) {
    case score >= 90:
        grade = "A";
        break;
    case score >= 80:
        grade = "B";
        break;
    case score >= 70:
        grade = "C";
        break;
    case score >= 60:
        grade = "D";
        break;
    default:
        grade = "F";
}
```

## Logical Operators

### AND Operator (&&)
```javascript
// Both conditions must be true
let age = 25;
let hasLicense = true;

if (age >= 18 && hasLicense) {
    console.log("You can drive");
}

// Short-circuit evaluation
let user = null;
let name = user && user.name; // null (doesn't throw error)
```

### OR Operator (||)
```javascript
// At least one condition must be true
let isStudent = false;
let hasDiscount = true;

if (isStudent || hasDiscount) {
    console.log("You get a discount");
}

// Default values
let username = userInput || "Guest";
let port = process.env.PORT || 3000;
```

### NOT Operator (!)
```javascript
// Inverts boolean values
let isLoggedIn = false;

if (!isLoggedIn) {
    console.log("Please log in");
}

// Double negation for boolean conversion
let value = "hello";
let isTruthy = !!value; // true
```

### Combined Logical Operators
```javascript
let user = {
    age: 25,
    hasLicense: true,
    hasInsurance: true,
    isStudent: false
};

// Complex condition
if ((user.age >= 18 && user.hasLicense) && 
    (user.hasInsurance || user.isStudent)) {
    console.log("You can drive");
}
```

## Comparison Operators

### Equality Operators
```javascript
// Strict equality (recommended)
console.log(5 === 5);     // true
console.log(5 === "5");   // false
console.log(5 !== "5");   // true

// Loose equality (avoid)
console.log(5 == 5);      // true
console.log(5 == "5");    // true (type coercion)
console.log(5 != "5");    // false
```

### Relational Operators
```javascript
let a = 10;
let b = 5;

console.log(a > b);   // true
console.log(a < b);   // false
console.log(a >= b);  // true
console.log(a <= b);  // false
```

### Special Cases
```javascript
// NaN comparisons
console.log(NaN === NaN);        // false
console.log(isNaN(NaN));         // true
console.log(Number.isNaN(NaN));  // true

// null and undefined
console.log(null === undefined); // false
console.log(null == undefined);  // true
console.log(null == 0);          // false
console.log(null == "");         // false
```

## Loops

### For Loop
```javascript
// Basic for loop
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}

// Loop with step
for (let i = 0; i < 10; i += 2) {
    console.log(i); // 0, 2, 4, 6, 8
}

// Reverse loop
for (let i = 5; i > 0; i--) {
    console.log(i); // 5, 4, 3, 2, 1
}
```

### While Loop
```javascript
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}

// Infinite loop (be careful!)
// while (true) {
//     console.log("This runs forever");
// }
```

### Do-While Loop
```javascript
let count = 0;
do {
    console.log(count);
    count++;
} while (count < 5);

// Executes at least once
let userInput;
do {
    userInput = prompt("Enter a number between 1 and 10:");
} while (userInput < 1 || userInput > 10);
```

### For...Of Loop
```javascript
// Iterate over arrays
let fruits = ["apple", "banana", "orange"];
for (let fruit of fruits) {
    console.log(fruit);
}

// Iterate over strings
let text = "Hello";
for (let char of text) {
    console.log(char);
}

// Iterate over NodeList
let elements = document.querySelectorAll(".item");
for (let element of elements) {
    element.classList.add("highlighted");
}
```

### For...In Loop
```javascript
// Iterate over object properties
let person = {
    name: "John",
    age: 30,
    city: "New York"
};

for (let key in person) {
    console.log(`${key}: ${person[key]}`);
}

// Be careful with arrays
let arr = [1, 2, 3];
for (let index in arr) {
    console.log(`${index}: ${arr[index]}`);
}
```

## Loop Control Statements

### Break Statement
```javascript
// Exit loop early
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break; // Exit the loop
    }
    console.log(i); // 0, 1, 2, 3, 4
}

// Break in nested loops
outer: for (let i = 0; i < 3; i++) {
    inner: for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outer; // Break out of both loops
        }
        console.log(`i: ${i}, j: ${j}`);
    }
}
```

### Continue Statement
```javascript
// Skip current iteration
for (let i = 0; i < 5; i++) {
    if (i === 2) {
        continue; // Skip this iteration
    }
    console.log(i); // 0, 1, 3, 4
}

// Continue in nested loops
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) {
            continue; // Skip j=1, continue with j=2
        }
        console.log(`i: ${i}, j: ${j}`);
    }
}
```

## Array Iteration Methods

### forEach
```javascript
let numbers = [1, 2, 3, 4, 5];

numbers.forEach((number, index) => {
    console.log(`Index ${index}: ${number}`);
});

// forEach with this context
let obj = {
    multiplier: 2,
    numbers: [1, 2, 3],
    multiply() {
        this.numbers.forEach(function(number) {
            console.log(number * this.multiplier);
        }, this); // Bind this context
    }
};
```

### Map
```javascript
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Map with index
let indexed = numbers.map((num, index) => `${index}: ${num}`);
console.log(indexed); // ["0: 1", "1: 2", "2: 3", "3: 4", "4: 5"]
```

### Filter
```javascript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Filter with complex conditions
let users = [
    {name: "John", age: 25, active: true},
    {name: "Jane", age: 30, active: false},
    {name: "Bob", age: 35, active: true}
];

let activeUsers = users.filter(user => user.active && user.age > 25);
console.log(activeUsers); // [{name: "Bob", age: 35, active: true}]
```

### Reduce
```javascript
let numbers = [1, 2, 3, 4, 5];
let sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 15

// Reduce with objects
let words = ["hello", "world", "javascript"];
let wordCounts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
}, {});
console.log(wordCounts); // {hello: 1, world: 1, javascript: 1}
```

### Find and FindIndex
```javascript
let users = [
    {id: 1, name: "John", age: 25},
    {id: 2, name: "Jane", age: 30},
    {id: 3, name: "Bob", age: 35}
];

let user = users.find(u => u.age > 30);
console.log(user); // {id: 3, name: "Bob", age: 35}

let userIndex = users.findIndex(u => u.name === "Jane");
console.log(userIndex); // 1
```

### Some and Every
```javascript
let numbers = [1, 2, 3, 4, 5];

let hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

let allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

let allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // false
```

## Error Handling in Control Flow

### Try-Catch with Control Flow
```javascript
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero");
        }
        return a / b;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

let result = divide(10, 0);
if (result !== null) {
    console.log("Result:", result);
} else {
    console.log("Could not perform division");
}
```

### Validation with Control Flow
```javascript
function validateUser(user) {
    if (!user) {
        throw new Error("User object is required");
    }
    
    if (!user.name) {
        throw new Error("Name is required");
    }
    
    if (!user.email) {
        throw new Error("Email is required");
    }
    
    if (!user.email.includes("@")) {
        throw new Error("Invalid email format");
    }
    
    return true;
}

try {
    let user = {name: "John", email: "john@example.com"};
    validateUser(user);
    console.log("User is valid");
} catch (error) {
    console.error("Validation failed:", error.message);
}
```

## Performance Considerations

### Loop Performance
```javascript
// Inefficient: DOM queries in loop
for (let i = 0; i < 1000; i++) {
    let element = document.getElementById("item-" + i);
    element.style.color = "red";
}

// Efficient: Cache DOM query
let elements = [];
for (let i = 0; i < 1000; i++) {
    elements.push(document.getElementById("item-" + i));
}
elements.forEach(element => element.style.color = "red");
```

### Early Returns
```javascript
// Avoid deep nesting
function processUser(user) {
    if (!user) {
        return null;
    }
    
    if (!user.name) {
        return null;
    }
    
    if (!user.email) {
        return null;
    }
    
    // Main logic here
    return {
        name: user.name,
        email: user.email,
        processed: true
    };
}
```

## Common Patterns

### Guard Clauses
```javascript
function calculateDiscount(price, user) {
    // Guard clauses
    if (price <= 0) return 0;
    if (!user) return 0;
    if (!user.isMember) return 0;
    
    // Main logic
    let discount = 0;
    if (user.membershipLevel === "gold") {
        discount = price * 0.2;
    } else if (user.membershipLevel === "silver") {
        discount = price * 0.1;
    }
    
    return discount;
}
```

### State Machines
```javascript
let gameState = "menu";

function updateGame() {
    switch (gameState) {
        case "menu":
            if (keyPressed === "start") {
                gameState = "playing";
            }
            break;
        case "playing":
            if (playerHealth <= 0) {
                gameState = "gameOver";
            }
            break;
        case "gameOver":
            if (keyPressed === "restart") {
                gameState = "menu";
            }
            break;
    }
}
```

### Conditional Rendering
```javascript
function renderUserProfile(user) {
    let html = `
        <div class="profile">
            <h2>${user.name}</h2>
            ${user.avatar ? `<img src="${user.avatar}" alt="Avatar">` : ''}
            ${user.bio ? `<p>${user.bio}</p>` : ''}
            ${user.isOnline ? '<span class="online">Online</span>' : '<span class="offline">Offline</span>'}
        </div>
    `;
    return html;
}
```

## Best Practices

### Readability
```javascript
// Good: Clear conditions
if (user.isActive && user.hasPermission) {
    // do something
}

// Bad: Complex conditions
if (user.isActive === true && user.hasPermission === true && user.role !== "guest") {
    // do something
}
```

### Performance
```javascript
// Good: Early returns
function processData(data) {
    if (!data) return null;
    if (data.length === 0) return [];
    
    // Process data
}

// Bad: Deep nesting
function processData(data) {
    if (data) {
        if (data.length > 0) {
            // Process data
        }
    }
}
```

### Maintainability
```javascript
// Good: Constants for magic numbers
const MIN_AGE = 18;
const MAX_AGE = 65;

if (age >= MIN_AGE && age <= MAX_AGE) {
    // do something
}

// Bad: Magic numbers
if (age >= 18 && age <= 65) {
    // do something
}
```

## Conclusion

Mastering control flow and conditional logic is essential for writing effective JavaScript programs. These concepts form the foundation for all programming logic and enable you to create dynamic, responsive applications.

## Key Takeaways

- Use appropriate conditional statements for different scenarios
- Understand the difference between strict and loose equality
- Choose the right loop type for your use case
- Leverage array methods for cleaner, more functional code
- Handle errors gracefully with try-catch blocks
- Write readable, maintainable code with clear conditions
- Consider performance implications of your control flow choices

## Next Steps

- Practice writing complex conditional logic
- Experiment with different loop patterns
- Learn about functional programming approaches
- Study error handling best practices
- Build projects that require sophisticated control flow


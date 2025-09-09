# Data Structures & Collections: Organizing Information in JavaScript

## Introduction

Data structures are fundamental ways of organizing and storing data in computer programs. JavaScript provides several built-in data structures, each optimized for different use cases. Understanding these structures is crucial for writing efficient, maintainable code.

## What are Data Structures?

Data structures are ways of organizing data so that it can be accessed and manipulated efficiently. They determine:
- How data is stored in memory
- What operations can be performed on the data
- The efficiency of those operations
- The relationship between data elements

## Arrays

Arrays are ordered collections of elements, indexed by integers starting from 0.

### Creating Arrays
```javascript
// Array literal
let fruits = ["apple", "banana", "orange"];
let numbers = [1, 2, 3, 4, 5];
let mixed = ["text", 42, true, null];

// Array constructor
let emptyArray = new Array();
let sizedArray = new Array(5); // Creates array with 5 empty slots
let filledArray = new Array(1, 2, 3, 4, 5);

// Array.from()
let arrayFromString = Array.from("hello"); // ["h", "e", "l", "l", "o"]
let arrayFromSet = Array.from(new Set([1, 2, 2, 3])); // [1, 2, 3]
```

### Array Properties and Methods
```javascript
let arr = [1, 2, 3, 4, 5];

// Length property
console.log(arr.length); // 5

// Accessing elements
console.log(arr[0]); // 1 (first element)
console.log(arr[arr.length - 1]); // 5 (last element)

// Modifying elements
arr[0] = 10;
console.log(arr); // [10, 2, 3, 4, 5]
```

### Array Methods

#### Adding and Removing Elements
```javascript
let arr = [1, 2, 3];

// Add to end
arr.push(4); // [1, 2, 3, 4]
arr.push(5, 6); // [1, 2, 3, 4, 5, 6]

// Remove from end
let last = arr.pop(); // 6, arr = [1, 2, 3, 4, 5]

// Add to beginning
arr.unshift(0); // [0, 1, 2, 3, 4, 5]

// Remove from beginning
let first = arr.shift(); // 0, arr = [1, 2, 3, 4, 5]

// Insert/remove at specific index
arr.splice(2, 0, 2.5); // [1, 2, 2.5, 3, 4, 5] (insert)
arr.splice(2, 1); // [1, 2, 3, 4, 5] (remove)
arr.splice(2, 1, 2.5); // [1, 2, 2.5, 4, 5] (replace)
```

#### Searching and Finding
```javascript
let arr = [1, 2, 3, 4, 5, 3];

// Find index
console.log(arr.indexOf(3)); // 2
console.log(arr.lastIndexOf(3)); // 5
console.log(arr.indexOf(6)); // -1 (not found)

// Check if element exists
console.log(arr.includes(3)); // true
console.log(arr.includes(6)); // false

// Find element
let found = arr.find(x => x > 3); // 4
let foundIndex = arr.findIndex(x => x > 3); // 3
```

#### Iteration Methods
```javascript
let numbers = [1, 2, 3, 4, 5];

// forEach - execute function for each element
numbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});

// map - transform each element
let doubled = numbers.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - select elements that meet condition
let evens = numbers.filter(x => x % 2 === 0); // [2, 4]

// reduce - reduce array to single value
let sum = numbers.reduce((acc, curr) => acc + curr, 0); // 15

// some - check if any element meets condition
let hasEven = numbers.some(x => x % 2 === 0); // true

// every - check if all elements meet condition
let allPositive = numbers.every(x => x > 0); // true
```

#### Sorting and Reversing
```javascript
let numbers = [3, 1, 4, 1, 5, 9, 2, 6];

// Sort (modifies original array)
numbers.sort(); // [1, 1, 2, 3, 4, 5, 6, 9] (lexicographic)
numbers.sort((a, b) => a - b); // [1, 1, 2, 3, 4, 5, 6, 9] (numeric)

// Reverse (modifies original array)
numbers.reverse(); // [9, 6, 5, 4, 3, 2, 1, 1]

// Create new sorted array
let sorted = [...numbers].sort((a, b) => a - b);
```

### Array Destructuring
```javascript
let arr = [1, 2, 3, 4, 5];

// Basic destructuring
let [first, second, third] = arr;
console.log(first, second, third); // 1, 2, 3

// Skip elements
let [a, , c] = arr; // Skip second element
console.log(a, c); // 1, 3

// Rest operator
let [x, y, ...rest] = arr;
console.log(x, y, rest); // 1, 2, [3, 4, 5]

// Default values
let [p, q, r = 10] = [1, 2]; // r defaults to 10
console.log(p, q, r); // 1, 2, 10

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```

### Spread Operator with Arrays
```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

// Combine arrays
let combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copy array
let copy = [...arr1]; // [1, 2, 3]

// Add elements
let extended = [0, ...arr1, 4]; // [0, 1, 2, 3, 4]

// Function arguments
function sum(a, b, c) {
    return a + b + c;
}
let numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6
```

## Objects

Objects are collections of key-value pairs, where keys are strings (or Symbols) and values can be any type.

### Creating Objects
```javascript
// Object literal
let person = {
    name: "John",
    age: 30,
    city: "New York"
};

// Object constructor
let person2 = new Object();
person2.name = "Jane";
person2.age = 25;

// Object.create()
let person3 = Object.create(null);
person3.name = "Bob";

// Factory function
function createPerson(name, age) {
    return {
        name,
        age,
        greet() {
            return `Hello, I'm ${this.name}`;
        }
    };
}
```

### Object Properties
```javascript
let person = {
    name: "John",
    age: 30,
    "full name": "John Doe" // Computed property names
};

// Accessing properties
console.log(person.name); // "John"
console.log(person["full name"]); // "John Doe"
console.log(person[age]); // 30

// Adding properties
person.city = "New York";
person["phone number"] = "123-456-7890";

// Deleting properties
delete person.age;

// Checking if property exists
console.log("name" in person); // true
console.log(person.hasOwnProperty("name")); // true
console.log(person.name !== undefined); // true
```

### Object Methods
```javascript
let person = {
    name: "John",
    age: 30,
    greet() {
        return `Hello, I'm ${this.name}`;
    },
    greetArrow: () => {
        return `Hello, I'm ${person.name}`; // No 'this' binding
    }
};

// Method calls
console.log(person.greet()); // "Hello, I'm John"
console.log(person.greetArrow()); // "Hello, I'm John"
```

### Object Destructuring
```javascript
let person = {
    name: "John",
    age: 30,
    city: "New York",
    country: "USA"
};

// Basic destructuring
let {name, age} = person;
console.log(name, age); // "John", 30

// Rename variables
let {name: fullName, age: years} = person;
console.log(fullName, years); // "John", 30

// Default values
let {name, age, occupation = "Developer"} = person;
console.log(occupation); // "Developer"

// Rest operator
let {name, ...rest} = person;
console.log(rest); // {age: 30, city: "New York", country: "USA"}

// Nested destructuring
let user = {
    id: 1,
    profile: {
        name: "John",
        age: 30
    }
};
let {profile: {name: userName}} = user;
console.log(userName); // "John"
```

### Object Methods and Utilities
```javascript
let person = {name: "John", age: 30, city: "New York"};

// Object.keys()
let keys = Object.keys(person); // ["name", "age", "city"]

// Object.values()
let values = Object.values(person); // ["John", 30, "New York"]

// Object.entries()
let entries = Object.entries(person); // [["name", "John"], ["age", 30], ["city", "New York"]]

// Object.assign()
let newPerson = Object.assign({}, person, {age: 31}); // {name: "John", age: 31, city: "New York"}

// Object.freeze()
Object.freeze(person);
person.age = 31; // Won't work in strict mode
console.log(person.age); // 30

// Object.seal()
Object.seal(person);
person.age = 31; // Works
person.newProp = "value"; // Won't work
```

### Spread Operator with Objects
```javascript
let person = {name: "John", age: 30};
let address = {city: "New York", country: "USA"};

// Combine objects
let fullPerson = {...person, ...address}; // {name: "John", age: 30, city: "New York", country: "USA"}

// Override properties
let updatedPerson = {...person, age: 31}; // {name: "John", age: 31}

// Add properties
let extendedPerson = {...person, city: "New York"}; // {name: "John", age: 30, city: "New York"}
```

## Maps

Maps are collections of key-value pairs where keys can be any type (not just strings).

### Creating Maps
```javascript
// Empty map
let map = new Map();

// Map with initial values
let map2 = new Map([
    ["name", "John"],
    ["age", 30],
    [1, "one"],
    [true, "boolean key"]
]);
```

### Map Methods
```javascript
let map = new Map();

// Adding key-value pairs
map.set("name", "John");
map.set("age", 30);
map.set(1, "one");
map.set({id: 1}, "object key");

// Getting values
console.log(map.get("name")); // "John"
console.log(map.get("nonexistent")); // undefined

// Checking if key exists
console.log(map.has("name")); // true
console.log(map.has("nonexistent")); // false

// Deleting entries
map.delete("age");

// Getting size
console.log(map.size); // 3

// Clearing all entries
map.clear();
console.log(map.size); // 0
```

### Map Iteration
```javascript
let map = new Map([
    ["name", "John"],
    ["age", 30],
    ["city", "New York"]
]);

// for...of loop
for (let [key, value] of map) {
    console.log(`${key}: ${value}`);
}

// forEach method
map.forEach((value, key) => {
    console.log(`${key}: ${value}`);
});

// Iterate keys only
for (let key of map.keys()) {
    console.log(key);
}

// Iterate values only
for (let value of map.values()) {
    console.log(value);
}

// Convert to array
let entries = Array.from(map.entries());
let keys = Array.from(map.keys());
let values = Array.from(map.values());
```

### Map vs Object
```javascript
// When to use Map:
// - Keys are not strings
// - Need to know the size
// - Frequent additions/deletions
// - Keys are unknown at compile time

let map = new Map();
map.set(1, "one");
map.set(true, "boolean");
map.set({id: 1}, "object");

// When to use Object:
// - Keys are strings
// - Need JSON serialization
// - Need prototype methods
// - Working with existing object APIs

let obj = {
    name: "John",
    age: 30
};
```

## Sets

Sets are collections of unique values (no duplicates).

### Creating Sets
```javascript
// Empty set
let set = new Set();

// Set with initial values
let set2 = new Set([1, 2, 3, 4, 5]);
let set3 = new Set("hello"); // {"h", "e", "l", "o"}
```

### Set Methods
```javascript
let set = new Set();

// Adding values
set.add(1);
set.add(2);
set.add(2); // Duplicate, won't be added
set.add("hello");
set.add({id: 1});

// Checking if value exists
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// Deleting values
set.delete(1);

// Getting size
console.log(set.size); // 3

// Clearing all values
set.clear();
console.log(set.size); // 0
```

### Set Iteration
```javascript
let set = new Set([1, 2, 3, 4, 5]);

// for...of loop
for (let value of set) {
    console.log(value);
}

// forEach method
set.forEach(value => {
    console.log(value);
});

// Convert to array
let array = Array.from(set); // [1, 2, 3, 4, 5]
let array2 = [...set]; // [1, 2, 3, 4, 5]
```

### Set Operations
```javascript
let set1 = new Set([1, 2, 3, 4]);
let set2 = new Set([3, 4, 5, 6]);

// Union
let union = new Set([...set1, ...set2]); // {1, 2, 3, 4, 5, 6}

// Intersection
let intersection = new Set([...set1].filter(x => set2.has(x))); // {3, 4}

// Difference
let difference = new Set([...set1].filter(x => !set2.has(x))); // {1, 2}

// Symmetric difference
let symmetricDiff = new Set([...union].filter(x => !intersection.has(x))); // {1, 2, 5, 6}
```

## WeakMap and WeakSet

WeakMap and WeakSet are similar to Map and Set but with weak references, allowing garbage collection.

### WeakMap
```javascript
let weakMap = new WeakMap();
let obj1 = {id: 1};
let obj2 = {id: 2};

// Adding key-value pairs
weakMap.set(obj1, "value1");
weakMap.set(obj2, "value2");

// Getting values
console.log(weakMap.get(obj1)); // "value1"

// Checking if key exists
console.log(weakMap.has(obj1)); // true

// Deleting entries
weakMap.delete(obj1);

// Note: WeakMap keys must be objects
// weakMap.set("string", "value"); // Error!
```

### WeakSet
```javascript
let weakSet = new WeakSet();
let obj1 = {id: 1};
let obj2 = {id: 2};

// Adding values
weakSet.add(obj1);
weakSet.add(obj2);

// Checking if value exists
console.log(weakSet.has(obj1)); // true

// Deleting values
weakSet.delete(obj1);

// Note: WeakSet values must be objects
// weakSet.add("string"); // Error!
```

## Advanced Data Structures

### Stacks (LIFO)
```javascript
class Stack {
    constructor() {
        this.items = [];
    }
    
    push(item) {
        this.items.push(item);
    }
    
    pop() {
        return this.items.pop();
    }
    
    peek() {
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Usage
let stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop()); // 3
console.log(stack.peek()); // 2
```

### Queues (FIFO)
```javascript
class Queue {
    constructor() {
        this.items = [];
    }
    
    enqueue(item) {
        this.items.push(item);
    }
    
    dequeue() {
        return this.items.shift();
    }
    
    front() {
        return this.items[0];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
    
    size() {
        return this.items.length;
    }
}

// Usage
let queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.dequeue()); // 1
console.log(queue.front()); // 2
```

### Linked Lists
```javascript
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    add(data) {
        let node = new Node(data);
        if (!this.head) {
            this.head = node;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.size++;
    }
    
    remove(data) {
        if (!this.head) return false;
        
        if (this.head.data === data) {
            this.head = this.head.next;
            this.size--;
            return true;
        }
        
        let current = this.head;
        while (current.next) {
            if (current.next.data === data) {
                current.next = current.next.next;
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false;
    }
    
    find(data) {
        let current = this.head;
        while (current) {
            if (current.data === data) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
}
```

## Performance Considerations

### Array Performance
```javascript
// O(1) operations
arr.push(item);        // Add to end
arr.pop();            // Remove from end
arr[index];           // Access by index

// O(n) operations
arr.unshift(item);    // Add to beginning
arr.shift();          // Remove from beginning
arr.splice(index, 1); // Remove at index
arr.indexOf(item);    // Search for item
```

### Object Performance
```javascript
// O(1) operations
obj.property;         // Access property
obj.property = value; // Set property
delete obj.property;  // Delete property

// O(n) operations
Object.keys(obj);     // Get all keys
Object.values(obj);   // Get all values
Object.entries(obj);  // Get all entries
```

### Map vs Object Performance
```javascript
// Map is generally faster for:
// - Frequent additions/deletions
// - Large numbers of key-value pairs
// - Keys that are not strings

// Object is generally faster for:
// - Small numbers of properties
// - String keys
// - Property access patterns
```

## Best Practices

### Choose the Right Data Structure
```javascript
// Use Arrays for:
// - Ordered collections
// - Index-based access
// - Mathematical operations

// Use Objects for:
// - Key-value pairs with string keys
// - JSON serialization
// - Prototype methods

// Use Maps for:
// - Non-string keys
// - Frequent additions/deletions
// - Unknown key types

// Use Sets for:
// - Unique values
// - Set operations
// - Fast lookups
```

### Memory Management
```javascript
// Clear references when done
let largeArray = new Array(1000000).fill(0);
// ... use array
largeArray = null; // Allow garbage collection

// Use WeakMap/WeakSet for temporary associations
let cache = new WeakMap();
let obj = {id: 1};
cache.set(obj, expensiveData);
// obj can be garbage collected even if cache still exists
```

### Immutability
```javascript
// Create new arrays instead of modifying
let original = [1, 2, 3];
let modified = [...original, 4]; // [1, 2, 3, 4]

// Create new objects instead of modifying
let original = {name: "John", age: 30};
let modified = {...original, age: 31}; // {name: "John", age: 31}

// Use Object.freeze() for immutability
let immutable = Object.freeze({name: "John", age: 30});
```

## Conclusion

Understanding data structures is crucial for writing efficient JavaScript code. Each structure has its strengths and weaknesses, and choosing the right one for your use case can significantly impact performance and maintainability.

## Key Takeaways

- Arrays are best for ordered collections with index-based access
- Objects are ideal for key-value pairs with string keys
- Maps provide better performance for frequent additions/deletions
- Sets are perfect for unique value collections
- WeakMap and WeakSet allow garbage collection of keys/values
- Choose data structures based on your access patterns and performance needs
- Consider immutability and memory management in your design

## Next Steps

- Practice implementing custom data structures
- Learn about time and space complexity
- Study algorithms that work with different data structures
- Experiment with performance testing
- Build projects that require complex data manipulation


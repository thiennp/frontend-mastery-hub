# Object-Oriented Programming: Building Reusable Code with Classes and Objects

## Introduction

Object-Oriented Programming (OOP) is a programming paradigm that organizes code around objects and classes. It promotes code reusability, maintainability, and helps model real-world concepts in software. JavaScript supports OOP through classes, prototypes, and various design patterns.

## What is Object-Oriented Programming?

OOP is based on four fundamental principles:
- **Encapsulation**: Bundling data and methods together
- **Inheritance**: Creating new classes based on existing ones
- **Polymorphism**: Using the same interface for different types
- **Abstraction**: Hiding complex implementation details

## Classes in JavaScript

### Class Declaration
```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
    
    getAge() {
        return this.age;
    }
}

// Creating instances
let person1 = new Person("John", 30);
let person2 = new Person("Jane", 25);

console.log(person1.greet()); // "Hello, I'm John"
console.log(person2.getAge()); // 25
```

### Class Expression
```javascript
// Named class expression
let Person = class PersonClass {
    constructor(name) {
        this.name = name;
    }
};

// Anonymous class expression
let Person = class {
    constructor(name) {
        this.name = name;
    }
};
```

### Constructor
```javascript
class Person {
    constructor(name, age, email) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.createdAt = new Date();
    }
    
    // Constructor with validation
    static createValidatedPerson(name, age, email) {
        if (!name || typeof name !== 'string') {
            throw new Error('Name must be a non-empty string');
        }
        if (age < 0 || age > 150) {
            throw new Error('Age must be between 0 and 150');
        }
        if (email && !email.includes('@')) {
            throw new Error('Invalid email format');
        }
        return new Person(name, age, email);
    }
}
```

### Methods

#### Instance Methods
```javascript
class BankAccount {
    constructor(accountNumber, initialBalance = 0) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.transactions = [];
    }
    
    deposit(amount) {
        if (amount <= 0) {
            throw new Error('Deposit amount must be positive');
        }
        this.balance += amount;
        this.transactions.push({
            type: 'deposit',
            amount: amount,
            date: new Date()
        });
        return this.balance;
    }
    
    withdraw(amount) {
        if (amount <= 0) {
            throw new Error('Withdrawal amount must be positive');
        }
        if (amount > this.balance) {
            throw new Error('Insufficient funds');
        }
        this.balance -= amount;
        this.transactions.push({
            type: 'withdrawal',
            amount: amount,
            date: new Date()
        });
        return this.balance;
    }
    
    getBalance() {
        return this.balance;
    }
    
    getTransactionHistory() {
        return [...this.transactions]; // Return copy to prevent external modification
    }
}
```

#### Static Methods
```javascript
class MathUtils {
    static add(a, b) {
        return a + b;
    }
    
    static multiply(a, b) {
        return a * b;
    }
    
    static isEven(number) {
        return number % 2 === 0;
    }
    
    static generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Usage
console.log(MathUtils.add(5, 3)); // 8
console.log(MathUtils.isEven(4)); // true
console.log(MathUtils.generateRandomNumber(1, 10)); // Random number between 1-10
```

#### Getter and Setter Methods
```javascript
class Rectangle {
    constructor(width, height) {
        this._width = width;
        this._height = height;
    }
    
    // Getter
    get area() {
        return this._width * this._height;
    }
    
    get perimeter() {
        return 2 * (this._width + this._height);
    }
    
    get width() {
        return this._width;
    }
    
    get height() {
        return this._height;
    }
    
    // Setter
    set width(value) {
        if (value <= 0) {
            throw new Error('Width must be positive');
        }
        this._width = value;
    }
    
    set height(value) {
        if (value <= 0) {
            throw new Error('Height must be positive');
        }
        this._height = value;
    }
}

// Usage
let rect = new Rectangle(5, 3);
console.log(rect.area); // 15
console.log(rect.perimeter); // 16

rect.width = 10; // Uses setter
console.log(rect.area); // 30
```

## Inheritance

### Basic Inheritance
```javascript
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    speak() {
        return `${this.name} makes a sound`;
    }
    
    move() {
        return `${this.name} moves`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name, 'Canine'); // Call parent constructor
        this.breed = breed;
    }
    
    speak() {
        return `${this.name} barks`;
    }
    
    fetch() {
        return `${this.name} fetches the ball`;
    }
}

// Usage
let dog = new Dog("Buddy", "Golden Retriever");
console.log(dog.speak()); // "Buddy barks"
console.log(dog.move()); // "Buddy moves"
console.log(dog.fetch()); // "Buddy fetches the ball"
```

### Method Overriding
```javascript
class Shape {
    constructor(name) {
        this.name = name;
    }
    
    area() {
        return 0;
    }
    
    perimeter() {
        return 0;
    }
    
    describe() {
        return `This is a ${this.name}`;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super('Circle');
        this.radius = radius;
    }
    
    area() {
        return Math.PI * this.radius * this.radius;
    }
    
    perimeter() {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super('Rectangle');
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
    
    perimeter() {
        return 2 * (this.width + this.height);
    }
}

// Usage
let circle = new Circle(5);
let rectangle = new Rectangle(4, 6);

console.log(circle.area()); // 78.54...
console.log(rectangle.area()); // 24
```

### Super Keyword
```javascript
class Vehicle {
    constructor(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.isRunning = false;
    }
    
    start() {
        this.isRunning = true;
        return `${this.brand} ${this.model} started`;
    }
    
    stop() {
        this.isRunning = false;
        return `${this.brand} ${this.model} stopped`;
    }
    
    getInfo() {
        return `${this.year} ${this.brand} ${this.model}`;
    }
}

class Car extends Vehicle {
    constructor(brand, model, year, doors) {
        super(brand, model, year); // Call parent constructor
        this.doors = doors;
    }
    
    start() {
        // Call parent method and add additional behavior
        let result = super.start();
        return result + " with engine running";
    }
    
    getInfo() {
        // Call parent method and extend it
        let baseInfo = super.getInfo();
        return `${baseInfo} with ${this.doors} doors`;
    }
}

// Usage
let car = new Car("Toyota", "Camry", 2023, 4);
console.log(car.start()); // "Toyota Camry started with engine running"
console.log(car.getInfo()); // "2023 Toyota Camry with 4 doors"
```

## Encapsulation

### Private Fields (ES2022)
```javascript
class BankAccount {
    #balance; // Private field
    #accountNumber; // Private field
    
    constructor(accountNumber, initialBalance = 0) {
        this.#accountNumber = accountNumber;
        this.#balance = initialBalance;
    }
    
    deposit(amount) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        this.#balance += amount;
    }
    
    withdraw(amount) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        if (amount > this.#balance) {
            throw new Error('Insufficient funds');
        }
        this.#balance -= amount;
    }
    
    getBalance() {
        return this.#balance;
    }
    
    getAccountNumber() {
        return this.#accountNumber;
    }
}

// Usage
let account = new BankAccount("123456", 1000);
console.log(account.getBalance()); // 1000
// console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

### Private Methods
```javascript
class User {
    #password;
    
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.#password = password;
    }
    
    // Private method
    #validatePassword(password) {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    }
    
    changePassword(oldPassword, newPassword) {
        if (oldPassword !== this.#password) {
            throw new Error('Current password is incorrect');
        }
        
        if (!this.#validatePassword(newPassword)) {
            throw new Error('New password must be at least 8 characters with uppercase letter and number');
        }
        
        this.#password = newPassword;
        return 'Password changed successfully';
    }
    
    authenticate(password) {
        return password === this.#password;
    }
}
```

### Closures for Encapsulation (Pre-ES2022)
```javascript
function createBankAccount(accountNumber, initialBalance = 0) {
    let balance = initialBalance; // Private variable
    
    return {
        deposit(amount) {
            if (amount <= 0) {
                throw new Error('Amount must be positive');
            }
            balance += amount;
        },
        
        withdraw(amount) {
            if (amount <= 0) {
                throw new Error('Amount must be positive');
            }
            if (amount > balance) {
                throw new Error('Insufficient funds');
            }
            balance -= amount;
        },
        
        getBalance() {
            return balance;
        },
        
        getAccountNumber() {
            return accountNumber;
        }
    };
}

// Usage
let account = createBankAccount("123456", 1000);
console.log(account.getBalance()); // 1000
// console.log(account.balance); // undefined
```

## Polymorphism

### Method Overriding
```javascript
class Animal {
    makeSound() {
        return "Some generic animal sound";
    }
}

class Dog extends Animal {
    makeSound() {
        return "Woof!";
    }
}

class Cat extends Animal {
    makeSound() {
        return "Meow!";
    }
}

class Bird extends Animal {
    makeSound() {
        return "Tweet!";
    }
}

// Polymorphic behavior
let animals = [
    new Dog(),
    new Cat(),
    new Bird()
];

animals.forEach(animal => {
    console.log(animal.makeSound()); // Each animal makes its own sound
});
```

### Interface-like Pattern
```javascript
class Shape {
    area() {
        throw new Error('area() method must be implemented');
    }
    
    perimeter() {
        throw new Error('perimeter() method must be implemented');
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    area() {
        return Math.PI * this.radius * this.radius;
    }
    
    perimeter() {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
    
    perimeter() {
        return 2 * (this.width + this.height);
    }
}

// Polymorphic function
function calculateTotalArea(shapes) {
    return shapes.reduce((total, shape) => total + shape.area(), 0);
}

// Usage
let shapes = [
    new Circle(5),
    new Rectangle(4, 6),
    new Circle(3)
];

console.log(calculateTotalArea(shapes)); // Works with any shape that implements area()
```

## Abstraction

### Abstract Classes
```javascript
class DatabaseConnection {
    constructor(connectionString) {
        if (this.constructor === DatabaseConnection) {
            throw new Error('DatabaseConnection is an abstract class');
        }
        this.connectionString = connectionString;
        this.isConnected = false;
    }
    
    connect() {
        throw new Error('connect() method must be implemented');
    }
    
    disconnect() {
        throw new Error('disconnect() method must be implemented');
    }
    
    query(sql) {
        throw new Error('query() method must be implemented');
    }
}

class MySQLConnection extends DatabaseConnection {
    connect() {
        // MySQL-specific connection logic
        this.isConnected = true;
        return 'Connected to MySQL database';
    }
    
    disconnect() {
        this.isConnected = false;
        return 'Disconnected from MySQL database';
    }
    
    query(sql) {
        if (!this.isConnected) {
            throw new Error('Not connected to database');
        }
        // MySQL-specific query execution
        return `Executing MySQL query: ${sql}`;
    }
}

class PostgreSQLConnection extends DatabaseConnection {
    connect() {
        // PostgreSQL-specific connection logic
        this.isConnected = true;
        return 'Connected to PostgreSQL database';
    }
    
    disconnect() {
        this.isConnected = false;
        return 'Disconnected from PostgreSQL database';
    }
    
    query(sql) {
        if (!this.isConnected) {
            throw new Error('Not connected to database');
        }
        // PostgreSQL-specific query execution
        return `Executing PostgreSQL query: ${sql}`;
    }
}
```

## Design Patterns

### Singleton Pattern
```javascript
class DatabaseManager {
    static instance = null;
    
    constructor() {
        if (DatabaseManager.instance) {
            return DatabaseManager.instance;
        }
        
        this.connection = null;
        this.isConnected = false;
        DatabaseManager.instance = this;
    }
    
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    
    connect(connectionString) {
        this.connection = connectionString;
        this.isConnected = true;
        return 'Connected to database';
    }
    
    disconnect() {
        this.connection = null;
        this.isConnected = false;
        return 'Disconnected from database';
    }
}

// Usage
let db1 = DatabaseManager.getInstance();
let db2 = DatabaseManager.getInstance();

console.log(db1 === db2); // true (same instance)
```

### Factory Pattern
```javascript
class VehicleFactory {
    static createVehicle(type, ...args) {
        switch (type) {
            case 'car':
                return new Car(...args);
            case 'truck':
                return new Truck(...args);
            case 'motorcycle':
                return new Motorcycle(...args);
            default:
                throw new Error(`Unknown vehicle type: ${type}`);
        }
    }
}

class Car {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
        this.type = 'car';
    }
}

class Truck {
    constructor(brand, model, payload) {
        this.brand = brand;
        this.model = model;
        this.payload = payload;
        this.type = 'truck';
    }
}

class Motorcycle {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
        this.type = 'motorcycle';
    }
}

// Usage
let car = VehicleFactory.createVehicle('car', 'Toyota', 'Camry');
let truck = VehicleFactory.createVehicle('truck', 'Ford', 'F-150', 1000);
```

### Observer Pattern
```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

class User extends EventEmitter {
    constructor(name, email) {
        super();
        this.name = name;
        this.email = email;
        this.isLoggedIn = false;
    }
    
    login() {
        this.isLoggedIn = true;
        this.emit('login', { user: this.name, timestamp: new Date() });
    }
    
    logout() {
        this.isLoggedIn = false;
        this.emit('logout', { user: this.name, timestamp: new Date() });
    }
}

// Usage
let user = new User('John', 'john@example.com');

user.on('login', (data) => {
    console.log(`User ${data.user} logged in at ${data.timestamp}`);
});

user.on('logout', (data) => {
    console.log(`User ${data.user} logged out at ${data.timestamp}`);
});

user.login();
user.logout();
```

## Mixins

### Multiple Inheritance Simulation
```javascript
// Mixin for logging
let LoggingMixin = {
    log(message) {
        console.log(`[${this.constructor.name}] ${message}`);
    },
    
    error(message) {
        console.error(`[${this.constructor.name}] ERROR: ${message}`);
    }
};

// Mixin for validation
let ValidationMixin = {
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    validateAge(age) {
        return age >= 0 && age <= 150;
    }
};

// Mixin for serialization
let SerializationMixin = {
    toJSON() {
        return JSON.stringify(this, null, 2);
    },
    
    fromJSON(json) {
        let data = JSON.parse(json);
        Object.assign(this, data);
        return this;
    }
};

// Class using mixins
class User {
    constructor(name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
}

// Apply mixins
Object.assign(User.prototype, LoggingMixin, ValidationMixin, SerializationMixin);

// Usage
let user = new User('John', 'john@example.com', 30);
user.log('User created');
console.log(user.validateEmail(user.email)); // true
console.log(user.toJSON());
```

## Best Practices

### Class Design
```javascript
// Good: Single responsibility
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    getName() {
        return this.name;
    }
    
    getEmail() {
        return this.email;
    }
}

// Bad: Multiple responsibilities
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    getName() {
        return this.name;
    }
    
    sendEmail() {
        // Email sending logic doesn't belong here
    }
    
    saveToDatabase() {
        // Database logic doesn't belong here
    }
}
```

### Encapsulation
```javascript
// Good: Proper encapsulation
class BankAccount {
    #balance;
    
    constructor(initialBalance = 0) {
        this.#balance = initialBalance;
    }
    
    deposit(amount) {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }
        this.#balance += amount;
    }
    
    getBalance() {
        return this.#balance;
    }
}

// Bad: Exposed internal state
class BankAccount {
    constructor(initialBalance = 0) {
        this.balance = initialBalance; // Can be modified directly
    }
    
    deposit(amount) {
        this.balance += amount; // No validation
    }
}
```

### Inheritance vs Composition
```javascript
// Good: Composition over inheritance
class Engine {
    start() {
        return 'Engine started';
    }
}

class Wheels {
    rotate() {
        return 'Wheels rotating';
    }
}

class Car {
    constructor() {
        this.engine = new Engine();
        this.wheels = new Wheels();
    }
    
    start() {
        return this.engine.start();
    }
    
    drive() {
        return this.wheels.rotate();
    }
}

// Bad: Deep inheritance hierarchy
class Vehicle {
    // ... vehicle code
}

class MotorizedVehicle extends Vehicle {
    // ... motorized vehicle code
}

class Car extends MotorizedVehicle {
    // ... car code
}

class SportsCar extends Car {
    // ... sports car code
}
```

## Conclusion

Object-Oriented Programming in JavaScript provides powerful tools for organizing code, creating reusable components, and modeling complex systems. Understanding classes, inheritance, encapsulation, and design patterns is essential for building maintainable applications.

## Key Takeaways

- Classes provide a blueprint for creating objects with shared behavior
- Inheritance allows code reuse and specialization
- Encapsulation protects internal state and provides controlled access
- Polymorphism enables flexible, extensible code
- Design patterns solve common programming problems
- Choose composition over inheritance when possible
- Use private fields and methods for proper encapsulation
- Follow single responsibility principle in class design

## Next Steps

- Practice implementing different design patterns
- Learn about advanced OOP concepts like interfaces and abstract classes
- Study functional programming approaches
- Build projects that demonstrate OOP principles
- Explore modern JavaScript features like decorators and mixins


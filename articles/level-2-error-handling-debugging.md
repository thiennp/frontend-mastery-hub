# Error Handling & Debugging: Building Robust JavaScript Applications

## Introduction

Error handling and debugging are essential skills for JavaScript developers. Proper error handling makes applications more robust and user-friendly, while effective debugging techniques help identify and fix issues quickly. This guide covers comprehensive strategies for handling errors and debugging JavaScript code.

## Understanding JavaScript Errors

### Types of Errors
```javascript
// Syntax Errors - caught at parse time
// let x = ; // SyntaxError: Unexpected token ';'

// Reference Errors - accessing undefined variables
// console.log(undefinedVariable); // ReferenceError: undefinedVariable is not defined

// Type Errors - wrong data type operations
let num = 42;
// num.toUpperCase(); // TypeError: num.toUpperCase is not a function

// Range Errors - values outside valid range
// let arr = new Array(-1); // RangeError: Invalid array length

// URI Errors - malformed URI
// decodeURIComponent('%'); // URIError: URI malformed

// Eval Errors - problems with eval()
// eval('console.log('); // SyntaxError in eval
```

### Error Object Properties
```javascript
try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log(error.name);        // "Error"
    console.log(error.message);     // "Something went wrong"
    console.log(error.stack);       // Stack trace
    console.log(error.toString());  // "Error: Something went wrong"
}
```

## Try-Catch-Finally Blocks

### Basic Error Handling
```javascript
function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error("Division by zero is not allowed");
        }
        return a / b;
    } catch (error) {
        console.error("Error in divide function:", error.message);
        return null;
    } finally {
        console.log("Division operation completed");
    }
}

console.log(divide(10, 2));  // 5
console.log(divide(10, 0));  // null
```

### Nested Try-Catch
```javascript
function processUserData(userData) {
    try {
        // Outer try block
        if (!userData) {
            throw new Error("User data is required");
        }
        
        try {
            // Inner try block
            if (!userData.name) {
                throw new Error("Name is required");
            }
            
            if (!userData.email) {
                throw new Error("Email is required");
            }
            
            // Process user data
            return {
                name: userData.name.toUpperCase(),
                email: userData.email.toLowerCase(),
                processed: true
            };
            
        } catch (innerError) {
            console.error("Validation error:", innerError.message);
            throw new Error(`User validation failed: ${innerError.message}`);
        }
        
    } catch (outerError) {
        console.error("Processing error:", outerError.message);
        return {
            error: outerError.message,
            processed: false
        };
    }
}
```

### Finally Block Usage
```javascript
function readFile(filename) {
    let fileHandle = null;
    
    try {
        // Simulate file opening
        fileHandle = { name: filename, open: true };
        console.log(`File ${filename} opened`);
        
        // Simulate file reading
        if (filename === "nonexistent.txt") {
            throw new Error("File not found");
        }
        
        return "File content";
        
    } catch (error) {
        console.error("Error reading file:", error.message);
        throw error;
    } finally {
        // Always close file handle
        if (fileHandle) {
            fileHandle.open = false;
            console.log(`File ${filename} closed`);
        }
    }
}
```

## Custom Error Classes

### Basic Custom Error
```javascript
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

class DatabaseError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "DatabaseError";
        this.code = code;
    }
}

// Usage
function validateUser(user) {
    if (!user.name) {
        throw new ValidationError("Name is required", "name");
    }
    
    if (!user.email) {
        throw new ValidationError("Email is required", "email");
    }
    
    if (!user.email.includes("@")) {
        throw new ValidationError("Invalid email format", "email");
    }
    
    return true;
}

try {
    validateUser({ name: "John" });
} catch (error) {
    if (error instanceof ValidationError) {
        console.error(`Validation failed for field '${error.field}': ${error.message}`);
    } else {
        console.error("Unexpected error:", error.message);
    }
}
```

### Advanced Error Classes
```javascript
class APIError extends Error {
    constructor(message, statusCode, response) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.response = response;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            response: this.response
        };
    }
}

class NetworkError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = "NetworkError";
        this.originalError = originalError;
        this.timestamp = new Date().toISOString();
    }
}

// Usage
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new APIError(
                `Failed to fetch user data`,
                response.status,
                await response.text()
            );
        }
        
        return await response.json();
        
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        } else {
            throw new NetworkError("Network request failed", error);
        }
    }
}
```

## Error Handling Patterns

### Error Boundaries (React-like)
```javascript
class ErrorBoundary {
    constructor() {
        this.error = null;
        this.errorInfo = null;
    }
    
    componentDidCatch(error, errorInfo) {
        this.error = error;
        this.errorInfo = errorInfo;
        console.error("Error caught by boundary:", error, errorInfo);
    }
    
    render() {
        if (this.error) {
            return {
                type: "error",
                message: "Something went wrong",
                error: this.error.message
            };
        }
        return null;
    }
}

// Usage
const errorBoundary = new ErrorBoundary();
try {
    // Risky operation
    riskyOperation();
} catch (error) {
    errorBoundary.componentDidCatch(error, { componentStack: "App" });
}
```

### Retry Pattern
```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }
    
    throw new Error(`Operation failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

// Usage
async function fetchData() {
    const response = await fetch("/api/data");
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

retryOperation(fetchData, 3, 1000)
    .then(data => console.log("Data fetched:", data))
    .catch(error => console.error("Failed to fetch data:", error.message));
```

### Circuit Breaker Pattern
```javascript
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000) {
        this.threshold = threshold;
        this.timeout = timeout;
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    }
    
    async execute(operation) {
        if (this.state === "OPEN") {
            if (Date.now() - this.lastFailureTime > this.timeout) {
                this.state = "HALF_OPEN";
            } else {
                throw new Error("Circuit breaker is OPEN");
            }
        }
        
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }
    
    onSuccess() {
        this.failureCount = 0;
        this.state = "CLOSED";
    }
    
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.threshold) {
            this.state = "OPEN";
        }
    }
}

// Usage
const circuitBreaker = new CircuitBreaker(3, 10000);

async function riskyAPICall() {
    return circuitBreaker.execute(async () => {
        const response = await fetch("/api/risky-endpoint");
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }
        return response.json();
    });
}
```

## Debugging Techniques

### Console Methods
```javascript
// Basic logging
console.log("Debug message");
console.info("Information message");
console.warn("Warning message");
console.error("Error message");

// Grouped logging
console.group("User Data");
console.log("Name: John");
console.log("Age: 30");
console.log("Email: john@example.com");
console.groupEnd();

// Table display
let users = [
    { name: "John", age: 30, city: "New York" },
    { name: "Jane", age: 25, city: "Boston" },
    { name: "Bob", age: 35, city: "Chicago" }
];
console.table(users);

// Timing
console.time("Operation");
// ... perform operation
console.timeEnd("Operation");

// Stack trace
console.trace("Function call trace");

// Assertions
console.assert(1 + 1 === 2, "Math is broken!");
console.assert(users.length > 0, "No users found");
```

### Debugger Statement
```javascript
function complexFunction(data) {
    debugger; // Execution will pause here in debugger
    
    let result = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] > 0) {
            result += data[i];
        }
    }
    
    return result;
}

// Usage
let numbers = [1, -2, 3, -4, 5];
let sum = complexFunction(numbers);
```

### Breakpoints and Stepping
```javascript
function processData(data) {
    // Set breakpoint here
    let processed = [];
    
    for (let item of data) {
        // Set breakpoint here
        if (item.value > 0) {
            // Set breakpoint here
            processed.push({
                id: item.id,
                value: item.value * 2
            });
        }
    }
    
    return processed;
}

// Usage
let data = [
    { id: 1, value: 10 },
    { id: 2, value: -5 },
    { id: 3, value: 20 }
];

let result = processData(data);
```

## Browser Developer Tools

### Chrome DevTools
```javascript
// Elements panel
// - Inspect HTML elements
// - Modify CSS styles
// - View computed styles
// - Edit HTML attributes

// Console panel
// - Execute JavaScript code
// - View logged messages
// - Inspect variables
// - Test functions

// Sources panel
// - Set breakpoints
// - Step through code
// - Inspect variables
// - Call stack
// - Scope chain

// Network panel
// - Monitor HTTP requests
// - View request/response headers
// - Analyze performance
// - Debug API calls

// Performance panel
// - Profile JavaScript execution
// - Identify bottlenecks
// - Analyze memory usage
// - Optimize code
```

### Debugging Tips
```javascript
// Use meaningful variable names
let userCount = 0; // Good
let x = 0; // Bad

// Add descriptive comments
function calculateTax(amount, rate) {
    // Calculate tax amount
    let tax = amount * rate;
    
    // Round to 2 decimal places
    return Math.round(tax * 100) / 100;
}

// Use console.log strategically
function processUsers(users) {
    console.log("Processing users:", users.length);
    
    let validUsers = users.filter(user => {
        console.log("Checking user:", user.name);
        return user.email && user.email.includes("@");
    });
    
    console.log("Valid users found:", validUsers.length);
    return validUsers;
}

// Use conditional breakpoints
function processItem(item) {
    // Set conditional breakpoint: item.value > 100
    if (item.value > 100) {
        console.log("High value item:", item);
    }
    
    return item.value * 1.1;
}
```

## Error Monitoring and Logging

### Basic Logging System
```javascript
class Logger {
    constructor(level = "INFO") {
        this.level = level;
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
    }
    
    log(level, message, data = null) {
        if (this.levels[level] <= this.levels[this.level]) {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                level,
                message,
                data
            };
            
            console.log(`[${timestamp}] ${level}: ${message}`, data || "");
            
            // Send to external logging service
            this.sendToExternalService(logEntry);
        }
    }
    
    error(message, data) {
        this.log("ERROR", message, data);
    }
    
    warn(message, data) {
        this.log("WARN", message, data);
    }
    
    info(message, data) {
        this.log("INFO", message, data);
    }
    
    debug(message, data) {
        this.log("DEBUG", message, data);
    }
    
    sendToExternalService(logEntry) {
        // Send to external logging service
        // fetch("/api/logs", { method: "POST", body: JSON.stringify(logEntry) });
    }
}

// Usage
const logger = new Logger("DEBUG");

try {
    riskyOperation();
} catch (error) {
    logger.error("Operation failed", {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });
}
```

### Global Error Handling
```javascript
// Global error handler
window.addEventListener("error", function(event) {
    console.error("Global error:", event.error);
    
    // Send to logging service
    sendErrorToService({
        message: event.error.message,
        stack: event.error.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
    });
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", function(event) {
    console.error("Unhandled promise rejection:", event.reason);
    
    // Send to logging service
    sendErrorToService({
        message: "Unhandled promise rejection",
        reason: event.reason,
        timestamp: new Date().toISOString()
    });
});

function sendErrorToService(errorData) {
    // Send error data to external service
    fetch("/api/errors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(errorData)
    }).catch(err => {
        console.error("Failed to send error to service:", err);
    });
}
```

## Testing Error Scenarios

### Unit Testing Errors
```javascript
// Using Jest-like syntax
describe("Error Handling", () => {
    test("should throw ValidationError for invalid input", () => {
        expect(() => {
            validateUser({});
        }).toThrow(ValidationError);
    });
    
    test("should handle division by zero", () => {
        expect(divide(10, 0)).toBeNull();
    });
    
    test("should retry failed operations", async () => {
        let attempts = 0;
        const operation = async () => {
            attempts++;
            if (attempts < 3) {
                throw new Error("Temporary failure");
            }
            return "success";
        };
        
        const result = await retryOperation(operation, 3, 100);
        expect(result).toBe("success");
        expect(attempts).toBe(3);
    });
});
```

### Integration Testing
```javascript
// Test error handling in real scenarios
describe("API Error Handling", () => {
    test("should handle network errors", async () => {
        // Mock network failure
        global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
        
        await expect(fetchUserData(123)).rejects.toThrow(NetworkError);
    });
    
    test("should handle API errors", async () => {
        // Mock API error response
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404,
            statusText: "Not Found"
        });
        
        await expect(fetchUserData(999)).rejects.toThrow(APIError);
    });
});
```

## Best Practices

### Error Handling Best Practices
```javascript
// 1. Be specific with error messages
throw new Error("User email validation failed: missing @ symbol");

// 2. Don't swallow errors silently
try {
    riskyOperation();
} catch (error) {
    // Bad: console.log("Something went wrong");
    // Good: Handle or re-throw
    logger.error("Operation failed", error);
    throw error;
}

// 3. Use appropriate error types
if (user.age < 0) {
    throw new ValidationError("Age cannot be negative", "age");
}

// 4. Provide context in error messages
throw new Error(`Failed to process user ${userId}: ${originalError.message}`);

// 5. Clean up resources in finally blocks
let connection = null;
try {
    connection = openConnection();
    // Use connection
} finally {
    if (connection) {
        connection.close();
    }
}
```

### Debugging Best Practices
```javascript
// 1. Use meaningful variable names
let userCount = 0; // Good
let x = 0; // Bad

// 2. Add descriptive comments
// Calculate total price including tax and shipping
let totalPrice = basePrice + tax + shipping;

// 3. Use console.log strategically
console.log("Processing user:", user.name, "with", user.orders.length, "orders");

// 4. Use breakpoints effectively
// Set breakpoints at key decision points
// Use conditional breakpoints for specific scenarios

// 5. Test edge cases
// Test with empty arrays, null values, extreme numbers
```

## Conclusion

Effective error handling and debugging are crucial for building robust JavaScript applications. By understanding different error types, implementing proper error handling patterns, and using debugging tools effectively, you can create more reliable and maintainable code.

## Key Takeaways

- Understand different types of JavaScript errors and when they occur
- Use try-catch-finally blocks appropriately for error handling
- Create custom error classes for better error categorization
- Implement error handling patterns like retry and circuit breaker
- Use browser developer tools effectively for debugging
- Set up proper logging and error monitoring
- Test error scenarios to ensure robust error handling
- Follow best practices for error handling and debugging

## Next Steps

- Practice implementing error handling in your projects
- Learn about advanced debugging techniques
- Explore error monitoring services like Sentry or LogRocket
- Study performance debugging and optimization
- Build projects that demonstrate robust error handling
- Learn about error handling in different JavaScript environments


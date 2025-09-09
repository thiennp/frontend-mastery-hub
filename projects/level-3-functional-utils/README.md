# Level 3 Mini-Project: Functional Programming Utility Library

## Project Overview

Build a comprehensive functional programming utility library that demonstrates advanced JavaScript concepts including closures, higher-order functions, function composition, and currying. This project will showcase how to create reusable, composable functions that can be used in real-world applications.

## Learning Objectives

- Master function fundamentals and different function types
- Understand scope chain and lexical scoping
- Implement closures and manage memory effectively
- Create higher-order functions for code reuse
- Build function composition and currying utilities
- Apply functional programming patterns in practice

## Project Requirements

### Core Features

1. **Function Utilities**
   - Function composition (compose, pipe)
   - Currying and partial application
   - Function memoization
   - Function debouncing and throttling

2. **Array Utilities**
   - Custom map, filter, reduce implementations
   - Array transformation functions
   - Array validation and checking functions

3. **Object Utilities**
   - Object transformation functions
   - Object validation and checking
   - Object composition and merging

4. **Async Utilities**
   - Promise composition
   - Async function utilities
   - Error handling for async operations

5. **Validation Utilities**
   - Validation pipeline
   - Schema validation
   - Error collection and reporting

### Technical Requirements

- Use modern JavaScript (ES6+)
- Implement proper error handling
- Include comprehensive tests
- Follow functional programming principles
- Use closures for data privacy
- Implement proper memory management

## Project Structure

```
level-3-functional-utils/
├── README.md
├── index.html
├── src/
│   ├── core/
│   │   ├── compose.js
│   │   ├── curry.js
│   │   ├── memoize.js
│   │   └── debounce.js
│   ├── arrays/
│   │   ├── map.js
│   │   ├── filter.js
│   │   ├── reduce.js
│   │   └── transform.js
│   ├── objects/
│   │   ├── transform.js
│   │   ├── validate.js
│   │   └── merge.js
│   ├── async/
│   │   ├── compose.js
│   │   ├── retry.js
│   │   └── timeout.js
│   ├── validation/
│   │   ├── pipeline.js
│   │   ├── schema.js
│   │   └── errors.js
│   └── index.js
├── tests/
│   ├── core.test.js
│   ├── arrays.test.js
│   ├── objects.test.js
│   ├── async.test.js
│   └── validation.test.js
└── examples/
    ├── basic-usage.html
    ├── advanced-patterns.html
    └── real-world-examples.html
```

## Implementation Guide

### Phase 1: Core Function Utilities

1. **Function Composition**
   - Implement `compose` function
   - Implement `pipe` function
   - Add error handling and logging

2. **Currying**
   - Implement basic currying
   - Add placeholder support
   - Implement partial application

3. **Memoization**
   - Implement memoization with cache
   - Add cache size limits
   - Implement cache invalidation

### Phase 2: Array Utilities

1. **Custom Array Methods**
   - Implement `map`, `filter`, `reduce`
   - Add error handling
   - Support for different data types

2. **Array Transformations**
   - Implement array composition
   - Add validation functions
   - Implement array utilities

### Phase 3: Object Utilities

1. **Object Transformations**
   - Implement object mapping
   - Add object filtering
   - Implement object composition

2. **Object Validation**
   - Implement schema validation
   - Add error collection
   - Implement validation pipeline

### Phase 4: Async Utilities

1. **Promise Composition**
   - Implement async composition
   - Add error handling
   - Implement retry logic

2. **Async Patterns**
   - Implement timeout handling
   - Add concurrency control
   - Implement async utilities

### Phase 5: Validation System

1. **Validation Pipeline**
   - Implement validation chain
   - Add error collection
   - Implement validation utilities

2. **Schema Validation**
   - Implement schema definition
   - Add validation rules
   - Implement error reporting

## Testing Strategy

### Unit Tests
- Test each utility function individually
- Test error handling and edge cases
- Test performance and memory usage

### Integration Tests
- Test function composition
- Test validation pipelines
- Test async operations

### Performance Tests
- Test memoization effectiveness
- Test memory usage
- Test execution time

## Examples

### Basic Usage

```javascript
import { compose, pipe, curry, memoize } from './src/index.js';

// Function composition
const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;
const square = x => x * x;

const composed = compose(square, multiplyByTwo, addOne);
console.log(composed(3)); // ((3 + 1) * 2)² = 64

// Currying
const add = curry((a, b, c) => a + b + c);
const add5 = add(5);
const add5And10 = add5(10);
console.log(add5And10(3)); // 18

// Memoization
const expensiveFunction = memoize(n => {
    console.log('Calculating...');
    return n * n * n;
});

console.log(expensiveFunction(5)); // Calculating... 125
console.log(expensiveFunction(5)); // 125 (cached)
```

### Advanced Patterns

```javascript
import { createValidator, createPipeline } from './src/index.js';

// Validation pipeline
const userValidator = createValidator()
    .addRule(data => data.name && data.name.length > 0)
    .addRule(data => data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    .addRule(data => data.age && data.age >= 18);

// Data processing pipeline
const processUsers = createPipeline()
    .addStep(users => users.filter(user => user.active))
    .addStep(users => users.map(user => ({ ...user, processed: true })))
    .addStep(users => users.sort((a, b) => a.name.localeCompare(b.name)));

const users = [
    { name: "John", email: "john@example.com", age: 30, active: true },
    { name: "Jane", email: "jane@example.com", age: 25, active: false },
    { name: "Bob", email: "bob@example.com", age: 35, active: true }
];

const processedUsers = processUsers(users);
console.log(processedUsers);
```

## Success Criteria

- [ ] All core utilities implemented and tested
- [ ] Function composition and currying working correctly
- [ ] Memory management implemented properly
- [ ] Error handling comprehensive
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Examples working
- [ ] Tests passing

## Bonus Features

- TypeScript support
- Performance benchmarking
- Memory usage monitoring
- Advanced caching strategies
- Plugin system for extensibility

## Resources

- [MDN Function Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)
- [Functional Programming in JavaScript](https://www.freecodecamp.org/news/functional-programming-in-javascript/)
- [Compose and Currying](https://javascript.info/currying-partials)
- [Closures and Scope](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)


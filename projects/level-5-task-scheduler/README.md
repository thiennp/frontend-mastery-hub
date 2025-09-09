# Asynchronous Task Scheduler

## Project Overview

The Asynchronous Task Scheduler is a comprehensive project that demonstrates advanced asynchronous programming patterns in JavaScript. This project showcases real-world applications of async/await, promises, event loops, and advanced patterns like circuit breakers, retry logic, and queue management.

## Features

- **Task Management**: Create, schedule, and manage asynchronous tasks
- **Priority Queue**: Execute tasks based on priority levels
- **Retry Logic**: Automatic retry with exponential backoff
- **Circuit Breaker**: Fault tolerance and system protection
- **Rate Limiting**: Control execution rate to prevent overwhelming
- **Timeout Handling**: Prevent tasks from hanging indefinitely
- **Progress Tracking**: Real-time progress updates and monitoring
- **Error Handling**: Comprehensive error management and recovery
- **Worker Threads**: Offload heavy computations to background workers
- **Event System**: Decoupled communication between components

## Project Structure

```
level-5-task-scheduler/
├── README.md
├── index.html
├── styles.css
├── script.js
├── src/
│   ├── core/
│   │   ├── TaskScheduler.js
│   │   ├── PriorityQueue.js
│   │   └── EventEmitter.js
│   ├── patterns/
│   │   ├── RetryLogic.js
│   │   ├── CircuitBreaker.js
│   │   ├── RateLimiter.js
│   │   └── TimeoutHandler.js
│   ├── workers/
│   │   ├── WorkerManager.js
│   │   └── worker.js
│   └── utils/
│       ├── Logger.js
│       └── Metrics.js
└── tests/
    └── task-scheduler.test.js
```

## Getting Started

1. Open `index.html` in a modern web browser
2. The application will automatically initialize
3. Use the interface to create and manage tasks
4. Monitor task execution and performance metrics

## Key Concepts Demonstrated

### 1. Advanced Async Patterns
- Promise cancellation and cleanup
- Async generators for streaming
- Event-driven architecture
- Worker thread management

### 2. Error Handling
- Circuit breaker pattern
- Retry logic with exponential backoff
- Timeout handling
- Graceful degradation

### 3. Performance Optimization
- Priority-based task execution
- Rate limiting and throttling
- Batch processing
- Resource pooling

### 4. Monitoring and Metrics
- Real-time performance tracking
- Error rate monitoring
- Task completion statistics
- System health indicators

## Usage Examples

### Basic Task Creation
```javascript
const scheduler = new TaskScheduler();

// Create a simple task
const task = await scheduler.createTask({
    name: 'Data Processing',
    priority: 'high',
    timeout: 30000,
    retryCount: 3
});

// Execute the task
await scheduler.executeTask(task.id);
```

### Advanced Task with Retry
```javascript
const task = await scheduler.createTask({
    name: 'API Call',
    priority: 'medium',
    timeout: 10000,
    retryCount: 5,
    retryDelay: 1000,
    circuitBreaker: true
});
```

### Batch Processing
```javascript
const tasks = await scheduler.createBatch([
    { name: 'Task 1', priority: 'high' },
    { name: 'Task 2', priority: 'medium' },
    { name: 'Task 3', priority: 'low' }
]);

await scheduler.executeBatch(tasks.map(t => t.id));
```

## Testing

Run the test suite to verify all functionality:

```bash
# Open the test file in a browser
open tests/task-scheduler.test.html
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- No external dependencies
- Uses modern JavaScript features (ES2017+)
- Requires Web Workers support

## Learning Objectives

After completing this project, you will understand:

1. How to implement advanced async patterns in real applications
2. How to build fault-tolerant systems with circuit breakers
3. How to manage task queues and priorities
4. How to implement retry logic and error recovery
5. How to use Web Workers for heavy computations
6. How to monitor and measure async performance
7. How to design event-driven architectures
8. How to handle timeouts and resource cleanup

## Next Steps

1. Experiment with different task types and priorities
2. Test the circuit breaker under various failure conditions
3. Monitor performance metrics during high load
4. Try implementing custom task types
5. Explore the worker thread capabilities
6. Analyze the event system and add custom events

## Troubleshooting

### Common Issues

1. **Tasks not executing**: Check the priority queue and circuit breaker status
2. **High memory usage**: Monitor task cleanup and worker thread management
3. **Timeout errors**: Adjust timeout values based on task complexity
4. **Rate limiting**: Check if rate limiter is blocking task execution

### Debug Mode

Enable debug mode for detailed logging:

```javascript
const scheduler = new TaskScheduler({ debug: true });
```

## Contributing

This project is part of the Frontend Mastery Hub curriculum. Feel free to extend it with additional features or improvements.


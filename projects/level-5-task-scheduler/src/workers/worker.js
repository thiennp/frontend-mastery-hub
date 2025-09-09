// Web Worker Script
// Handles heavy computations in background thread

// Worker state
let currentTask = null;
let isTerminating = false;

// Task handlers
const taskHandlers = {
    // Simple computation task
    simple: async (data) => {
        const { iterations = 1000000 } = data;
        let result = 0;
        
        for (let i = 0; i < iterations; i++) {
            result += Math.sqrt(i);
            
            // Report progress every 10%
            if (i % (iterations / 10) === 0) {
                self.postMessage({
                    type: 'taskProgress',
                    taskId: currentTask.id,
                    progress: {
                        percentage: (i / iterations) * 100,
                        current: i,
                        total: iterations
                    }
                });
            }
        }
        
        return { result, iterations };
    },

    // Data processing task
    dataProcessing: async (data) => {
        const { items = [], operation = 'sort' } = data;
        
        switch (operation) {
            case 'sort':
                return {
                    result: items.sort((a, b) => a - b),
                    operation: 'sort',
                    count: items.length
                };
                
            case 'filter':
                const { filterValue = 0 } = data;
                return {
                    result: items.filter(item => item > filterValue),
                    operation: 'filter',
                    count: items.length,
                    filteredCount: items.filter(item => item > filterValue).length
                };
                
            case 'map':
                const { mapFunction = 'double' } = data;
                let mappedItems;
                switch (mapFunction) {
                    case 'double':
                        mappedItems = items.map(item => item * 2);
                        break;
                    case 'square':
                        mappedItems = items.map(item => item * item);
                        break;
                    case 'sqrt':
                        mappedItems = items.map(item => Math.sqrt(item));
                        break;
                    default:
                        mappedItems = items;
                }
                return {
                    result: mappedItems,
                    operation: 'map',
                    mapFunction,
                    count: items.length
                };
                
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    },

    // Fibonacci calculation
    fibonacci: async (data) => {
        const { n = 40 } = data;
        
        const calculate = (num) => {
            if (num <= 1) return num;
            return calculate(num - 1) + calculate(num - 2);
        };
        
        const result = calculate(n);
        
        return {
            result,
            n,
            type: 'fibonacci'
        };
    },

    // Prime number generation
    primes: async (data) => {
        const { limit = 1000 } = data;
        const primes = [];
        
        for (let i = 2; i <= limit; i++) {
            let isPrime = true;
            
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }
            
            if (isPrime) {
                primes.push(i);
            }
            
            // Report progress every 10%
            if (i % (limit / 10) === 0) {
                self.postMessage({
                    type: 'taskProgress',
                    taskId: currentTask.id,
                    progress: {
                        percentage: (i / limit) * 100,
                        current: i,
                        total: limit,
                        primesFound: primes.length
                    }
                });
            }
        }
        
        return {
            primes,
            count: primes.length,
            limit
        };
    },

    // Matrix operations
    matrix: async (data) => {
        const { operation = 'multiply', matrixA, matrixB, size = 100 } = data;
        
        // Generate matrices if not provided
        const generateMatrix = (rows, cols) => {
            const matrix = [];
            for (let i = 0; i < rows; i++) {
                matrix[i] = [];
                for (let j = 0; j < cols; j++) {
                    matrix[i][j] = Math.random() * 100;
                }
            }
            return matrix;
        };
        
        const A = matrixA || generateMatrix(size, size);
        const B = matrixB || generateMatrix(size, size);
        
        switch (operation) {
            case 'multiply':
                const result = [];
                for (let i = 0; i < A.length; i++) {
                    result[i] = [];
                    for (let j = 0; j < B[0].length; j++) {
                        let sum = 0;
                        for (let k = 0; k < A[0].length; k++) {
                            sum += A[i][k] * B[k][j];
                        }
                        result[i][j] = sum;
                    }
                    
                    // Report progress
                    if (i % (A.length / 10) === 0) {
                        self.postMessage({
                            type: 'taskProgress',
                            taskId: currentTask.id,
                            progress: {
                                percentage: (i / A.length) * 100,
                                current: i,
                                total: A.length
                            }
                        });
                    }
                }
                return { result, operation: 'multiply', size };
                
            case 'transpose':
                const transposed = [];
                for (let i = 0; i < A[0].length; i++) {
                    transposed[i] = [];
                    for (let j = 0; j < A.length; j++) {
                        transposed[i][j] = A[j][i];
                    }
                }
                return { result: transposed, operation: 'transpose', size };
                
            default:
                throw new Error(`Unknown matrix operation: ${operation}`);
        }
    },

    // Image processing simulation
    imageProcessing: async (data) => {
        const { width = 100, height = 100, operation = 'blur' } = data;
        const pixels = width * height;
        
        // Simulate image processing
        const processPixel = (x, y) => {
            // Simulate complex pixel processing
            let value = 0;
            for (let i = 0; i < 1000; i++) {
                value += Math.sin(x * y * i) * Math.cos(x + y + i);
            }
            return value;
        };
        
        const result = [];
        for (let y = 0; y < height; y++) {
            result[y] = [];
            for (let x = 0; x < width; x++) {
                result[y][x] = processPixel(x, y);
            }
            
            // Report progress
            if (y % (height / 10) === 0) {
                self.postMessage({
                    type: 'taskProgress',
                    taskId: currentTask.id,
                    progress: {
                        percentage: (y / height) * 100,
                        current: y,
                        total: height,
                        pixelsProcessed: y * width
                    }
                });
            }
        }
        
        return {
            result,
            operation,
            width,
            height,
            pixels
        };
    },

    // API simulation
    apiCall: async (data) => {
        const { url, method = 'GET', delay = 1000 } = data;
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate random success/failure
        if (Math.random() < 0.1) { // 10% failure rate
            throw new Error('Simulated API error');
        }
        
        return {
            url,
            method,
            status: 200,
            data: { message: 'Success', timestamp: Date.now() }
        };
    },

    // Batch processing
    batch: async (data) => {
        const { items = [], batchSize = 10, operation = 'process' } = data;
        const results = [];
        
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const batchResult = await processBatch(batch, operation);
            results.push(...batchResult);
            
            // Report progress
            self.postMessage({
                type: 'taskProgress',
                taskId: currentTask.id,
                progress: {
                    percentage: ((i + batchSize) / items.length) * 100,
                    current: i + batchSize,
                    total: items.length,
                    batchesProcessed: Math.floor((i + batchSize) / batchSize)
                }
            });
        }
        
        return {
            results,
            totalItems: items.length,
            batchSize,
            batchesProcessed: Math.ceil(items.length / batchSize)
        };
    }
};

// Process a batch of items
async function processBatch(batch, operation) {
    switch (operation) {
        case 'process':
            return batch.map(item => ({
                input: item,
                output: item * 2,
                processed: true
            }));
        case 'validate':
            return batch.map(item => ({
                input: item,
                valid: item > 0,
                error: item <= 0 ? 'Value must be positive' : null
            }));
        default:
            return batch;
    }
}

// Handle messages from main thread
self.onmessage = function(event) {
    const { type, taskId, taskData, options } = event.data;
    
    switch (type) {
        case 'executeTask':
            executeTask(taskId, taskData, options);
            break;
        case 'cancelTask':
            cancelTask(taskId);
            break;
        case 'terminate':
            terminate();
            break;
        default:
            console.warn(`Unknown message type: ${type}`);
    }
};

// Execute a task
async function executeTask(taskId, taskData, options) {
    if (isTerminating) {
        return;
    }
    
    currentTask = { id: taskId, data: taskData, options };
    
    try {
        const { type, ...data } = taskData;
        const handler = taskHandlers[type];
        
        if (!handler) {
            throw new Error(`Unknown task type: ${type}`);
        }
        
        const startTime = Date.now();
        const result = await handler(data);
        const duration = Date.now() - startTime;
        
        self.postMessage({
            type: 'taskComplete',
            taskId,
            result: {
                ...result,
                duration,
                type
            }
        });
        
    } catch (error) {
        self.postMessage({
            type: 'taskError',
            taskId,
            error: error.message
        });
    } finally {
        currentTask = null;
    }
}

// Cancel a task
function cancelTask(taskId) {
    if (currentTask && currentTask.id === taskId) {
        currentTask = null;
        self.postMessage({
            type: 'taskCancelled',
            taskId
        });
    }
}

// Terminate worker
function terminate() {
    isTerminating = true;
    currentTask = null;
    self.close();
}

// Handle errors
self.onerror = function(error) {
    console.error('Worker error:', error);
    
    if (currentTask) {
        self.postMessage({
            type: 'taskError',
            taskId: currentTask.id,
            error: error.message
        });
    }
};

// Handle unhandled promise rejections
self.onunhandledrejection = function(event) {
    console.error('Worker unhandled rejection:', event.reason);
    
    if (currentTask) {
        self.postMessage({
            type: 'taskError',
            taskId: currentTask.id,
            error: event.reason.message || 'Unhandled promise rejection'
        });
    }
};

// Signal that worker is ready
self.postMessage({
    type: 'workerReady'
});


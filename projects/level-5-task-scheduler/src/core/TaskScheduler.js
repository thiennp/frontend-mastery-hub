// Task Scheduler
// Main orchestrator for asynchronous task management

class TaskScheduler {
    constructor(options = {}) {
        this.options = {
            maxConcurrentTasks: options.maxConcurrentTasks || 4,
            retryAttempts: options.retryAttempts || 3,
            retryDelay: options.retryDelay || 1000,
            circuitBreakerThreshold: options.circuitBreakerThreshold || 5,
            circuitBreakerTimeout: options.circuitBreakerTimeout || 30000,
            rateLimitPerSecond: options.rateLimitPerSecond || 10,
            debug: options.debug || false,
            ...options
        };
        
        // Initialize components
        this.eventEmitter = new EventEmitter();
        this.priorityQueue = new PriorityQueue();
        this.retryLogic = new RetryLogic({
            maxRetries: this.options.retryAttempts,
            baseDelay: this.options.retryDelay
        });
        this.circuitBreaker = new CircuitBreaker({
            threshold: this.options.circuitBreakerThreshold,
            timeout: this.options.circuitBreakerTimeout
        });
        this.rateLimiter = new RateLimiter({
            limit: this.options.rateLimitPerSecond,
            window: 1000
        });
        this.timeoutHandler = new TimeoutHandler({
            defaultTimeout: 30000
        });
        this.workerManager = new WorkerManager({
            maxWorkers: this.options.maxConcurrentTasks
        });
        
        // State management
        this.isRunning = false;
        this.isPaused = false;
        this.activeTasks = new Map();
        this.taskHistory = [];
        this.metrics = {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            cancelledTasks: 0,
            activeTasks: 0,
            queueSize: 0
        };
        
        // Task ID counter
        this.taskIdCounter = 0;
        
        // Set up event listeners
        this.setupEventListeners();
    }

    // Set up event listeners
    setupEventListeners() {
        // Circuit breaker events
        this.circuitBreaker.setOnStateChange((newState, oldState) => {
            this.eventEmitter.emit('circuitBreakerStateChanged', newState, oldState);
        });
        
        // Worker manager events
        this.workerManager.setOnTaskComplete((taskId, result) => {
            this.eventEmitter.emit('workerTaskComplete', taskId, result);
        });
        
        this.workerManager.setOnTaskError((taskId, error) => {
            this.eventEmitter.emit('workerTaskError', taskId, error);
        });
        
        this.workerManager.setOnWorkerStatusChange((workerId, status, task) => {
            this.eventEmitter.emit('workerStatusChanged', workerId, status, task);
        });
    }

    // Start the scheduler
    async start() {
        if (this.isRunning) {
            throw new Error('Scheduler is already running');
        }
        
        this.isRunning = true;
        this.isPaused = false;
        
        // Start processing loop
        this.startProcessingLoop();
        
        this.eventEmitter.emit('schedulerStarted');
        this.log('Scheduler started', 'info');
    }

    // Stop the scheduler
    async stop() {
        if (!this.isRunning) {
            throw new Error('Scheduler is not running');
        }
        
        this.isRunning = false;
        this.isPaused = false;
        
        // Cancel all active tasks
        for (const [taskId, task] of this.activeTasks) {
            await this.cancelTask(taskId);
        }
        
        // Clear queue
        this.priorityQueue.clear();
        
        this.eventEmitter.emit('schedulerStopped');
        this.log('Scheduler stopped', 'info');
    }

    // Start processing loop
    startProcessingLoop() {
        const processLoop = async () => {
            if (!this.isRunning) {
                return;
            }
            
            if (!this.isPaused && this.activeTasks.size < this.options.maxConcurrentTasks) {
                await this.processNextTask();
            }
            
            // Update metrics
            this.updateMetrics();
            
            // Schedule next iteration
            setTimeout(processLoop, 100);
        };
        
        processLoop();
    }

    // Process next task from queue
    async processNextTask() {
        if (this.priorityQueue.isEmpty()) {
            return;
        }
        
        const task = this.priorityQueue.dequeue();
        if (!task) {
            return;
        }
        
        // Check rate limit
        if (!await this.rateLimiter.isAllowed(task.id)) {
            // Re-queue task
            this.priorityQueue.enqueue(task);
            return;
        }
        
        // Execute task
        this.executeTask(task);
    }

    // Execute a task
    async executeTask(task) {
        task.status = 'running';
        task.startedAt = Date.now();
        this.activeTasks.set(task.id, task);
        
        this.eventEmitter.emit('taskStarted', task);
        this.log(`Task started: ${task.name}`, 'info');
        
        try {
            // Execute with circuit breaker, retry logic, and timeout
            const result = await this.circuitBreaker.execute(async () => {
                return await this.retryLogic.execute(async () => {
                    return await this.timeoutHandler.execute(async () => {
                        return await this.runTask(task);
                    }, task.timeout);
                });
            });
            
            // Task completed successfully
            task.status = 'completed';
            task.completedAt = Date.now();
            task.duration = task.completedAt - task.startedAt;
            task.result = result;
            
            this.activeTasks.delete(task.id);
            this.taskHistory.push(task);
            this.metrics.completedTasks++;
            
            this.eventEmitter.emit('taskCompleted', task);
            this.log(`Task completed: ${task.name} (${task.duration}ms)`, 'info');
            
        } catch (error) {
            // Task failed
            task.status = 'failed';
            task.completedAt = Date.now();
            task.duration = task.completedAt - task.startedAt;
            task.error = error.message;
            
            this.activeTasks.delete(task.id);
            this.taskHistory.push(task);
            this.metrics.failedTasks++;
            
            this.eventEmitter.emit('taskFailed', task, error);
            this.log(`Task failed: ${task.name} - ${error.message}`, 'error');
        }
    }

    // Run the actual task
    async runTask(task) {
        const { type, data } = task;
        
        switch (type) {
            case 'simple':
                return await this.runSimpleTask(data);
            case 'api':
                return await this.runAPITask(data);
            case 'computation':
                return await this.runComputationTask(data);
            case 'batch':
                return await this.runBatchTask(data);
            default:
                throw new Error(`Unknown task type: ${type}`);
        }
    }

    // Run simple task
    async runSimpleTask(data) {
        const { delay = 1000, message = 'Simple task completed' } = data;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return {
            message,
            delay,
            timestamp: Date.now()
        };
    }

    // Run API task
    async runAPITask(data) {
        const { url, method = 'GET', timeout = 10000 } = data;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
        
        // Simulate random failures
        if (Math.random() < 0.1) {
            throw new Error('API request failed');
        }
        
        return {
            url,
            method,
            status: 200,
            data: { message: 'API call successful', timestamp: Date.now() }
        };
    }

    // Run computation task
    async runComputationTask(data) {
        const { iterations = 1000000, type = 'simple' } = data;
        
        // Use worker for heavy computation
        return await this.workerManager.executeTask({
            type: 'simple',
            data: { iterations }
        });
    }

    // Run batch task
    async runBatchTask(data) {
        const { items = [], batchSize = 10, operation = 'process' } = data;
        
        // Use worker for batch processing
        return await this.workerManager.executeTask({
            type: 'batch',
            data: { items, batchSize, operation }
        });
    }

    // Create a new task
    async createTask(taskData) {
        const task = {
            id: this.generateTaskId(),
            name: taskData.name,
            type: taskData.type || 'simple',
            priority: taskData.priority || 'medium',
            timeout: taskData.timeout || 30000,
            retryCount: taskData.retryCount || 0,
            useCircuitBreaker: taskData.useCircuitBreaker !== false,
            data: taskData.data || {},
            status: 'pending',
            createdAt: Date.now(),
            ...taskData
        };
        
        // Add to queue
        this.priorityQueue.enqueue(task);
        this.metrics.totalTasks++;
        
        this.eventEmitter.emit('taskCreated', task);
        this.log(`Task created: ${task.name}`, 'info');
        
        return task;
    }

    // Create multiple tasks
    async createBatch(taskDataArray) {
        const tasks = [];
        
        for (const taskData of taskDataArray) {
            const task = await this.createTask(taskData);
            tasks.push(task);
        }
        
        return tasks;
    }

    // Execute a task by ID
    async executeTaskById(taskId) {
        const task = this.priorityQueue.getById(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }
        
        // Remove from queue and execute immediately
        this.priorityQueue.removeById(taskId);
        await this.executeTask(task);
        
        return task;
    }

    // Execute multiple tasks
    async executeBatch(taskIds) {
        const results = [];
        
        for (const taskId of taskIds) {
            try {
                const result = await this.executeTaskById(taskId);
                results.push({ success: true, taskId, result });
            } catch (error) {
                results.push({ success: false, taskId, error: error.message });
            }
        }
        
        return results;
    }

    // Cancel a task
    async cancelTask(taskId) {
        // Check if task is in queue
        const queuedTask = this.priorityQueue.removeById(taskId);
        if (queuedTask) {
            queuedTask.status = 'cancelled';
            queuedTask.completedAt = Date.now();
            this.taskHistory.push(queuedTask);
            this.metrics.cancelledTasks++;
            
            this.eventEmitter.emit('taskCancelled', queuedTask);
            this.log(`Task cancelled: ${queuedTask.name}`, 'warn');
            return true;
        }
        
        // Check if task is active
        const activeTask = this.activeTasks.get(taskId);
        if (activeTask) {
            activeTask.status = 'cancelled';
            activeTask.completedAt = Date.now();
            activeTask.duration = activeTask.completedAt - activeTask.startedAt;
            
            this.activeTasks.delete(taskId);
            this.taskHistory.push(activeTask);
            this.metrics.cancelledTasks++;
            
            this.eventEmitter.emit('taskCancelled', activeTask);
            this.log(`Task cancelled: ${activeTask.name}`, 'warn');
            return true;
        }
        
        return false;
    }

    // Pause queue
    pauseQueue() {
        this.isPaused = true;
        this.eventEmitter.emit('queuePaused');
        this.log('Queue paused', 'info');
    }

    // Resume queue
    resumeQueue() {
        this.isPaused = false;
        this.eventEmitter.emit('queueResumed');
        this.log('Queue resumed', 'info');
    }

    // Check if queue is paused
    isQueuePaused() {
        return this.isPaused;
    }

    // Clear all tasks
    async clearAllTasks() {
        // Cancel all active tasks
        for (const [taskId, task] of this.activeTasks) {
            await this.cancelTask(taskId);
        }
        
        // Clear queue
        this.priorityQueue.clear();
        
        // Clear history
        this.taskHistory = [];
        
        // Reset metrics
        this.metrics = {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            cancelledTasks: 0,
            activeTasks: 0,
            queueSize: 0
        };
        
        this.eventEmitter.emit('allTasksCleared');
        this.log('All tasks cleared', 'info');
    }

    // Clear queue only
    clearQueue() {
        this.priorityQueue.clear();
        this.eventEmitter.emit('queueCleared');
        this.log('Queue cleared', 'info');
    }

    // Clear history only
    clearHistory() {
        this.taskHistory = [];
        this.eventEmitter.emit('historyCleared');
        this.log('History cleared', 'info');
    }

    // Get queue
    getQueue() {
        return this.priorityQueue.getAll();
    }

    // Get history
    getHistory() {
        return this.taskHistory;
    }

    // Get active tasks
    getActiveTasks() {
        return Array.from(this.activeTasks.values());
    }

    // Get worker status
    getWorkerStatus() {
        return this.workerManager.getWorkerStatus();
    }

    // Get metrics
    getMetrics() {
        return {
            ...this.metrics,
            queueSize: this.priorityQueue.size(),
            activeTasks: this.activeTasks.size,
            circuitBreakerState: this.circuitBreaker.getState(),
            workerStats: this.workerManager.getStats(),
            retryStats: this.retryLogic.getStats(),
            rateLimiterStats: this.rateLimiter.getStats(),
            timeoutStats: this.timeoutHandler.getStats()
        };
    }

    // Update metrics
    updateMetrics() {
        this.metrics.queueSize = this.priorityQueue.size();
        this.metrics.activeTasks = this.activeTasks.size;
        
        this.eventEmitter.emit('metricsUpdated', this.metrics);
    }

    // Generate task ID
    generateTaskId() {
        return `task_${++this.taskIdCounter}_${Date.now()}`;
    }

    // Log message
    log(message, level = 'info') {
        if (this.options.debug) {
            console.log(`[TaskScheduler] ${message}`);
        }
        this.eventEmitter.emit('log', { message, level, timestamp: Date.now() });
    }

    // Event emitter methods
    on(event, listener) {
        this.eventEmitter.on(event, listener);
    }

    off(event, listener) {
        this.eventEmitter.off(event, listener);
    }

    emit(event, ...args) {
        this.eventEmitter.emit(event, ...args);
    }

    // Get scheduler status
    getStatus() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            activeTasks: this.activeTasks.size,
            queueSize: this.priorityQueue.size(),
            totalTasks: this.metrics.totalTasks,
            completedTasks: this.metrics.completedTasks,
            failedTasks: this.metrics.failedTasks,
            cancelledTasks: this.metrics.cancelledTasks
        };
    }

    // Get health status
    getHealth() {
        const health = {
            healthy: true,
            issues: [],
            components: {}
        };
        
        // Check circuit breaker
        const circuitBreakerHealth = this.circuitBreaker.getHealth();
        health.components.circuitBreaker = circuitBreakerHealth;
        if (!circuitBreakerHealth.healthy) {
            health.healthy = false;
            health.issues.push('Circuit breaker is open');
        }
        
        // Check worker health
        const workerHealth = this.workerManager.getWorkerHealth();
        health.components.workers = workerHealth;
        if (!workerHealth.healthy) {
            health.healthy = false;
            health.issues.push(...workerHealth.issues);
        }
        
        // Check queue health
        const queueSize = this.priorityQueue.size();
        if (queueSize > 1000) {
            health.healthy = false;
            health.issues.push(`Queue size too large: ${queueSize}`);
        }
        
        health.components.queue = {
            healthy: queueSize <= 1000,
            size: queueSize
        };
        
        return health;
    }

    // Destroy scheduler
    destroy() {
        this.stop();
        this.workerManager.terminateAll();
        this.eventEmitter.destroy();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskScheduler;
}



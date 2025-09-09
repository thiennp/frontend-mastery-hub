// Worker Manager
// Manages Web Workers for heavy computations

class WorkerManager {
    constructor(options = {}) {
        this.maxWorkers = options.maxWorkers || navigator.hardwareConcurrency || 4;
        this.workerScript = options.workerScript || 'worker.js';
        this.workers = new Map();
        this.taskQueue = [];
        this.activeTasks = new Map();
        this.workerStatus = new Map();
        this.taskIdCounter = 0;
        this.onTaskComplete = options.onTaskComplete || (() => {});
        this.onTaskError = options.onTaskError || (() => {});
        this.onWorkerStatusChange = options.onWorkerStatusChange || (() => {});
        
        this.initializeWorkers();
    }

    // Initialize workers
    async initializeWorkers() {
        for (let i = 0; i < this.maxWorkers; i++) {
            await this.createWorker(i);
        }
    }

    // Create a new worker
    async createWorker(id) {
        try {
            const worker = new Worker(this.workerScript);
            
            worker.onmessage = (event) => {
                this.handleWorkerMessage(id, event);
            };
            
            worker.onerror = (error) => {
                this.handleWorkerError(id, error);
            };
            
            this.workers.set(id, worker);
            this.workerStatus.set(id, {
                status: 'idle',
                currentTask: null,
                taskCount: 0,
                lastActivity: Date.now()
            });
            
            console.log(`Worker ${id} created successfully`);
        } catch (error) {
            console.error(`Failed to create worker ${id}:`, error);
        }
    }

    // Handle worker messages
    handleWorkerMessage(workerId, event) {
        const { type, taskId, result, error, progress } = event.data;
        
        switch (type) {
            case 'taskComplete':
                this.handleTaskComplete(workerId, taskId, result);
                break;
            case 'taskError':
                this.handleTaskError(workerId, taskId, error);
                break;
            case 'taskProgress':
                this.handleTaskProgress(workerId, taskId, progress);
                break;
            case 'workerReady':
                this.handleWorkerReady(workerId);
                break;
            default:
                console.warn(`Unknown message type: ${type}`);
        }
    }

    // Handle worker errors
    handleWorkerError(workerId, error) {
        console.error(`Worker ${workerId} error:`, error);
        
        // Mark worker as error state
        this.updateWorkerStatus(workerId, 'error', null);
        
        // Try to recreate worker
        this.recreateWorker(workerId);
    }

    // Handle task completion
    handleTaskComplete(workerId, taskId, result) {
        const task = this.activeTasks.get(taskId);
        if (task) {
            task.resolve(result);
            this.activeTasks.delete(taskId);
            this.updateWorkerStatus(workerId, 'idle', null);
            this.onTaskComplete(taskId, result);
        }
    }

    // Handle task error
    handleTaskError(workerId, taskId, error) {
        const task = this.activeTasks.get(taskId);
        if (task) {
            task.reject(new Error(error));
            this.activeTasks.delete(taskId);
            this.updateWorkerStatus(workerId, 'idle', null);
            this.onTaskError(taskId, error);
        }
    }

    // Handle task progress
    handleTaskProgress(workerId, taskId, progress) {
        const task = this.activeTasks.get(taskId);
        if (task && task.onProgress) {
            task.onProgress(progress);
        }
    }

    // Handle worker ready
    handleWorkerReady(workerId) {
        this.updateWorkerStatus(workerId, 'idle', null);
        this.processQueue();
    }

    // Update worker status
    updateWorkerStatus(workerId, status, currentTask) {
        const statusInfo = this.workerStatus.get(workerId);
        if (statusInfo) {
            statusInfo.status = status;
            statusInfo.currentTask = currentTask;
            statusInfo.lastActivity = Date.now();
            
            if (status === 'idle') {
                statusInfo.taskCount++;
            }
            
            this.onWorkerStatusChange(workerId, status, currentTask);
        }
    }

    // Execute task on worker
    async executeTask(taskData, options = {}) {
        const taskId = this.generateTaskId();
        const workerId = this.getAvailableWorker();
        
        if (workerId === null) {
            // No available workers, queue the task
            return this.queueTask(taskData, options);
        }
        
        return this.runTaskOnWorker(workerId, taskId, taskData, options);
    }

    // Run task on specific worker
    async runTaskOnWorker(workerId, taskId, taskData, options = {}) {
        const worker = this.workers.get(workerId);
        if (!worker) {
            throw new Error(`Worker ${workerId} not found`);
        }
        
        const task = {
            id: taskId,
            data: taskData,
            options,
            startTime: Date.now(),
            workerId
        };
        
        return new Promise((resolve, reject) => {
            task.resolve = resolve;
            task.reject = reject;
            task.onProgress = options.onProgress;
            
            this.activeTasks.set(taskId, task);
            this.updateWorkerStatus(workerId, 'busy', taskData);
            
            // Send task to worker
            worker.postMessage({
                type: 'executeTask',
                taskId,
                taskData,
                options
            });
        });
    }

    // Queue task for later execution
    queueTask(taskData, options = {}) {
        const taskId = this.generateTaskId();
        
        return new Promise((resolve, reject) => {
            const queuedTask = {
                id: taskId,
                data: taskData,
                options,
                resolve,
                reject,
                queuedAt: Date.now()
            };
            
            this.taskQueue.push(queuedTask);
            this.processQueue();
        });
    }

    // Process queued tasks
    processQueue() {
        while (this.taskQueue.length > 0) {
            const workerId = this.getAvailableWorker();
            if (workerId === null) {
                break; // No available workers
            }
            
            const task = this.taskQueue.shift();
            this.runTaskOnWorker(workerId, task.id, task.data, task.options)
                .then(task.resolve)
                .catch(task.reject);
        }
    }

    // Get available worker
    getAvailableWorker() {
        for (const [workerId, status] of this.workerStatus) {
            if (status.status === 'idle') {
                return workerId;
            }
        }
        return null;
    }

    // Get worker status
    getWorkerStatus() {
        return Object.fromEntries(this.workerStatus);
    }

    // Get task queue status
    getQueueStatus() {
        return {
            queued: this.taskQueue.length,
            active: this.activeTasks.size,
            totalWorkers: this.workers.size,
            availableWorkers: Array.from(this.workerStatus.values()).filter(s => s.status === 'idle').length
        };
    }

    // Cancel task
    cancelTask(taskId) {
        // Check if task is in queue
        const queueIndex = this.taskQueue.findIndex(task => task.id === taskId);
        if (queueIndex !== -1) {
            const task = this.taskQueue.splice(queueIndex, 1)[0];
            task.reject(new Error('Task cancelled'));
            return true;
        }
        
        // Check if task is active
        const task = this.activeTasks.get(taskId);
        if (task) {
            const worker = this.workers.get(task.workerId);
            if (worker) {
                worker.postMessage({
                    type: 'cancelTask',
                    taskId
                });
            }
            
            task.reject(new Error('Task cancelled'));
            this.activeTasks.delete(taskId);
            this.updateWorkerStatus(task.workerId, 'idle', null);
            return true;
        }
        
        return false;
    }

    // Recreate worker
    async recreateWorker(workerId) {
        try {
            // Terminate old worker
            const oldWorker = this.workers.get(workerId);
            if (oldWorker) {
                oldWorker.terminate();
            }
            
            // Create new worker
            await this.createWorker(workerId);
            console.log(`Worker ${workerId} recreated successfully`);
        } catch (error) {
            console.error(`Failed to recreate worker ${workerId}:`, error);
        }
    }

    // Get statistics
    getStats() {
        const stats = {
            totalWorkers: this.workers.size,
            activeWorkers: 0,
            idleWorkers: 0,
            errorWorkers: 0,
            queuedTasks: this.taskQueue.length,
            activeTasks: this.activeTasks.size,
            totalTasks: 0,
            averageTaskDuration: 0
        };
        
        let totalDuration = 0;
        let completedTasks = 0;
        
        for (const [workerId, status] of this.workerStatus) {
            switch (status.status) {
                case 'idle':
                    stats.idleWorkers++;
                    break;
                case 'busy':
                    stats.activeWorkers++;
                    break;
                case 'error':
                    stats.errorWorkers++;
                    break;
            }
            
            stats.totalTasks += status.taskCount;
            totalDuration += status.taskCount * 1000; // Rough estimate
            completedTasks += status.taskCount;
        }
        
        if (completedTasks > 0) {
            stats.averageTaskDuration = totalDuration / completedTasks;
        }
        
        return stats;
    }

    // Set callbacks
    setOnTaskComplete(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Task complete callback must be a function');
        }
        this.onTaskComplete = callback;
    }

    setOnTaskError(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Task error callback must be a function');
        }
        this.onTaskError = callback;
    }

    setOnWorkerStatusChange(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Worker status change callback must be a function');
        }
        this.onWorkerStatusChange = callback;
    }

    // Generate task ID
    generateTaskId() {
        return `task_${++this.taskIdCounter}_${Date.now()}`;
    }

    // Terminate all workers
    terminateAll() {
        for (const [workerId, worker] of this.workers) {
            worker.terminate();
        }
        this.workers.clear();
        this.workerStatus.clear();
        this.activeTasks.clear();
        this.taskQueue = [];
    }

    // Restart all workers
    async restartAll() {
        this.terminateAll();
        await this.initializeWorkers();
    }

    // Get worker health
    getWorkerHealth() {
        const health = {
            healthy: true,
            issues: [],
            workers: {}
        };
        
        for (const [workerId, status] of this.workerStatus) {
            const workerHealth = {
                status: status.status,
                lastActivity: status.lastActivity,
                taskCount: status.taskCount,
                healthy: true
            };
            
            // Check if worker is responsive
            const timeSinceActivity = Date.now() - status.lastActivity;
            if (timeSinceActivity > 300000) { // 5 minutes
                workerHealth.healthy = false;
                health.healthy = false;
                health.issues.push(`Worker ${workerId} unresponsive for ${Math.floor(timeSinceActivity / 1000)}s`);
            }
            
            // Check if worker is in error state
            if (status.status === 'error') {
                workerHealth.healthy = false;
                health.healthy = false;
                health.issues.push(`Worker ${workerId} in error state`);
            }
            
            health.workers[workerId] = workerHealth;
        }
        
        return health;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkerManager;
}


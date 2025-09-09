// Main Application Script
// Level 5: Asynchronous Task Scheduler

class TaskSchedulerApp {
    constructor() {
        this.scheduler = null;
        this.isRunning = false;
        this.autoScrollLogs = true;
        this.notifications = [];
        
        this.init();
    }

    async init() {
        try {
            this.setupEventListeners();
            this.initializeScheduler();
            this.updateUI();
            this.log('Application initialized successfully', 'info');
        } catch (error) {
            this.log(`Failed to initialize application: ${error.message}`, 'error');
            this.showNotification('Failed to initialize application', 'error');
        }
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('startScheduler').addEventListener('click', () => this.startScheduler());
        document.getElementById('stopScheduler').addEventListener('click', () => this.stopScheduler());
        document.getElementById('clearTasks').addEventListener('click', () => this.clearAllTasks());
        
        // Queue controls
        document.getElementById('pauseQueue').addEventListener('click', () => this.pauseQueue());
        document.getElementById('resumeQueue').addEventListener('click', () => this.resumeQueue());
        document.getElementById('clearQueue').addEventListener('click', () => this.clearQueue());
        
        // History controls
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
        document.getElementById('exportHistory').addEventListener('click', () => this.exportHistory());
        
        // Log controls
        document.getElementById('clearLogs').addEventListener('click', () => this.clearLogs());
        document.getElementById('toggleLogs').addEventListener('click', () => this.toggleAutoScroll());
        
        // Task form
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleTaskForm(e));
        
        // Auto-refresh metrics
        setInterval(() => this.updateMetrics(), 1000);
    }

    initializeScheduler() {
        this.scheduler = new TaskScheduler({
            maxConcurrentTasks: 4,
            retryAttempts: 3,
            retryDelay: 1000,
            circuitBreakerThreshold: 5,
            circuitBreakerTimeout: 30000,
            rateLimitPerSecond: 10,
            debug: true
        });

        // Set up event listeners for scheduler events
        this.scheduler.on('taskCreated', (task) => this.onTaskCreated(task));
        this.scheduler.on('taskStarted', (task) => this.onTaskStarted(task));
        this.scheduler.on('taskCompleted', (task) => this.onTaskCompleted(task));
        this.scheduler.on('taskFailed', (task, error) => this.onTaskFailed(task, error));
        this.scheduler.on('taskCancelled', (task) => this.onTaskCancelled(task));
        this.scheduler.on('queueUpdated', () => this.updateQueueDisplay());
        this.scheduler.on('metricsUpdated', (metrics) => this.updateMetricsDisplay(metrics));
        this.scheduler.on('circuitBreakerStateChanged', (state) => this.onCircuitBreakerStateChanged(state));
        this.scheduler.on('workerStatusChanged', (workerId, status, task) => this.onWorkerStatusChanged(workerId, status, task));
    }

    async startScheduler() {
        try {
            await this.scheduler.start();
            this.isRunning = true;
            this.updateUI();
            this.log('Scheduler started', 'info');
            this.showNotification('Scheduler started successfully', 'success');
        } catch (error) {
            this.log(`Failed to start scheduler: ${error.message}`, 'error');
            this.showNotification('Failed to start scheduler', 'error');
        }
    }

    async stopScheduler() {
        try {
            await this.scheduler.stop();
            this.isRunning = false;
            this.updateUI();
            this.log('Scheduler stopped', 'info');
            this.showNotification('Scheduler stopped', 'warning');
        } catch (error) {
            this.log(`Failed to stop scheduler: ${error.message}`, 'error');
            this.showNotification('Failed to stop scheduler', 'error');
        }
    }

    async clearAllTasks() {
        try {
            await this.scheduler.clearAllTasks();
            this.updateQueueDisplay();
            this.updateHistoryDisplay();
            this.log('All tasks cleared', 'info');
            this.showNotification('All tasks cleared', 'warning');
        } catch (error) {
            this.log(`Failed to clear tasks: ${error.message}`, 'error');
            this.showNotification('Failed to clear tasks', 'error');
        }
    }

    pauseQueue() {
        this.scheduler.pauseQueue();
        this.updateUI();
        this.log('Queue paused', 'info');
        this.showNotification('Queue paused', 'warning');
    }

    resumeQueue() {
        this.scheduler.resumeQueue();
        this.updateUI();
        this.log('Queue resumed', 'info');
        this.showNotification('Queue resumed', 'success');
    }

    clearQueue() {
        this.scheduler.clearQueue();
        this.updateQueueDisplay();
        this.log('Queue cleared', 'info');
        this.showNotification('Queue cleared', 'warning');
    }

    clearHistory() {
        this.scheduler.clearHistory();
        this.updateHistoryDisplay();
        this.log('History cleared', 'info');
        this.showNotification('History cleared', 'warning');
    }

    exportHistory() {
        const history = this.scheduler.getHistory();
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `task-history-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.log('History exported', 'info');
        this.showNotification('History exported successfully', 'success');
    }

    clearLogs() {
        const logContainer = document.getElementById('logContainer');
        logContainer.innerHTML = '';
        this.log('Logs cleared', 'info');
    }

    toggleAutoScroll() {
        this.autoScrollLogs = !this.autoScrollLogs;
        const button = document.getElementById('toggleLogs');
        button.innerHTML = this.autoScrollLogs ? 
            '<i class="fas fa-eye"></i> Toggle Auto-scroll' : 
            '<i class="fas fa-eye-slash"></i> Toggle Auto-scroll';
        this.log(`Auto-scroll ${this.autoScrollLogs ? 'enabled' : 'disabled'}`, 'info');
    }

    async handleTaskForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const taskData = {
            name: document.getElementById('taskName').value,
            type: document.getElementById('taskType').value,
            priority: document.getElementById('taskPriority').value,
            timeout: parseInt(document.getElementById('taskTimeout').value),
            retryCount: parseInt(document.getElementById('retryCount').value),
            useCircuitBreaker: document.getElementById('useCircuitBreaker').checked
        };

        try {
            const task = await this.scheduler.createTask(taskData);
            this.log(`Task created: ${task.name}`, 'info');
            this.showNotification(`Task "${task.name}" created successfully`, 'success');
            event.target.reset();
        } catch (error) {
            this.log(`Failed to create task: ${error.message}`, 'error');
            this.showNotification('Failed to create task', 'error');
        }
    }

    onTaskCreated(task) {
        this.log(`Task created: ${task.name} (ID: ${task.id})`, 'info');
        this.updateQueueDisplay();
    }

    onTaskStarted(task) {
        this.log(`Task started: ${task.name}`, 'info');
        this.updateQueueDisplay();
        this.updateWorkerDisplay();
    }

    onTaskCompleted(task) {
        this.log(`Task completed: ${task.name} (Duration: ${task.duration}ms)`, 'info');
        this.updateQueueDisplay();
        this.updateHistoryDisplay();
        this.updateWorkerDisplay();
        this.showNotification(`Task "${task.name}" completed`, 'success');
    }

    onTaskFailed(task, error) {
        this.log(`Task failed: ${task.name} - ${error.message}`, 'error');
        this.updateQueueDisplay();
        this.updateHistoryDisplay();
        this.updateWorkerDisplay();
        this.showNotification(`Task "${task.name}" failed`, 'error');
    }

    onTaskCancelled(task) {
        this.log(`Task cancelled: ${task.name}`, 'warn');
        this.updateQueueDisplay();
        this.updateHistoryDisplay();
        this.updateWorkerDisplay();
        this.showNotification(`Task "${task.name}" cancelled`, 'warning');
    }

    onCircuitBreakerStateChanged(state) {
        this.log(`Circuit breaker state changed: ${state}`, 'warn');
        this.updateMetricsDisplay();
    }

    onWorkerStatusChanged(workerId, status, task) {
        this.updateWorkerDisplay();
        if (task) {
            this.log(`Worker ${workerId} ${status}: ${task.name}`, 'info');
        }
    }

    updateUI() {
        const startBtn = document.getElementById('startScheduler');
        const stopBtn = document.getElementById('stopScheduler');
        const pauseBtn = document.getElementById('pauseQueue');
        const resumeBtn = document.getElementById('resumeQueue');

        if (this.isRunning) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }

        if (this.scheduler && this.scheduler.isQueuePaused()) {
            pauseBtn.disabled = true;
            resumeBtn.disabled = false;
        } else {
            pauseBtn.disabled = false;
            resumeBtn.disabled = true;
        }
    }

    updateQueueDisplay() {
        const queueList = document.getElementById('queueList');
        const tasks = this.scheduler.getQueue();
        
        if (tasks.length === 0) {
            queueList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No tasks in queue</p>
                </div>
            `;
            return;
        }

        queueList.innerHTML = tasks.map(task => `
            <div class="queue-item priority-${task.priority}">
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-details">
                        Type: ${task.type} | Priority: ${task.priority} | 
                        Timeout: ${task.timeout}ms | Retries: ${task.retryCount}
                    </div>
                </div>
                <div class="task-status">
                    <span class="status-badge status-${task.status}">${task.status}</span>
                    <button class="btn btn-danger btn-sm" onclick="app.cancelTask('${task.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        const history = this.scheduler.getHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <p>No completed tasks yet</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = history.slice(-10).reverse().map(task => `
            <div class="history-item">
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-details">
                        Type: ${task.type} | Priority: ${task.priority} | 
                        Duration: ${task.duration}ms
                    </div>
                </div>
                <div class="task-status">
                    <span class="status-badge status-${task.status}">${task.status}</span>
                    <span class="history-time">${new Date(task.completedAt).toLocaleTimeString()}</span>
                </div>
            </div>
        `).join('');
    }

    updateWorkerDisplay() {
        const workers = this.scheduler.getWorkerStatus();
        
        Object.keys(workers).forEach(workerId => {
            const worker = workers[workerId];
            const statusElement = document.getElementById(`${workerId}Status`);
            const taskElement = document.getElementById(`${workerId}Task`);
            const cardElement = statusElement.closest('.worker-card');
            
            if (statusElement) {
                statusElement.textContent = worker.status;
                statusElement.className = `worker-status ${worker.status}`;
            }
            
            if (taskElement) {
                taskElement.textContent = worker.task ? worker.task.name : '-';
            }
            
            if (cardElement) {
                cardElement.className = `worker-card ${worker.status}`;
            }
        });
    }

    updateMetrics() {
        if (!this.scheduler) return;
        
        const metrics = this.scheduler.getMetrics();
        
        document.getElementById('totalTasks').textContent = metrics.totalTasks || 0;
        document.getElementById('completedTasks').textContent = metrics.completedTasks || 0;
        document.getElementById('failedTasks').textContent = metrics.failedTasks || 0;
        document.getElementById('activeTasks').textContent = metrics.activeTasks || 0;
        document.getElementById('queueSize').textContent = metrics.queueSize || 0;
        document.getElementById('circuitBreakerState').textContent = metrics.circuitBreakerState || 'CLOSED';
    }

    updateMetricsDisplay(metrics) {
        this.updateMetrics();
    }

    async cancelTask(taskId) {
        try {
            await this.scheduler.cancelTask(taskId);
            this.log(`Task cancelled: ${taskId}`, 'info');
            this.showNotification('Task cancelled', 'warning');
        } catch (error) {
            this.log(`Failed to cancel task: ${error.message}`, 'error');
            this.showNotification('Failed to cancel task', 'error');
        }
    }

    log(message, level = 'info') {
        const logContainer = document.getElementById('logContainer');
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${level}`;
        logEntry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-level">[${level.toUpperCase()}]</span>
            <span class="log-message">${message}</span>
        `;
        
        logContainer.appendChild(logEntry);
        
        if (this.autoScrollLogs) {
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        
        // Keep only last 100 log entries
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 100) {
            entries[0].remove();
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TaskSchedulerApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause some operations
        if (window.app && window.app.scheduler) {
            window.app.scheduler.pauseQueue();
        }
    } else {
        // Page is visible, resume operations
        if (window.app && window.app.scheduler) {
            window.app.scheduler.resumeQueue();
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app && window.app.scheduler) {
        window.app.scheduler.stop();
    }
});


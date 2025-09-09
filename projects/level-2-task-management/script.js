// Task Management System - Level 2 JavaScript Project
// Demonstrates: Control Flow, Data Structures, OOP, Functional Programming, Error Handling

// Custom Error Classes
class TaskError extends Error {
    constructor(message, field = null) {
        super(message);
        this.name = 'TaskError';
        this.field = field;
    }
}

class ValidationError extends TaskError {
    constructor(message, field) {
        super(message, field);
        this.name = 'ValidationError';
    }
}

class StorageError extends TaskError {
    constructor(message) {
        super(message);
        this.name = 'StorageError';
    }
}

// Task Class - Object-Oriented Programming
class Task {
    constructor(title, description = '', priority = 'medium', category = 'other', dueDate = null, status = 'pending') {
        this.id = this.generateId();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.category = category;
        this.dueDate = dueDate;
        this.status = status;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    update(updates) {
        const allowedFields = ['title', 'description', 'priority', 'category', 'dueDate', 'status'];
        
        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                this[key] = value;
            }
        }
        
        this.updatedAt = new Date();
    }

    isOverdue() {
        if (!this.dueDate || this.status === 'completed') {
            return false;
        }
        return new Date(this.dueDate) < new Date();
    }

    getDaysUntilDue() {
        if (!this.dueDate) {
            return null;
        }
        const today = new Date();
        const due = new Date(this.dueDate);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            category: this.category,
            dueDate: this.dueDate,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromJSON(data) {
        const task = new Task(data.title, data.description, data.priority, data.category, data.dueDate, data.status);
        task.id = data.id;
        task.createdAt = new Date(data.createdAt);
        task.updatedAt = new Date(data.updatedAt);
        return task;
    }
}

// TaskManager Class - Main Application Logic
class TaskManager {
    constructor() {
        this.tasks = [];
        this.filters = {
            search: '',
            status: '',
            priority: '',
            category: ''
        };
        this.sortBy = 'created';
        this.sortOrder = 'desc';
        
        this.initializeEventListeners();
        this.loadTasks();
        this.render();
    }

    // Control Flow - Conditional Logic and Loops
    addTask(taskData) {
        try {
            this.validateTaskData(taskData);
            
            const task = new Task(
                taskData.title,
                taskData.description,
                taskData.priority,
                taskData.category,
                taskData.dueDate,
                taskData.status
            );
            
            this.tasks.push(task);
            this.saveTasks();
            this.render();
            this.showSuccess('Task added successfully!');
            
            return task;
        } catch (error) {
            this.showError(error.message);
            throw error;
        }
    }

    updateTask(taskId, updates) {
        try {
            const taskIndex = this.tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex === -1) {
                throw new TaskError('Task not found');
            }
            
            if (updates.title) {
                this.validateTitle(updates.title);
            }
            
            this.tasks[taskIndex].update(updates);
            this.saveTasks();
            this.render();
            this.showSuccess('Task updated successfully!');
            
            return this.tasks[taskIndex];
        } catch (error) {
            this.showError(error.message);
            throw error;
        }
    }

    deleteTask(taskId) {
        try {
            const taskIndex = this.tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex === -1) {
                throw new TaskError('Task not found');
            }
            
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.render();
            this.showSuccess('Task deleted successfully!');
            
            return true;
        } catch (error) {
            this.showError(error.message);
            throw error;
        }
    }

    // Data Structures - Array Methods and Object Manipulation
    getFilteredTasks() {
        let filteredTasks = [...this.tasks];
        
        // Apply search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply status filter
        if (this.filters.status) {
            filteredTasks = filteredTasks.filter(task => task.status === this.filters.status);
        }
        
        // Apply priority filter
        if (this.filters.priority) {
            filteredTasks = filteredTasks.filter(task => task.priority === this.filters.priority);
        }
        
        // Apply category filter
        if (this.filters.category) {
            filteredTasks = filteredTasks.filter(task => task.category === this.filters.category);
        }
        
        return filteredTasks;
    }

    getSortedTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        return filteredTasks.sort((a, b) => {
            let comparison = 0;
            
            switch (this.sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) comparison = 0;
                    else if (!a.dueDate) comparison = 1;
                    else if (!b.dueDate) comparison = -1;
                    else comparison = new Date(a.dueDate) - new Date(b.dueDate);
                    break;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
                    break;
                case 'created':
                default:
                    comparison = new Date(a.createdAt) - new Date(b.createdAt);
                    break;
            }
            
            return this.sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    // Functional Programming - Pure Functions and Higher-Order Functions
    getTaskStatistics() {
        const totalTasks = this.tasks.length;
        
        const statusCounts = this.tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        
        const priorityCounts = this.tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});
        
        const overdueTasks = this.tasks.filter(task => task.isOverdue()).length;
        
        return {
            total: totalTasks,
            completed: statusCounts.completed || 0,
            inProgress: statusCounts['in-progress'] || 0,
            pending: statusCounts.pending || 0,
            highPriority: priorityCounts.high || 0,
            overdue: overdueTasks
        };
    }

    // Error Handling - Validation and Error Management
    validateTaskData(data) {
        if (!data.title || typeof data.title !== 'string') {
            throw new ValidationError('Title is required and must be a string', 'title');
        }
        
        if (data.title.trim().length < 3) {
            throw new ValidationError('Title must be at least 3 characters long', 'title');
        }
        
        if (data.title.length > 100) {
            throw new ValidationError('Title must be less than 100 characters', 'title');
        }
        
        if (data.description && data.description.length > 500) {
            throw new ValidationError('Description must be less than 500 characters', 'description');
        }
        
        const validPriorities = ['low', 'medium', 'high'];
        if (data.priority && !validPriorities.includes(data.priority)) {
            throw new ValidationError('Priority must be low, medium, or high', 'priority');
        }
        
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (data.status && !validStatuses.includes(data.status)) {
            throw new ValidationError('Status must be pending, in-progress, or completed', 'status');
        }
        
        if (data.dueDate && new Date(data.dueDate) < new Date()) {
            throw new ValidationError('Due date cannot be in the past', 'dueDate');
        }
    }

    validateTitle(title) {
        if (!title || typeof title !== 'string') {
            throw new ValidationError('Title is required and must be a string', 'title');
        }
        
        if (title.trim().length < 3) {
            throw new ValidationError('Title must be at least 3 characters long', 'title');
        }
        
        if (title.length > 100) {
            throw new ValidationError('Title must be less than 100 characters', 'title');
        }
    }

    // Local Storage - Data Persistence
    saveTasks() {
        try {
            const tasksData = this.tasks.map(task => task.toJSON());
            localStorage.setItem('taskManager_tasks', JSON.stringify(tasksData));
        } catch (error) {
            throw new StorageError('Failed to save tasks to local storage');
        }
    }

    loadTasks() {
        try {
            const tasksData = localStorage.getItem('taskManager_tasks');
            if (tasksData) {
                const parsedTasks = JSON.parse(tasksData);
                this.tasks = parsedTasks.map(taskData => Task.fromJSON(taskData));
            }
        } catch (error) {
            console.error('Failed to load tasks from local storage:', error);
            this.tasks = [];
        }
    }

    // DOM Manipulation and Event Handling
    initializeEventListeners() {
        // Form submission
        const taskForm = document.getElementById('taskForm');
        taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Filter inputs
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e));
        
        const statusFilter = document.getElementById('statusFilter');
        statusFilter.addEventListener('change', (e) => this.handleStatusFilter(e));
        
        const priorityFilter = document.getElementById('priorityFilter');
        priorityFilter.addEventListener('change', (e) => this.handlePriorityFilter(e));
        
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e));
        
        const sortBy = document.getElementById('sortBy');
        sortBy.addEventListener('change', (e) => this.handleSort(e));
        
        const clearFilters = document.getElementById('clearFilters');
        clearFilters.addEventListener('click', () => this.clearFilters());
        
        // Modal close
        const errorModal = document.getElementById('errorModal');
        const closeBtn = errorModal.querySelector('.close');
        closeBtn.addEventListener('click', () => this.hideError());
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target === errorModal) {
                this.hideError();
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim(),
            priority: formData.get('priority'),
            category: formData.get('category'),
            dueDate: formData.get('dueDate') || null,
            status: formData.get('status')
        };
        
        try {
            this.addTask(taskData);
            e.target.reset();
        } catch (error) {
            // Error already handled in addTask method
        }
    }

    handleSearch(e) {
        this.filters.search = e.target.value;
        this.render();
    }

    handleStatusFilter(e) {
        this.filters.status = e.target.value;
        this.render();
    }

    handlePriorityFilter(e) {
        this.filters.priority = e.target.value;
        this.render();
    }

    handleCategoryFilter(e) {
        this.filters.category = e.target.value;
        this.render();
    }

    handleSort(e) {
        this.sortBy = e.target.value;
        this.render();
    }

    clearFilters() {
        this.filters = {
            search: '',
            status: '',
            priority: '',
            category: ''
        };
        
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('priorityFilter').value = '';
        document.getElementById('categoryFilter').value = '';
        
        this.render();
    }

    // Rendering - DOM Updates
    render() {
        this.renderTaskList();
        this.renderStatistics();
    }

    renderTaskList() {
        const taskList = document.getElementById('taskList');
        const sortedTasks = this.getSortedTasks();
        
        if (sortedTasks.length === 0) {
            taskList.innerHTML = '<div class="no-tasks"><p>No tasks found. Add a new task to get started!</p></div>';
            return;
        }
        
        taskList.innerHTML = sortedTasks.map(task => this.createTaskHTML(task)).join('');
        
        // Add event listeners to task buttons
        this.attachTaskEventListeners();
    }

    createTaskHTML(task) {
        const isOverdue = task.isOverdue();
        const daysUntilDue = task.getDaysUntilDue();
        
        return `
            <div class="task-item ${task.status} ${task.priority}-priority ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
                <div class="task-header">
                    <div>
                        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                        <span class="task-status ${task.status}">${task.status.replace('-', ' ')}</span>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-sm btn-success" onclick="taskManager.toggleTaskStatus('${task.id}')">
                            ${task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="taskManager.editTask('${task.id}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="taskManager.deleteTask('${task.id}')">Delete</button>
                    </div>
                </div>
                
                ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                
                <div class="task-meta">
                    <div class="task-meta-item">
                        <strong>Priority:</strong>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                    </div>
                    <div class="task-meta-item">
                        <strong>Category:</strong>
                        <span class="task-category">${task.category}</span>
                    </div>
                    ${task.dueDate ? `
                        <div class="task-meta-item">
                            <strong>Due Date:</strong>
                            <span>${new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div class="task-meta-item">
                            <strong>Days Until Due:</strong>
                            <span class="${isOverdue ? 'overdue' : ''}">${isOverdue ? 'Overdue' : (daysUntilDue === 0 ? 'Today' : `${daysUntilDue} days`)}</span>
                        </div>
                    ` : ''}
                    <div class="task-meta-item">
                        <strong>Created:</strong>
                        <span>${new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    attachTaskEventListeners() {
        // Event listeners are attached via onclick attributes in the HTML
        // This is a simple approach for this project
    }

    renderStatistics() {
        const stats = this.getTaskStatistics();
        
        document.getElementById('totalTasks').textContent = stats.total;
        document.getElementById('completedTasks').textContent = stats.completed;
        document.getElementById('inProgressTasks').textContent = stats.inProgress;
        document.getElementById('pendingTasks').textContent = stats.pending;
        document.getElementById('highPriorityTasks').textContent = stats.highPriority;
        document.getElementById('overdueTasks').textContent = stats.overdue;
    }

    // Task Actions
    toggleTaskStatus(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        this.updateTask(taskId, { status: newStatus });
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Pre-fill form with task data
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskCategory').value = task.category;
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskStatus').value = task.status;
        
        // Scroll to form
        document.querySelector('.task-form-section').scrollIntoView({ behavior: 'smooth' });
        
        // Store task ID for update
        document.getElementById('taskForm').dataset.editingTaskId = taskId;
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccess(message) {
        const toast = document.getElementById('successToast');
        const messageEl = document.getElementById('successMessage');
        
        messageEl.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    showError(message) {
        const modal = document.getElementById('errorModal');
        const messageEl = document.getElementById('errorMessage');
        
        messageEl.textContent = message;
        modal.style.display = 'block';
    }

    hideError() {
        const modal = document.getElementById('errorModal');
        modal.style.display = 'none';
    }
}

// Initialize the application
let taskManager;

document.addEventListener('DOMContentLoaded', () => {
    try {
        taskManager = new TaskManager();
        console.log('Task Management System initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Task Management System:', error);
        alert('Failed to initialize the application. Please refresh the page.');
    }
});

// Handle form editing
document.getElementById('taskForm').addEventListener('submit', (e) => {
    const editingTaskId = e.target.dataset.editingTaskId;
    
    if (editingTaskId) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('title').trim(),
            description: formData.get('description').trim(),
            priority: formData.get('priority'),
            category: formData.get('category'),
            dueDate: formData.get('dueDate') || null,
            status: formData.get('status')
        };
        
        try {
            taskManager.updateTask(editingTaskId, taskData);
            e.target.reset();
            delete e.target.dataset.editingTaskId;
        } catch (error) {
            // Error already handled in updateTask method
        }
    }
});


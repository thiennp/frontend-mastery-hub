// Priority Queue
// Implements a priority queue for task scheduling

class PriorityQueue {
    constructor(options = {}) {
        this.items = [];
        this.comparator = options.comparator || this.defaultComparator;
        this.maxSize = options.maxSize || Infinity;
        this.autoSort = options.autoSort !== false;
        this.priorityLevels = options.priorityLevels || {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1
        };
    }

    // Default comparator function
    defaultComparator(a, b) {
        // First compare by priority level
        const priorityA = this.priorityLevels[a.priority] || 0;
        const priorityB = this.priorityLevels[b.priority] || 0;
        
        if (priorityA !== priorityB) {
            return priorityB - priorityA; // Higher priority first
        }
        
        // Then compare by creation time (FIFO for same priority)
        return a.createdAt - b.createdAt;
    }

    // Add item to queue
    enqueue(item) {
        if (this.isFull()) {
            throw new Error('Queue is full');
        }

        // Add metadata
        const queueItem = {
            ...item,
            id: item.id || this.generateId(),
            createdAt: item.createdAt || Date.now(),
            priority: item.priority || 'medium',
            status: 'pending'
        };

        this.items.push(queueItem);
        
        if (this.autoSort) {
            this.sort();
        }

        return queueItem.id;
    }

    // Remove and return highest priority item
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }

        if (this.autoSort) {
            this.sort();
        }

        return this.items.shift();
    }

    // Peek at highest priority item without removing
    peek() {
        if (this.isEmpty()) {
            return null;
        }

        if (this.autoSort) {
            this.sort();
        }

        return this.items[0];
    }

    // Get item by ID
    getById(id) {
        return this.items.find(item => item.id === id);
    }

    // Update item by ID
    updateById(id, updates) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...updates };
            if (this.autoSort) {
                this.sort();
            }
            return true;
        }
        return false;
    }

    // Remove item by ID
    removeById(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }

    // Check if queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Check if queue is full
    isFull() {
        return this.items.length >= this.maxSize;
    }

    // Get queue size
    size() {
        return this.items.length;
    }

    // Get all items
    getAll() {
        return [...this.items];
    }

    // Get items by priority
    getByPriority(priority) {
        return this.items.filter(item => item.priority === priority);
    }

    // Get items by status
    getByStatus(status) {
        return this.items.filter(item => item.status === status);
    }

    // Sort the queue
    sort() {
        this.items.sort(this.comparator);
    }

    // Clear the queue
    clear() {
        this.items = [];
    }

    // Filter items
    filter(predicate) {
        return this.items.filter(predicate);
    }

    // Find first item matching predicate
    find(predicate) {
        return this.items.find(predicate);
    }

    // Find index of first item matching predicate
    findIndex(predicate) {
        return this.items.findIndex(predicate);
    }

    // Map over items
    map(callback) {
        return this.items.map(callback);
    }

    // Reduce items
    reduce(callback, initialValue) {
        return this.items.reduce(callback, initialValue);
    }

    // For each item
    forEach(callback) {
        this.items.forEach(callback);
    }

    // Get queue statistics
    getStats() {
        const stats = {
            total: this.items.length,
            byPriority: {},
            byStatus: {},
            oldest: null,
            newest: null
        };

        // Count by priority
        for (const priority in this.priorityLevels) {
            stats.byPriority[priority] = this.getByPriority(priority).length;
        }

        // Count by status
        const statuses = [...new Set(this.items.map(item => item.status))];
        statuses.forEach(status => {
            stats.byStatus[status] = this.getByStatus(status).length;
        });

        // Find oldest and newest
        if (this.items.length > 0) {
            const sortedByTime = [...this.items].sort((a, b) => a.createdAt - b.createdAt);
            stats.oldest = sortedByTime[0];
            stats.newest = sortedByTime[sortedByTime.length - 1];
        }

        return stats;
    }

    // Get items in priority order
    getPriorityOrder() {
        const sorted = [...this.items];
        sorted.sort(this.comparator);
        return sorted;
    }

    // Move item to front of queue
    moveToFront(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            const item = this.items.splice(index, 1)[0];
            this.items.unshift(item);
            return true;
        }
        return false;
    }

    // Move item to back of queue
    moveToBack(id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            const item = this.items.splice(index, 1)[0];
            this.items.push(item);
            return true;
        }
        return false;
    }

    // Swap two items
    swap(id1, id2) {
        const index1 = this.items.findIndex(item => item.id === id1);
        const index2 = this.items.findIndex(item => item.id === id2);
        
        if (index1 !== -1 && index2 !== -1) {
            [this.items[index1], this.items[index2]] = [this.items[index2], this.items[index1]];
            return true;
        }
        return false;
    }

    // Get items within time range
    getByTimeRange(startTime, endTime) {
        return this.items.filter(item => 
            item.createdAt >= startTime && item.createdAt <= endTime
        );
    }

    // Get items older than specified time
    getOlderThan(time) {
        return this.items.filter(item => item.createdAt < time);
    }

    // Get items newer than specified time
    getNewerThan(time) {
        return this.items.filter(item => item.createdAt > time);
    }

    // Batch operations
    enqueueBatch(items) {
        const results = [];
        for (const item of items) {
            try {
                const id = this.enqueue(item);
                results.push({ success: true, id, item });
            } catch (error) {
                results.push({ success: false, error: error.message, item });
            }
        }
        return results;
    }

    dequeueBatch(count) {
        const results = [];
        for (let i = 0; i < count && !this.isEmpty(); i++) {
            results.push(this.dequeue());
        }
        return results;
    }

    // Convert to array
    toArray() {
        return [...this.items];
    }

    // Convert to JSON
    toJSON() {
        return {
            items: this.items,
            maxSize: this.maxSize,
            priorityLevels: this.priorityLevels,
            stats: this.getStats()
        };
    }

    // Create from JSON
    static fromJSON(json) {
        const queue = new PriorityQueue({
            maxSize: json.maxSize,
            priorityLevels: json.priorityLevels
        });
        queue.items = json.items || [];
        return queue;
    }

    // Generate unique ID
    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Custom comparator for specific use cases
    setComparator(comparator) {
        if (typeof comparator !== 'function') {
            throw new TypeError('Comparator must be a function');
        }
        this.comparator = comparator;
        if (this.autoSort) {
            this.sort();
        }
    }

    // Set priority levels
    setPriorityLevels(levels) {
        this.priorityLevels = { ...this.priorityLevels, ...levels };
        if (this.autoSort) {
            this.sort();
        }
    }

    // Get priority level for a priority name
    getPriorityLevel(priority) {
        return this.priorityLevels[priority] || 0;
    }

    // Check if item exists
    has(id) {
        return this.items.some(item => item.id === id);
    }

    // Get index of item
    indexOf(id) {
        return this.items.findIndex(item => item.id === id);
    }

    // Insert item at specific index
    insertAt(index, item) {
        if (index < 0 || index > this.items.length) {
            throw new Error('Index out of bounds');
        }
        
        if (this.isFull()) {
            throw new Error('Queue is full');
        }

        const queueItem = {
            ...item,
            id: item.id || this.generateId(),
            createdAt: item.createdAt || Date.now(),
            priority: item.priority || 'medium',
            status: 'pending'
        };

        this.items.splice(index, 0, queueItem);
        return queueItem.id;
    }

    // Remove item at specific index
    removeAt(index) {
        if (index < 0 || index >= this.items.length) {
            return null;
        }
        return this.items.splice(index, 1)[0];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PriorityQueue;
}



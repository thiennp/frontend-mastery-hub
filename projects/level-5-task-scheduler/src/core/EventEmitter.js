// Event Emitter
// Provides event-driven communication between components

class EventEmitter {
    constructor() {
        this.events = new Map();
        this.maxListeners = 10;
        this.warnOnMaxListeners = true;
    }

    // Add event listener
    on(event, listener, options = {}) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }

        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        const listeners = this.events.get(event);
        
        // Check max listeners
        if (listeners.length >= this.maxListeners) {
            if (this.warnOnMaxListeners) {
                console.warn(`Max listeners (${this.maxListeners}) exceeded for event "${event}"`);
            }
        }

        const listenerInfo = {
            listener,
            once: options.once || false,
            priority: options.priority || 0,
            id: options.id || Math.random().toString(36).substr(2, 9)
        };

        listeners.push(listenerInfo);
        
        // Sort by priority (higher priority first)
        listeners.sort((a, b) => b.priority - a.priority);

        return listenerInfo.id;
    }

    // Add one-time event listener
    once(event, listener, options = {}) {
        return this.on(event, listener, { ...options, once: true });
    }

    // Remove event listener
    off(event, listenerOrId) {
        if (!this.events.has(event)) {
            return false;
        }

        const listeners = this.events.get(event);
        
        if (typeof listenerOrId === 'string') {
            // Remove by ID
            const index = listeners.findIndex(l => l.id === listenerOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
                return true;
            }
        } else if (typeof listenerOrId === 'function') {
            // Remove by function reference
            const index = listeners.findIndex(l => l.listener === listenerOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
                return true;
            }
        }

        return false;
    }

    // Remove all listeners for an event
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    // Emit event
    emit(event, ...args) {
        if (!this.events.has(event)) {
            return false;
        }

        const listeners = this.events.get(event);
        const toRemove = [];

        for (let i = 0; i < listeners.length; i++) {
            const listenerInfo = listeners[i];
            
            try {
                listenerInfo.listener.apply(this, args);
                
                if (listenerInfo.once) {
                    toRemove.push(i);
                }
            } catch (error) {
                console.error(`Error in event listener for "${event}":`, error);
            }
        }

        // Remove one-time listeners
        for (let i = toRemove.length - 1; i >= 0; i--) {
            listeners.splice(toRemove[i], 1);
        }

        return listeners.length > 0;
    }

    // Emit event asynchronously
    async emitAsync(event, ...args) {
        if (!this.events.has(event)) {
            return false;
        }

        const listeners = this.events.get(event);
        const toRemove = [];
        const promises = [];

        for (let i = 0; i < listeners.length; i++) {
            const listenerInfo = listeners[i];
            
            try {
                const result = listenerInfo.listener.apply(this, args);
                
                if (result && typeof result.then === 'function') {
                    promises.push(result);
                }
                
                if (listenerInfo.once) {
                    toRemove.push(i);
                }
            } catch (error) {
                console.error(`Error in async event listener for "${event}":`, error);
            }
        }

        // Wait for all promises to resolve
        if (promises.length > 0) {
            try {
                await Promise.all(promises);
            } catch (error) {
                console.error(`Error in async event listeners for "${event}":`, error);
            }
        }

        // Remove one-time listeners
        for (let i = toRemove.length - 1; i >= 0; i--) {
            listeners.splice(toRemove[i], 1);
        }

        return listeners.length > 0;
    }

    // Emit event sequentially (one after another)
    async emitSequential(event, ...args) {
        if (!this.events.has(event)) {
            return false;
        }

        const listeners = this.events.get(event);
        const toRemove = [];

        for (let i = 0; i < listeners.length; i++) {
            const listenerInfo = listeners[i];
            
            try {
                const result = listenerInfo.listener.apply(this, args);
                
                if (result && typeof result.then === 'function') {
                    await result;
                }
                
                if (listenerInfo.once) {
                    toRemove.push(i);
                }
            } catch (error) {
                console.error(`Error in sequential event listener for "${event}":`, error);
            }
        }

        // Remove one-time listeners
        for (let i = toRemove.length - 1; i >= 0; i--) {
            listeners.splice(toRemove[i], 1);
        }

        return listeners.length > 0;
    }

    // Get listener count for an event
    listenerCount(event) {
        if (!this.events.has(event)) {
            return 0;
        }
        return this.events.get(event).length;
    }

    // Get all event names
    eventNames() {
        return Array.from(this.events.keys());
    }

    // Get listeners for an event
    listeners(event) {
        if (!this.events.has(event)) {
            return [];
        }
        return this.events.get(event).map(l => l.listener);
    }

    // Set max listeners
    setMaxListeners(n) {
        if (typeof n !== 'number' || n < 0) {
            throw new TypeError('Max listeners must be a non-negative number');
        }
        this.maxListeners = n;
    }

    // Get max listeners
    getMaxListeners() {
        return this.maxListeners;
    }

    // Create a promise that resolves when an event is emitted
    oncePromise(event, timeout = 0) {
        return new Promise((resolve, reject) => {
            let timeoutId;
            
            const listener = (...args) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                resolve(args);
            };
            
            this.once(event, listener);
            
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    this.off(event, listener);
                    reject(new Error(`Event "${event}" timeout after ${timeout}ms`));
                }, timeout);
            }
        });
    }

    // Create a promise that resolves when any of multiple events is emitted
    onceAnyPromise(events, timeout = 0) {
        return new Promise((resolve, reject) => {
            let timeoutId;
            const listeners = new Map();
            
            const cleanup = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                listeners.forEach((listener, event) => {
                    this.off(event, listener);
                });
            };
            
            const onEvent = (event) => (...args) => {
                cleanup();
                resolve({ event, args });
            };
            
            events.forEach(event => {
                const listener = onEvent(event);
                listeners.set(event, listener);
                this.once(event, listener);
            });
            
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    cleanup();
                    reject(new Error(`None of events [${events.join(', ')}] emitted within ${timeout}ms`));
                }, timeout);
            }
        });
    }

    // Get event emitter statistics
    getStats() {
        const stats = {
            totalEvents: this.events.size,
            totalListeners: 0,
            events: {}
        };
        
        for (const [event, listeners] of this.events) {
            stats.events[event] = {
                listenerCount: listeners.length,
                onceListeners: listeners.filter(l => l.once).length,
                regularListeners: listeners.filter(l => !l.once).length
            };
            stats.totalListeners += listeners.length;
        }
        
        return stats;
    }

    // Create a child event emitter that forwards events
    createChild() {
        const child = new EventEmitter();
        
        // Forward all events from child to parent
        child.on('*', (event, ...args) => {
            this.emit(event, ...args);
        });
        
        return child;
    }

    // Forward events from another emitter
    forwardFrom(emitter, events) {
        if (Array.isArray(events)) {
            events.forEach(event => {
                emitter.on(event, (...args) => {
                    this.emit(event, ...args);
                });
            });
        } else {
            // Forward all events
            emitter.on('*', (event, ...args) => {
                this.emit(event, ...args);
            });
        }
    }

    // Destroy the event emitter
    destroy() {
        this.events.clear();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventEmitter;
}



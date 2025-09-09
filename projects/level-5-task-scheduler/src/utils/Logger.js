// Logger Utility
// Provides structured logging functionality

class Logger {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.enableConsole = options.enableConsole !== false;
        this.enableStorage = options.enableStorage || false;
        this.maxEntries = options.maxEntries || 1000;
        this.entries = [];
        
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
    }

    log(level, message, data = null) {
        if (this.levels[level] < this.levels[this.level]) {
            return;
        }

        const entry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            data,
            id: Math.random().toString(36).substr(2, 9)
        };

        this.entries.push(entry);

        // Keep only the last maxEntries
        if (this.entries.length > this.maxEntries) {
            this.entries = this.entries.slice(-this.maxEntries);
        }

        if (this.enableConsole) {
            this.logToConsole(entry);
        }

        if (this.enableStorage) {
            this.logToStorage(entry);
        }

        return entry;
    }

    debug(message, data = null) {
        return this.log('debug', message, data);
    }

    info(message, data = null) {
        return this.log('info', message, data);
    }

    warn(message, data = null) {
        return this.log('warn', message, data);
    }

    error(message, data = null) {
        return this.log('error', message, data);
    }

    logToConsole(entry) {
        const { timestamp, level, message, data } = entry;
        const timeStr = new Date(timestamp).toLocaleTimeString();
        const prefix = `[${timeStr}] [${level}]`;
        
        switch (level) {
            case 'DEBUG':
                console.debug(prefix, message, data || '');
                break;
            case 'INFO':
                console.info(prefix, message, data || '');
                break;
            case 'WARN':
                console.warn(prefix, message, data || '');
                break;
            case 'ERROR':
                console.error(prefix, message, data || '');
                break;
        }
    }

    logToStorage(entry) {
        try {
            const stored = localStorage.getItem('logger_entries');
            const entries = stored ? JSON.parse(stored) : [];
            entries.push(entry);
            
            // Keep only last maxEntries
            if (entries.length > this.maxEntries) {
                entries.splice(0, entries.length - this.maxEntries);
            }
            
            localStorage.setItem('logger_entries', JSON.stringify(entries));
        } catch (error) {
            console.error('Failed to store log entry:', error);
        }
    }

    getEntries(level = null, limit = null) {
        let entries = this.entries;
        
        if (level) {
            entries = entries.filter(entry => entry.level === level.toUpperCase());
        }
        
        if (limit) {
            entries = entries.slice(-limit);
        }
        
        return entries;
    }

    clear() {
        this.entries = [];
        if (this.enableStorage) {
            localStorage.removeItem('logger_entries');
        }
    }

    export(format = 'json') {
        const entries = this.entries;
        
        switch (format) {
            case 'json':
                return JSON.stringify(entries, null, 2);
            case 'csv':
                return this.exportToCSV(entries);
            case 'txt':
                return this.exportToText(entries);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    exportToCSV(entries) {
        const headers = ['timestamp', 'level', 'message', 'data'];
        const csvContent = [
            headers.join(','),
            ...entries.map(entry => [
                entry.timestamp,
                entry.level,
                `"${entry.message.replace(/"/g, '""')}"`,
                entry.data ? `"${JSON.stringify(entry.data).replace(/"/g, '""')}"` : ''
            ].join(','))
        ].join('\n');
        
        return csvContent;
    }

    exportToText(entries) {
        return entries.map(entry => {
            const timeStr = new Date(entry.timestamp).toLocaleString();
            const dataStr = entry.data ? ` | Data: ${JSON.stringify(entry.data)}` : '';
            return `[${timeStr}] [${entry.level}] ${entry.message}${dataStr}`;
        }).join('\n');
    }

    setLevel(level) {
        if (this.levels[level] !== undefined) {
            this.level = level;
        } else {
            throw new Error(`Invalid log level: ${level}`);
        }
    }

    getStats() {
        const stats = {
            total: this.entries.length,
            byLevel: {}
        };
        
        this.levels.forEach(level => {
            stats.byLevel[level] = this.entries.filter(entry => entry.level === level.toUpperCase()).length;
        });
        
        return stats;
    }
}

// Create a default logger instance
window.logger = new Logger({
    level: 'info',
    enableConsole: true,
    enableStorage: false,
    maxEntries: 1000
});


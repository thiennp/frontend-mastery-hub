// Error Handler Utility
// Level 4 Mini-Project

class ErrorHandler {
    constructor() {
        this.errorTypes = {
            NETWORK_ERROR: 'NETWORK_ERROR',
            API_ERROR: 'API_ERROR',
            GEOLOCATION_ERROR: 'GEOLOCATION_ERROR',
            STORAGE_ERROR: 'STORAGE_ERROR',
            VALIDATION_ERROR: 'VALIDATION_ERROR',
            UNKNOWN_ERROR: 'UNKNOWN_ERROR'
        };
    }
    
    handle(error, context = '') {
        const errorInfo = this.analyzeError(error);
        
        console.error(`Error in ${context}:`, errorInfo);
        
        // Log to external service if available
        this.logError(errorInfo, context);
        
        // Return user-friendly error message
        return this.getUserFriendlyMessage(errorInfo);
    }
    
    analyzeError(error) {
        const errorInfo = {
            type: this.errorTypes.UNKNOWN_ERROR,
            message: error.message || 'Unknown error occurred',
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Determine error type
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorInfo.type = this.errorTypes.NETWORK_ERROR;
        } else if (error.name === 'GeolocationPositionError') {
            errorInfo.type = this.errorTypes.GEOLOCATION_ERROR;
        } else if (error.message.includes('API')) {
            errorInfo.type = this.errorTypes.API_ERROR;
        } else if (error.message.includes('storage') || error.message.includes('localStorage')) {
            errorInfo.type = this.errorTypes.STORAGE_ERROR;
        } else if (error.message.includes('validation')) {
            errorInfo.type = this.errorTypes.VALIDATION_ERROR;
        }
        
        return errorInfo;
    }
    
    getUserFriendlyMessage(errorInfo) {
        const messages = {
            [this.errorTypes.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection and try again.',
            [this.errorTypes.API_ERROR]: 'Weather service is temporarily unavailable. Please try again later.',
            [this.errorTypes.GEOLOCATION_ERROR]: 'Location access denied. Please enable location services or search for a city manually.',
            [this.errorTypes.STORAGE_ERROR]: 'Unable to save preferences. Please check your browser settings.',
            [this.errorTypes.VALIDATION_ERROR]: 'Invalid input provided. Please check your data and try again.',
            [this.errorTypes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again or refresh the page.'
        };
        
        return messages[errorInfo.type] || messages[this.errorTypes.UNKNOWN_ERROR];
    }
    
    logError(errorInfo, context) {
        // In a real application, you would send this to an error logging service
        // For now, we'll just log to console
        console.log('Error logged:', {
            ...errorInfo,
            context
        });
        
        // Example: Send to external service
        // this.sendToErrorService(errorInfo, context);
    }
    
    // sendToErrorService(errorInfo, context) {
    //     fetch('/api/errors', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             ...errorInfo,
    //             context
    //         })
    //     }).catch(err => {
    //         console.error('Failed to log error:', err);
    //     });
    // }
    
    createError(type, message, originalError = null) {
        const error = new Error(message);
        error.type = type;
        error.originalError = originalError;
        error.timestamp = new Date().toISOString();
        return error;
    }
    
    isRetryableError(error) {
        const retryableTypes = [
            this.errorTypes.NETWORK_ERROR,
            this.errorTypes.API_ERROR
        ];
        
        const errorInfo = this.analyzeError(error);
        return retryableTypes.includes(errorInfo.type);
    }
    
    getRetryDelay(attemptNumber, baseDelay = 1000) {
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attemptNumber);
        const jitter = Math.random() * 0.1 * delay;
        return delay + jitter;
    }
}

// Global error handler instance
window.errorHandler = new ErrorHandler();



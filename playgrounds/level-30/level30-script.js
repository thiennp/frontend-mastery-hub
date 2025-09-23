// Level 30: Microservices & API Architecture Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['microservicesArchitecture', 'ServiceRegistry', 'register', 'discover'],
        description: 'Microservices Design Patterns'
    },
    2: {
        required: ['APIGateway', 'addRoute', 'handleRequest', 'checkRateLimit'],
        description: 'API Gateway Implementation'
    },
    3: {
        required: ['ServiceDiscovery', 'LoadBalancer', 'selectInstance', 'performHealthCheck'],
        description: 'Service Discovery & Load Balancing'
    },
    4: {
        required: ['EventBus', 'MessageQueue', 'subscribe', 'publish'],
        description: 'Event-Driven Architecture'
    },
    5: {
        required: ['CircuitBreaker', 'BulkheadPool', 'DistributedTracer'],
        description: 'Distributed Systems Patterns'
    }
};

// Initialize level
document.addEventListener('DOMContentLoaded', function() {
    initializeLevel();
    loadProgress();
});

function initializeLevel() {
    // Set up code editors
    for (let i = 1; i <= 5; i++) {
        const textarea = document.getElementById(`code${i}`);
        if (textarea) {
            textarea.addEventListener('input', function() {
                clearOutput(i);
            });
        }
    }
    
    // Initialize progress
    updateProgress();
}

function runCode(exerciseNumber) {
    const code = document.getElementById(`code${exerciseNumber}`).value;
    const output = document.getElementById(`output${exerciseNumber}`);
    
    if (!code.trim()) {
        showOutput(exerciseNumber, 'Please enter some code to run.', 'error');
        return;
    }
    
    try {
        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;
        let outputText = '';
        
        console.log = function(...args) {
            outputText += args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
        };
        
        console.error = function(...args) {
            outputText += 'ERROR: ' + args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
        };
        
        // Execute code
        const result = eval(code);
        
        // Restore console
        console.log = originalLog;
        console.error = originalError;
        
        // Show output
        if (outputText) {
            showOutput(exerciseNumber, outputText, 'success');
        } else if (result !== undefined) {
            showOutput(exerciseNumber, JSON.stringify(result, null, 2), 'success');
        } else {
            showOutput(exerciseNumber, 'Code executed successfully!', 'success');
        }
        
    } catch (error) {
        showOutput(exerciseNumber, `Error: ${error.message}`, 'error');
    }
}

function validateExercise(exerciseNumber) {
    const code = document.getElementById(`code${exerciseNumber}`).value;
    const pattern = exercisePatterns[exerciseNumber];
    
    if (!pattern) {
        showOutput(exerciseNumber, 'Validation pattern not found.', 'error');
        return;
    }
    
    let missing = [];
    let found = [];
    
    // Check for required patterns
    for (const required of pattern.required) {
        if (code.includes(required)) {
            found.push(required);
        } else {
            missing.push(required);
        }
    }
    
    let message = `Validating ${pattern.description}...\n\n`;
    
    if (found.length > 0) {
        message += `✅ Found: ${found.join(', ')}\n`;
    }
    
    if (missing.length > 0) {
        message += `❌ Missing: ${missing.join(', ')}\n`;
    }
    
    if (missing.length === 0) {
        message += `\n🎉 Exercise completed successfully!`;
        markExerciseComplete(exerciseNumber);
        showOutput(exerciseNumber, message, 'success');
    } else {
        message += `\n📝 Please implement the missing components.`;
        showOutput(exerciseNumber, message, 'error');
    }
}

function showOutput(exerciseNumber, message, type = 'success') {
    const output = document.getElementById(`output${exerciseNumber}`);
    output.textContent = message;
    output.className = `output ${type}`;
}

function clearOutput(exerciseNumber) {
    const output = document.getElementById(`output${exerciseNumber}`);
    output.textContent = '';
    output.className = 'output';
}

function markExerciseComplete(exerciseNumber) {
    const exercise = document.getElementById(`exercise${exerciseNumber}`);
    exercise.classList.add('completed');
    
    // Update progress
    updateProgress();
    saveProgress();
}

function updateProgress() {
    const completedExercises = document.querySelectorAll('.exercise.completed').length;
    const progressFill = document.getElementById('progressFill');
    const completedSpan = document.getElementById('completedExercises');
    
    const progress = (completedExercises / 5) * 100;
    progressFill.style.width = `${progress}%`;
    completedSpan.textContent = completedExercises;
    
    // Update badge count
    const badgeCount = document.getElementById('badgeCount');
    badgeCount.textContent = Math.floor(completedExercises / 5) * 10;
}

function saveProgress() {
    const progress = {
        level: 30,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level30Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level30Progress');
    if (saved) {
        const progress = JSON.parse(saved);
        
        // Mark completed exercises
        for (let i = 1; i <= progress.completedExercises; i++) {
            markExerciseComplete(i);
        }
    }
}

function updateMainHubProgress() {
    // Update main hub progress if available
    if (typeof updateLevelProgress === 'function') {
        updateLevelProgress(30, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 30) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 29) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 31) {
        // Next level not implemented yet
        alert('Level 31 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// Microservices-specific helper functions
function simulateServiceCall(serviceName, delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% success rate
                resolve({
                    service: serviceName,
                    status: 'success',
                    data: { message: `Response from ${serviceName}` },
                    timestamp: new Date()
                });
            } else {
                reject(new Error(`Service ${serviceName} unavailable`));
            }
        }, delay);
    });
}

function createServiceHealthCheck(serviceName) {
    return {
        name: serviceName,
        check: async () => {
            try {
                const response = await simulateServiceCall(serviceName, 500);
                return { healthy: true, response };
            } catch (error) {
                return { healthy: false, error: error.message };
            }
        }
    };
}

// Event-driven architecture helpers
function createEvent(type, data, metadata = {}) {
    return {
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        metadata: {
            ...metadata,
            timestamp: new Date(),
            version: '1.0'
        }
    };
}

function createMessage(queueName, body, attributes = {}) {
    return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        queueName,
        body,
        attributes,
        sentAt: new Date(),
        retryCount: 0
    };
}

// Circuit breaker helpers
function createCircuitBreakerConfig(failureThreshold = 5, timeout = 60000) {
    return {
        failureThreshold,
        timeout,
        resetTimeout: timeout / 2
    };
}

// Load balancing helpers
function createLoadBalancerConfig(strategy = 'round-robin') {
    return {
        strategy,
        healthCheckInterval: 30000,
        maxRetries: 3
    };
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.simulateServiceCall = simulateServiceCall;
window.createServiceHealthCheck = createServiceHealthCheck;
window.createEvent = createEvent;
window.createMessage = createMessage;
window.createCircuitBreakerConfig = createCircuitBreakerConfig;
window.createLoadBalancerConfig = createLoadBalancerConfig;

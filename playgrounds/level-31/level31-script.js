// Level 31: DevOps & CI/CD Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['CICDPipeline', 'PipelineStage', 'PipelineStep', 'addStage', 'execute'],
        description: 'CI/CD Pipeline Configuration'
    },
    2: {
        required: ['InfrastructureManager', 'defineResource', 'provision', 'AWSProvider', 'KubernetesProvider'],
        description: 'Infrastructure as Code'
    },
    3: {
        required: ['ContainerOrchestrator', 'createCluster', 'createDeployment', 'scaleDeployment'],
        description: 'Container Orchestration'
    },
    4: {
        required: ['MonitoringSystem', 'recordMetric', 'createAlertRule', 'log', 'createDashboard'],
        description: 'Monitoring & Logging'
    },
    5: {
        required: ['DevOpsAutomation', 'registerRepository', 'createWorkflow', 'triggerWorkflow'],
        description: 'DevOps Automation'
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
        level: 31,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level31Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level31Progress');
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
        updateLevelProgress(31, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 31) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 30) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 32) {
        // Next level not implemented yet
        alert('Level 32 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// DevOps-specific helper functions
function simulatePipelineExecution(pipelineName, stages) {
    return new Promise((resolve, reject) => {
        let currentStage = 0;
        
        const executeNextStage = () => {
            if (currentStage >= stages.length) {
                resolve({ status: 'success', completedStages: stages.length });
                return;
            }
            
            const stage = stages[currentStage];
            console.log(`Executing stage: ${stage.name}`);
            
            // Simulate stage execution
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    currentStage++;
                    executeNextStage();
                } else {
                    reject(new Error(`Stage failed: ${stage.name}`));
                }
            }, 1000);
        };
        
        executeNextStage();
    });
}

function createDeploymentConfig(environment, replicas = 1) {
    return {
        environment,
        replicas,
        strategy: 'rolling',
        healthCheck: {
            path: '/health',
            interval: 30,
            timeout: 5,
            retries: 3
        },
        resources: {
            requests: { cpu: '100m', memory: '128Mi' },
            limits: { cpu: '500m', memory: '512Mi' }
        }
    };
}

function generateMetrics(metricName, count = 10) {
    const metrics = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        metrics.push({
            name: metricName,
            value: Math.random() * 100,
            timestamp: new Date(now.getTime() - (count - i) * 60000), // 1 minute intervals
            tags: { host: `host-${Math.floor(Math.random() * 3) + 1}` }
        });
    }
    
    return metrics;
}

function createAlertRule(name, condition, threshold, severity = 'warning') {
    return {
        name,
        condition,
        threshold,
        severity,
        enabled: true,
        createdAt: new Date()
    };
}

function simulateGitEvent(type, branch, commit = null) {
    return {
        type,
        branch,
        commit: commit || `commit_${Date.now()}`,
        timestamp: new Date(),
        author: 'developer@company.com'
    };
}

function createWorkflowStep(name, type, config) {
    return {
        name,
        type,
        config,
        timeout: config.timeout || 300000,
        retries: config.retries || 0
    };
}

function generateLogEntry(level, message, service = 'unknown') {
    return {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        level,
        message,
        service,
        timestamp: new Date(),
        context: {
            requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
            userId: Math.floor(Math.random() * 1000)
        }
    };
}

function createInfrastructureResource(type, name, config) {
    return {
        type,
        name,
        config,
        id: `${type}_${name}`,
        status: 'pending',
        createdAt: new Date()
    };
}

function simulateContainerHealthCheck(containerId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isHealthy = Math.random() > 0.1; // 90% healthy
            resolve({
                containerId,
                healthy: isHealthy,
                responseTime: Math.random() * 1000,
                timestamp: new Date()
            });
        }, 500);
    });
}

function createNotificationConfig(type, recipients, template) {
    return {
        type,
        recipients,
        template,
        enabled: true,
        createdAt: new Date()
    };
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.simulatePipelineExecution = simulatePipelineExecution;
window.createDeploymentConfig = createDeploymentConfig;
window.generateMetrics = generateMetrics;
window.createAlertRule = createAlertRule;
window.simulateGitEvent = simulateGitEvent;
window.createWorkflowStep = createWorkflowStep;
window.generateLogEntry = generateLogEntry;
window.createInfrastructureResource = createInfrastructureResource;
window.simulateContainerHealthCheck = simulateContainerHealthCheck;
window.createNotificationConfig = createNotificationConfig;

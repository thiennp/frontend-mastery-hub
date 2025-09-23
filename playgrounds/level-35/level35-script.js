// Level 35: Cloud Computing Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['AWSServiceManager', 'createEC2Instance', 'createS3Bucket', 'createLambdaFunction', 'createIAMRole'],
        description: 'AWS Fundamentals'
    },
    2: {
        required: ['AzureServiceManager', 'createResourceGroup', 'createVirtualMachine', 'createBlobStorage', 'createFunctionApp'],
        description: 'Azure Services'
    },
    3: {
        required: ['GCPServiceManager', 'createProject', 'createComputeInstance', 'createCloudStorageBucket', 'createCloudFunction'],
        description: 'Google Cloud Platform'
    },
    4: {
        required: ['ServerlessManager', 'createFunction', 'createAPIGateway', 'createTrigger', 'invokeFunction'],
        description: 'Serverless Architecture'
    },
    5: {
        required: ['CloudDeploymentManager', 'createCIPipeline', 'createContainer', 'createKubernetesDeployment', 'deployApplication'],
        description: 'Cloud Deployment'
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
        level: 35,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level35Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level35Progress');
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
        updateLevelProgress(35, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 35) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 34) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 36) {
        // Next level not implemented yet
        alert('Level 36 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// Cloud-specific helper functions
function simulateAWSDeployment(services) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const deployment = {
                services: services.length,
                status: 'deployed',
                region: 'us-east-1',
                timestamp: new Date()
            };
            resolve(deployment);
        }, 1500);
    });
}

function simulateAzureDeployment(resources) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const deployment = {
                resources: resources.length,
                status: 'deployed',
                resourceGroup: 'my-app-rg',
                location: 'East US',
                timestamp: new Date()
            };
            resolve(deployment);
        }, 1500);
    });
}

function simulateGCPDeployment(services) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const deployment = {
                services: services.length,
                status: 'deployed',
                project: 'my-gcp-project',
                zone: 'us-central1-a',
                timestamp: new Date()
            };
            resolve(deployment);
        }, 1500);
    });
}

function simulateServerlessInvocation(functionName, payload) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = {
                functionName,
                statusCode: 200,
                executionTime: Math.random() * 1000 + 100,
                memoryUsed: Math.random() * 128 + 64,
                payload,
                timestamp: new Date()
            };
            resolve(result);
        }, 500);
    });
}

function simulateContainerDeployment(containers) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const deployment = {
                containers: containers.length,
                status: 'running',
                replicas: containers.reduce((sum, c) => sum + (c.replicas || 1), 0),
                timestamp: new Date()
            };
            resolve(deployment);
        }, 2000);
    });
}

function generateCloudMetrics(serviceType) {
    const metrics = {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 1000,
        requests: Math.floor(Math.random() * 10000)
    };
    
    switch (serviceType) {
        case 'EC2':
            metrics.instances = Math.floor(Math.random() * 10) + 1;
            break;
        case 'S3':
            metrics.buckets = Math.floor(Math.random() * 5) + 1;
            metrics.storage = Math.random() * 1000;
            break;
        case 'Lambda':
            metrics.invocations = Math.floor(Math.random() * 1000);
            metrics.errors = Math.floor(Math.random() * 10);
            break;
        case 'VM':
            metrics.vms = Math.floor(Math.random() * 5) + 1;
            break;
        case 'BlobStorage':
            metrics.containers = Math.floor(Math.random() * 10) + 1;
            break;
        case 'FunctionApp':
            metrics.functions = Math.floor(Math.random() * 20) + 1;
            break;
        case 'ComputeInstance':
            metrics.instances = Math.floor(Math.random() * 8) + 1;
            break;
        case 'CloudStorage':
            metrics.buckets = Math.floor(Math.random() * 5) + 1;
            break;
        case 'CloudFunction':
            metrics.functions = Math.floor(Math.random() * 15) + 1;
            break;
    }
    
    return metrics;
}

function calculateCloudCosts(services) {
    let totalCost = 0;
    const costs = {};
    
    for (const service of services) {
        let cost = 0;
        switch (service.type) {
            case 'EC2':
                cost = service.size === 't2.micro' ? 0.0116 : 0.0464; // per hour
                break;
            case 'S3':
                cost = 0.023; // per GB per month
                break;
            case 'Lambda':
                cost = 0.0000166667; // per GB-second
                break;
            case 'VM':
                cost = service.size === 'Standard_B1s' ? 0.0052 : 0.0208; // per hour
                break;
            case 'BlobStorage':
                cost = 0.0184; // per GB per month
                break;
            case 'FunctionApp':
                cost = 0.0000166667; // per GB-second
                break;
            case 'ComputeInstance':
                cost = service.machineType === 'e2-micro' ? 0.0038 : 0.0152; // per hour
                break;
            case 'CloudStorage':
                cost = 0.020; // per GB per month
                break;
            case 'CloudFunction':
                cost = 0.0000004; // per invocation
                break;
        }
        
        costs[service.name] = cost;
        totalCost += cost;
    }
    
    return { totalCost, costs };
}

function generateDeploymentPipeline(stages) {
    const pipeline = {
        stages: stages.map(stage => ({
            name: stage,
            status: Math.random() > 0.1 ? 'success' : 'failed',
            duration: Math.random() * 300 + 30,
            timestamp: new Date()
        })),
        totalDuration: 0,
        status: 'completed'
    };
    
    pipeline.totalDuration = pipeline.stages.reduce((sum, stage) => sum + stage.duration, 0);
    
    return pipeline;
}

function simulateLoadBalancer(requests) {
    const instances = ['instance-1', 'instance-2', 'instance-3'];
    const distribution = {};
    
    for (const instance of instances) {
        distribution[instance] = Math.floor(requests / instances.length) + Math.floor(Math.random() * 10);
    }
    
    return {
        totalRequests: requests,
        distribution,
        averageResponseTime: Math.random() * 100 + 50,
        healthChecks: {
            passed: instances.length,
            failed: 0
        }
    };
}

function generateMonitoringAlerts(metrics) {
    const alerts = [];
    
    if (metrics.cpu > 80) {
        alerts.push({
            type: 'cpu',
            severity: 'high',
            message: `CPU usage is ${metrics.cpu.toFixed(1)}%`
        });
    }
    
    if (metrics.memory > 90) {
        alerts.push({
            type: 'memory',
            severity: 'critical',
            message: `Memory usage is ${metrics.memory.toFixed(1)}%`
        });
    }
    
    if (metrics.requests > 5000) {
        alerts.push({
            type: 'requests',
            severity: 'medium',
            message: `High request volume: ${metrics.requests} requests`
        });
    }
    
    return alerts;
}

function simulateAutoScaling(currentInstances, load) {
    let targetInstances = currentInstances;
    
    if (load > 80) {
        targetInstances = Math.min(currentInstances + 2, 10); // Scale up
    } else if (load < 20) {
        targetInstances = Math.max(currentInstances - 1, 1); // Scale down
    }
    
    return {
        currentInstances,
        targetInstances,
        action: targetInstances > currentInstances ? 'scale-up' : 
                targetInstances < currentInstances ? 'scale-down' : 'no-change',
        load
    };
}

function generateCloudSecurityReport(services) {
    const report = {
        totalServices: services.length,
        securityScore: 0,
        vulnerabilities: [],
        recommendations: []
    };
    
    let secureServices = 0;
    
    for (const service of services) {
        if (service.encryption && service.accessControl) {
            secureServices++;
        } else {
            report.vulnerabilities.push({
                service: service.name,
                type: service.encryption ? 'access-control' : 'encryption',
                severity: 'medium'
            });
        }
    }
    
    report.securityScore = Math.round((secureServices / services.length) * 100);
    
    if (report.securityScore < 80) {
        report.recommendations.push('Enable encryption for all services');
        report.recommendations.push('Implement proper access controls');
        report.recommendations.push('Regular security audits');
    }
    
    return report;
}

function simulateDisasterRecovery(services) {
    const recovery = {
        services: services.length,
        backupStatus: 'completed',
        replicationStatus: 'active',
        recoveryTimeObjective: '4 hours',
        recoveryPointObjective: '1 hour',
        lastBackup: new Date(),
        nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
    
    return recovery;
}

function generateCloudOptimization(services) {
    const optimization = {
        recommendations: [],
        potentialSavings: 0,
        performanceImprovements: []
    };
    
    for (const service of services) {
        if (service.type === 'EC2' && service.size === 't2.large') {
            optimization.recommendations.push(`Consider downsizing ${service.name} to t2.medium`);
            optimization.potentialSavings += 50;
        }
        
        if (service.type === 'S3' && !service.lifecycle) {
            optimization.recommendations.push(`Enable lifecycle policies for ${service.name}`);
            optimization.potentialSavings += 30;
        }
        
        if (service.type === 'Lambda' && service.memory > 512) {
            optimization.recommendations.push(`Optimize memory allocation for ${service.name}`);
            optimization.potentialSavings += 20;
        }
    }
    
    optimization.performanceImprovements = [
        'Enable CloudFront for static content',
        'Implement database connection pooling',
        'Use read replicas for database queries'
    ];
    
    return optimization;
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.simulateAWSDeployment = simulateAWSDeployment;
window.simulateAzureDeployment = simulateAzureDeployment;
window.simulateGCPDeployment = simulateGCPDeployment;
window.simulateServerlessInvocation = simulateServerlessInvocation;
window.simulateContainerDeployment = simulateContainerDeployment;
window.generateCloudMetrics = generateCloudMetrics;
window.calculateCloudCosts = calculateCloudCosts;
window.generateDeploymentPipeline = generateDeploymentPipeline;
window.simulateLoadBalancer = simulateLoadBalancer;
window.generateMonitoringAlerts = generateMonitoringAlerts;
window.simulateAutoScaling = simulateAutoScaling;
window.generateCloudSecurityReport = generateCloudSecurityReport;
window.simulateDisasterRecovery = simulateDisasterRecovery;
window.generateCloudOptimization = generateCloudOptimization;

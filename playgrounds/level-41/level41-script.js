// Level 41: Edge Computing Script

// Global variables
let currentProgress = 0;
let completedExercises = new Set();
let edgeComputingSimulation = new Map();

// Initialize the level
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUI();
    initializeEdgeComputingSimulation();
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('level41_progress');
    if (saved) {
        const data = JSON.parse(saved);
        currentProgress = data.progress || 0;
        completedExercises = new Set(data.completed || []);
    }
}

// Save progress to localStorage
function saveProgress() {
    const data = {
        progress: currentProgress,
        completed: Array.from(completedExercises),
        timestamp: Date.now()
    };
    localStorage.setItem('level41_progress', JSON.stringify(data));
    
    // Update main hub progress
    updateMainHubProgress();
}

// Update main hub progress
function updateMainHubProgress() {
    const hubProgress = JSON.parse(localStorage.getItem('hub_progress') || '{}');
    hubProgress.level41 = {
        completed: completedExercises.size === 5,
        progress: currentProgress,
        timestamp: Date.now()
    };
    localStorage.setItem('hub_progress', JSON.stringify(hubProgress));
}

// Update UI based on current progress
function updateUI() {
    updateProgressBar();
    updateBadges();
    updateExerciseCards();
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const percentage = (currentProgress / 5) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${currentProgress}/5`;
}

// Update badges
function updateBadges() {
    for (let i = 1; i <= 5; i++) {
        const badge = document.getElementById(`badge${i}`);
        if (completedExercises.has(i)) {
            badge.classList.add('unlocked');
        } else {
            badge.classList.remove('unlocked');
        }
    }
}

// Update exercise cards
function updateExerciseCards() {
    for (let i = 1; i <= 5; i++) {
        const card = document.getElementById(`exercise${i}`);
        if (completedExercises.has(i)) {
            card.classList.add('completed');
        } else {
            card.classList.remove('completed');
        }
    }
}

// Initialize edge computing simulation
function initializeEdgeComputingSimulation() {
    // Create mock edge computing environment
    createMockEdgeComputingEnvironment();
}

// Create mock edge computing environment
function createMockEdgeComputingEnvironment() {
    // Mock edge computing framework for Exercise 1
    edgeComputingSimulation.set('edge', {
        nodes: new Map([
            ['node-1', { id: 'node-1', location: 10, capacity: 100, services: new Set(), status: 'active' }],
            ['node-2', { id: 'node-2', location: 20, capacity: 150, services: new Set(), status: 'active' }],
            ['node-3', { id: 'node-3', location: 30, capacity: 120, services: new Set(), status: 'active' }]
        ]),
        services: new Map(),
        totalCapacity: 370,
        averageLatency: 25.5,
        deployService: (serviceId, requirements) => {
            const bestNode = 'node-2';
            edgeComputingSimulation.get('edge').services.set(serviceId, {
                id: serviceId,
                nodeId: bestNode,
                requirements: requirements,
                status: 'deployed'
            });
            return { success: true, nodeId: bestNode };
        }
    });
    
    // Mock IoT device manager for Exercise 2
    edgeComputingSimulation.set('iot', {
        devices: new Map([
            ['sensor-1', { id: 'sensor-1', type: 'temperature', location: 'room-1', status: 'online', dataRate: 1 }],
            ['sensor-2', { id: 'sensor-2', type: 'pressure', location: 'room-2', status: 'online', dataRate: 0.5 }],
            ['camera-1', { id: 'camera-1', type: 'video', location: 'entrance', status: 'online', dataRate: 2 }]
        ]),
        streams: new Map([
            ['sensor-1-temperature', { id: 'sensor-1-temperature', deviceId: 'sensor-1', type: 'temperature', active: true, dataPoints: 15 }],
            ['sensor-1-humidity', { id: 'sensor-1-humidity', deviceId: 'sensor-1', type: 'humidity', active: true, dataPoints: 8 }],
            ['sensor-2-pressure', { id: 'sensor-2-pressure', deviceId: 'sensor-2', type: 'pressure', active: true, dataPoints: 5 }]
        ]),
        totalDevices: 3,
        activeStreams: 3,
        totalDataPoints: 28,
        deviceTypes: { temperature: 1, pressure: 1, video: 1 }
    });
    
    // Mock real-time processor for Exercise 3
    edgeComputingSimulation.set('realtime', {
        pipelines: new Map([
            ['sensor-pipeline', { id: 'sensor-pipeline', status: 'active', throughput: 150, latency: 12, errorRate: 0.02 }]
        ]),
        processors: new Map([
            ['filter-1', { id: 'filter-1', pipelineId: 'sensor-pipeline', type: 'filter', status: 'active', processedCount: 120, errorCount: 2 }],
            ['transform-1', { id: 'transform-1', pipelineId: 'sensor-pipeline', type: 'transform', status: 'active', processedCount: 118, errorCount: 1 }],
            ['validate-1', { id: 'validate-1', pipelineId: 'sensor-pipeline', type: 'validate', status: 'active', processedCount: 117, errorCount: 0 }]
        ]),
        totalProcessed: 355,
        totalErrors: 3,
        averageLatency: 12,
        throughput: 150,
        errorRate: 0.02
    });
    
    // Mock edge AI for Exercise 4
    edgeComputingSimulation.set('ai', {
        models: new Map([
            ['model-1', { id: 'model-1', type: 'image_classification', status: 'loaded', accuracy: 0.95, latency: 15, memoryUsage: 80 }],
            ['model-2', { id: 'model-2', type: 'anomaly_detection', status: 'loaded', accuracy: 0.92, latency: 8, memoryUsage: 40 }]
        ]),
        inferences: new Map([
            ['inf-1', { id: 'inf-1', modelId: 'model-1', inferenceTime: 14, timestamp: Date.now() - 1000 }],
            ['inf-2', { id: 'inf-2', modelId: 'model-2', inferenceTime: 7, timestamp: Date.now() - 500 }]
        ]),
        totalInferences: 2,
        averageInferenceTime: 10.5,
        accuracy: 0.935,
        memoryUsage: 120
    });
    
    // Mock performance optimizer for Exercise 5
    edgeComputingSimulation.set('performance', {
        cache: new Map([
            ['main-cache', { id: 'main-cache', hitRate: 0.85, size: 750, maxSize: 1000 }]
        ]),
        loadBalancer: new Map([
            ['main-balancer', { id: 'main-balancer', nodes: 3, algorithm: 'round-robin', totalRequests: 1250 }]
        ]),
        resources: new Map([
            ['main-resources', { id: 'main-resources', utilization: 0.65, allocations: 8, totalCPU: 1000, totalMemory: 2048 }]
        ]),
        cacheHitRate: 0.85,
        resourceUtilization: 0.65,
        performanceScore: 78.5
    });
}

// Run exercise
function runExercise(exerciseNumber) {
    const codeInput = document.getElementById(`code${exerciseNumber}`);
    const outputPanel = document.getElementById(`output${exerciseNumber}`);
    const code = codeInput.value.trim();
    
    if (!code) {
        showOutput(exerciseNumber, 'Please enter some code to run.');
        return;
    }
    
    try {
        let result;
        
        switch (exerciseNumber) {
            case 1:
                result = runExercise1(code);
                break;
            case 2:
                result = runExercise2(code);
                break;
            case 3:
                result = runExercise3(code);
                break;
            case 4:
                result = runExercise4(code);
                break;
            case 5:
                result = runExercise5(code);
                break;
            default:
                result = 'Unknown exercise number.';
        }
        
        showOutput(exerciseNumber, result);
        
        // Check if exercise is completed
        if (checkExerciseCompletion(exerciseNumber, code, result)) {
            completeExercise(exerciseNumber);
        }
        
    } catch (error) {
        showOutput(exerciseNumber, `Error: ${error.message}`);
    }
}

// Run Exercise 1: Edge Computing Fundamentals
function runExercise1(code) {
    const edge = edgeComputingSimulation.get('edge');
    
    const output = [];
    output.push('⚡ Edge Computing Framework Initialized');
    output.push('');
    output.push('🌐 Network Topology:');
    output.push(`Total Nodes: ${edge.nodes.size}`);
    output.push(`Total Capacity: ${edge.totalCapacity} CPU units`);
    output.push(`Average Latency: ${edge.averageLatency}ms`);
    output.push('');
    
    // Show node details
    output.push('📊 Edge Nodes:');
    for (const [nodeId, node] of edge.nodes) {
        output.push(`Node ${nodeId}:`);
        output.push(`  Location: ${node.location}`);
        output.push(`  Capacity: ${node.capacity} CPU units`);
        output.push(`  Status: ${node.status}`);
        output.push(`  Services: ${node.services.size}`);
        output.push('');
    }
    
    // Simulate service deployment
    const service1 = edge.deployService('service-1', { cpu: 50, location: 15, maxServices: 5 });
    const service2 = edge.deployService('service-2', { cpu: 80, location: 25, maxServices: 3 });
    
    output.push('🚀 Service Deployment:');
    output.push(`Service 1: ${service1.success ? 'Deployed' : 'Failed'} to ${service1.nodeId}`);
    output.push(`Service 2: ${service2.success ? 'Deployed' : 'Failed'} to ${service2.nodeId}`);
    output.push('');
    
    // Show service details
    output.push('📋 Deployed Services:');
    for (const [serviceId, service] of edge.services) {
        output.push(`Service ${serviceId}:`);
        output.push(`  Node: ${service.nodeId}`);
        output.push(`  Status: ${service.status}`);
        output.push(`  Requirements: ${JSON.stringify(service.requirements)}`);
        output.push('');
    }
    
    // Performance metrics
    output.push('📈 Performance Metrics:');
    output.push(`Network Utilization: ${((edge.services.size * 65) / edge.totalCapacity * 100).toFixed(1)}%`);
    output.push(`Average Response Time: ${edge.averageLatency}ms`);
    output.push(`Service Distribution: ${edge.services.size} services across ${edge.nodes.size} nodes`);
    
    output.push('');
    output.push('✅ Edge computing fundamentals demonstrated!');
    
    return output.join('\n');
}

// Run Exercise 2: IoT Integration
function runExercise2(code) {
    const iot = edgeComputingSimulation.get('iot');
    
    const output = [];
    output.push('🔗 IoT Device Manager Initialized');
    output.push('');
    output.push('📱 Device Overview:');
    output.push(`Total Devices: ${iot.totalDevices}`);
    output.push(`Active Streams: ${iot.activeStreams}`);
    output.push(`Total Data Points: ${iot.totalDataPoints}`);
    output.push('');
    
    // Show device details
    output.push('📊 Registered Devices:');
    for (const [deviceId, device] of iot.devices) {
        output.push(`Device ${deviceId}:`);
        output.push(`  Type: ${device.type}`);
        output.push(`  Location: ${device.location}`);
        output.push(`  Status: ${device.status}`);
        output.push(`  Data Rate: ${device.dataRate} Hz`);
        output.push('');
    }
    
    // Show data streams
    output.push('📡 Data Streams:');
    for (const [streamId, stream] of iot.streams) {
        output.push(`Stream ${streamId}:`);
        output.push(`  Device: ${stream.deviceId}`);
        output.push(`  Type: ${stream.type}`);
        output.push(`  Status: ${stream.active ? 'Active' : 'Inactive'}`);
        output.push(`  Data Points: ${stream.dataPoints}`);
        output.push('');
    }
    
    // Simulate data processing
    output.push('🔄 Data Processing Simulation:');
    output.push('Processing temperature data: 25.5°C → Normal status');
    output.push('Processing humidity data: 65.2% → Normal status');
    output.push('Processing pressure data: 1013.25 hPa → Normal status');
    output.push('');
    
    // Device types summary
    output.push('📊 Device Types Summary:');
    for (const [type, count] of Object.entries(iot.deviceTypes)) {
        output.push(`${type}: ${count} devices`);
    }
    output.push('');
    
    // Network statistics
    output.push('📈 Network Statistics:');
    output.push(`Average Data Rate: ${(iot.totalDataPoints / iot.totalDevices).toFixed(1)} points/device`);
    output.push(`Stream Efficiency: ${(iot.activeStreams / iot.totalDevices * 100).toFixed(1)}%`);
    output.push(`Data Processing: Real-time`);
    
    output.push('');
    output.push('✅ IoT integration successful!');
    
    return output.join('\n');
}

// Run Exercise 3: Real-time Processing
function runExercise3(code) {
    const realtime = edgeComputingSimulation.get('realtime');
    
    const output = [];
    output.push('🤖 Real-time Processor Initialized');
    output.push('');
    output.push('⚡ Processing Pipeline:');
    output.push(`Pipeline Status: ${realtime.pipelines.get('sensor-pipeline').status}`);
    output.push(`Throughput: ${realtime.throughput} requests/sec`);
    output.push(`Average Latency: ${realtime.averageLatency}ms`);
    output.push(`Error Rate: ${(realtime.errorRate * 100).toFixed(2)}%`);
    output.push('');
    
    // Show pipeline details
    output.push('🔧 Pipeline Configuration:');
    const pipeline = realtime.pipelines.get('sensor-pipeline');
    output.push(`Pipeline ID: ${pipeline.id}`);
    output.push(`Status: ${pipeline.status}`);
    output.push(`Throughput: ${pipeline.throughput} req/sec`);
    output.push(`Latency: ${pipeline.latency}ms`);
    output.push(`Error Rate: ${(pipeline.errorRate * 100).toFixed(2)}%`);
    output.push('');
    
    // Show processors
    output.push('⚙️ Processing Stages:');
    for (const [processorId, processor] of realtime.processors) {
        output.push(`Processor ${processorId}:`);
        output.push(`  Type: ${processor.type}`);
        output.push(`  Status: ${processor.status}`);
        output.push(`  Processed: ${processor.processedCount} items`);
        output.push(`  Errors: ${processor.errorCount}`);
        output.push('');
    }
    
    // Simulate data processing
    output.push('🔄 Data Processing Simulation:');
    output.push('Input Data: [25.5, 30.2, -5.1, 45.8]');
    output.push('Filter Stage: Removed negative values → [25.5, 30.2, 45.8]');
    output.push('Transform Stage: Applied scaling → [28.05, 33.22, 50.38]');
    output.push('Validation Stage: All values validated → Success');
    output.push('');
    
    // Performance metrics
    output.push('📈 Performance Metrics:');
    output.push(`Total Processed: ${realtime.totalProcessed} items`);
    output.push(`Total Errors: ${realtime.totalErrors}`);
    output.push(`Success Rate: ${((realtime.totalProcessed - realtime.totalErrors) / realtime.totalProcessed * 100).toFixed(1)}%`);
    output.push(`Average Processing Time: ${realtime.averageLatency}ms`);
    output.push(`Pipeline Efficiency: ${(realtime.throughput / 200 * 100).toFixed(1)}%`);
    
    output.push('');
    output.push('✅ Real-time processing pipeline active!');
    
    return output.join('\n');
}

// Run Exercise 4: Edge AI
function runExercise4(code) {
    const ai = edgeComputingSimulation.get('ai');
    
    const output = [];
    output.push('📊 Edge AI System Initialized');
    output.push('');
    output.push('🧠 AI Models:');
    output.push(`Total Models: ${ai.models.size}`);
    output.push(`Average Accuracy: ${(ai.accuracy * 100).toFixed(1)}%`);
    output.push(`Average Inference Time: ${ai.averageInferenceTime}ms`);
    output.push(`Memory Usage: ${ai.memoryUsage}MB`);
    output.push('');
    
    // Show model details
    output.push('🔧 Loaded Models:');
    for (const [modelId, model] of ai.models) {
        output.push(`Model ${modelId}:`);
        output.push(`  Type: ${model.type}`);
        output.push(`  Status: ${model.status}`);
        output.push(`  Accuracy: ${(model.accuracy * 100).toFixed(1)}%`);
        output.push(`  Latency: ${model.latency}ms`);
        output.push(`  Memory: ${model.memoryUsage}MB`);
        output.push('');
    }
    
    // Simulate AI inference
    output.push('🔍 AI Inference Simulation:');
    output.push('Image Classification:');
    output.push('  Input: sample.jpg');
    output.push('  Predicted Class: person');
    output.push('  Confidence: 94.2%');
    output.push('  Inference Time: 14ms');
    output.push('');
    output.push('Anomaly Detection:');
    output.push('  Input: sensor data (value: 25.5)');
    output.push('  Anomaly Score: 0.15');
    output.push('  Status: Normal');
    output.push('  Inference Time: 7ms');
    output.push('');
    
    // Show inference history
    output.push('📋 Inference History:');
    for (const [inferenceId, inference] of ai.inferences) {
        output.push(`Inference ${inferenceId}:`);
        output.push(`  Model: ${inference.modelId}`);
        output.push(`  Time: ${inference.inferenceTime}ms`);
        output.push(`  Timestamp: ${new Date(inference.timestamp).toLocaleTimeString()}`);
        output.push('');
    }
    
    // Performance metrics
    output.push('📈 AI Performance Metrics:');
    output.push(`Total Inferences: ${ai.totalInferences}`);
    output.push(`Average Inference Time: ${ai.averageInferenceTime}ms`);
    output.push(`Model Accuracy: ${(ai.accuracy * 100).toFixed(1)}%`);
    output.push(`Memory Efficiency: ${(ai.memoryUsage / 200 * 100).toFixed(1)}%`);
    output.push(`Inference Rate: ${(ai.totalInferences / 2).toFixed(1)} inferences/sec`);
    
    output.push('');
    output.push('✅ Edge AI system operational!');
    
    return output.join('\n');
}

// Run Exercise 5: Performance Optimization
function runExercise5(code) {
    const performance = edgeComputingSimulation.get('performance');
    
    const output = [];
    output.push('🚀 Performance Optimizer Initialized');
    output.push('');
    output.push('⚡ Optimization Features:');
    output.push(`Cache Hit Rate: ${(performance.cacheHitRate * 100).toFixed(1)}%`);
    output.push(`Resource Utilization: ${(performance.resourceUtilization * 100).toFixed(1)}%`);
    output.push(`Performance Score: ${performance.performanceScore}/100`);
    output.push('');
    
    // Show cache performance
    output.push('💾 Cache Performance:');
    for (const [cacheId, cache] of performance.cache) {
        output.push(`Cache ${cacheId}:`);
        output.push(`  Hit Rate: ${(cache.hitRate * 100).toFixed(1)}%`);
        output.push(`  Size: ${cache.size}/${cache.maxSize} items`);
        output.push(`  Efficiency: ${(cache.size / cache.maxSize * 100).toFixed(1)}%`);
        output.push('');
    }
    
    // Show load balancer performance
    output.push('⚖️ Load Balancer Performance:');
    for (const [balancerId, balancer] of performance.loadBalancer) {
        output.push(`Balancer ${balancerId}:`);
        output.push(`  Nodes: ${balancer.nodes}`);
        output.push(`  Algorithm: ${balancer.algorithm}`);
        output.push(`  Total Requests: ${balancer.totalRequests}`);
        output.push(`  Average per Node: ${(balancer.totalRequests / balancer.nodes).toFixed(1)}`);
        output.push('');
    }
    
    // Show resource management
    output.push('🔧 Resource Management:');
    for (const [resourceId, resource] of performance.resources) {
        output.push(`Resource ${resourceId}:`);
        output.push(`  Utilization: ${(resource.utilization * 100).toFixed(1)}%`);
        output.push(`  Allocations: ${resource.allocations}`);
        output.push(`  Total CPU: ${resource.totalCPU} units`);
        output.push(`  Total Memory: ${resource.totalMemory}MB`);
        output.push('');
    }
    
    // Simulate optimization operations
    output.push('🔄 Optimization Operations:');
    output.push('Cache Operation:');
    output.push('  Set cache key "user-123" → Success');
    output.push('  Get cache key "user-123" → Hit (from cache)');
    output.push('');
    output.push('Load Balancing:');
    output.push('  Request routed to node-2 → Success');
    output.push('  Node selection: Round-robin algorithm');
    output.push('');
    output.push('Resource Allocation:');
    output.push('  Allocated 100 CPU units, 256MB memory → Success');
    output.push('  Resource utilization updated');
    output.push('');
    
    // Performance comparison
    output.push('📊 Performance Comparison:');
    output.push(`Before Optimization:`);
    output.push(`  Cache Hit Rate: 45%`);
    output.push(`  Resource Utilization: 85%`);
    output.push(`  Performance Score: 45/100`);
    output.push('');
    output.push(`After Optimization:`);
    output.push(`  Cache Hit Rate: ${(performance.cacheHitRate * 100).toFixed(1)}%`);
    output.push(`  Resource Utilization: ${(performance.resourceUtilization * 100).toFixed(1)}%`);
    output.push(`  Performance Score: ${performance.performanceScore}/100`);
    output.push('');
    output.push(`Improvement: +${(performance.performanceScore - 45).toFixed(1)} points`);
    
    output.push('');
    output.push('✅ Performance optimization complete!');
    
    return output.join('\n');
}

// Show output in the output panel
function showOutput(exerciseNumber, output) {
    const outputPanel = document.getElementById(`output${exerciseNumber}`);
    outputPanel.textContent = output;
    
    // Add syntax highlighting for edge computing terms
    if (output.includes('Edge') || output.includes('IoT') || output.includes('AI')) {
        outputPanel.innerHTML = highlightEdgeComputingOutput(output);
    }
}

// Highlight edge computing output
function highlightEdgeComputingOutput(output) {
    return output
        .replace(/Edge Computing/g, '<span style="color: #2c3e50; font-weight: bold;">$&</span>')
        .replace(/IoT/g, '<span style="color: #e74c3c; font-weight: bold;">$&</span>')
        .replace(/AI/g, '<span style="color: #9b59b6; font-weight: bold;">$&</span>')
        .replace(/(\d+)ms/g, '<span style="color: #3498db; font-weight: bold;">$1ms</span>')
        .replace(/(\d+\.?\d*)%/g, '<span style="color: #27ae60; font-weight: bold;">$1%</span>')
        .replace(/(\d+)MB/g, '<span style="color: #f39c12; font-weight: bold;">$1MB</span>');
}

// Check if exercise is completed
function checkExerciseCompletion(exerciseNumber, code, result) {
    const checks = {
        1: () => code.includes('EdgeComputingFramework') && code.includes('deployService') && result.includes('Edge Computing Framework'),
        2: () => code.includes('IoTDeviceManager') && code.includes('registerDevice') && result.includes('IoT Device Manager'),
        3: () => code.includes('RealTimeProcessor') && code.includes('processData') && result.includes('Real-time Processor'),
        4: () => code.includes('EdgeAI') && code.includes('runInference') && result.includes('Edge AI System'),
        5: () => code.includes('EdgePerformanceOptimizer') && code.includes('setupCaching') && result.includes('Performance Optimizer')
    };
    
    return checks[exerciseNumber] ? checks[exerciseNumber]() : false;
}

// Complete exercise
function completeExercise(exerciseNumber) {
    if (!completedExercises.has(exerciseNumber)) {
        completedExercises.add(exerciseNumber);
        currentProgress = completedExercises.size;
        
        // Update UI
        updateUI();
        
        // Save progress
        saveProgress();
        
        // Show completion message
        showCompletionMessage(exerciseNumber);
        
        // Unlock next exercise
        if (exerciseNumber < 5) {
            setTimeout(() => {
                const nextCard = document.getElementById(`exercise${exerciseNumber + 1}`);
                nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
        }
    }
}

// Show completion message
function showCompletionMessage(exerciseNumber) {
    const messages = {
        1: '⚡ Edge Computing Fundamentals mastered!',
        2: '🔗 IoT Integration complete!',
        3: '🤖 Real-time Processing implemented!',
        4: '📊 Edge AI system operational!',
        5: '🚀 Performance Optimization successful!'
    };
    
    const message = messages[exerciseNumber];
    if (message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #2c3e50, #34495e);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-weight: 600;
            animation: slideIn 0.5s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber === 40) {
        window.location.href = '../level-40/index.html';
    } else if (levelNumber === 42) {
        window.location.href = '../level-42/index.html';
    }
}

function goToHub() {
    window.location.href = '../../index.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-save progress every 30 seconds
setInterval(saveProgress, 30000);

// Handle page unload
window.addEventListener('beforeunload', saveProgress);

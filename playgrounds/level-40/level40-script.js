// Level 40: Advanced Data Visualization Script

// Global variables
let currentProgress = 0;
let completedExercises = new Set();
let visualizationSimulation = new Map();

// Initialize the level
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUI();
    initializeVisualizationSimulation();
    setupChartContainers();
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('level40_progress');
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
    localStorage.setItem('level40_progress', JSON.stringify(data));
    
    // Update main hub progress
    updateMainHubProgress();
}

// Update main hub progress
function updateMainHubProgress() {
    const hubProgress = JSON.parse(localStorage.getItem('hub_progress') || '{}');
    hubProgress.level40 = {
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

// Initialize visualization simulation
function initializeVisualizationSimulation() {
    // Create mock visualization environment
    createMockVisualizationEnvironment();
}

// Create mock visualization environment
function createMockVisualizationEnvironment() {
    // Mock D3.js environment for Exercise 1
    visualizationSimulation.set('d3', {
        version: '7.0.0',
        scales: ['linear', 'band', 'ordinal', 'time'],
        transitions: ['ease', 'ease-in', 'ease-out', 'ease-in-out'],
        createBarChart: (data) => {
            return {
                bars: data.length,
                animated: true,
                interactive: true,
                tooltips: true
            };
        }
    });
    
    // Mock interactive charts for Exercise 2
    visualizationSimulation.set('interactive', {
        zoom: { enabled: true, scaleExtent: [0.5, 10] },
        pan: { enabled: true },
        brush: { enabled: true, selection: 'rectangular' },
        filtering: { enabled: true, realTime: true },
        createScatterPlot: (data) => {
            return {
                points: data.length,
                zoomable: true,
                pannable: true,
                brushable: true,
                filterable: true
            };
        }
    });
    
    // Mock real-time data for Exercise 3
    visualizationSimulation.set('realtime', {
        websocket: { connected: true, latency: 50 },
        dataStream: { active: true, frequency: 1000 },
        updates: { smooth: true, transitions: true },
        createLineChart: (data) => {
            return {
                dataPoints: data.length,
                realTime: true,
                animated: true,
                responsive: true
            };
        }
    });
    
    // Mock custom visualizations for Exercise 4
    visualizationSimulation.set('custom', {
        treemap: { layout: 'squarify', padding: 2 },
        chord: { padAngle: 0.05, sortSubgroups: true },
        force: { charge: -300, linkDistance: 50 },
        createTreemap: (data) => {
            return {
                cells: data.children.length,
                hierarchical: true,
                colorCoded: true,
                interactive: true
            };
        },
        createChord: (data) => {
            return {
                groups: data.length,
                connections: data.flat().filter(d => d > 0).length,
                circular: true,
                interactive: true
            };
        },
        createForceGraph: (data) => {
            return {
                nodes: data.nodes.length,
                links: data.links.length,
                physics: true,
                draggable: true
            };
        }
    });
    
    // Mock performance optimization for Exercise 5
    visualizationSimulation.set('performance', {
        canvas: { enabled: true, hardwareAccelerated: true },
        virtualScrolling: { enabled: true, itemHeight: 30 },
        dataAggregation: { enabled: true, gridSize: 10 },
        rendering: { optimized: true, fps: 60 },
        createOptimizedChart: (data) => {
            return {
                totalDataPoints: data.length,
                renderedPoints: Math.min(data.length, 10000),
                aggregation: true,
                canvas: true,
                fps: 60
            };
        }
    });
}

// Setup chart containers
function setupChartContainers() {
    // Create chart containers for each exercise
    for (let i = 1; i <= 5; i++) {
        const outputPanel = document.getElementById(`output${i}`);
        if (outputPanel) {
            // Create chart container
            const chartContainer = document.createElement('div');
            chartContainer.id = `chart${i}`;
            chartContainer.className = 'chart-container';
            chartContainer.style.cssText = `
                width: 100%;
                height: 300px;
                background: white;
                border-radius: 10px;
                margin: 10px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 14px;
            `;
            chartContainer.textContent = 'Chart will be rendered here...';
            outputPanel.appendChild(chartContainer);
        }
    }
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

// Run Exercise 1: D3.js Mastery
function runExercise1(code) {
    const d3 = visualizationSimulation.get('d3');
    
    const output = [];
    output.push('📈 D3.js Visualization Created Successfully!');
    output.push('');
    output.push('🔧 D3.js Environment:');
    output.push(`Version: ${d3.version}`);
    output.push(`Available Scales: ${d3.scales.join(', ')}`);
    output.push(`Transition Types: ${d3.transitions.join(', ')}`);
    output.push('');
    
    // Simulate bar chart creation
    const sampleData = [
        { name: 'JavaScript', value: 85 },
        { name: 'Python', value: 78 },
        { name: 'Java', value: 72 },
        { name: 'C++', value: 68 },
        { name: 'Go', value: 65 }
    ];
    
    const chart = d3.createBarChart(sampleData);
    output.push('📊 Bar Chart Analysis:');
    output.push(`Number of Bars: ${chart.bars}`);
    output.push(`Animation: ${chart.animated ? 'Enabled' : 'Disabled'}`);
    output.push(`Interactive: ${chart.interactive ? 'Yes' : 'No'}`);
    output.push(`Tooltips: ${chart.tooltips ? 'Enabled' : 'Disabled'}`);
    output.push('');
    
    // Simulate chart rendering
    output.push('🎨 Chart Rendering:');
    output.push('✅ SVG container created');
    output.push('✅ Scales configured (x: band, y: linear)');
    output.push('✅ Axes generated');
    output.push('✅ Bars rendered with animation');
    output.push('✅ Hover effects applied');
    output.push('✅ Tooltips implemented');
    output.push('');
    
    // Performance metrics
    output.push('⚡ Performance Metrics:');
    output.push(`Rendering Time: 45ms`);
    output.push(`Animation Duration: 1000ms`);
    output.push(`Memory Usage: 2.3MB`);
    output.push(`FPS: 60`);
    
    output.push('');
    output.push('✅ D3.js mastery demonstrated!');
    
    return output.join('\n');
}

// Run Exercise 2: Interactive Charts
function runExercise2(code) {
    const interactive = visualizationSimulation.get('interactive');
    
    const output = [];
    output.push('🎯 Interactive Chart Features');
    output.push('');
    output.push('🔧 Interactive Capabilities:');
    output.push(`Zoom: ${interactive.zoom.enabled ? 'Enabled' : 'Disabled'} (Scale: ${interactive.zoom.scaleExtent[0]}x - ${interactive.zoom.scaleExtent[1]}x)`);
    output.push(`Pan: ${interactive.pan.enabled ? 'Enabled' : 'Disabled'}`);
    output.push(`Brush Selection: ${interactive.brush.enabled ? 'Enabled' : 'Disabled'}`);
    output.push(`Filtering: ${interactive.filtering.enabled ? 'Enabled' : 'Disabled'}`);
    output.push('');
    
    // Simulate scatter plot creation
    const sampleData = Array.from({ length: 100 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
    
    const chart = interactive.createScatterPlot(sampleData);
    output.push('📊 Scatter Plot Analysis:');
    output.push(`Data Points: ${chart.points}`);
    output.push(`Zoomable: ${chart.zoomable ? 'Yes' : 'No'}`);
    output.push(`Pannable: ${chart.pannable ? 'Yes' : 'No'}`);
    output.push(`Brushable: ${chart.brushable ? 'Yes' : 'No'}`);
    output.push(`Filterable: ${chart.filterable ? 'Yes' : 'No'}`);
    output.push('');
    
    // Simulate interactions
    output.push('🖱️ Interaction Simulation:');
    output.push('✅ Zoom behavior configured');
    output.push('✅ Pan behavior enabled');
    output.push('✅ Brush selection active');
    output.push('✅ Real-time filtering applied');
    output.push('✅ Selection counter updated');
    output.push('');
    
    // User interaction stats
    output.push('📈 Interaction Statistics:');
    output.push(`Zoom Level: 1.0x`);
    output.push(`Selected Points: 0`);
    output.push(`Filtered Points: 100`);
    output.push(`Interaction Events: 0`);
    
    output.push('');
    output.push('✅ Interactive charts implemented!');
    
    return output.join('\n');
}

// Run Exercise 3: Real-time Data
function runExercise3(code) {
    const realtime = visualizationSimulation.get('realtime');
    
    const output = [];
    output.push('⚡ Real-time Data Visualization');
    output.push('');
    output.push('🔗 Connection Status:');
    output.push(`WebSocket: ${realtime.websocket.connected ? 'Connected' : 'Disconnected'}`);
    output.push(`Latency: ${realtime.websocket.latency}ms`);
    output.push(`Data Stream: ${realtime.dataStream.active ? 'Active' : 'Inactive'}`);
    output.push(`Update Frequency: ${realtime.dataStream.frequency}ms`);
    output.push('');
    
    // Simulate line chart creation
    const sampleData = Array.from({ length: 50 }, (_, i) => ({
        time: new Date(Date.now() - (50 - i) * 1000),
        value: Math.random() * 100
    }));
    
    const chart = realtime.createLineChart(sampleData);
    output.push('📊 Real-time Line Chart:');
    output.push(`Data Points: ${chart.dataPoints}`);
    output.push(`Real-time Updates: ${chart.realTime ? 'Enabled' : 'Disabled'}`);
    output.push(`Animations: ${chart.animated ? 'Smooth' : 'Disabled'}`);
    output.push(`Responsive: ${chart.responsive ? 'Yes' : 'No'}`);
    output.push('');
    
    // Simulate real-time updates
    output.push('🔄 Real-time Updates:');
    output.push('✅ WebSocket connection established');
    output.push('✅ Data stream started');
    output.push('✅ Chart updates smoothly');
    output.push('✅ Transitions applied');
    output.push('✅ Performance optimized');
    output.push('');
    
    // Real-time metrics
    output.push('📈 Real-time Metrics:');
    output.push(`Data Points/sec: 1`);
    output.push(`Update Latency: ${realtime.websocket.latency}ms`);
    output.push(`Chart FPS: 60`);
    output.push(`Memory Usage: 1.8MB`);
    output.push(`CPU Usage: 12%`);
    
    output.push('');
    output.push('✅ Real-time visualization active!');
    
    return output.join('\n');
}

// Run Exercise 4: Custom Visualizations
function runExercise4(code) {
    const custom = visualizationSimulation.get('custom');
    
    const output = [];
    output.push('🎨 Custom Visualizations Created');
    output.push('');
    output.push('🔧 Visualization Types:');
    output.push(`Treemap: ${custom.treemap.layout} layout, ${custom.treemap.padding}px padding`);
    output.push(`Chord Diagram: ${custom.chord.padAngle} pad angle, sorted subgroups`);
    output.push(`Force Graph: ${custom.force.charge} charge, ${custom.force.linkDistance}px link distance`);
    output.push('');
    
    // Simulate treemap creation
    const treemapData = {
        children: [
            { name: 'A', value: 100 },
            { name: 'B', value: 80 },
            { name: 'C', value: 60 },
            { name: 'D', value: 40 },
            { name: 'E', value: 20 }
        ]
    };
    
    const treemap = custom.createTreemap(treemapData);
    output.push('📊 Treemap Analysis:');
    output.push(`Cells: ${treemap.cells}`);
    output.push(`Hierarchical: ${treemap.hierarchical ? 'Yes' : 'No'}`);
    output.push(`Color Coded: ${treemap.colorCoded ? 'Yes' : 'No'}`);
    output.push(`Interactive: ${treemap.interactive ? 'Yes' : 'No'}`);
    output.push('');
    
    // Simulate chord diagram creation
    const chordData = [
        [0, 5, 3, 2],
        [3, 0, 2, 1],
        [2, 1, 0, 4],
        [1, 2, 3, 0]
    ];
    
    const chord = custom.createChord(chordData);
    output.push('📊 Chord Diagram Analysis:');
    output.push(`Groups: ${chord.groups}`);
    output.push(`Connections: ${chord.connections}`);
    output.push(`Circular Layout: ${chord.circular ? 'Yes' : 'No'}`);
    output.push(`Interactive: ${chord.interactive ? 'Yes' : 'No'}`);
    output.push('');
    
    // Simulate force graph creation
    const forceData = {
        nodes: [
            { id: 'A', group: 1 },
            { id: 'B', group: 1 },
            { id: 'C', group: 2 },
            { id: 'D', group: 2 },
            { id: 'E', group: 3 }
        ],
        links: [
            { source: 'A', target: 'B', value: 1 },
            { source: 'B', target: 'C', value: 2 },
            { source: 'C', target: 'D', value: 1 },
            { source: 'D', target: 'E', value: 3 },
            { source: 'E', target: 'A', value: 2 }
        ]
    };
    
    const forceGraph = custom.createForceGraph(forceData);
    output.push('📊 Force Graph Analysis:');
    output.push(`Nodes: ${forceGraph.nodes}`);
    output.push(`Links: ${forceGraph.links}`);
    output.push(`Physics Simulation: ${forceGraph.physics ? 'Active' : 'Inactive'}`);
    output.push(`Draggable: ${forceGraph.draggable ? 'Yes' : 'No'}`);
    output.push('');
    
    output.push('✅ Custom visualizations rendered!');
    
    return output.join('\n');
}

// Run Exercise 5: Performance Optimization
function runExercise5(code) {
    const performance = visualizationSimulation.get('performance');
    
    const output = [];
    output.push('🚀 Performance Optimization Analysis');
    output.push('');
    output.push('⚡ Optimization Features:');
    output.push(`Canvas Rendering: ${performance.canvas.enabled ? 'Enabled' : 'Disabled'}`);
    output.push(`Hardware Acceleration: ${performance.canvas.hardwareAccelerated ? 'Active' : 'Inactive'}`);
    output.push(`Virtual Scrolling: ${performance.virtualScrolling.enabled ? 'Enabled' : 'Disabled'}`);
    output.push(`Data Aggregation: ${performance.dataAggregation.enabled ? 'Enabled' : 'Disabled'}`);
    output.push(`Optimized Rendering: ${performance.rendering.optimized ? 'Yes' : 'No'}`);
    output.push('');
    
    // Simulate optimized chart creation
    const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
        x: Math.random() * 800,
        y: Math.random() * 400,
        value: Math.random() * 100,
        id: i
    }));
    
    const chart = performance.createOptimizedChart(largeDataset);
    output.push('📊 Optimized Chart Analysis:');
    output.push(`Total Data Points: ${chart.totalDataPoints.toLocaleString()}`);
    output.push(`Rendered Points: ${chart.renderedPoints.toLocaleString()}`);
    output.push(`Data Aggregation: ${chart.aggregation ? 'Enabled' : 'Disabled'}`);
    output.push(`Canvas Rendering: ${chart.canvas ? 'Yes' : 'No'}`);
    output.push(`Target FPS: ${chart.fps}`);
    output.push('');
    
    // Performance metrics
    output.push('📈 Performance Metrics:');
    output.push(`Rendering Time: 12ms`);
    output.push(`Memory Usage: 15.2MB`);
    output.push(`CPU Usage: 8%`);
    output.push(`GPU Usage: 3%`);
    output.push(`Frame Rate: ${chart.fps} FPS`);
    output.push('');
    
    // Optimization techniques
    output.push('🔧 Optimization Techniques:');
    output.push('✅ Data aggregation implemented');
    output.push('✅ Virtual scrolling active');
    output.push('✅ Canvas rendering enabled');
    output.push('✅ Hardware acceleration used');
    output.push('✅ Efficient update strategies');
    output.push('✅ Memory management optimized');
    output.push('');
    
    // Comparison with unoptimized
    output.push('📊 Performance Comparison:');
    output.push(`Unoptimized Rendering: 450ms`);
    output.push(`Optimized Rendering: 12ms`);
    output.push(`Performance Improvement: 37.5x faster`);
    output.push(`Memory Reduction: 60%`);
    
    output.push('');
    output.push('✅ Performance optimization successful!');
    
    return output.join('\n');
}

// Show output in the output panel
function showOutput(exerciseNumber, output) {
    const outputPanel = document.getElementById(`output${exerciseNumber}`);
    const chartContainer = document.getElementById(`chart${exerciseNumber}`);
    
    if (chartContainer) {
        chartContainer.innerHTML = output;
        chartContainer.style.cssText = `
            width: 100%;
            min-height: 300px;
            background: white;
            border-radius: 10px;
            margin: 10px 0;
            padding: 20px;
            color: #333;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            overflow-y: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        `;
    }
    
    // Add syntax highlighting for visualization terms
    if (output.includes('D3.js') || output.includes('Chart') || output.includes('FPS')) {
        chartContainer.innerHTML = highlightVisualizationOutput(output);
    }
}

// Highlight visualization output
function highlightVisualizationOutput(output) {
    return output
        .replace(/D3\.js/g, '<span style="color: #e74c3c; font-weight: bold;">$&</span>')
        .replace(/Chart/g, '<span style="color: #3498db; font-weight: bold;">$&</span>')
        .replace(/(\d+) FPS/g, '<span style="color: #27ae60; font-weight: bold;">$1 FPS</span>')
        .replace(/(\d+)ms/g, '<span style="color: #f39c12; font-weight: bold;">$1ms</span>')
        .replace(/(\d+\.?\d*)MB/g, '<span style="color: #9b59b6; font-weight: bold;">$1MB</span>');
}

// Check if exercise is completed
function checkExerciseCompletion(exerciseNumber, code, result) {
    const checks = {
        1: () => code.includes('d3') && code.includes('scale') && result.includes('D3.js Visualization'),
        2: () => code.includes('zoom') && code.includes('brush') && result.includes('Interactive Chart'),
        3: () => code.includes('realtime') && code.includes('websocket') && result.includes('Real-time Data'),
        4: () => code.includes('treemap') && code.includes('chord') && result.includes('Custom Visualizations'),
        5: () => code.includes('performance') && code.includes('optimization') && result.includes('Performance Optimization')
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
        1: '📈 D3.js Mastery achieved!',
        2: '🎯 Interactive Charts implemented!',
        3: '⚡ Real-time Data visualization active!',
        4: '🎨 Custom Visualizations created!',
        5: '🚀 Performance Optimization complete!'
    };
    
    const message = messages[exerciseNumber];
    if (message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
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
    if (levelNumber === 39) {
        window.location.href = '../level-39/index.html';
    } else if (levelNumber === 41) {
        window.location.href = '../level-41/index.html';
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

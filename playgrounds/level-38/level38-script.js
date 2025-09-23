// Level 38: WebAssembly Script

// Global variables
let currentProgress = 0;
let completedExercises = new Set();
let wasmModules = new Map();

// Initialize the level
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUI();
    initializeWASMSimulation();
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('level38_progress');
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
    localStorage.setItem('level38_progress', JSON.stringify(data));
    
    // Update main hub progress
    updateMainHubProgress();
}

// Update main hub progress
function updateMainHubProgress() {
    const hubProgress = JSON.parse(localStorage.getItem('hub_progress') || '{}');
    hubProgress.level38 = {
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

// Initialize WebAssembly simulation
function initializeWASMSimulation() {
    // Create mock WASM modules for simulation
    createMockWASMModules();
}

// Create mock WASM modules for simulation
function createMockWASMModules() {
    // Mock module for Exercise 1: Basic arithmetic
    wasmModules.set('basic', {
        exports: {
            add: (a, b) => a + b,
            subtract: (a, b) => a - b,
            multiply: (a, b) => a * b,
            divide: (a, b) => b !== 0 ? a / b : 0
        }
    });
    
    // Mock module for Exercise 2: Performance optimization
    wasmModules.set('performance', {
        exports: {
            matrix_multiply: (rows, cols, data) => {
                const startTime = performance.now();
                // Simulate matrix multiplication
                let result = 0;
                for (let i = 0; i < rows * cols; i++) {
                    result += data[i] * 2;
                }
                const endTime = performance.now();
                return { result, executionTime: endTime - startTime };
            }
        }
    });
    
    // Mock module for Exercise 3: System integration
    wasmModules.set('integration', {
        exports: {
            process_array: (arrayPtr, length) => {
                let sum = 0;
                for (let i = 0; i < length; i++) {
                    sum += i * 2; // Simulate array processing
                }
                return sum;
            }
        }
    });
    
    // Mock module for Exercise 4: Multi-threading
    wasmModules.set('threading', {
        exports: {
            parallel_process: (data, numWorkers) => {
                return new Promise((resolve) => {
                    const chunkSize = Math.ceil(data.length / numWorkers);
                    const promises = [];
                    
                    for (let i = 0; i < numWorkers; i++) {
                        const start = i * chunkSize;
                        const end = Math.min(start + chunkSize, data.length);
                        const chunk = data.slice(start, end);
                        
                        const promise = new Promise((chunkResolve) => {
                            setTimeout(() => {
                                const result = chunk.reduce((acc, val) => acc + val, 0);
                                chunkResolve(result);
                            }, Math.random() * 100); // Simulate processing time
                        });
                        
                        promises.push(promise);
                    }
                    
                    Promise.all(promises).then(results => {
                        const total = results.reduce((acc, result) => acc + result, 0);
                        resolve(total);
                    });
                });
            }
        }
    });
    
    // Mock module for Exercise 5: Advanced features
    wasmModules.set('advanced', {
        exports: {
            process_data: () => {
                return Math.random() * 1000;
            },
            memory_allocate: (size) => {
                return Math.floor(Math.random() * 10000);
            },
            memory_deallocate: (ptr) => {
                return true;
            }
        }
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

// Run Exercise 1: WebAssembly Fundamentals
function runExercise1(code) {
    const module = wasmModules.get('basic');
    
    // Simulate WASM module instantiation
    const output = [];
    output.push('🚀 WebAssembly Module Instantiated Successfully!');
    output.push('');
    output.push('📋 Module Exports:');
    output.push('- add(a, b): Adds two numbers');
    output.push('- subtract(a, b): Subtracts b from a');
    output.push('- multiply(a, b): Multiplies two numbers');
    output.push('- divide(a, b): Divides a by b');
    output.push('');
    
    // Test the add function
    const result = module.exports.add(5, 3);
    output.push(`🧮 Testing add(5, 3): ${result}`);
    
    // Test other functions
    const subtractResult = module.exports.subtract(10, 4);
    output.push(`🧮 Testing subtract(10, 4): ${subtractResult}`);
    
    const multiplyResult = module.exports.multiply(6, 7);
    output.push(`🧮 Testing multiply(6, 7): ${multiplyResult}`);
    
    const divideResult = module.exports.divide(15, 3);
    output.push(`🧮 Testing divide(15, 3): ${divideResult}`);
    
    output.push('');
    output.push('✅ WebAssembly fundamentals demonstrated successfully!');
    
    return output.join('\n');
}

// Run Exercise 2: Performance Optimization
function runExercise2(code) {
    const module = wasmModules.get('performance');
    
    const output = [];
    output.push('⚡ Performance Optimization Analysis');
    output.push('');
    
    // Simulate matrix multiplication
    const testData = Array.from({ length: 1000 }, (_, i) => i + 1);
    const result = module.exports.matrix_multiply(10, 100, testData);
    
    output.push(`📊 Matrix Size: 10x100 (1000 elements)`);
    output.push(`🔢 Result: ${result.result}`);
    output.push(`⏱️ Execution Time: ${result.executionTime.toFixed(4)}ms`);
    output.push('');
    
    // Performance metrics
    const opsPerMs = (1000 / result.executionTime).toFixed(2);
    output.push(`📈 Operations per millisecond: ${opsPerMs}`);
    output.push(`🎯 Performance Rating: ${result.executionTime < 1 ? 'Excellent' : result.executionTime < 5 ? 'Good' : 'Needs Optimization'}`);
    
    output.push('');
    output.push('✅ Performance optimization techniques applied!');
    
    return output.join('\n');
}

// Run Exercise 3: System Integration
function runExercise3(code) {
    const module = wasmModules.get('integration');
    
    const output = [];
    output.push('🔧 System Integration Test');
    output.push('');
    
    // Simulate array processing
    const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = module.exports.process_array(0, testArray.length);
    
    output.push(`📋 Input Array: [${testArray.join(', ')}]`);
    output.push(`🔄 Processing with WebAssembly...`);
    output.push(`📊 Processed Result: ${result}`);
    output.push('');
    
    // Integration status
    output.push('🔗 Integration Status:');
    output.push('✅ JavaScript ↔ WebAssembly communication: Active');
    output.push('✅ Memory management: Optimized');
    output.push('✅ Data serialization: Working');
    output.push('✅ Error handling: Implemented');
    
    output.push('');
    output.push('✅ System integration successful!');
    
    return output.join('\n');
}

// Run Exercise 4: Multi-threading
async function runExercise4(code) {
    const module = wasmModules.get('threading');
    
    const output = [];
    output.push('🧵 Multi-threading Performance Test');
    output.push('');
    
    const testData = Array.from({ length: 100 }, (_, i) => i + 1);
    const numWorkers = 4;
    
    output.push(`📊 Data Size: ${testData.length} elements`);
    output.push(`👥 Workers: ${numWorkers}`);
    output.push(`🔄 Processing in parallel...`);
    
    const startTime = performance.now();
    const result = await module.exports.parallel_process(testData, numWorkers);
    const endTime = performance.now();
    
    output.push(`⏱️ Total Execution Time: ${(endTime - startTime).toFixed(4)}ms`);
    output.push(`📈 Parallel Result: ${result}`);
    output.push('');
    
    // Threading analysis
    const sequentialTime = testData.length * 0.1; // Simulate sequential processing
    const speedup = (sequentialTime / (endTime - startTime)).toFixed(2);
    
    output.push('📊 Threading Analysis:');
    output.push(`🚀 Speedup Factor: ${speedup}x`);
    output.push(`💡 Efficiency: ${((speedup / numWorkers) * 100).toFixed(1)}%`);
    output.push(`🎯 Thread Utilization: ${numWorkers} workers active`);
    
    output.push('');
    output.push('✅ Multi-threading implementation successful!');
    
    return output.join('\n');
}

// Run Exercise 5: Advanced Features
function runExercise5(code) {
    const module = wasmModules.get('advanced');
    
    const output = [];
    output.push('🚀 Advanced WebAssembly Features');
    output.push('');
    
    // Test advanced features
    const processResult = module.exports.process_data();
    const memoryPtr = module.exports.memory_allocate(1024);
    const deallocResult = module.exports.memory_deallocate(memoryPtr);
    
    output.push('🔧 Advanced Features Test:');
    output.push(`📊 Data Processing Result: ${processResult.toFixed(2)}`);
    output.push(`💾 Memory Allocation: Pointer ${memoryPtr}`);
    output.push(`🗑️ Memory Deallocation: ${deallocResult ? 'Success' : 'Failed'}`);
    output.push('');
    
    // Feature status
    output.push('🎯 Feature Implementation Status:');
    output.push('✅ WASI Integration: Ready');
    output.push('✅ Dynamic Linking: Supported');
    output.push('✅ Memory Management: Advanced');
    output.push('✅ Framework Integration: Compatible');
    output.push('✅ Garbage Collection: Optimized');
    
    output.push('');
    output.push('🌟 Advanced features demonstration complete!');
    
    return output.join('\n');
}

// Show output in the output panel
function showOutput(exerciseNumber, output) {
    const outputPanel = document.getElementById(`output${exerciseNumber}`);
    outputPanel.textContent = output;
    
    // Add syntax highlighting for WebAssembly
    if (output.includes('WebAssembly') || output.includes('WASM')) {
        outputPanel.innerHTML = highlightWASMOutput(output);
    }
}

// Highlight WebAssembly output
function highlightWASMOutput(output) {
    return output
        .replace(/WebAssembly|WASM/g, '<span class="wasm-keyword">$&</span>')
        .replace(/i32|i64|f32|f64/g, '<span class="wasm-type">$&</span>')
        .replace(/add|sub|mul|div/g, '<span class="wasm-instruction">$&</span>')
        .replace(/\/\/.*$/gm, '<span class="wasm-comment">$&</span>');
}

// Check if exercise is completed
function checkExerciseCompletion(exerciseNumber, code, result) {
    const checks = {
        1: () => code.includes('add') && code.includes('WebAssembly') && result.includes('8'),
        2: () => code.includes('matrix') && code.includes('optimization') && result.includes('Performance'),
        3: () => code.includes('integration') && code.includes('JavaScript') && result.includes('integration'),
        4: () => code.includes('thread') && code.includes('parallel') && result.includes('Multi-threading'),
        5: () => code.includes('advanced') && code.includes('WASI') && result.includes('Advanced')
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
        1: '🎯 WebAssembly Fundamentals mastered!',
        2: '⚡ Performance optimization techniques learned!',
        3: '🔧 System integration skills developed!',
        4: '🧵 Multi-threading implementation complete!',
        5: '🚀 Advanced WebAssembly features explored!'
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
    if (levelNumber === 37) {
        window.location.href = '../level-37/index.html';
    } else if (levelNumber === 39) {
        window.location.href = '../level-39/index.html';
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

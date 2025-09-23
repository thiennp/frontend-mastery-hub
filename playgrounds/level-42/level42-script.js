// Level 42: Quantum Computing Script

// Global variables
let currentProgress = 0;
let completedExercises = new Set();
let quantumComputingSimulation = new Map();

// Initialize the level
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateUI();
    initializeQuantumComputingSimulation();
});

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('level42_progress');
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
    localStorage.setItem('level42_progress', JSON.stringify(data));
    
    // Update main hub progress
    updateMainHubProgress();
}

// Update main hub progress
function updateMainHubProgress() {
    const hubProgress = JSON.parse(localStorage.getItem('hub_progress') || '{}');
    hubProgress.level42 = {
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

// Initialize quantum computing simulation
function initializeQuantumComputingSimulation() {
    // Create mock quantum computing environment
    createMockQuantumComputingEnvironment();
}

// Create mock quantum computing environment
function createMockQuantumComputingEnvironment() {
    // Mock quantum computing fundamentals for Exercise 1
    quantumComputingSimulation.set('fundamentals', {
        qubits: new Map([
            ['q1', { alpha: 0.707, beta: 0.707, state: 'superposition' }],
            ['q2', { alpha: 1, beta: 0, state: '|0⟩' }]
        ]),
        gates: ['X', 'Y', 'Z', 'H', 'CNOT'],
        measurements: { 'q1': 0, 'q2': 1 },
        superposition: true,
        entanglement: false
    });
    
    // Mock quantum algorithms for Exercise 2
    quantumComputingSimulation.set('algorithms', {
        deutschJozsa: {
            constantResult: [0, 0],
            balancedResult: [1, 0],
            iterations: 1,
            success: true
        },
        grover: {
            searchResult: [1, 0],
            iterations: 2,
            success: true,
            speedup: 'O(√N)'
        },
        shor: {
            factorization: [3, 5],
            success: true,
            complexity: 'O(log³N)'
        }
    });
    
    // Mock quantum machine learning for Exercise 3
    quantumComputingSimulation.set('ml', {
        vqe: {
            energy: -1.85,
            iterations: 100,
            convergence: true,
            parameters: [0.5, 1.2, 0.8, 2.1]
        },
        qnn: {
            accuracy: 0.95,
            epochs: 50,
            loss: 0.05,
            weights: [0.1, 0.3, 0.7, 0.9]
        },
        qsvm: {
            accuracy: 0.92,
            supportVectors: 15,
            kernel: 'quantum'
        }
    });
    
    // Mock quantum cryptography for Exercise 4
    quantumComputingSimulation.set('cryptography', {
        bb84: {
            keyLength: 128,
            efficiency: 0.75,
            errorRate: 0.02,
            secure: true
        },
        qrng: {
            entropy: 0.99,
            randomness: true,
            bitsGenerated: 1000
        },
        qds: {
            signatureValid: true,
            securityLevel: 'quantum',
            keySize: 256
        }
    });
    
    // Mock quantum simulation for Exercise 5
    quantumComputingSimulation.set('simulation', {
        simulator: {
            qubits: 2,
            gates: 5,
            fidelity: 0.98,
            state: '|00⟩ + |11⟩'
        },
        noise: {
            depolarizing: 0.01,
            dephasing: 0.005,
            amplitude: 0.003
        },
        errorCorrection: {
            code: 'surface',
            distance: 5,
            threshold: 0.01
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

// Run Exercise 1: Quantum Computing Fundamentals
function runExercise1(code) {
    const fundamentals = quantumComputingSimulation.get('fundamentals');
    
    const output = [];
    output.push('⚛️ Quantum Computing Fundamentals');
    output.push('');
    output.push('🔬 Quantum System Initialized:');
    output.push(`Qubits: ${fundamentals.qubits.size}`);
    output.push(`Available Gates: ${fundamentals.gates.join(', ')}`);
    output.push(`Superposition: ${fundamentals.superposition ? 'Enabled' : 'Disabled'}`);
    output.push('');
    
    // Show qubit states
    output.push('📊 Qubit States:');
    for (const [qubitId, qubit] of fundamentals.qubits) {
        output.push(`Qubit ${qubitId}:`);
        output.push(`  State: ${qubit.state}`);
        output.push(`  Alpha: ${qubit.alpha.toFixed(3)}`);
        output.push(`  Beta: ${qubit.beta.toFixed(3)}`);
        output.push(`  Measurement: ${fundamentals.measurements[qubitId]}`);
        output.push('');
    }
    
    // Simulate quantum operations
    output.push('⚡ Quantum Operations:');
    output.push('Initial state: |0⟩');
    output.push('After Hadamard gate: (|0⟩ + |1⟩)/√2');
    output.push('After X gate: |1⟩');
    output.push('After CNOT gate: Entangled state');
    output.push('');
    
    // Show measurement results
    output.push('📏 Measurement Results:');
    output.push(`Qubit 1 measurement: ${fundamentals.measurements['q1']}`);
    output.push(`Qubit 2 measurement: ${fundamentals.measurements['q2']}`);
    output.push('State collapsed after measurement');
    output.push('');
    
    // Quantum properties
    output.push('🌌 Quantum Properties:');
    output.push(`Superposition: ${fundamentals.superposition ? 'Active' : 'Inactive'}`);
    output.push(`Entanglement: ${fundamentals.entanglement ? 'Present' : 'Absent'}`);
    output.push(`Coherence Time: 100μs`);
    output.push(`Gate Fidelity: 99.9%`);
    
    output.push('');
    output.push('✅ Quantum computing fundamentals demonstrated!');
    
    return output.join('\n');
}

// Run Exercise 2: Quantum Algorithms
function runExercise2(code) {
    const algorithms = quantumComputingSimulation.get('algorithms');
    
    const output = [];
    output.push('🧮 Quantum Algorithms Execution');
    output.push('');
    output.push('🔍 Deutsch-Jozsa Algorithm:');
    output.push(`Constant Function Result: [${algorithms.deutschJozsa.constantResult.join(', ')}]`);
    output.push(`Balanced Function Result: [${algorithms.deutschJozsa.balancedResult.join(', ')}]`);
    output.push(`Iterations: ${algorithms.deutschJozsa.iterations}`);
    output.push(`Success: ${algorithms.deutschJozsa.success ? 'Yes' : 'No'}`);
    output.push('');
    
    output.push('🔎 Grover Search Algorithm:');
    output.push(`Search Result: [${algorithms.grover.searchResult.join(', ')}]`);
    output.push(`Iterations: ${algorithms.grover.iterations}`);
    output.push(`Speedup: ${algorithms.grover.speedup}`);
    output.push(`Success: ${algorithms.grover.success ? 'Yes' : 'No'}`);
    output.push('');
    
    output.push('🔢 Shor Factorization Algorithm:');
    output.push(`Factorization Result: [${algorithms.shor.factorization.join(', ')}]`);
    output.push(`Complexity: ${algorithms.shor.complexity}`);
    output.push(`Success: ${algorithms.shor.success ? 'Yes' : 'No'}`);
    output.push('');
    
    // Algorithm comparison
    output.push('📊 Algorithm Comparison:');
    output.push(`Deutsch-Jozsa: O(1) vs Classical O(2^n)`);
    output.push(`Grover Search: O(√N) vs Classical O(N)`);
    output.push(`Shor Factorization: O(log³N) vs Classical O(e^N)`);
    output.push('');
    
    // Quantum advantage
    output.push('⚡ Quantum Advantage:');
    output.push(`Exponential speedup in factorization`);
    output.push(`Quadratic speedup in search`);
    output.push(`Constant time function evaluation`);
    output.push(`Quantum parallelism exploited`);
    
    output.push('');
    output.push('✅ Quantum algorithms executed successfully!');
    
    return output.join('\n');
}

// Run Exercise 3: Quantum Machine Learning
function runExercise3(code) {
    const ml = quantumComputingSimulation.get('ml');
    
    const output = [];
    output.push('🤖 Quantum Machine Learning');
    output.push('');
    output.push('🔬 Variational Quantum Eigensolver (VQE):');
    output.push(`Ground State Energy: ${ml.vqe.energy}`);
    output.push(`Optimization Iterations: ${ml.vqe.iterations}`);
    output.push(`Convergence: ${ml.vqe.convergence ? 'Achieved' : 'Not achieved'}`);
    output.push(`Parameters: [${ml.vqe.parameters.map(p => p.toFixed(2)).join(', ')}]`);
    output.push('');
    
    output.push('🧠 Quantum Neural Network (QNN):');
    output.push(`Accuracy: ${(ml.qnn.accuracy * 100).toFixed(1)}%`);
    output.push(`Training Epochs: ${ml.qnn.epochs}`);
    output.push(`Loss: ${ml.qnn.loss.toFixed(3)}`);
    output.push(`Weights: [${ml.qnn.weights.map(w => w.toFixed(2)).join(', ')}]`);
    output.push('');
    
    output.push('🎯 Quantum Support Vector Machine (QSVM):');
    output.push(`Accuracy: ${(ml.qsvm.accuracy * 100).toFixed(1)}%`);
    output.push(`Support Vectors: ${ml.qsvm.supportVectors}`);
    output.push(`Kernel Type: ${ml.qsvm.kernel}`);
    output.push('');
    
    // Training progress
    output.push('📈 Training Progress:');
    output.push('Epoch 0: Loss = 0.500, Accuracy = 50%');
    output.push('Epoch 10: Loss = 0.250, Accuracy = 75%');
    output.push('Epoch 20: Loss = 0.100, Accuracy = 90%');
    output.push('Epoch 50: Loss = 0.050, Accuracy = 95%');
    output.push('');
    
    // Quantum advantages
    output.push('⚡ Quantum ML Advantages:');
    output.push(`Exponential feature space`);
    output.push(`Quantum interference effects`);
    output.push(`Parallel parameter optimization`);
    output.push(`Enhanced pattern recognition`);
    
    output.push('');
    output.push('✅ Quantum machine learning models trained!');
    
    return output.join('\n');
}

// Run Exercise 4: Quantum Cryptography
function runExercise4(code) {
    const crypto = quantumComputingSimulation.get('cryptography');
    
    const output = [];
    output.push('🔐 Quantum Cryptography Protocols');
    output.push('');
    output.push('🔑 BB84 Quantum Key Distribution:');
    output.push(`Key Length: ${crypto.bb84.keyLength} bits`);
    output.push(`Efficiency: ${(crypto.bb84.efficiency * 100).toFixed(1)}%`);
    output.push(`Error Rate: ${(crypto.bb84.errorRate * 100).toFixed(2)}%`);
    output.push(`Security: ${crypto.bb84.secure ? 'Verified' : 'Compromised'}`);
    output.push('');
    
    output.push('🎲 Quantum Random Number Generator:');
    output.push(`Entropy: ${crypto.qrng.entropy.toFixed(3)}`);
    output.push(`Randomness: ${crypto.qrng.randomness ? 'Verified' : 'Failed'}`);
    output.push(`Bits Generated: ${crypto.qrng.bitsGenerated}`);
    output.push('');
    
    output.push('✍️ Quantum Digital Signature:');
    output.push(`Signature Valid: ${crypto.qds.signatureValid ? 'Yes' : 'No'}`);
    output.push(`Security Level: ${crypto.qds.securityLevel}`);
    output.push(`Key Size: ${crypto.qds.keySize} bits`);
    output.push('');
    
    // Security analysis
    output.push('🛡️ Security Analysis:');
    output.push(`BB84 Protocol: Unconditionally secure`);
    output.push(`Quantum RNG: True randomness`);
    output.push(`Quantum Signature: Tamper-evident`);
    output.push(`Post-quantum Security: Achieved`);
    output.push('');
    
    // Key generation process
    output.push('🔧 Key Generation Process:');
    output.push('1. Alice generates random bits and bases');
    output.push('2. Bob generates random bases');
    output.push('3. Quantum channel transmission');
    output.push('4. Basis reconciliation');
    output.push('5. Error detection and correction');
    output.push('6. Privacy amplification');
    output.push('7. Final secure key');
    
    output.push('');
    output.push('✅ Quantum cryptography protocols secure!');
    
    return output.join('\n');
}

// Run Exercise 5: Quantum Simulation
function runExercise5(code) {
    const simulation = quantumComputingSimulation.get('simulation');
    
    const output = [];
    output.push('🔬 Quantum System Simulation');
    output.push('');
    output.push('⚛️ Quantum Simulator:');
    output.push(`Qubits: ${simulation.simulator.qubits}`);
    output.push(`Gates Applied: ${simulation.simulator.gates}`);
    output.push(`State Fidelity: ${(simulation.simulator.fidelity * 100).toFixed(1)}%`);
    output.push(`Final State: ${simulation.simulator.state}`);
    output.push('');
    
    output.push('🌊 Noise Model:');
    output.push(`Depolarizing Noise: ${(simulation.noise.depolarizing * 100).toFixed(2)}%`);
    output.push(`Dephasing Noise: ${(simulation.noise.dephasing * 100).toFixed(2)}%`);
    output.push(`Amplitude Damping: ${(simulation.noise.amplitude * 100).toFixed(2)}%`);
    output.push('');
    
    output.push('🛠️ Error Correction:');
    output.push(`Code Type: ${simulation.errorCorrection.code}`);
    output.push(`Code Distance: ${simulation.errorCorrection.distance}`);
    output.push(`Error Threshold: ${(simulation.errorCorrection.threshold * 100).toFixed(2)}%`);
    output.push('');
    
    // Simulation steps
    output.push('📋 Simulation Steps:');
    output.push('1. Initialize quantum state |00⟩');
    output.push('2. Apply Hadamard gates: (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2');
    output.push('3. Apply CNOT gate: (|00⟩ + |11⟩)/√2');
    output.push('4. Measure qubits: Entangled state');
    output.push('5. Calculate fidelity: 98%');
    output.push('');
    
    // Performance metrics
    output.push('📊 Performance Metrics:');
    output.push(`Simulation Time: 45ms`);
    output.push(`Memory Usage: 2.3MB`);
    output.push(`Gate Operations: 5`);
    output.push(`Measurement Accuracy: 99.9%`);
    output.push('');
    
    // Quantum advantage
    output.push('⚡ Simulation Advantages:');
    output.push(`Exponential state space`);
    output.push(`Quantum interference`);
    output.push(`Entanglement simulation`);
    output.push(`Noise modeling`);
    
    output.push('');
    output.push('✅ Quantum simulation completed successfully!');
    
    return output.join('\n');
}

// Show output in the output panel
function showOutput(exerciseNumber, output) {
    const outputPanel = document.getElementById(`output${exerciseNumber}`);
    outputPanel.textContent = output;
    
    // Add syntax highlighting for quantum computing terms
    if (output.includes('Quantum') || output.includes('Qubit') || output.includes('Entanglement')) {
        outputPanel.innerHTML = highlightQuantumComputingOutput(output);
    }
}

// Highlight quantum computing output
function highlightQuantumComputingOutput(output) {
    return output
        .replace(/Quantum/g, '<span style="color: #9b59b6; font-weight: bold;">$&</span>')
        .replace(/Qubit/g, '<span style="color: #e74c3c; font-weight: bold;">$&</span>')
        .replace(/Entanglement/g, '<span style="color: #3498db; font-weight: bold;">$&</span>')
        .replace(/(\d+\.?\d*)%/g, '<span style="color: #27ae60; font-weight: bold;">$1%</span>')
        .replace(/(\d+\.?\d*)ms/g, '<span style="color: #f39c12; font-weight: bold;">$1ms</span>')
        .replace(/(\d+\.?\d*)MB/g, '<span style="color: #8e44ad; font-weight: bold;">$1MB</span>');
}

// Check if exercise is completed
function checkExerciseCompletion(exerciseNumber, code, result) {
    const checks = {
        1: () => code.includes('QuantumBit') && code.includes('QuantumGate') && result.includes('Quantum Computing Fundamentals'),
        2: () => code.includes('DeutschJozsa') && code.includes('GroversSearch') && result.includes('Quantum Algorithms'),
        3: () => code.includes('VariationalQuantumEigensolver') && code.includes('QuantumNeuralNetwork') && result.includes('Quantum Machine Learning'),
        4: () => code.includes('BB84Protocol') && code.includes('QuantumRNG') && result.includes('Quantum Cryptography'),
        5: () => code.includes('QuantumSimulator') && code.includes('applyGate') && result.includes('Quantum System Simulation')
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
        1: '⚛️ Quantum Computing Fundamentals mastered!',
        2: '🧮 Quantum Algorithms implemented!',
        3: '🤖 Quantum Machine Learning trained!',
        4: '🔐 Quantum Cryptography secured!',
        5: '🔬 Quantum Simulation completed!'
    };
    
    const message = messages[exerciseNumber];
    if (message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #1a1a2e, #16213e);
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
    if (levelNumber === 41) {
        window.location.href = '../level-41/index.html';
    } else if (levelNumber === 43) {
        window.location.href = '../level-43/index.html';
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

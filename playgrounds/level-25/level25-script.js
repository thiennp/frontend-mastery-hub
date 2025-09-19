// Level 25: WebAssembly Script

class WebAssemblyLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'WASM Fundamentals', completed: false },
            { id: 2, name: 'Performance Optimization', completed: false },
            { id: 3, name: 'Language Interop', completed: false },
            { id: 4, name: 'Browser Integration', completed: false },
            { id: 5, name: 'Advanced WASM', completed: false }
        ];
        this.wasmMetrics = {
            wasmSize: 0,
            wasmFunctions: 0,
            wasmMemory: 0,
            wasmSpeedup: 0,
            wasmOps: 0,
            wasmEfficiency: 0,
            langCount: 0,
            interopFunctions: 0,
            interopCompatibility: 0,
            browserAPIs: 0,
            canvasStatus: 'Not Ready',
            webglStatus: 'Not Ready',
            simdStatus: 'Disabled',
            threadCount: 0,
            optimizationLevel: 0
        };
        this.wasmModules = new Map();
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.simulateWASMEnvironment();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.exercise-card').forEach(card => {
            const exerciseId = parseInt(card.dataset.exercise);
            const runBtn = card.querySelector('.run-btn');
            runBtn.addEventListener('click', () => this.runExercise(exerciseId));
        });

        document.getElementById('completeBtn').addEventListener('click', () => this.completeLevel());
        document.querySelector('.btn-secondary').addEventListener('click', () => this.resetLevel());
    }

    simulateWASMEnvironment() {
        // Simulate dynamic WASM metrics updates
        setInterval(() => {
            if (Math.random() > 0.5) {
                this.updateRandomWASMMetric();
            }
        }, 7000);
    }

    updateRandomWASMMetric() {
        const metrics = Object.keys(this.wasmMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Size') || randomMetric.includes('Memory')) {
            this.wasmMetrics[randomMetric] = Math.floor(Math.random() * 1000) + 100;
        } else if (randomMetric.includes('Functions') || randomMetric.includes('APIs')) {
            this.wasmMetrics[randomMetric] = Math.floor(Math.random() * 50) + 10;
        } else if (randomMetric.includes('Speedup')) {
            this.wasmMetrics[randomMetric] = (Math.random() * 10 + 1).toFixed(1);
        } else if (randomMetric.includes('Efficiency') || randomMetric.includes('Compatibility') || randomMetric.includes('Level')) {
            this.wasmMetrics[randomMetric] = Math.floor(Math.random() * 40) + 60;
        } else if (randomMetric.includes('Status')) {
            const statuses = ['Ready', 'Compiling', 'Error', 'Optimized'];
            this.wasmMetrics[randomMetric] = statuses[Math.floor(Math.random() * statuses.length)];
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Compiling WASM...</span>';
        
        setTimeout(() => {
            this.executeWASMExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 4000);
    }

    executeWASMExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeWASMFundamentals(outputContent);
                break;
            case 2:
                this.executePerformanceOptimization(outputContent);
                break;
            case 3:
                this.executeLanguageInterop(outputContent);
                break;
            case 4:
                this.executeBrowserIntegration(outputContent);
                break;
            case 5:
                this.executeAdvancedWASM(outputContent);
                break;
        }
    }

    executeWASMFundamentals(outputContent) {
        this.wasmMetrics.wasmSize = 245;
        this.wasmMetrics.wasmFunctions = 8;
        this.wasmMetrics.wasmMemory = 2;

        outputContent.innerHTML = `
<div class="wasm-fundamentals">
    <h4>⚡ WebAssembly Module Compiled</h4>
    
    <div class="binary-visualization">
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
        <div class="binary-bit"></div>
    </div>
    
    <div class="wasm-module-info">
        <h5>📦 Module Information:</h5>
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">Module Size</div>
                <div class="metric-value">245 KB</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Functions</div>
                <div class="metric-value">8</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Memory</div>
                <div class="metric-value">2 MB</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Instructions</div>
                <div class="metric-value">1,247</div>
            </div>
        </div>
    </div>
    
    <div class="memory-visualization">
        <div class="memory-cell allocated"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell allocated"></div>
        <div class="memory-cell"></div>
        <div class="memory-cell allocated"></div>
    </div>
    
    <div class="function-exports">
        <h5>🔧 Exported Functions:</h5>
        <div style="margin: 10px 0;">
            <span class="wasm-result wasm-compiled">add(a, b) → int32</span>
            <span class="wasm-result wasm-compiled">fibonacci(n) → int32</span>
            <span class="wasm-result wasm-compiled">processArray(ptr, len) → void</span>
            <span class="wasm-result wasm-compiled">multiply(a, b) → int32</span>
        </div>
    </div>
    
    <div class="execution-results">
        <h5>🎯 Execution Results:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            add(5, 3) = 8<br>
            fibonacci(10) = 55<br>
            processArray([1,2,3,4,5]) = [2,4,6,8,10]<br>
            multiply(7, 6) = 42<br>
            <br>
            Execution Time: 0.8ms<br>
            Memory Usage: 1.2 MB<br>
            Stack Depth: 12 levels
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executePerformanceOptimization(outputContent) {
        this.wasmMetrics.wasmSpeedup = 8.5;
        this.wasmMetrics.wasmOps = 1250000;
        this.wasmMetrics.wasmEfficiency = 94;

        outputContent.innerHTML = `
<div class="performance-optimization">
    <h4>🚀 Performance Optimization Complete</h4>
    
    <div class="performance-comparison">
        <h5>📊 Performance Comparison:</h5>
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">WASM Speedup</div>
                <div class="metric-value">8.5x</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Operations/sec</div>
                <div class="metric-value">1.25M</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Efficiency</div>
                <div class="metric-value">94%</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Memory Usage</div>
                <div class="metric-value">45 MB</div>
            </div>
        </div>
    </div>
    
    <div class="optimization-techniques">
        <h5>⚡ Applied Optimizations:</h5>
        <div style="margin: 10px 0;">
            <span class="wasm-result simd-enabled">SIMD Vectorization ✓</span>
            <span class="wasm-result threading-active">Multi-threading ✓</span>
            <span class="wasm-result performance-high">Memory Pooling ✓</span>
            <span class="wasm-result performance-high">Loop Unrolling ✓</span>
        </div>
    </div>
    
    <div class="simd-vector">
        <div class="vector-element">1</div>
        <div class="vector-element">2</div>
        <div class="vector-element">3</div>
        <div class="vector-element">4</div>
        <div class="vector-element">5</div>
        <div class="vector-element">6</div>
        <div class="vector-element">7</div>
        <div class="vector-element">8</div>
    </div>
    
    <div class="threading-visualization">
        <div class="thread active"></div>
        <div class="thread active"></div>
        <div class="thread active"></div>
        <div class="thread active"></div>
        <div class="thread idle"></div>
        <div class="thread idle"></div>
        <div class="thread idle"></div>
        <div class="thread idle"></div>
    </div>
    
    <div class="benchmark-results">
        <h5>📈 Benchmark Results:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Matrix Multiplication: 8.5x faster than JS<br>
            Image Processing: 12.3x faster than JS<br>
            Cryptographic Operations: 15.7x faster than JS<br>
            Scientific Computing: 6.8x faster than JS<br>
            <br>
            Total Optimization: 94% efficiency<br>
            Memory Overhead: Reduced by 67%
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeLanguageInterop(outputContent) {
        this.wasmMetrics.langCount = 3;
        this.wasmMetrics.interopFunctions = 15;
        this.wasmMetrics.interopCompatibility = 98;

        outputContent.innerHTML = `
<div class="language-interop">
    <h4>🌐 Multi-Language WASM Integration</h4>
    
    <div class="language-support">
        <h5>🔧 Supported Languages:</h5>
        <div style="margin: 15px 0;">
            <span class="wasm-result wasm-compiled">Rust → WASM ✓</span>
            <span class="wasm-result wasm-compiled">C++ → WASM ✓</span>
            <span class="wasm-result wasm-compiled">Go → WASM ✓</span>
            <span class="wasm-result wasm-compiled">AssemblyScript → WASM ✓</span>
        </div>
    </div>
    
    <div class="interop-functions">
        <h5>🔗 Interoperability Functions:</h5>
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">Rust Functions</div>
                <div class="metric-value">6</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">C++ Functions</div>
                <div class="metric-value">5</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Go Functions</div>
                <div class="metric-value">4</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Compatibility</div>
                <div class="metric-value">98%</div>
            </div>
        </div>
    </div>
    
    <div class="language-examples">
        <h5>💻 Language Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Rust:</strong> Point.distance() = 5.0<br>
            <strong>C++:</strong> Calculator.add(2, 3) = 5<br>
            <strong>Go:</strong> fibonacci(10) = 55<br>
            <strong>AssemblyScript:</strong> vectorAdd([1,2,3], [4,5,6]) = [5,7,9]
        </div>
    </div>
    
    <div class="type-bindings">
        <h5>🔗 Type Bindings:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            • i32 ↔ int32 (4 bytes)<br>
            • f64 ↔ double (8 bytes)<br>
            • String ↔ UTF-8 pointer<br>
            • Array ↔ Linear memory pointer<br>
            • Struct ↔ Memory layout mapping<br>
            <br>
            Automatic type conversion: ✓<br>
            Memory management: ✓<br>
            Error handling: ✓
        </div>
    </div>
    
    <div class="performance-comparison">
        <h5>⚡ Cross-Language Performance:</h5>
        <div style="margin: 10px 0;">
            <span class="wasm-result performance-high">Rust: 100% (baseline)</span>
            <span class="wasm-result performance-high">C++: 98%</span>
            <span class="wasm-result performance-medium">Go: 85%</span>
            <span class="wasm-result performance-medium">AssemblyScript: 90%</span>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeBrowserIntegration(outputContent) {
        this.wasmMetrics.browserAPIs = 12;
        this.wasmMetrics.canvasStatus = 'Ready';
        this.wasmMetrics.webglStatus = 'Ready';

        outputContent.innerHTML = `
<div class="browser-integration">
    <h4>🌐 Browser Integration Complete</h4>
    
    <div class="web-apis">
        <h5>🔌 Web API Integration:</h5>
        <div style="margin: 15px 0;">
            <span class="wasm-result wasm-compiled">Canvas 2D ✓</span>
            <span class="wasm-result wasm-compiled">WebGL ✓</span>
            <span class="wasm-result wasm-compiled">Web Audio ✓</span>
            <span class="wasm-result wasm-compiled">Web Workers ✓</span>
            <span class="wasm-result wasm-compiled">Fetch API ✓</span>
            <span class="wasm-result wasm-compiled">IndexedDB ✓</span>
        </div>
    </div>
    
    <div class="canvas-rendering">
        <h5>🎨 Canvas Rendering:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); text-align: center;">
            <div style="width: 200px; height: 150px; background: linear-gradient(45deg, #654ea3, #eaafc8); margin: 0 auto; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                🎨 WASM Canvas
            </div>
        </div>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Mandelbrot Set: 60 FPS<br>
            Image Processing: Real-time<br>
            Particle System: 10,000 particles<br>
            Memory Usage: 15 MB
        </div>
    </div>
    
    <div class="webgl-integration">
        <h5>🎮 WebGL Integration:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); text-align: center;">
            <div style="width: 200px; height: 150px; background: linear-gradient(45deg, #4facfe, #00f2fe); margin: 0 auto; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                🎮 3D Scene
            </div>
        </div>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Shader Compilation: ✓<br>
            Texture Loading: ✓<br>
            Model Rendering: ✓<br>
            Lighting: Phong shading
        </div>
    </div>
    
    <div class="event-handling">
        <h5>🎯 Event Handling:</h5>
        <div style="margin: 10px 0;">
            <span class="wasm-result threading-active">Mouse Events ✓</span>
            <span class="wasm-result threading-active">Keyboard Events ✓</span>
            <span class="wasm-result threading-active">Touch Events ✓</span>
            <span class="wasm-result threading-active">Resize Events ✓</span>
        </div>
    </div>
    
    <div class="performance-metrics">
        <h5>📊 Integration Performance:</h5>
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">APIs Connected</div>
                <div class="metric-value">12</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Canvas FPS</div>
                <div class="metric-value">60</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">WebGL FPS</div>
                <div class="metric-value">60</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Latency</div>
                <div class="metric-value">2ms</div>
            </div>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeAdvancedWASM(outputContent) {
        this.wasmMetrics.simdStatus = 'Enabled';
        this.wasmMetrics.threadCount = 8;
        this.wasmMetrics.optimizationLevel = 96;

        outputContent.innerHTML = `
<div class="advanced-wasm">
    <h4>🚀 Advanced WebAssembly Features</h4>
    
    <div class="simd-support">
        <h5>⚡ SIMD Vector Instructions:</h5>
        <div style="margin: 15px 0;">
            <span class="wasm-result simd-enabled">SIMD Enabled ✓</span>
            <span class="wasm-result simd-enabled">Vector Operations ✓</span>
            <span class="wasm-result simd-enabled">Parallel Processing ✓</span>
            <span class="wasm-result simd-enabled">128-bit Vectors ✓</span>
        </div>
        <div class="simd-vector">
            <div class="vector-element">1</div>
            <div class="vector-element">2</div>
            <div class="vector-element">3</div>
            <div class="vector-element">4</div>
            <div class="vector-element">5</div>
            <div class="vector-element">6</div>
            <div class="vector-element">7</div>
            <div class="vector-element">8</div>
        </div>
    </div>
    
    <div class="threading-support">
        <h5>🧵 Multi-threading Support:</h5>
        <div class="threading-visualization">
            <div class="thread active"></div>
            <div class="thread active"></div>
            <div class="thread active"></div>
            <div class="thread active"></div>
            <div class="thread active"></div>
            <div class="thread active"></div>
            <div class="thread active"></div>
            <div class="thread active"></div>
        </div>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            CPU Cores: 8<br>
            Worker Threads: 8<br>
            SharedArrayBuffer: ✓<br>
            Atomic Operations: ✓
        </div>
    </div>
    
    <div class="wasi-integration">
        <h5>🔧 WASI System Interface:</h5>
        <div style="margin: 10px 0;">
            <span class="wasm-result wasm-compiled">File System ✓</span>
            <span class="wasm-result wasm-compiled">Network I/O ✓</span>
            <span class="wasm-result wasm-compiled">Environment Variables ✓</span>
            <span class="wasm-result wasm-compiled">Process Management ✓</span>
        </div>
    </div>
    
    <div class="optimization-levels">
        <h5>⚙️ Optimization Levels:</h5>
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">Code Size</div>
                <div class="metric-value">-67%</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Execution Speed</div>
                <div class="metric-value">+340%</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Memory Usage</div>
                <div class="metric-value">-45%</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Overall</div>
                <div class="metric-value">96%</div>
            </div>
        </div>
    </div>
    
    <div class="advanced-features">
        <h5>🎯 Advanced Features:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            • Tail Call Optimization: ✓<br>
            • Dead Code Elimination: ✓<br>
            • Constant Folding: ✓<br>
            • Loop Unrolling: ✓<br>
            • Function Inlining: ✓<br>
            • Memory Pooling: ✓<br>
            • Garbage Collection: ✓<br>
            • Hot Code Reloading: ✓
        </div>
    </div>
    
    <div class="performance-benchmarks">
        <h5>📊 Performance Benchmarks:</h5>
        <div style="margin: 10px 0;">
            <span class="wasm-result performance-high">Matrix Math: 15.2x faster</span>
            <span class="wasm-result performance-high">Image Processing: 22.8x faster</span>
            <span class="wasm-result performance-high">Cryptography: 18.5x faster</span>
            <span class="wasm-result performance-high">Scientific Computing: 12.3x faster</span>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    markExerciseComplete(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        exercise.completed = true;
        
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const statusElement = card.querySelector('.exercise-status');
        
        card.classList.add('completed');
        statusElement.innerHTML = '<i class="fas fa-circle status-completed"></i><span>Completed</span>';
        
        card.classList.add('success-animation');
        setTimeout(() => {
            card.classList.remove('success-animation');
        }, 600);
        
        this.saveProgress();
    }

    updateMetricsDisplay() {
        // Update WASM Fundamentals metrics
        document.getElementById('wasmSize').textContent = `${this.wasmMetrics.wasmSize} KB`;
        document.getElementById('wasmFunctions').textContent = this.wasmMetrics.wasmFunctions;
        document.getElementById('wasmMemory').textContent = `${this.wasmMetrics.wasmMemory} MB`;

        // Update Performance metrics
        document.getElementById('wasmSpeedup').textContent = `${this.wasmMetrics.wasmSpeedup}x`;
        document.getElementById('wasmOps').textContent = this.wasmMetrics.wasmOps.toLocaleString();
        document.getElementById('wasmEfficiency').textContent = `${this.wasmMetrics.wasmEfficiency}%`;

        // Update Language Interop metrics
        document.getElementById('langCount').textContent = this.wasmMetrics.langCount;
        document.getElementById('interopFunctions').textContent = this.wasmMetrics.interopFunctions;
        document.getElementById('interopCompatibility').textContent = `${this.wasmMetrics.interopCompatibility}%`;

        // Update Browser Integration metrics
        document.getElementById('browserAPIs').textContent = this.wasmMetrics.browserAPIs;
        document.getElementById('canvasStatus').textContent = this.wasmMetrics.canvasStatus;
        document.getElementById('webglStatus').textContent = this.wasmMetrics.webglStatus;

        // Update Advanced WASM metrics
        document.getElementById('simdStatus').textContent = this.wasmMetrics.simdStatus;
        document.getElementById('threadCount').textContent = this.wasmMetrics.threadCount;
        document.getElementById('optimizationLevel').textContent = `${this.wasmMetrics.optimizationLevel}%`;
    }

    updateProgressDisplay() {
        const completedCount = this.exercises.filter(ex => ex.completed).length;
        const totalCount = this.exercises.length;
        const percentage = (completedCount / totalCount) * 100;

        const progressFill = document.getElementById('overallProgress');
        progressFill.style.width = `${percentage}%`;

        const progressText = document.querySelector('.progress-text');
        progressText.textContent = `${completedCount}/${totalCount} Complete`;

        const completeBtn = document.getElementById('completeBtn');
        completeBtn.disabled = completedCount < totalCount;
    }

    completeLevel() {
        if (this.exercises.every(ex => ex.completed)) {
            this.showCompletionAnimation();
            
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(25)) {
                completedLevels.push(25);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 25).toString());

            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 25: WebAssembly!\n\nYou\'ve mastered:\n• WASM fundamentals and module compilation\n• Performance optimization with SIMD and threading\n• Multi-language interoperability\n• Browser integration with Canvas and WebGL\n• Advanced WASM features and optimization');
                
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        for (let i = 0; i < 40; i++) {
            const wasmIcon = document.createElement('div');
            wasmIcon.style.position = 'absolute';
            wasmIcon.style.fontSize = '20px';
            wasmIcon.innerHTML = ['⚡', '🔧', '🌐', '🚀', '💻', '🎯', '📊'][Math.floor(Math.random() * 7)];
            wasmIcon.style.left = Math.random() * 100 + '%';
            wasmIcon.style.top = '-30px';
            wasmIcon.style.animation = `wasmFall ${Math.random() * 2 + 2}s linear forwards`;
            wasmIcon.style.opacity = '0.8';
            wasmIcon.classList.add('wasm-compiling');
            container.appendChild(wasmIcon);

            setTimeout(() => wasmIcon.remove(), 4000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes wasmFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All WASM progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            this.wasmMetrics = {
                wasmSize: 0, wasmFunctions: 0, wasmMemory: 0,
                wasmSpeedup: 0, wasmOps: 0, wasmEfficiency: 0,
                langCount: 0, interopFunctions: 0, interopCompatibility: 0,
                browserAPIs: 0, canvasStatus: 'Not Ready', webglStatus: 'Not Ready',
                simdStatus: 'Disabled', threadCount: 0, optimizationLevel: 0
            };

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level25Progress', JSON.stringify({
            exercises: this.exercises,
            wasmMetrics: this.wasmMetrics
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level25Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.wasmMetrics = data.wasmMetrics || this.wasmMetrics;
            
            this.exercises.forEach((exercise, index) => {
                if (exercise.completed) {
                    const card = document.querySelector(`[data-exercise="${index + 1}"]`);
                    if (card) {
                        card.classList.add('completed');
                        const statusElement = card.querySelector('.exercise-status');
                        statusElement.innerHTML = '<i class="fas fa-circle status-completed"></i><span>Completed</span>';
                    }
                }
            });
        }
    }
}

// Global functions for HTML onclick handlers
function runExercise(exerciseId) {
    if (window.wasmLevel) {
        window.wasmLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.wasmLevel) {
        window.wasmLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.wasmLevel) {
        window.wasmLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.wasmLevel = new WebAssemblyLevel();
});

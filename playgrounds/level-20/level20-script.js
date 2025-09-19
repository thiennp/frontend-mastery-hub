// Level 20: Performance Optimization Script

class PerformanceOptimizationLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'Bundle Optimization', completed: false },
            { id: 2, name: 'Image Optimization', completed: false },
            { id: 3, name: 'Caching Strategies', completed: false },
            { id: 4, name: 'Performance Monitoring', completed: false },
            { id: 5, name: 'Advanced Optimization', completed: false }
        ];
        this.currentExercise = 1;
        this.performanceMetrics = {
            bundleSize: 0,
            loadTime: 0,
            chunkCount: 0,
            imageFormat: 'Original',
            imageSize: 0,
            imageLoadTime: 0,
            cacheHitRate: 0,
            cacheSize: 0,
            cacheRequests: 0,
            lcpValue: 0,
            fidValue: 0,
            clsValue: 0,
            budgetStatus: 'Within',
            preloadCount: 0,
            optimizationScore: 0
        };
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.initializePerformanceMonitoring();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Exercise completion tracking
        document.querySelectorAll('.exercise-card').forEach(card => {
            const exerciseId = parseInt(card.dataset.exercise);
            const runBtn = card.querySelector('.run-btn');
            runBtn.addEventListener('click', () => this.runExercise(exerciseId));
        });

        // Level completion
        document.getElementById('completeBtn').addEventListener('click', () => this.completeLevel());
        
        // Reset level
        document.querySelector('.btn-secondary').addEventListener('click', () => this.resetLevel());
    }

    initializePerformanceMonitoring() {
        // Set up performance observers
        this.setupWebVitals();
        this.setupPerformanceAPI();
        this.setupResourceTiming();
    }

    setupWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.performanceMetrics.lcpValue = Math.round(lastEntry.startTime);
                    this.updateMetricsDisplay();
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.log('LCP observer not supported');
            }

            // First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.performanceMetrics.fidValue = Math.round(entry.processingStart - entry.startTime);
                        this.updateMetricsDisplay();
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.log('FID observer not supported');
            }

            // Cumulative Layout Shift (CLS)
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                            this.performanceMetrics.clsValue = Math.round(clsValue * 1000) / 1000;
                            this.updateMetricsDisplay();
                        }
                    });
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.log('CLS observer not supported');
            }
        }
    }

    setupPerformanceAPI() {
        // Get navigation timing
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.performanceMetrics.loadTime = Math.round(navigation.loadEventEnd - navigation.loadEventStart);
                this.updateMetricsDisplay();
            }
        });
    }

    setupResourceTiming() {
        // Monitor resource loading
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            let totalSize = 0;
            let imageCount = 0;
            let totalImageSize = 0;

            resources.forEach(resource => {
                if (resource.transferSize) {
                    totalSize += resource.transferSize;
                }
                
                if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
                    imageCount++;
                    if (resource.transferSize) {
                        totalImageSize += resource.transferSize;
                    }
                }
            });

            this.performanceMetrics.bundleSize = Math.round(totalSize / 1024);
            this.performanceMetrics.imageSize = Math.round(totalImageSize / 1024);
            this.performanceMetrics.chunkCount = resources.length;
            this.updateMetricsDisplay();
        });
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        // Update status to in-progress
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Running...</span>';
        
        // Simulate exercise execution
        setTimeout(() => {
            this.executeExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 1500);
    }

    executeExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeBundleOptimization(outputContent);
                break;
            case 2:
                this.executeImageOptimization(outputContent);
                break;
            case 3:
                this.executeCachingStrategies(outputContent);
                break;
            case 4:
                this.executePerformanceMonitoring(outputContent);
                break;
            case 5:
                this.executeAdvancedOptimization(outputContent);
                break;
        }
    }

    executeBundleOptimization(outputContent) {
        const bundleSize = Math.floor(Math.random() * 500) + 100;
        const loadTime = Math.floor(Math.random() * 200) + 50;
        const chunkCount = Math.floor(Math.random() * 10) + 3;

        this.performanceMetrics.bundleSize = bundleSize;
        this.performanceMetrics.loadTime = loadTime;
        this.performanceMetrics.chunkCount = chunkCount;

        outputContent.innerHTML = `
<div class="performance-analysis">
    <h4>📊 Bundle Analysis Results</h4>
    <div class="chart-container">
        <div class="chart-bar" data-label="Bundle Size" data-value="${bundleSize} KB" style="width: ${Math.min(bundleSize / 5, 100)}%"></div>
        <div class="chart-bar" data-label="Load Time" data-value="${loadTime} ms" style="width: ${Math.min(loadTime / 2, 100)}%"></div>
        <div class="chart-bar" data-label="Chunks" data-value="${chunkCount}" style="width: ${Math.min(chunkCount * 10, 100)}%"></div>
    </div>
    
    <div class="optimization-tips">
        <h5>🎯 Optimization Applied:</h5>
        <ul>
            <li>✅ Code splitting implemented</li>
            <li>✅ Tree shaking enabled</li>
            <li>✅ Dynamic imports configured</li>
            <li>✅ Bundle compression applied</li>
        </ul>
    </div>
    
    <div class="performance-metrics">
        <span class="performance-metric performance-success">Bundle Size: ${bundleSize} KB</span>
        <span class="performance-metric performance-success">Load Time: ${loadTime} ms</span>
        <span class="performance-metric performance-success">Chunks: ${chunkCount}</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeImageOptimization(outputContent) {
        const formats = ['WebP', 'AVIF', 'JPEG', 'PNG'];
        const format = formats[Math.floor(Math.random() * formats.length)];
        const imageSize = Math.floor(Math.random() * 200) + 50;
        const loadTime = Math.floor(Math.random() * 100) + 20;

        this.performanceMetrics.imageFormat = format;
        this.performanceMetrics.imageSize = imageSize;
        this.performanceMetrics.imageLoadTime = loadTime;

        outputContent.innerHTML = `
<div class="image-optimization-results">
    <h4>🖼️ Image Optimization Results</h4>
    <div class="optimization-comparison">
        <div class="before-after">
            <div class="before">
                <h5>Before Optimization</h5>
                <div class="metric">Format: JPEG</div>
                <div class="metric">Size: ${imageSize * 2} KB</div>
                <div class="metric">Load Time: ${loadTime * 1.5} ms</div>
            </div>
            <div class="after">
                <h5>After Optimization</h5>
                <div class="metric">Format: ${format}</div>
                <div class="metric">Size: ${imageSize} KB</div>
                <div class="metric">Load Time: ${loadTime} ms</div>
            </div>
        </div>
    </div>
    
    <div class="optimization-tips">
        <h5>🎯 Optimization Applied:</h5>
        <ul>
            <li>✅ Modern format conversion (${format})</li>
            <li>✅ Responsive images with srcset</li>
            <li>✅ Lazy loading implemented</li>
            <li>✅ Compression optimized</li>
        </ul>
    </div>
    
    <div class="performance-metrics">
        <span class="performance-metric performance-success">Format: ${format}</span>
        <span class="performance-metric performance-success">Size: ${imageSize} KB</span>
        <span class="performance-metric performance-success">Load Time: ${loadTime} ms</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeCachingStrategies(outputContent) {
        const hitRate = Math.floor(Math.random() * 30) + 70;
        const cacheSize = Math.floor(Math.random() * 1000) + 500;
        const requests = Math.floor(Math.random() * 100) + 50;

        this.performanceMetrics.cacheHitRate = hitRate;
        this.performanceMetrics.cacheSize = cacheSize;
        this.performanceMetrics.cacheRequests = requests;

        outputContent.innerHTML = `
<div class="caching-results">
    <h4>💾 Caching Strategy Results</h4>
    <div class="cache-performance">
        <div class="cache-metrics">
            <div class="metric-card">
                <h5>Cache Hit Rate</h5>
                <div class="metric-value ${hitRate >= 80 ? 'success' : hitRate >= 60 ? 'warning' : 'error'}">${hitRate}%</div>
            </div>
            <div class="metric-card">
                <h5>Cache Size</h5>
                <div class="metric-value">${cacheSize} KB</div>
            </div>
            <div class="metric-card">
                <h5>Total Requests</h5>
                <div class="metric-value">${requests}</div>
            </div>
        </div>
    </div>
    
    <div class="caching-strategies">
        <h5>🎯 Caching Strategies Applied:</h5>
        <ul>
            <li>✅ HTTP caching headers configured</li>
            <li>✅ Service Worker caching implemented</li>
            <li>✅ Memory caching with LRU</li>
            <li>✅ CDN edge caching enabled</li>
        </ul>
    </div>
    
    <div class="performance-metrics">
        <span class="performance-metric ${hitRate >= 80 ? 'performance-success' : hitRate >= 60 ? 'performance-warning' : 'performance-error'}">Hit Rate: ${hitRate}%</span>
        <span class="performance-metric performance-success">Size: ${cacheSize} KB</span>
        <span class="performance-metric performance-success">Requests: ${requests}</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executePerformanceMonitoring(outputContent) {
        const lcp = Math.floor(Math.random() * 1000) + 1000;
        const fid = Math.floor(Math.random() * 50) + 10;
        const cls = Math.random() * 0.1;

        this.performanceMetrics.lcpValue = lcp;
        this.performanceMetrics.fidValue = fid;
        this.performanceMetrics.clsValue = cls;

        outputContent.innerHTML = `
<div class="performance-monitoring-results">
    <h4>📈 Performance Monitoring Results</h4>
    <div class="web-vitals">
        <div class="vital-metric">
            <h5>Largest Contentful Paint (LCP)</h5>
            <div class="metric-value ${lcp <= 2500 ? 'success' : 'warning'}">${lcp} ms</div>
            <div class="threshold">Threshold: ≤ 2500ms</div>
        </div>
        <div class="vital-metric">
            <h5>First Input Delay (FID)</h5>
            <div class="metric-value ${fid <= 100 ? 'success' : 'warning'}">${fid} ms</div>
            <div class="threshold">Threshold: ≤ 100ms</div>
        </div>
        <div class="vital-metric">
            <h5>Cumulative Layout Shift (CLS)</h5>
            <div class="metric-value ${cls <= 0.1 ? 'success' : 'warning'}">${cls.toFixed(3)}</div>
            <div class="threshold">Threshold: ≤ 0.1</div>
        </div>
    </div>
    
    <div class="monitoring-features">
        <h5>🎯 Monitoring Features:</h5>
        <ul>
            <li>✅ Core Web Vitals tracking</li>
            <li>✅ Performance API integration</li>
            <li>✅ Real-time metrics collection</li>
            <li>✅ Performance budget alerts</li>
        </ul>
    </div>
    
    <div class="performance-metrics">
        <span class="performance-metric ${lcp <= 2500 ? 'performance-success' : 'performance-warning'}">LCP: ${lcp} ms</span>
        <span class="performance-metric ${fid <= 100 ? 'performance-success' : 'performance-warning'}">FID: ${fid} ms</span>
        <span class="performance-metric ${cls <= 0.1 ? 'performance-success' : 'performance-warning'}">CLS: ${cls.toFixed(3)}</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeAdvancedOptimization(outputContent) {
        const budgetStatus = Math.random() > 0.2 ? 'Within' : 'Exceeded';
        const preloadCount = Math.floor(Math.random() * 5) + 3;
        const score = Math.floor(Math.random() * 20) + 80;

        this.performanceMetrics.budgetStatus = budgetStatus;
        this.performanceMetrics.preloadCount = preloadCount;
        this.performanceMetrics.optimizationScore = score;

        outputContent.innerHTML = `
<div class="advanced-optimization-results">
    <h4>🚀 Advanced Optimization Results</h4>
    <div class="optimization-score">
        <div class="score-circle">
            <div class="score-value">${score}</div>
            <div class="score-label">Optimization Score</div>
        </div>
    </div>
    
    <div class="optimization-features">
        <h5>🎯 Advanced Features Applied:</h5>
        <ul>
            <li>✅ Resource preloading implemented</li>
            <li>✅ Critical resource prioritization</li>
            <li>✅ Performance budget monitoring</li>
            <li>✅ Advanced bundling strategies</li>
        </ul>
    </div>
    
    <div class="budget-status">
        <h5>💰 Performance Budget Status</h5>
        <div class="budget-indicator ${budgetStatus === 'Within' ? 'success' : 'warning'}">
            ${budgetStatus === 'Within' ? '✅ Within Budget' : '⚠️ Budget Exceeded'}
        </div>
    </div>
    
    <div class="performance-metrics">
        <span class="performance-metric ${budgetStatus === 'Within' ? 'performance-success' : 'performance-warning'}">Budget: ${budgetStatus}</span>
        <span class="performance-metric performance-success">Preloads: ${preloadCount}</span>
        <span class="performance-metric performance-success">Score: ${score}/100</span>
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
        
        this.saveProgress();
    }

    updateMetricsDisplay() {
        // Update bundle optimization metrics
        document.getElementById('bundleSize').textContent = `${this.performanceMetrics.bundleSize} KB`;
        document.getElementById('loadTime').textContent = `${this.performanceMetrics.loadTime} ms`;
        document.getElementById('chunkCount').textContent = this.performanceMetrics.chunkCount;

        // Update image optimization metrics
        document.getElementById('imageFormat').textContent = this.performanceMetrics.imageFormat;
        document.getElementById('imageSize').textContent = `${this.performanceMetrics.imageSize} KB`;
        document.getElementById('imageLoadTime').textContent = `${this.performanceMetrics.imageLoadTime} ms`;

        // Update caching metrics
        document.getElementById('cacheHitRate').textContent = `${this.performanceMetrics.cacheHitRate}%`;
        document.getElementById('cacheSize').textContent = `${this.performanceMetrics.cacheSize} KB`;
        document.getElementById('cacheRequests').textContent = this.performanceMetrics.cacheRequests;

        // Update performance monitoring metrics
        document.getElementById('lcpValue').textContent = `${this.performanceMetrics.lcpValue} ms`;
        document.getElementById('fidValue').textContent = `${this.performanceMetrics.fidValue} ms`;
        document.getElementById('clsValue').textContent = this.performanceMetrics.clsValue;

        // Update advanced optimization metrics
        document.getElementById('budgetStatus').textContent = this.performanceMetrics.budgetStatus;
        document.getElementById('preloadCount').textContent = this.performanceMetrics.preloadCount;
        document.getElementById('optimizationScore').textContent = `${this.performanceMetrics.optimizationScore}/100`;
    }

    updateProgressDisplay() {
        const completedCount = this.exercises.filter(ex => ex.completed).length;
        const totalCount = this.exercises.length;
        const percentage = (completedCount / totalCount) * 100;

        // Update progress bar
        const progressFill = document.getElementById('overallProgress');
        progressFill.style.width = `${percentage}%`;

        // Update progress text
        const progressText = document.querySelector('.progress-text');
        progressText.textContent = `${completedCount}/${totalCount} Complete`;

        // Enable/disable complete button
        const completeBtn = document.getElementById('completeBtn');
        completeBtn.disabled = completedCount < totalCount;
    }

    completeLevel() {
        if (this.exercises.every(ex => ex.completed)) {
            // Show completion animation
            this.showCompletionAnimation();
            
            // Update local storage
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(20)) {
                completedLevels.push(20);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            // Update progress
            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 20).toString());

            // Show success message
            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 20: Performance Optimization!\n\nYou\'ve mastered:\n• Bundle optimization techniques\n• Image optimization strategies\n• Caching implementations\n• Performance monitoring\n• Advanced optimization methods');
                
                // Redirect to main hub
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        // Create confetti effect
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#ff6b35', '#00d4aa', '#004e89', '#ffc107'][Math.floor(Math.random() * 4)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s linear forwards`;
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }

        // Add confetti animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            // Reset UI
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            // Clear outputs
            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            // Reset metrics
            this.performanceMetrics = {
                bundleSize: 0, loadTime: 0, chunkCount: 0,
                imageFormat: 'Original', imageSize: 0, imageLoadTime: 0,
                cacheHitRate: 0, cacheSize: 0, cacheRequests: 0,
                lcpValue: 0, fidValue: 0, clsValue: 0,
                budgetStatus: 'Within', preloadCount: 0, optimizationScore: 0
            };

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level20Progress', JSON.stringify({
            exercises: this.exercises,
            performanceMetrics: this.performanceMetrics
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level20Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.performanceMetrics = data.performanceMetrics || this.performanceMetrics;
            
            // Update UI based on saved progress
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
    if (window.performanceLevel) {
        window.performanceLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.performanceLevel) {
        window.performanceLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.performanceLevel) {
        window.performanceLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.performanceLevel = new PerformanceOptimizationLevel();
});

// Add some additional CSS for the dynamic content
const additionalStyles = `
<style>
.metric-card {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    margin: 10px;
}

.metric-card h5 {
    color: var(--text-secondary);
    margin-bottom: 10px;
    font-size: 0.9rem;
}

.metric-value {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.metric-value.success {
    color: var(--success-color);
}

.metric-value.warning {
    color: var(--warning-color);
}

.metric-value.error {
    color: var(--error-color);
}

.threshold {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.before-after {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 20px 0;
}

.before, .after {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
}

.before h5, .after h5 {
    color: var(--text-primary);
    margin-bottom: 15px;
    text-align: center;
}

.before .metric, .after .metric {
    color: var(--text-secondary);
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
}

.score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--gradient-accent);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    color: white;
}

.score-value {
    font-size: 2rem;
    font-weight: bold;
}

.score-label {
    font-size: 0.8rem;
    text-align: center;
}

.budget-indicator {
    padding: 10px 20px;
    border-radius: 6px;
    text-align: center;
    font-weight: bold;
    margin: 10px 0;
}

.budget-indicator.success {
    background: rgba(40, 167, 69, 0.2);
    color: var(--success-color);
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.budget-indicator.warning {
    background: rgba(255, 193, 7, 0.2);
    color: var(--warning-color);
    border: 1px solid rgba(255, 193, 7, 0.3);
}

.optimization-tips, .monitoring-features, .caching-strategies, .optimization-features {
    background: rgba(0, 212, 170, 0.1);
    border: 1px solid rgba(0, 212, 170, 0.3);
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
}

.optimization-tips h5, .monitoring-features h5, .caching-strategies h5, .optimization-features h5 {
    color: var(--accent-color);
    margin-bottom: 10px;
}

.optimization-tips ul, .monitoring-features ul, .caching-strategies ul, .optimization-features ul {
    list-style: none;
    padding: 0;
}

.optimization-tips li, .monitoring-features li, .caching-strategies li, .optimization-features li {
    color: var(--text-secondary);
    margin-bottom: 5px;
    padding-left: 20px;
    position: relative;
}

.optimization-tips li::before, .monitoring-features li::before, .caching-strategies li::before, .optimization-features li::before {
    content: '✅';
    position: absolute;
    left: 0;
    color: var(--accent-color);
}

@media (max-width: 768px) {
    .before-after {
        grid-template-columns: 1fr;
    }
    
    .cache-metrics {
        display: flex;
        flex-direction: column;
    }
    
    .metric-card {
        margin: 5px 0;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);



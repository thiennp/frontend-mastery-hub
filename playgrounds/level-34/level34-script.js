// Level 34: Performance Optimization Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['BundleOptimizer', 'WebpackConfigGenerator', 'analyzeDependencies', 'performTreeShaking'],
        description: 'Bundle Optimization'
    },
    2: {
        required: ['ImageOptimizer', 'LazyLoadingManager', 'ImagePreloader', 'optimizeImage'],
        description: 'Image Optimization'
    },
    3: {
        required: ['CacheManager', 'ServiceWorkerCache', 'CDNCacheStrategy', 'get', 'set'],
        description: 'Caching Strategies'
    },
    4: {
        required: ['PerformanceMonitor', 'PerformanceDashboard', 'recordMetric', 'setupWebVitals'],
        description: 'Performance Monitoring'
    },
    5: {
        required: ['AdvancedOptimizer', 'analyzeCriticalPath', 'optimizeCriticalPath', 'implementResourceHints'],
        description: 'Advanced Optimization'
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
        level: 34,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level34Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level34Progress');
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
        updateLevelProgress(34, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 34) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 33) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 35) {
        // Next level not implemented yet
        alert('Level 35 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// Performance-specific helper functions
function simulateBundleAnalysis(modules) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const analysis = {
                totalModules: modules.length,
                totalSize: modules.reduce((sum, m) => sum + m.size, 0),
                unusedModules: modules.filter(m => !m.used).length,
                circularDependencies: Math.floor(Math.random() * 3)
            };
            resolve(analysis);
        }, 1000);
    });
}

function calculateBundleReduction(originalSize, optimizations) {
    const reduction = optimizations.reduce((sum, opt) => sum + opt.sizeReduction, 0);
    return {
        originalSize,
        reducedSize: originalSize - reduction,
        reduction,
        percentage: (reduction / originalSize) * 100
    };
}

function generateWebpackConfig(optimizations) {
    return {
        mode: 'production',
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            },
            usedExports: true,
            sideEffects: false
        },
        plugins: ['TerserPlugin', 'CompressionPlugin']
    };
}

function simulateImageOptimization(image) {
    return {
        original: image,
        optimized: {
            ...image,
            size: Math.floor(image.size * 0.6), // 40% reduction
            format: 'webp',
            lazy: true
        },
        savings: image.size - Math.floor(image.size * 0.6)
    };
}

function generateResponsiveImages(image, sizes) {
    return sizes.map(size => ({
        src: image.src.replace(/\d+x\d+/, `${size}x${Math.floor(size * 0.75)}`),
        width: size,
        size: Math.floor(image.size * (size / image.width))
    }));
}

function createLazyLoadingStrategy(images) {
    return {
        aboveFold: images.filter(img => img.priority > 7),
        belowFold: images.filter(img => img.priority <= 7),
        preload: images.filter(img => img.priority > 8)
    };
}

function simulateCachePerformance(cacheName, requests) {
    const hitRate = Math.random() * 0.3 + 0.6; // 60-90% hit rate
    const hits = Math.floor(requests * hitRate);
    const misses = requests - hits;
    
    return {
        cacheName,
        requests,
        hits,
        misses,
        hitRate: hitRate * 100,
        averageResponseTime: Math.floor(Math.random() * 50 + 10) // 10-60ms
    };
}

function generateCacheHeaders(resourceType, ttl) {
    const headers = {
        'Cache-Control': `public, max-age=${ttl}`,
        'ETag': `"${Date.now()}-${Math.random().toString(36).substr(2, 9)}"`,
        'Last-Modified': new Date().toUTCString()
    };
    
    if (resourceType === 'static') {
        headers['Cache-Control'] += ', immutable';
    }
    
    return headers;
}

function simulateWebVitals() {
    return {
        LCP: Math.random() * 2000 + 1000, // 1-3 seconds
        FID: Math.random() * 100 + 10,    // 10-110ms
        CLS: Math.random() * 0.1,         // 0-0.1
        FCP: Math.random() * 1500 + 800,  // 0.8-2.3 seconds
        TTI: Math.random() * 3000 + 2000  // 2-5 seconds
    };
}

function calculatePerformanceScore(metrics, thresholds) {
    let totalScore = 0;
    let metricCount = 0;
    
    for (const [name, value] of Object.entries(metrics)) {
        if (thresholds[name]) {
            const score = Math.max(0, 100 - (value / thresholds[name]) * 100);
            totalScore += score;
            metricCount++;
        }
    }
    
    return metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
}

function generatePerformanceRecommendations(metrics, thresholds) {
    const recommendations = [];
    
    for (const [name, value] of Object.entries(metrics)) {
        if (thresholds[name] && value > thresholds[name]) {
            switch (name) {
                case 'LCP':
                    recommendations.push('Optimize images and reduce server response time');
                    break;
                case 'FID':
                    recommendations.push('Reduce JavaScript execution time');
                    break;
                case 'CLS':
                    recommendations.push('Set size attributes on images');
                    break;
                case 'FCP':
                    recommendations.push('Minimize render-blocking resources');
                    break;
                case 'TTI':
                    recommendations.push('Reduce JavaScript execution time');
                    break;
            }
        }
    }
    
    return recommendations;
}

function analyzeCriticalPath(resources) {
    const critical = resources.filter(r => r.priority > 7);
    const nonCritical = resources.filter(r => r.priority <= 7);
    
    return {
        critical,
        nonCritical,
        criticalSize: critical.reduce((sum, r) => sum + r.size, 0),
        totalSize: resources.reduce((sum, r) => sum + r.size, 0)
    };
}

function optimizeResourceLoading(resources) {
    const strategy = {
        preload: resources.filter(r => r.priority > 8),
        defer: resources.filter(r => r.priority <= 5),
        lazy: resources.filter(r => r.priority <= 3)
    };
    
    return strategy;
}

function generateResourceHints(resources) {
    return resources.map(resource => ({
        type: resource.priority > 7 ? 'preload' : 'prefetch',
        href: resource.src,
        as: resource.type === 'css' ? 'style' : 
            resource.type === 'js' ? 'script' : 'fetch'
    }));
}

function calculateOptimizationImpact(original, optimized) {
    const sizeReduction = original.size - optimized.size;
    const timeReduction = original.loadTime - optimized.loadTime;
    
    return {
        sizeReduction,
        sizeReductionPercentage: (sizeReduction / original.size) * 100,
        timeReduction,
        timeReductionPercentage: (timeReduction / original.loadTime) * 100
    };
}

function simulateLongTaskDetection() {
    const tasks = [];
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
        tasks.push({
            duration: Math.random() * 200 + 50, // 50-250ms
            startTime: Date.now() - Math.random() * 1000,
            name: `task-${i}`
        });
    }
    return tasks;
}

function generateOptimizationReport(optimizations) {
    const totalOriginalSize = optimizations.reduce((sum, opt) => sum + opt.original.size, 0);
    const totalOptimizedSize = optimizations.reduce((sum, opt) => sum + opt.optimized.size, 0);
    
    return {
        totalOriginalSize,
        totalOptimizedSize,
        totalSavings: totalOriginalSize - totalOptimizedSize,
        savingsPercentage: ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100,
        optimizations,
        timestamp: new Date()
    };
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.simulateBundleAnalysis = simulateBundleAnalysis;
window.calculateBundleReduction = calculateBundleReduction;
window.generateWebpackConfig = generateWebpackConfig;
window.simulateImageOptimization = simulateImageOptimization;
window.generateResponsiveImages = generateResponsiveImages;
window.createLazyLoadingStrategy = createLazyLoadingStrategy;
window.simulateCachePerformance = simulateCachePerformance;
window.generateCacheHeaders = generateCacheHeaders;
window.simulateWebVitals = simulateWebVitals;
window.calculatePerformanceScore = calculatePerformanceScore;
window.generatePerformanceRecommendations = generatePerformanceRecommendations;
window.analyzeCriticalPath = analyzeCriticalPath;
window.optimizeResourceLoading = optimizeResourceLoading;
window.generateResourceHints = generateResourceHints;
window.calculateOptimizationImpact = calculateOptimizationImpact;
window.simulateLongTaskDetection = simulateLongTaskDetection;
window.generateOptimizationReport = generateOptimizationReport;

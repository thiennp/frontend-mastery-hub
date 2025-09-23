// Level 36: Mobile Development Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['React', 'useState', 'useEffect', 'NavigationContainer', 'FlatList', 'TouchableOpacity'],
        description: 'React Native'
    },
    2: {
        required: ['Flutter', 'StatefulWidget', 'StatelessWidget', 'MaterialApp', 'Scaffold', 'ListView'],
        description: 'Flutter'
    },
    3: {
        required: ['PWAManager', 'registerServiceWorker', 'createManifest', 'enableOfflineMode', 'requestNotificationPermission'],
        description: 'Progressive Web Apps'
    },
    4: {
        required: ['MobilePerformanceOptimizer', 'measurePerformance', 'optimizeImages', 'implementLazyLoading', 'optimizeMemory'],
        description: 'Mobile Performance'
    },
    5: {
        required: ['CrossPlatformManager', 'detectPlatform', 'createSharedComponent', 'createPlatformSpecific', 'generatePlatformCode'],
        description: 'Cross-platform Development'
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
        level: 36,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level36Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level36Progress');
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
        updateLevelProgress(36, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 36) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 35) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 37) {
        // Next level not implemented yet
        alert('Level 37 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// Mobile-specific helper functions
function simulateReactNativeBuild(components) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const build = {
                components: components.length,
                bundleSize: Math.random() * 1000 + 500, // KB
                buildTime: Math.random() * 30 + 10, // seconds
                platforms: ['ios', 'android'],
                status: 'success'
            };
            resolve(build);
        }, 2000);
    });
}

function simulateFlutterBuild(widgets) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const build = {
                widgets: widgets.length,
                apkSize: Math.random() * 5000 + 2000, // KB
                buildTime: Math.random() * 45 + 15, // seconds
                platforms: ['android', 'ios', 'web'],
                status: 'success'
            };
            resolve(build);
        }, 2500);
    });
}

function simulatePWAPerformance() {
    return {
        loadTime: Math.random() * 2000 + 500, // ms
        installPrompt: Math.random() > 0.5,
        offlineSupport: true,
        pushNotifications: Math.random() > 0.3,
        serviceWorker: 'active',
        cacheHitRate: Math.random() * 0.4 + 0.6 // 60-100%
    };
}

function simulateMobilePerformance() {
    return {
        memoryUsage: Math.random() * 100, // MB
        cpuUsage: Math.random() * 100, // %
        networkLatency: Math.random() * 500 + 100, // ms
        batteryImpact: Math.random() * 20 + 5, // %
        frameRate: Math.random() * 20 + 50, // fps
        crashRate: Math.random() * 0.1 // %
    };
}

function simulateCrossPlatformBuild(platforms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const build = {
                platforms: platforms.length,
                sharedCode: Math.random() * 0.8 + 0.6, // 60-80%
                platformSpecific: Math.random() * 0.4 + 0.2, // 20-40%
                buildTime: Math.random() * 60 + 20, // seconds
                status: 'success'
            };
            resolve(build);
        }, 3000);
    });
}

function generateMobileMetrics(platform) {
    const metrics = {
        platform,
        users: Math.floor(Math.random() * 10000) + 1000,
        sessions: Math.floor(Math.random() * 50000) + 5000,
        crashes: Math.floor(Math.random() * 100),
        ratings: Math.random() * 2 + 3, // 3-5 stars
        downloads: Math.floor(Math.random() * 100000) + 10000
    };
    
    return metrics;
}

function calculateMobilePerformanceScore(metrics) {
    let score = 100;
    
    if (metrics.memoryUsage > 80) score -= 20;
    if (metrics.cpuUsage > 70) score -= 15;
    if (metrics.networkLatency > 300) score -= 10;
    if (metrics.batteryImpact > 15) score -= 10;
    if (metrics.frameRate < 55) score -= 15;
    if (metrics.crashRate > 0.05) score -= 20;
    
    return Math.max(0, score);
}

function generateMobileRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.memoryUsage > 80) {
        recommendations.push('Optimize memory usage and implement lazy loading');
    }
    
    if (metrics.cpuUsage > 70) {
        recommendations.push('Reduce CPU-intensive operations and optimize algorithms');
    }
    
    if (metrics.networkLatency > 300) {
        recommendations.push('Implement caching and optimize network requests');
    }
    
    if (metrics.batteryImpact > 15) {
        recommendations.push('Optimize background processes and reduce battery drain');
    }
    
    if (metrics.frameRate < 55) {
        recommendations.push('Optimize rendering and reduce UI complexity');
    }
    
    if (metrics.crashRate > 0.05) {
        recommendations.push('Implement better error handling and crash reporting');
    }
    
    return recommendations;
}

function simulateAppStoreSubmission(platform) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const submission = {
                platform,
                status: Math.random() > 0.1 ? 'approved' : 'rejected',
                reviewTime: Math.random() * 7 + 1, // days
                version: '1.0.0',
                size: Math.random() * 50 + 10, // MB
                requirements: this.generateRequirements(platform)
            };
            resolve(submission);
        }, 1500);
    });
}

function generateRequirements(platform) {
    const requirements = {
        ios: [
            'App Store Guidelines compliance',
            'iOS version compatibility',
            'Privacy policy and terms',
            'App icon and screenshots',
            'Metadata and descriptions'
        ],
        android: [
            'Google Play Policy compliance',
            'Android version compatibility',
            'Permissions and privacy',
            'App icon and screenshots',
            'Store listing optimization'
        ],
        web: [
            'PWA manifest file',
            'Service worker implementation',
            'HTTPS requirement',
            'Responsive design',
            'Offline functionality'
        ]
    };
    
    return requirements[platform] || [];
}

function simulateMobileTesting(testType) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const testing = {
                type: testType,
                tests: Math.floor(Math.random() * 100) + 50,
                passed: Math.floor(Math.random() * 90) + 45,
                failed: Math.floor(Math.random() * 10) + 1,
                coverage: Math.random() * 0.3 + 0.7, // 70-100%
                duration: Math.random() * 30 + 10 // minutes
            };
            resolve(testing);
        }, 1000);
    });
}

function generateMobileAnalytics(platform) {
    const analytics = {
        platform,
        dailyActiveUsers: Math.floor(Math.random() * 5000) + 1000,
        monthlyActiveUsers: Math.floor(Math.random() * 50000) + 10000,
        sessionDuration: Math.random() * 300 + 120, // seconds
        retentionRate: Math.random() * 0.4 + 0.3, // 30-70%
        conversionRate: Math.random() * 0.1 + 0.02, // 2-12%
        revenue: Math.random() * 10000 + 1000 // USD
    };
    
    return analytics;
}

function simulateMobileDeployment(platforms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const deployment = {
                platforms: platforms.length,
                status: 'deployed',
                version: '1.0.0',
                rolloutPercentage: 100,
                deploymentTime: Math.random() * 60 + 30, // minutes
                rollbackAvailable: true
            };
            resolve(deployment);
        }, 2000);
    });
}

function generateMobileSecurityReport(platform) {
    const security = {
        platform,
        vulnerabilities: Math.floor(Math.random() * 5),
        securityScore: Math.random() * 20 + 80, // 80-100
        recommendations: [
            'Implement certificate pinning',
            'Use secure storage for sensitive data',
            'Enable app transport security',
            'Implement biometric authentication',
            'Regular security audits'
        ]
    };
    
    return security;
}

function simulateMobileOptimization(optimizations) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = {
                optimizations: optimizations.length,
                performanceImprovement: Math.random() * 0.4 + 0.2, // 20-60%
                bundleSizeReduction: Math.random() * 0.3 + 0.1, // 10-40%
                loadTimeImprovement: Math.random() * 0.5 + 0.3, // 30-80%
                memoryReduction: Math.random() * 0.3 + 0.1, // 10-40%
                status: 'completed'
            };
            resolve(results);
        }, 1500);
    });
}

function generateMobileUserFeedback(platform) {
    const feedback = {
        platform,
        totalReviews: Math.floor(Math.random() * 1000) + 100,
        averageRating: Math.random() * 2 + 3, // 3-5
        positiveReviews: Math.floor(Math.random() * 800) + 100,
        negativeReviews: Math.floor(Math.random() * 200) + 10,
        commonIssues: [
            'App crashes occasionally',
            'Slow loading times',
            'UI not intuitive',
            'Missing features',
            'Battery drain'
        ]
    };
    
    return feedback;
}

function simulateMobileAIBTesting(variants) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const test = {
                variants: variants.length,
                participants: Math.floor(Math.random() * 10000) + 1000,
                duration: Math.random() * 30 + 7, // days
                winner: variants[Math.floor(Math.random() * variants.length)],
                confidence: Math.random() * 0.3 + 0.7, // 70-100%
                metrics: {
                    conversionRate: Math.random() * 0.1 + 0.05,
                    engagement: Math.random() * 0.3 + 0.4,
                    retention: Math.random() * 0.2 + 0.3
                }
            };
            resolve(test);
        }, 2000);
    });
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.simulateReactNativeBuild = simulateReactNativeBuild;
window.simulateFlutterBuild = simulateFlutterBuild;
window.simulatePWAPerformance = simulatePWAPerformance;
window.simulateMobilePerformance = simulateMobilePerformance;
window.simulateCrossPlatformBuild = simulateCrossPlatformBuild;
window.generateMobileMetrics = generateMobileMetrics;
window.calculateMobilePerformanceScore = calculateMobilePerformanceScore;
window.generateMobileRecommendations = generateMobileRecommendations;
window.simulateAppStoreSubmission = simulateAppStoreSubmission;
window.generateRequirements = generateRequirements;
window.simulateMobileTesting = simulateMobileTesting;
window.generateMobileAnalytics = generateMobileAnalytics;
window.simulateMobileDeployment = simulateMobileDeployment;
window.generateMobileSecurityReport = generateMobileSecurityReport;
window.simulateMobileOptimization = simulateMobileOptimization;
window.generateMobileUserFeedback = generateMobileUserFeedback;
window.simulateMobileAIBTesting = simulateMobileAIBTesting;

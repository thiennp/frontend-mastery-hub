// Level 32: Advanced Testing Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['E2ETestSuite', 'CypressCommands', 'addTest', 'runTests'],
        description: 'E2E Testing with Cypress'
    },
    2: {
        required: ['PerformanceTestSuite', 'WebVitalsMonitor', 'measurePerformance', 'runLighthouseAudit'],
        description: 'Performance Testing'
    },
    3: {
        required: ['VisualTestSuite', 'ComponentVisualTester', 'captureScreenshot', 'compareScreenshots'],
        description: 'Visual Testing'
    },
    4: {
        required: ['TestAutomationSystem', 'CIIntegration', 'runTestSuite', 'runTestsInParallel'],
        description: 'Test Automation'
    },
    5: {
        required: ['TestingStrategy', 'TestCoverageAnalyzer', 'createMock', 'validateTestPyramid'],
        description: 'Testing Strategies'
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
        level: 32,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level32Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level32Progress');
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
        updateLevelProgress(32, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 32) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 31) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 33) {
        // Next level not implemented yet
        alert('Level 33 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// Testing-specific helper functions
function simulateE2ETest(testName, steps) {
    return new Promise((resolve, reject) => {
        let currentStep = 0;
        
        const executeNextStep = () => {
            if (currentStep >= steps.length) {
                resolve({ testName, status: 'passed', steps: steps.length });
                return;
            }
            
            const step = steps[currentStep];
            console.log(`  📋 Executing step: ${step.name}`);
            
            // Simulate step execution
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    currentStep++;
                    executeNextStep();
                } else {
                    reject(new Error(`Step failed: ${step.name}`));
                }
            }, 500);
        };
        
        executeNextStep();
    });
}

function generatePerformanceMetrics(url) {
    return {
        url,
        loadTime: Math.random() * 3000 + 500,
        firstContentfulPaint: Math.random() * 2000 + 500,
        largestContentfulPaint: Math.random() * 3000 + 1000,
        cumulativeLayoutShift: Math.random() * 0.1,
        firstInputDelay: Math.random() * 100 + 10,
        timeToInteractive: Math.random() * 4000 + 2000,
        timestamp: new Date()
    };
}

function createVisualDiff(baseline, current) {
    return {
        baseline,
        current,
        diffPercentage: Math.random() * 0.2,
        diffImage: `diff_${Date.now()}.png`,
        timestamp: new Date()
    };
}

function simulateTestExecution(testName, duration = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate
            resolve({
                testName,
                status: success ? 'passed' : 'failed',
                duration,
                timestamp: new Date()
            });
        }, duration);
    });
}

function createMockFunction(returnValue, shouldThrow = false) {
    const calls = [];
    
    return {
        fn: (...args) => {
            calls.push({ args, timestamp: new Date() });
            
            if (shouldThrow) {
                throw new Error('Mock error');
            }
            
            return returnValue;
        },
        calls,
        reset: () => {
            calls.length = 0;
        }
    };
}

function generateTestData(schema) {
    const data = {};
    
    for (const [key, type] of Object.entries(schema)) {
        switch (type) {
            case 'string':
                data[key] = `test_${key}_${Date.now()}`;
                break;
            case 'number':
                data[key] = Math.floor(Math.random() * 1000);
                break;
            case 'boolean':
                data[key] = Math.random() > 0.5;
                break;
            case 'email':
                data[key] = `test_${Date.now()}@example.com`;
                break;
            case 'uuid':
                data[key] = `uuid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                break;
        }
    }
    
    return data;
}

function calculateTestCoverage(covered, total) {
    return total > 0 ? (covered / total) * 100 : 0;
}

function validateTestPyramid(unit, integration, e2e) {
    const total = unit + integration + e2e;
    if (total === 0) return { valid: false, message: 'No tests found' };
    
    const unitPercentage = (unit / total) * 100;
    const integrationPercentage = (integration / total) * 100;
    const e2ePercentage = (e2e / total) * 100;
    
    const violations = [];
    
    if (Math.abs(unitPercentage - 70) > 10) {
        violations.push({ type: 'unit', actual: unitPercentage, expected: 70 });
    }
    
    if (Math.abs(integrationPercentage - 20) > 10) {
        violations.push({ type: 'integration', actual: integrationPercentage, expected: 20 });
    }
    
    if (Math.abs(e2ePercentage - 10) > 10) {
        violations.push({ type: 'e2e', actual: e2ePercentage, expected: 10 });
    }
    
    return {
        valid: violations.length === 0,
        violations,
        totalTests: total,
        percentages: { unit: unitPercentage, integration: integrationPercentage, e2e: e2ePercentage }
    };
}

function createTestReport(results) {
    const total = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    
    return {
        summary: {
            total,
            passed,
            failed,
            passRate: total > 0 ? (passed / total) * 100 : 0
        },
        results,
        timestamp: new Date()
    };
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.simulateE2ETest = simulateE2ETest;
window.generatePerformanceMetrics = generatePerformanceMetrics;
window.createVisualDiff = createVisualDiff;
window.simulateTestExecution = simulateTestExecution;
window.createMockFunction = createMockFunction;
window.generateTestData = generateTestData;
window.calculateTestCoverage = calculateTestCoverage;
window.validateTestPyramid = validateTestPyramid;
window.createTestReport = createTestReport;

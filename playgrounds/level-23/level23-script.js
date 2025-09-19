// Level 23: Advanced Testing Script

class AdvancedTestingLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'E2E Testing', completed: false },
            { id: 2, name: 'Performance Testing', completed: false },
            { id: 3, name: 'Visual Testing', completed: false },
            { id: 4, name: 'Test Automation', completed: false },
            { id: 5, name: 'Testing Strategies', completed: false }
        ];
        this.testingMetrics = {
            e2eTests: 0,
            e2ePassed: 0,
            e2eBrowser: 'Chrome',
            perfScore: 0,
            perfLcp: 0,
            perfMemory: 0,
            visualTests: 0,
            visualPassed: 0,
            visualDiff: 0,
            autoSuites: 0,
            autoCoverage: 0,
            autoDuration: 0,
            strategyFeatures: 0,
            strategyRisk: 'Low',
            strategyCoverage: 0
        };
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.simulateTestingEnvironment();
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

    simulateTestingEnvironment() {
        // Simulate dynamic test metrics updates
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.updateRandomTestingMetric();
            }
        }, 5000);
    }

    updateRandomTestingMetric() {
        const metrics = Object.keys(this.testingMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Tests') || randomMetric.includes('Passed') || randomMetric.includes('Suites')) {
            this.testingMetrics[randomMetric] = Math.floor(Math.random() * 50) + 10;
        } else if (randomMetric.includes('Score') || randomMetric.includes('Coverage')) {
            this.testingMetrics[randomMetric] = Math.floor(Math.random() * 40) + 60;
        } else if (randomMetric.includes('Duration')) {
            this.testingMetrics[randomMetric] = Math.floor(Math.random() * 5000) + 1000;
        } else if (randomMetric.includes('Memory')) {
            this.testingMetrics[randomMetric] = Math.floor(Math.random() * 100) + 20;
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Running Tests...</span>';
        
        setTimeout(() => {
            this.executeTestingExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 3000);
    }

    executeTestingExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeE2ETesting(outputContent);
                break;
            case 2:
                this.executePerformanceTesting(outputContent);
                break;
            case 3:
                this.executeVisualTesting(outputContent);
                break;
            case 4:
                this.executeTestAutomation(outputContent);
                break;
            case 5:
                this.executeTestingStrategies(outputContent);
                break;
        }
    }

    executeE2ETesting(outputContent) {
        this.testingMetrics.e2eTests = 25;
        this.testingMetrics.e2ePassed = 23;
        this.testingMetrics.e2eBrowser = 'Chrome';

        outputContent.innerHTML = `
<div class="e2e-testing">
    <h4>🤖 E2E Testing Suite Executed</h4>
    
    <div class="test-pipeline">
        <div class="pipeline-stage">
            <div class="stage-title">Setup</div>
            <div class="stage-status stage-passed">Passed</div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-title">Tests</div>
            <div class="stage-status stage-running">Running</div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-title">Teardown</div>
            <div class="stage-status stage-pending">Pending</div>
        </div>
    </div>
    
    <div class="test-summary">
        <div class="summary-item">
            <div class="summary-label">Total Tests</div>
            <div class="summary-value">25</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Passed</div>
            <div class="summary-value">23</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Failed</div>
            <div class="summary-value">2</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Duration</div>
            <div class="summary-value">2.3s</div>
        </div>
    </div>
    
    <div class="test-results">
        <h5>🎯 Test Results:</h5>
        <div style="margin: 10px 0;">
            <span class="test-result test-passed">✓ User Login Flow</span>
            <span class="test-result test-passed">✓ Navigation Tests</span>
            <span class="test-result test-passed">✓ Form Validation</span>
            <span class="test-result test-failed">✗ Payment Flow</span>
            <span class="test-result test-passed">✓ Responsive Design</span>
        </div>
    </div>
    
    <div class="browser-compatibility">
        <h5>🌐 Cross-Browser Results:</h5>
        <div style="margin: 10px 0;">
            <span class="test-result cypress-test">Cypress: Chrome ✓</span>
            <span class="test-result playwright-test">Playwright: Firefox ✓</span>
            <span class="test-result playwright-test">Playwright: Safari ✓</span>
            <span class="test-result playwright-test">Playwright: Edge ✓</span>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executePerformanceTesting(outputContent) {
        this.testingMetrics.perfScore = 89;
        this.testingMetrics.perfLcp = 1200;
        this.testingMetrics.perfMemory = 42;

        outputContent.innerHTML = `
<div class="performance-testing">
    <h4>⚡ Performance Testing Completed</h4>
    
    <div class="performance-score">
        <div class="score-item">
            <div class="score-title">Performance</div>
            <div class="score-value score-excellent">89</div>
            <div class="score-subtitle">Excellent</div>
        </div>
        <div class="score-item">
            <div class="score-title">Accessibility</div>
            <div class="score-value score-excellent">95</div>
            <div class="score-subtitle">Excellent</div>
        </div>
        <div class="score-item">
            <div class="score-title">Best Practices</div>
            <div class="score-value score-good">78</div>
            <div class="score-subtitle">Good</div>
        </div>
        <div class="score-item">
            <div class="score-title">SEO</div>
            <div class="score-value score-excellent">92</div>
            <div class="score-subtitle">Excellent</div>
        </div>
    </div>
    
    <div class="core-web-vitals">
        <h5>🎯 Core Web Vitals:</h5>
        <div class="vitals-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 15px 0;">
            <div class="vital-item" style="text-align: center; padding: 15px; background: var(--surface-color); border-radius: 8px;">
                <div style="color: var(--success-color); font-size: 1.5rem; font-weight: bold;">1.2s</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">LCP</div>
            </div>
            <div class="vital-item" style="text-align: center; padding: 15px; background: var(--surface-color); border-radius: 8px;">
                <div style="color: var(--success-color); font-size: 1.5rem; font-weight: bold;">45ms</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">FID</div>
            </div>
            <div class="vital-item" style="text-align: center; padding: 15px; background: var(--surface-color); border-radius: 8px;">
                <div style="color: var(--warning-color); font-size: 1.5rem; font-weight: bold;">0.08</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">CLS</div>
            </div>
        </div>
    </div>
    
    <div class="load-testing">
        <h5>🚀 Load Testing Results:</h5>
        <div style="margin: 10px 0;">
            <span class="test-result lighthouse-test">10 users: 250ms avg</span>
            <span class="test-result lighthouse-test">50 users: 420ms avg</span>
            <span class="test-result lighthouse-test">100 users: 680ms avg</span>
            <span class="test-result lighthouse-test">200 users: 1.2s avg</span>
        </div>
    </div>
    
    <div class="memory-analysis">
        <h5>💾 Memory Analysis:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Initial Memory: 28.5 MB<br>
            Peak Memory: 42.3 MB<br>
            Memory Leaks: None detected<br>
            GC Efficiency: 94%
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeVisualTesting(outputContent) {
        this.testingMetrics.visualTests = 18;
        this.testingMetrics.visualPassed = 16;
        this.testingMetrics.visualDiff = 2.3;

        outputContent.innerHTML = `
<div class="visual-testing">
    <h4>👁️ Visual Testing Results</h4>
    
    <div class="visual-diff">
        <div class="diff-panel">
            <div class="diff-title">Baseline</div>
            <div class="diff-image">📸 Baseline Screenshot</div>
        </div>
        <div class="diff-panel">
            <div class="diff-title">Current</div>
            <div class="diff-image">📸 Current Screenshot</div>
        </div>
        <div class="diff-panel">
            <div class="diff-title">Difference</div>
            <div class="diff-image">📊 2.3% Difference</div>
        </div>
    </div>
    
    <div class="visual-test-results">
        <h5>🎯 Component Tests:</h5>
        <div style="margin: 10px 0;">
            <span class="test-result test-passed">✓ Header Component</span>
            <span class="test-result test-passed">✓ Navigation Menu</span>
            <span class="test-result test-failed">✗ Footer Layout</span>
            <span class="test-result test-passed">✓ Button Styles</span>
            <span class="test-result test-passed">✓ Form Elements</span>
        </div>
    </div>
    
    <div class="cross-browser-visual">
        <h5>🌐 Cross-Browser Visual Tests:</h5>
        <div style="margin: 10px 0;">
            <span class="test-result test-passed">Chrome: 0.5% diff</span>
            <span class="test-result test-passed">Firefox: 1.2% diff</span>
            <span class="test-result test-failed">Safari: 3.8% diff</span>
            <span class="test-result test-passed">Edge: 0.8% diff</span>
        </div>
    </div>
    
    <div class="regression-analysis">
        <h5>📈 Regression Analysis:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            New UI Changes Detected: 3<br>
            Breaking Changes: 1<br>
            Minor Adjustments: 2<br>
            Approval Required: Yes
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeTestAutomation(outputContent) {
        this.testingMetrics.autoSuites = 8;
        this.testingMetrics.autoCoverage = 87;
        this.testingMetrics.autoDuration = 4200;

        outputContent.innerHTML = `
<div class="test-automation">
    <h4>⚙️ Test Automation Pipeline</h4>
    
    <div class="test-pipeline">
        <div class="pipeline-stage">
            <div class="stage-title">Unit Tests</div>
            <div class="stage-status stage-passed">145 passed</div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-title">Integration</div>
            <div class="stage-status stage-passed">32 passed</div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-title">E2E Tests</div>
            <div class="stage-status stage-running">Running...</div>
        </div>
        <div class="pipeline-stage">
            <div class="stage-title">Deploy</div>
            <div class="stage-status stage-pending">Waiting</div>
        </div>
    </div>
    
    <div class="automation-report">
        <h5>📊 Automation Report:</h5>
        <div class="test-summary">
            <div class="summary-item">
                <div class="summary-label">Test Suites</div>
                <div class="summary-value">8</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Tests</div>
                <div class="summary-value">247</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Passed</div>
                <div class="summary-value">238</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Failed</div>
                <div class="summary-value">9</div>
            </div>
        </div>
    </div>
    
    <div class="coverage-report">
        <h5>📈 Code Coverage:</h5>
        <div style="margin: 15px 0;">
            <div style="margin-bottom: 10px;">
                <span style="color: var(--text-secondary);">Statements:</span>
                <div class="coverage-bar">
                    <div class="coverage-fill" style="width: 87%;"></div>
                    <div class="coverage-text">87%</div>
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <span style="color: var(--text-secondary);">Branches:</span>
                <div class="coverage-bar">
                    <div class="coverage-fill" style="width: 82%;"></div>
                    <div class="coverage-text">82%</div>
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <span style="color: var(--text-secondary);">Functions:</span>
                <div class="coverage-bar">
                    <div class="coverage-fill" style="width: 94%;"></div>
                    <div class="coverage-text">94%</div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="ci-cd-integration">
        <h5>🔄 CI/CD Integration:</h5>
        <div style="margin: 10px 0;">
            <span class="test-result test-passed">✓ GitHub Actions</span>
            <span class="test-result test-passed">✓ Docker Build</span>
            <span class="test-result test-running">⏳ Quality Gates</span>
            <span class="test-result test-pending">⏸️ Deployment</span>
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeTestingStrategies(outputContent) {
        this.testingMetrics.strategyFeatures = 12;
        this.testingMetrics.strategyRisk = 'Medium';
        this.testingMetrics.strategyCoverage = 91;

        outputContent.innerHTML = `
<div class="testing-strategies">
    <h4>♟️ Testing Strategy Analysis</h4>
    
    <div class="test-pyramid" style="text-align: center; margin: 20px 0;">
        <h5>🏗️ Test Pyramid Distribution:</h5>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin: 15px 0;">
            <div style="width: 60px; height: 20px; background: var(--error-color); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">E2E 10%</div>
            <div style="width: 120px; height: 20px; background: var(--warning-color); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">Integration 20%</div>
            <div style="width: 180px; height: 20px; background: var(--success-color); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">Unit Tests 70%</div>
        </div>
    </div>
    
    <div class="risk-assessment">
        <h5>⚠️ Risk Assessment:</h5>
        <div class="test-summary">
            <div class="summary-item">
                <div class="summary-label">Features Analyzed</div>
                <div class="summary-value">12</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">High Risk</div>
                <div class="summary-value">3</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Medium Risk</div>
                <div class="summary-value">5</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Low Risk</div>
                <div class="summary-value">4</div>
            </div>
        </div>
    </div>
    
    <div class="quality-gates">
        <h5>🚪 Quality Gates:</h5>
        <div style="margin: 10px 0;">
            <span class="test-result test-passed">✓ Code Quality: 91%</span>
            <span class="test-result test-passed">✓ Performance: Good</span>
            <span class="test-result test-failed">✗ Security: 2 issues</span>
            <span class="test-result test-passed">✓ Coverage: 87%</span>
        </div>
    </div>
    
    <div class="test-effectiveness">
        <h5>📊 Test Effectiveness Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Defect Detection Rate: 89%<br>
            Test Execution Time: 4.2 minutes<br>
            Automation Rate: 78%<br>
            False Positive Rate: 3%<br>
            Test Maintenance Cost: Low
        </div>
    </div>
    
    <div class="recommendations">
        <h5>💡 Recommendations:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            • Increase E2E test coverage for payment flow<br>
            • Implement visual regression testing<br>
            • Add performance budgets to CI/CD<br>
            • Enhance security testing automation<br>
            • Review test data management strategy
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
        // Update E2E metrics
        document.getElementById('e2eTests').textContent = this.testingMetrics.e2eTests;
        document.getElementById('e2ePassed').textContent = this.testingMetrics.e2ePassed;
        document.getElementById('e2eBrowser').textContent = this.testingMetrics.e2eBrowser;

        // Update Performance metrics
        document.getElementById('perfScore').textContent = this.testingMetrics.perfScore;
        document.getElementById('perfLcp').textContent = `${this.testingMetrics.perfLcp}ms`;
        document.getElementById('perfMemory').textContent = `${this.testingMetrics.perfMemory} MB`;

        // Update Visual metrics
        document.getElementById('visualTests').textContent = this.testingMetrics.visualTests;
        document.getElementById('visualPassed').textContent = this.testingMetrics.visualPassed;
        document.getElementById('visualDiff').textContent = `${this.testingMetrics.visualDiff}%`;

        // Update Automation metrics
        document.getElementById('autoSuites').textContent = this.testingMetrics.autoSuites;
        document.getElementById('autoCoverage').textContent = `${this.testingMetrics.autoCoverage}%`;
        document.getElementById('autoDuration').textContent = `${this.testingMetrics.autoDuration}ms`;

        // Update Strategy metrics
        document.getElementById('strategyFeatures').textContent = this.testingMetrics.strategyFeatures;
        document.getElementById('strategyRisk').textContent = this.testingMetrics.strategyRisk;
        document.getElementById('strategyCoverage').textContent = `${this.testingMetrics.strategyCoverage}%`;
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
            if (!completedLevels.includes(23)) {
                completedLevels.push(23);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 23).toString());

            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 23: Advanced Testing!\n\nYou\'ve mastered:\n• E2E testing with Cypress and Playwright\n• Performance testing and optimization\n• Visual regression testing\n• Test automation pipelines\n• Comprehensive testing strategies');
                
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        for (let i = 0; i < 30; i++) {
            const testIcon = document.createElement('div');
            testIcon.style.position = 'absolute';
            testIcon.style.fontSize = '20px';
            testIcon.innerHTML = ['🧪', '✅', '⚡', '👁️', '⚙️'][Math.floor(Math.random() * 5)];
            testIcon.style.left = Math.random() * 100 + '%';
            testIcon.style.top = '-30px';
            testIcon.style.animation = `testFall ${Math.random() * 2 + 2}s linear forwards`;
            testIcon.style.opacity = '0.8';
            container.appendChild(testIcon);

            setTimeout(() => testIcon.remove(), 4000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes testFall {
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
            
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            this.testingMetrics = {
                e2eTests: 0, e2ePassed: 0, e2eBrowser: 'Chrome',
                perfScore: 0, perfLcp: 0, perfMemory: 0,
                visualTests: 0, visualPassed: 0, visualDiff: 0,
                autoSuites: 0, autoCoverage: 0, autoDuration: 0,
                strategyFeatures: 0, strategyRisk: 'Low', strategyCoverage: 0
            };

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level23Progress', JSON.stringify({
            exercises: this.exercises,
            testingMetrics: this.testingMetrics
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level23Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.testingMetrics = data.testingMetrics || this.testingMetrics;
            
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
    if (window.testingLevel) {
        window.testingLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.testingLevel) {
        window.testingLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.testingLevel) {
        window.testingLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.testingLevel = new AdvancedTestingLevel();
});

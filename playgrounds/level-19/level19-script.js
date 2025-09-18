// Level 19: Microservices Architecture - JavaScript Functionality

class MicroservicesLevel19 {
    constructor() {
        this.exercises = [
            {
                id: 1,
                name: "Service Mesh Implementation",
                keywords: ['VirtualService', 'DestinationRule', 'AuthorizationPolicy', 'trafficPolicy', 'circuitBreaker', 'connectionPool'],
                hints: [
                    'Use VirtualService for traffic routing and load balancing',
                    'Implement circuit breakers for fault tolerance',
                    'Configure connection pooling for performance',
                    'Set up authorization policies for security'
                ]
            },
            {
                id: 2,
                name: "Container Orchestration",
                keywords: ['Deployment', 'Service', 'HorizontalPodAutoscaler', 'PodDisruptionBudget', 'livenessProbe', 'readinessProbe'],
                hints: [
                    'Use ConfigMaps and Secrets for configuration management',
                    'Implement health checks for reliability',
                    'Configure horizontal pod autoscaling',
                    'Set up pod disruption budgets for availability'
                ]
            },
            {
                id: 3,
                name: "API Gateway",
                keywords: ['services', 'routes', 'plugins', 'rate-limiting', 'jwt', 'cors', 'consumers'],
                hints: [
                    'Configure rate limiting per service and consumer',
                    'Implement JWT authentication for secure access',
                    'Set up CORS policies for cross-origin requests',
                    'Add monitoring and tracing plugins'
                ]
            },
            {
                id: 4,
                name: "Event-Driven Architecture",
                keywords: ['EventSourcingService', 'handleCommand', 'handleQuery', 'publishEvent', 'replayEvents', 'CQRS'],
                hints: [
                    'Separate command and query responsibilities (CQRS)',
                    'Store events in event store for audit trail',
                    'Implement event handlers for side effects',
                    'Use correlation IDs for tracing across services'
                ]
            },
            {
                id: 5,
                name: "Distributed Tracing",
                keywords: ['TracingService', 'createSpan', 'traceHttpRequest', 'traceDatabaseOperation', 'propagateTraceContext', 'OpenTelemetry'],
                hints: [
                    'Use OpenTelemetry for standardized tracing',
                    'Propagate trace context across service boundaries',
                    'Add meaningful attributes and events to spans',
                    'Implement proper error handling and status codes'
                ]
            }
        ];
        
        this.completedExercises = new Set();
        this.init();
    }

    init() {
        this.loadProgress();
        this.updateProgress();
        this.setupCodeEditors();
        this.setupEventListeners();
    }

    setupCodeEditors() {
        // Initialize CodeMirror for each textarea
        const editors = [
            { id: 'code1', mode: 'yaml' },
            { id: 'code2', mode: 'yaml' },
            { id: 'code3', mode: 'yaml' },
            { id: 'code4', mode: 'javascript' },
            { id: 'code5', mode: 'javascript' }
        ];

        editors.forEach(editor => {
            const textarea = document.getElementById(editor.id);
            if (textarea) {
                CodeMirror.fromTextArea(textarea, {
                    mode: editor.mode,
                    theme: 'monokai',
                    lineNumbers: true,
                    indentUnit: 2,
                    tabSize: 2,
                    lineWrapping: true,
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                });
            }
        });
    }

    setupEventListeners() {
        // Add event listeners for code changes
        for (let i = 1; i <= 5; i++) {
            const textarea = document.getElementById(`code${i}`);
            if (textarea) {
                textarea.addEventListener('input', () => {
                    this.checkExerciseCompletion(i);
                });
            }
        }
    }

    runExercise(exerciseNumber) {
        const code = document.getElementById(`code${exerciseNumber}`).value;
        const exercise = this.exercises[exerciseNumber - 1];
        const resultDiv = document.getElementById(`result${exerciseNumber}`);
        
        // Simulate validation
        const validation = this.validateExercise(exerciseNumber, code);
        
        if (validation.isValid) {
            resultDiv.className = 'exercise-result success';
            resultDiv.innerHTML = `
                <strong>🏗️ Exercise ${exerciseNumber} Deployed!</strong><br>
                ${validation.message}
            `;
            
            this.completedExercises.add(exerciseNumber);
            this.markExerciseComplete(exerciseNumber);
        } else {
            resultDiv.className = 'exercise-result error';
            resultDiv.innerHTML = `
                <strong>⚠️ Exercise ${exerciseNumber} Needs Architecture Review</strong><br>
                ${validation.message}
            `;
        }
        
        this.updateProgress();
        this.saveProgress();
    }

    validateExercise(exerciseNumber, code) {
        const exercise = this.exercises[exerciseNumber - 1];
        const codeLower = code.toLowerCase();
        
        // Check for required keywords
        const missingKeywords = exercise.keywords.filter(keyword => 
            !codeLower.includes(keyword.toLowerCase())
        );
        
        if (missingKeywords.length === 0) {
            return {
                isValid: true,
                message: `Excellent! Your ${exercise.name} implementation follows microservices best practices. All required architectural patterns are present.`
            };
        } else if (missingKeywords.length <= 2) {
            return {
                isValid: true,
                message: `Good work! Your ${exercise.name} implementation is mostly complete. Consider adding: ${missingKeywords.join(', ')}.`
            };
        } else {
            return {
                isValid: false,
                message: `Your ${exercise.name} implementation needs architectural improvements. Missing key elements: ${missingKeywords.slice(0, 3).join(', ')}.`
            };
        }
    }

    checkExerciseCompletion(exerciseNumber) {
        const code = document.getElementById(`code${exerciseNumber}`).value;
        const validation = this.validateExercise(exerciseNumber, code);
        
        if (validation.isValid && !this.completedExercises.has(exerciseNumber)) {
            // Auto-complete if validation passes
            this.completedExercises.add(exerciseNumber);
            this.markExerciseComplete(exerciseNumber);
            this.updateProgress();
            this.saveProgress();
        }
    }

    markExerciseComplete(exerciseNumber) {
        const exerciseElement = document.getElementById(`exercise${exerciseNumber}`);
        exerciseElement.classList.add('completed');
        
        // Add completion indicator
        const header = exerciseElement.querySelector('.exercise-header h3');
        if (!header.querySelector('.completion-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'completion-indicator microservices-badge';
            indicator.innerHTML = ' 🏗️';
            header.appendChild(indicator);
        }
    }

    updateProgress() {
        const completedCount = this.completedExercises.size;
        const totalCount = this.exercises.length;
        const percentage = (completedCount / totalCount) * 100;
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${completedCount}/${totalCount} Complete`;
        }
        
        // Update level completion status
        if (completedCount === totalCount) {
            this.showLevelComplete();
        }
    }

    showLevelComplete() {
        // Create completion modal
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🏗️ Level 19 Complete!</h2>
                    <p>Congratulations! You've mastered Microservices Architecture</p>
                </div>
                <div class="modal-body">
                    <div class="achievement">
                        <h3>🕸️ Microservices Architect Badge Earned!</h3>
                        <p>You've successfully completed all 5 Microservices Architecture exercises</p>
                    </div>
                    <div class="skills-learned">
                        <h4>Architecture Skills Mastered:</h4>
                        <ul>
                            <li>🕸️ Service Mesh Implementation with Istio</li>
                            <li>🐳 Container Orchestration with Kubernetes</li>
                            <li>🚪 API Gateway Configuration with Kong</li>
                            <li>📡 Event-Driven Architecture & CQRS</li>
                            <li>🔍 Distributed Tracing with OpenTelemetry</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Continue Learning
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .completion-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: var(--microservices-surface);
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                border: 2px solid var(--microservices-primary);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            .modal-header h2 {
                color: var(--microservices-primary);
                margin-bottom: 10px;
            }
            .achievement {
                background: rgba(99, 102, 241, 0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border: 1px solid var(--microservices-primary);
            }
            .skills-learned ul {
                list-style: none;
                padding: 0;
            }
            .skills-learned li {
                padding: 5px 0;
                color: var(--microservices-text-secondary);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    completeLevel() {
        if (this.completedExercises.size === this.exercises.length) {
            // Mark level as complete in localStorage
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(19)) {
                completedLevels.push(19);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }
            
            // Update main hub progress
            this.updateMainHubProgress();
            
            alert('🏗️ Level 19 completed! Your microservices architecture expertise has been saved.');
        } else {
            alert(`Please complete all ${this.exercises.length} microservices exercises before finishing the level.`);
        }
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this microservices level? All progress will be lost.')) {
            // Clear completed exercises
            this.completedExercises.clear();
            
            // Reset all code editors
            for (let i = 1; i <= 5; i++) {
                const textarea = document.getElementById(`code${i}`);
                if (textarea) {
                    textarea.value = '';
                }
                
                // Reset exercise appearance
                const exerciseElement = document.getElementById(`exercise${i}`);
                exerciseElement.classList.remove('completed');
                
                const indicator = exerciseElement.querySelector('.completion-indicator');
                if (indicator) {
                    indicator.remove();
                }
                
                // Clear results
                const resultDiv = document.getElementById(`result${i}`);
                resultDiv.className = 'exercise-result';
                resultDiv.innerHTML = '';
            }
            
            this.updateProgress();
            this.saveProgress();
        }
    }

    updateMainHubProgress() {
        // This would typically update the main hub's progress tracking
        // For now, we'll just log the completion
        console.log('Level 19 completed - updating main hub progress');
    }

    saveProgress() {
        const progress = {
            completedExercises: Array.from(this.completedExercises),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('level19Progress', JSON.stringify(progress));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('level19Progress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                this.completedExercises = new Set(progress.completedExercises || []);
                
                // Restore completed exercise states
                this.completedExercises.forEach(exerciseNumber => {
                    this.markExerciseComplete(exerciseNumber);
                });
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        }
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.microservicesLevel = new MicroservicesLevel19();
});

// Global functions for HTML onclick handlers
function runExercise(exerciseNumber) {
    if (window.microservicesLevel) {
        window.microservicesLevel.runExercise(exerciseNumber);
    }
}

function completeLevel() {
    if (window.microservicesLevel) {
        window.microservicesLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.microservicesLevel) {
        window.microservicesLevel.resetLevel();
    }
}

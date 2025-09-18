// Level 17: DevOps & Deployment - JavaScript Functionality

class DevOpsLevel17 {
    constructor() {
        this.exercises = [
            {
                id: 1,
                name: "Docker Containerization",
                keywords: ['FROM', 'WORKDIR', 'COPY', 'RUN', 'EXPOSE', 'CMD', 'multi-stage'],
                hints: [
                    'Use multi-stage builds to reduce image size',
                    'Copy package.json first for better layer caching',
                    'Use Alpine Linux for smaller base images',
                    'Set proper working directory and expose ports'
                ]
            },
            {
                id: 2,
                name: "CI/CD Pipeline",
                keywords: ['name:', 'on:', 'jobs:', 'steps:', 'uses:', 'runs-on:', 'with:'],
                hints: [
                    'Use matrix strategy for multiple Node.js versions',
                    'Add caching for node_modules',
                    'Include security scanning steps',
                    'Use environment variables for secrets'
                ]
            },
            {
                id: 3,
                name: "Cloud Deployment",
                keywords: ['apiVersion:', 'kind:', 'metadata:', 'spec:', 'containers:', 'ports:', 'resources:'],
                hints: [
                    'Set appropriate resource requests and limits',
                    'Use health checks for better reliability',
                    'Configure horizontal pod autoscaling',
                    'Add proper labels and selectors'
                ]
            },
            {
                id: 4,
                name: "Infrastructure as Code",
                keywords: ['terraform', 'provider', 'resource', 'aws_vpc', 'aws_subnet', 'aws_internet_gateway'],
                hints: [
                    'Use variables for reusable configurations',
                    'Add security groups for proper access control',
                    'Include load balancers and auto-scaling groups',
                    'Use data sources for existing resources'
                ]
            },
            {
                id: 5,
                name: "Monitoring & Logging",
                keywords: ['version:', 'services:', 'image:', 'ports:', 'volumes:', 'environment:'],
                hints: [
                    'Configure proper data retention policies',
                    'Set up alerting rules for critical metrics',
                    'Use persistent volumes for data storage',
                    'Include log aggregation with ELK stack'
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
            { id: 'code1', mode: 'shell' },
            { id: 'code2', mode: 'yaml' },
            { id: 'code3', mode: 'yaml' },
            { id: 'code4', mode: 'shell' },
            { id: 'code5', mode: 'yaml' }
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
                <strong>✅ Exercise ${exerciseNumber} Complete!</strong><br>
                ${validation.message}
            `;
            
            this.completedExercises.add(exerciseNumber);
            this.markExerciseComplete(exerciseNumber);
        } else {
            resultDiv.className = 'exercise-result error';
            resultDiv.innerHTML = `
                <strong>❌ Exercise ${exerciseNumber} Needs Work</strong><br>
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
                message: `Great job! Your ${exercise.name} configuration looks good. All required elements are present.`
            };
        } else if (missingKeywords.length <= 2) {
            return {
                isValid: true,
                message: `Good work! Your ${exercise.name} configuration is mostly complete. Consider adding: ${missingKeywords.join(', ')}.`
            };
        } else {
            return {
                isValid: false,
                message: `Your ${exercise.name} configuration needs more work. Missing key elements: ${missingKeywords.slice(0, 3).join(', ')}.`
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
            indicator.className = 'completion-indicator';
            indicator.innerHTML = ' ✅';
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
                    <h2>🎉 Level 17 Complete!</h2>
                    <p>Congratulations! You've mastered DevOps & Deployment</p>
                </div>
                <div class="modal-body">
                    <div class="achievement">
                        <h3>🏆 DevOps Master Badge Earned!</h3>
                        <p>You've successfully completed all 5 DevOps & Deployment exercises</p>
                    </div>
                    <div class="skills-learned">
                        <h4>Skills Mastered:</h4>
                        <ul>
                            <li>🐳 Docker Containerization</li>
                            <li>🔄 CI/CD Pipeline Development</li>
                            <li>☁️ Cloud Deployment with Kubernetes</li>
                            <li>🏗️ Infrastructure as Code with Terraform</li>
                            <li>📊 Monitoring & Logging Setup</li>
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
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: var(--devops-surface);
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                border: 2px solid var(--devops-primary);
            }
            .modal-header h2 {
                color: var(--devops-primary);
                margin-bottom: 10px;
            }
            .achievement {
                background: rgba(0, 212, 170, 0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border: 1px solid var(--devops-primary);
            }
            .skills-learned ul {
                list-style: none;
                padding: 0;
            }
            .skills-learned li {
                padding: 5px 0;
                color: var(--devops-text-secondary);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    completeLevel() {
        if (this.completedExercises.size === this.exercises.length) {
            // Mark level as complete in localStorage
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(17)) {
                completedLevels.push(17);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }
            
            // Update main hub progress
            this.updateMainHubProgress();
            
            alert('🎉 Level 17 completed! Your progress has been saved.');
        } else {
            alert(`Please complete all ${this.exercises.length} exercises before finishing the level.`);
        }
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All progress will be lost.')) {
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
        console.log('Level 17 completed - updating main hub progress');
    }

    saveProgress() {
        const progress = {
            completedExercises: Array.from(this.completedExercises),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('level17Progress', JSON.stringify(progress));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('level17Progress');
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
    window.devOpsLevel = new DevOpsLevel17();
});

// Global functions for HTML onclick handlers
function runExercise(exerciseNumber) {
    if (window.devOpsLevel) {
        window.devOpsLevel.runExercise(exerciseNumber);
    }
}

function completeLevel() {
    if (window.devOpsLevel) {
        window.devOpsLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.devOpsLevel) {
        window.devOpsLevel.resetLevel();
    }
}

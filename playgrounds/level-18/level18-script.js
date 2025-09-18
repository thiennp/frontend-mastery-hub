// Level 18: Security & Authentication - JavaScript Functionality

class SecurityLevel18 {
    constructor() {
        this.exercises = [
            {
                id: 1,
                name: "OAuth 2.0 Implementation",
                keywords: ['OAuth2Client', 'generateCodeVerifier', 'generateCodeChallenge', 'initiateAuth', 'exchangeCodeForToken', 'PKCE'],
                hints: [
                    'Use PKCE (Proof Key for Code Exchange) for enhanced security',
                    'Generate cryptographically secure random values for state and code verifier',
                    'Store sensitive data securely and clear it after use',
                    'Validate state parameter to prevent CSRF attacks'
                ]
            },
            {
                id: 2,
                name: "JWT Token Management",
                keywords: ['JWTManager', 'setTokens', 'getValidToken', 'refreshAccessToken', 'makeAuthenticatedRequest'],
                hints: [
                    'Implement automatic token refresh before expiration',
                    'Use refresh token rotation for enhanced security',
                    'Store tokens securely and clear them on logout',
                    'Handle token refresh failures gracefully'
                ]
            },
            {
                id: 3,
                name: "Password Security",
                keywords: ['PasswordSecurity', 'validatePassword', 'hashPassword', 'verifyPassword', 'generateSecurePassword'],
                hints: [
                    'Use strong hashing algorithms like bcrypt or Argon2',
                    'Implement proper password complexity requirements',
                    'Check for common password patterns and dictionary attacks',
                    'Use secure random number generation for password generation'
                ]
            },
            {
                id: 4,
                name: "Security Headers",
                keywords: ['securityHeaders', 'Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'securityHeadersMiddleware'],
                hints: [
                    'Implement Content Security Policy to prevent XSS attacks',
                    'Use HSTS to enforce HTTPS connections',
                    'Set X-Frame-Options to prevent clickjacking',
                    'Configure CORS policies appropriately'
                ]
            },
            {
                id: 5,
                name: "Penetration Testing",
                keywords: ['SecurityScanner', 'scanWebsite', 'checkForSQLInjection', 'checkForXSSVulnerabilities', 'generateReport'],
                hints: [
                    'Test for common vulnerabilities like SQL injection and XSS',
                    'Check for proper security headers implementation',
                    'Validate CSRF protection mechanisms',
                    'Look for information disclosure vulnerabilities'
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
            { id: 'code1', mode: 'javascript' },
            { id: 'code2', mode: 'javascript' },
            { id: 'code3', mode: 'javascript' },
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
                <strong>🔐 Exercise ${exerciseNumber} Secure!</strong><br>
                ${validation.message}
            `;
            
            this.completedExercises.add(exerciseNumber);
            this.markExerciseComplete(exerciseNumber);
        } else {
            resultDiv.className = 'exercise-result error';
            resultDiv.innerHTML = `
                <strong>⚠️ Exercise ${exerciseNumber} Security Issue</strong><br>
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
                message: `Excellent! Your ${exercise.name} implementation follows security best practices. All required security features are present.`
            };
        } else if (missingKeywords.length <= 2) {
            return {
                isValid: true,
                message: `Good work! Your ${exercise.name} implementation is mostly secure. Consider adding: ${missingKeywords.join(', ')}.`
            };
        } else {
            return {
                isValid: false,
                message: `Your ${exercise.name} implementation needs security improvements. Missing key elements: ${missingKeywords.slice(0, 3).join(', ')}.`
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
            indicator.className = 'completion-indicator security-badge';
            indicator.innerHTML = ' 🔐';
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
                    <h2>🔐 Level 18 Complete!</h2>
                    <p>Congratulations! You've mastered Security & Authentication</p>
                </div>
                <div class="modal-body">
                    <div class="achievement">
                        <h3>🛡️ Security Expert Badge Earned!</h3>
                        <p>You've successfully completed all 5 Security & Authentication exercises</p>
                    </div>
                    <div class="skills-learned">
                        <h4>Security Skills Mastered:</h4>
                        <ul>
                            <li>🔑 OAuth 2.0 Implementation with PKCE</li>
                            <li>🎫 JWT Token Management & Refresh</li>
                            <li>🛡️ Password Security & Hashing</li>
                            <li>🛡️ Security Headers Configuration</li>
                            <li>🔍 Penetration Testing & Vulnerability Scanning</li>
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
                background: var(--security-surface);
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                border: 2px solid var(--security-primary);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            .modal-header h2 {
                color: var(--security-primary);
                margin-bottom: 10px;
            }
            .achievement {
                background: rgba(255, 107, 53, 0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border: 1px solid var(--security-primary);
            }
            .skills-learned ul {
                list-style: none;
                padding: 0;
            }
            .skills-learned li {
                padding: 5px 0;
                color: var(--security-text-secondary);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    completeLevel() {
        if (this.completedExercises.size === this.exercises.length) {
            // Mark level as complete in localStorage
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(18)) {
                completedLevels.push(18);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }
            
            // Update main hub progress
            this.updateMainHubProgress();
            
            alert('🔐 Level 18 completed! Your security expertise has been saved.');
        } else {
            alert(`Please complete all ${this.exercises.length} security exercises before finishing the level.`);
        }
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this security level? All progress will be lost.')) {
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
        console.log('Level 18 completed - updating main hub progress');
    }

    saveProgress() {
        const progress = {
            completedExercises: Array.from(this.completedExercises),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('level18Progress', JSON.stringify(progress));
    }

    loadProgress() {
        const savedProgress = localStorage.getItem('level18Progress');
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
    window.securityLevel = new SecurityLevel18();
});

// Global functions for HTML onclick handlers
function runExercise(exerciseNumber) {
    if (window.securityLevel) {
        window.securityLevel.runExercise(exerciseNumber);
    }
}

function completeLevel() {
    if (window.securityLevel) {
        window.securityLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.securityLevel) {
        window.securityLevel.resetLevel();
    }
}

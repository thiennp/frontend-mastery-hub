// Level 12: TypeScript Advanced - Interactive Script

class Level12Manager {
    constructor() {
        this.storageKey = 'level12-progress';
        this.progress = this.loadProgress();
        this.currentTab = 'ts1';
        this.init();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            completed: 0,
            total: 5,
            exercises: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false
            },
            lastUpdated: Date.now()
        };
    }

    saveProgress() {
        this.progress.lastUpdated = Date.now();
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    init() {
        this.updateUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const codeInputs = document.querySelectorAll('.code-input');
        codeInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updatePreview();
            });
        });
    }

    switchTab(tabId) {
        const allTabs = document.querySelectorAll('.tab');
        const allContents = document.querySelectorAll('.editor-content > *');
        
        allTabs.forEach(tab => tab.classList.remove('active'));
        allContents.forEach(content => content.style.display = 'none');
        
        const selectedTab = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.style.display = 'block';
            this.currentTab = tabId;
        }
    }

    compileTypeScript(tsCode) {
        try {
            // Use the TypeScript compiler from CDN with advanced options
            const result = ts.transpile(tsCode, {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.ESNext,
                strict: true,
                noImplicitAny: true,
                strictNullChecks: true,
                strictFunctionTypes: true,
                strictBindCallApply: true,
                strictPropertyInitialization: true,
                noImplicitReturns: true,
                noFallthroughCasesInSwitch: true,
                noUncheckedIndexedAccess: true,
                noImplicitOverride: true,
                allowUnusedLabels: false,
                allowUnreachableCode: false,
                exactOptionalPropertyTypes: true,
                noImplicitThis: true,
                useUnknownInCatchVariables: true,
                noPropertyAccessFromIndexSignature: true,
                noUncheckedIndexedAccess: true,
                noImplicitAny: true,
                experimentalDecorators: true,
                emitDecoratorMetadata: true
            });
            return { success: true, code: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    updatePreview() {
        const exerciseNumber = this.currentTab.replace(/\D/g, '');
        const tsContent = document.getElementById(`ts${exerciseNumber}`)?.value || '';
        const jsContent = document.getElementById(`js${exerciseNumber}`);
        const output = document.getElementById(`output${exerciseNumber}`);
        
        if (tsContent && jsContent) {
            const compilation = this.compileTypeScript(tsContent);
            
            if (compilation.success) {
                jsContent.value = compilation.code;
            } else {
                jsContent.value = `// Compilation Error:\n// ${compilation.error}`;
            }
        }
        
        if (output) {
            this.runCode(tsContent, exerciseNumber);
        }
    }

    runCode(tsCode, exerciseNumber) {
        const compilation = this.compileTypeScript(tsCode);
        const output = document.getElementById(`output${exerciseNumber}`)?.querySelector('.console-output');
        
        if (!output) return;
        
        if (!compilation.success) {
            output.textContent = `Compilation Error: ${compilation.error}`;
            output.style.color = '#e53e3e';
            return;
        }
        
        // Capture console output
        const originalLog = console.log;
        const logs = [];
        
        console.log = (...args) => {
            logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
        };
        
        try {
            // Execute the compiled JavaScript
            eval(compilation.code);
            
            output.textContent = logs.join('\n') || 'No output';
            output.style.color = '#333';
        } catch (error) {
            output.textContent = `Runtime Error: ${error.message}`;
            output.style.color = '#e53e3e';
        } finally {
            console.log = originalLog;
        }
    }

    checkExercise(exerciseNumber) {
        const exercise = document.getElementById(`exercise${exerciseNumber}`);
        const status = document.getElementById(`status${exerciseNumber}`);
        const tsContent = document.getElementById(`ts${exerciseNumber}`)?.value || '';
        
        const hasContent = tsContent.trim().length > 300;
        const hasAdvancedTypes = tsContent.includes('type ') && (
            tsContent.includes('extends') || 
            tsContent.includes('infer') || 
            tsContent.includes('keyof') ||
            tsContent.includes('Partial') ||
            tsContent.includes('Required') ||
            tsContent.includes('Pick') ||
            tsContent.includes('Omit') ||
            tsContent.includes('Record') ||
            tsContent.includes('Capitalize') ||
            tsContent.includes('TemplateLiteral') ||
            tsContent.includes('namespace') ||
            tsContent.includes('declare')
        );
        const hasComplexPatterns = tsContent.includes('Brand') || 
                                 tsContent.includes('Phantom') || 
                                 tsContent.includes('Deep') ||
                                 tsContent.includes('Paths') ||
                                 tsContent.includes('Get');
        
        if (hasContent && hasAdvancedTypes && (hasComplexPatterns || exerciseNumber <= 3)) {
            this.progress.exercises[exerciseNumber] = true;
            this.progress.completed = Object.values(this.progress.exercises).filter(Boolean).length;
            
            status.textContent = '✅ Completed';
            status.classList.add('completed');
            exercise.classList.add('completed');
            
            exercise.classList.add('success');
            setTimeout(() => {
                exercise.classList.remove('success');
            }, 600);
            
            this.saveProgress();
            this.updateUI();
            this.showNotification(`Exercise ${exerciseNumber} completed! 🎉`, 'success');
            
            if (this.progress.completed >= this.progress.total) {
                this.completeLevel();
            }
        } else {
            this.showNotification('Please add advanced TypeScript code with utility types, conditional types, or advanced patterns to complete this exercise.', 'warning');
        }
    }

    completeLevel() {
        const completionMessage = document.getElementById('completionMessage');
        if (completionMessage) {
            completionMessage.style.display = 'block';
            completionMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        this.syncWithMainHub();
        this.showNotification('🎉 Level 12 completed! You are now a TypeScript Advanced Master!', 'success');
        this.createConfetti();
    }

    syncWithMainHub() {
        const mainHubProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainHubProgress.levels && mainHubProgress.levels[12]) {
            mainHubProgress.levels[12].completed = this.progress.completed;
            mainHubProgress.levels[12].levelCompleted = this.progress.completed >= this.progress.total;
            localStorage.setItem('frontend-mastery-progress', JSON.stringify(mainHubProgress));
        }
    }

    updateUI() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const percentage = Math.round((this.progress.completed / this.progress.total) * 100);
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}% Complete`;
        }
        
        for (let i = 1; i <= 5; i++) {
            const status = document.getElementById(`status${i}`);
            const exercise = document.getElementById(`exercise${i}`);
            
            if (this.progress.exercises[i]) {
                if (status) {
                    status.textContent = '✅ Completed';
                    status.classList.add('completed');
                }
                if (exercise) {
                    exercise.classList.add('completed');
                }
            }
        }
    }

    resetProgress() {
        if (confirm('Are you sure you want to reset your progress? This action cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.progress = this.loadProgress();
            this.updateUI();
            
            for (let i = 1; i <= 5; i++) {
                const status = document.getElementById(`status${i}`);
                const exercise = document.getElementById(`exercise${i}`);
                
                if (status) {
                    status.textContent = '⏳ Pending';
                    status.classList.remove('completed');
                }
                if (exercise) {
                    exercise.classList.remove('completed');
                }
            }
            
            const completionMessage = document.getElementById('completionMessage');
            if (completionMessage) {
                completionMessage.style.display = 'none';
            }
            
            this.showNotification('Progress reset successfully!', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        });

        const colors = {
            success: '#9f7aea',
            warning: '#ed8936',
            info: '#4299e1',
            error: '#e53e3e'
        };
        notification.style.background = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#9f7aea', '#805ad5', '#4facfe', '#00f2fe'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }, i * 50);
        }
        
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Global functions
function switchTab(tabId) {
    level12Manager.switchTab(tabId);
}

function checkExercise(exerciseNumber) {
    level12Manager.checkExercise(exerciseNumber);
}

function resetProgress() {
    level12Manager.resetProgress();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.level12Manager = new Level12Manager();
    level12Manager.switchTab('ts1');
    
    console.log('Level 12: TypeScript Advanced loaded!');
    console.log('Advanced TypeScript compiler is available at: window.ts');
});

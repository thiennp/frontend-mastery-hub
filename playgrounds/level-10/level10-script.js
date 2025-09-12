// Level 10: JavaScript Testing - Interactive Script

class Level10Manager {
    constructor() {
        this.storageKey = 'level10-progress';
        this.progress = this.loadProgress();
        this.currentTab = 'js1';
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

    updatePreview() {
        const exerciseNumber = this.currentTab.replace(/\D/g, '');
        const jsContent = document.getElementById(`js${exerciseNumber}`)?.value || '';
        const testContent = document.getElementById(`test${exerciseNumber}`)?.value || '';
        
        const testOutput = document.getElementById(`testOutput${exerciseNumber}`);
        if (testOutput) {
            const results = this.runTests(jsContent, testContent, exerciseNumber);
            testOutput.querySelector('.test-results').innerHTML = results;
        }
    }

    runTests(jsCode, testCode, exerciseNumber) {
        // Simple test runner simulation
        const tests = this.parseTests(testCode);
        let results = '';
        let passed = 0;
        let total = tests.length;

        tests.forEach((test, index) => {
            try {
                const result = this.executeTest(test, jsCode);
                if (result.passed) {
                    passed++;
                    results += `<div class="test-pass">✅ ${test.name}</div>`;
                } else {
                    results += `<div class="test-fail">❌ ${test.name} - ${result.error}</div>`;
                }
            } catch (error) {
                results += `<div class="test-fail">❌ ${test.name} - ${error.message}</div>`;
            }
        });

        const summary = `<div class="test-summary" style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
            <strong>Tests: ${passed}/${total} passed</strong>
        </div>`;

        return results + summary;
    }

    parseTests(testCode) {
        const tests = [];
        const testRegex = /test\(['"`]([^'"`]+)['"`],\s*\(\)\s*=>\s*\{([^}]+)\}/g;
        let match;

        while ((match = testRegex.exec(testCode)) !== null) {
            tests.push({
                name: match[1],
                code: match[2].trim()
            });
        }

        return tests;
    }

    executeTest(test, jsCode) {
        // Simple test execution simulation
        const hasExpect = test.code.includes('expect(');
        const hasToBe = test.code.includes('.toBe(');
        const hasToThrow = test.code.includes('.toThrow(');
        const hasToEqual = test.code.includes('.toEqual(');

        if (!hasExpect) {
            return { passed: false, error: 'Test must contain expect()' };
        }

        // Check if the test has meaningful content
        const hasContent = test.code.length > 20;
        
        if (hasContent && (hasToBe || hasToThrow || hasToEqual)) {
            return { passed: true };
        } else {
            return { passed: false, error: 'Test needs proper assertions' };
        }
    }

    checkExercise(exerciseNumber) {
        const exercise = document.getElementById(`exercise${exerciseNumber}`);
        const status = document.getElementById(`status${exerciseNumber}`);
        const jsContent = document.getElementById(`js${exerciseNumber}`)?.value || '';
        const testContent = document.getElementById(`test${exerciseNumber}`)?.value || '';
        
        const hasJsContent = jsContent.trim().length > 100;
        const hasTestContent = testContent.trim().length > 200;
        const hasTests = testContent.includes('test(') && testContent.includes('expect(');
        
        if (hasJsContent && hasTestContent && hasTests) {
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
            this.showNotification('Please add both JavaScript code and proper tests to complete this exercise.', 'warning');
        }
    }

    completeLevel() {
        const completionMessage = document.getElementById('completionMessage');
        if (completionMessage) {
            completionMessage.style.display = 'block';
            completionMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        this.syncWithMainHub();
        this.showNotification('🎉 Level 10 completed! You are now a Testing Master!', 'success');
        this.createConfetti();
    }

    syncWithMainHub() {
        const mainHubProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainHubProgress.levels && mainHubProgress.levels[10]) {
            mainHubProgress.levels[10].completed = this.progress.completed;
            mainHubProgress.levels[10].levelCompleted = this.progress.completed >= this.progress.total;
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
            success: '#28a745',
            warning: '#ffc107',
            info: '#17a2b8',
            error: '#dc3545'
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
        const colors = ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#667eea', '#764ba2'];
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
    level10Manager.switchTab(tabId);
}

function checkExercise(exerciseNumber) {
    level10Manager.checkExercise(exerciseNumber);
}

function resetProgress() {
    level10Manager.resetProgress();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.level10Manager = new Level10Manager();
    level10Manager.switchTab('js1');
    
    console.log('Level 10: JavaScript Testing loaded!');
});

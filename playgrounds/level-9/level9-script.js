// Level 9: CSS Advanced Techniques - Interactive Script

class Level9Manager {
    constructor() {
        this.storageKey = 'level9-progress';
        this.progress = this.loadProgress();
        this.currentTab = 'html1';
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
        this.updatePreview();
    }

    setupEventListeners() {
        // Add event listeners for code input changes
        const codeInputs = document.querySelectorAll('.code-input');
        codeInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updatePreview();
            });
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.updatePreview();
                        break;
                    case 'Enter':
                        e.preventDefault();
                        this.updatePreview();
                        break;
                }
            }
        });
    }

    switchTab(tabId) {
        // Hide all tab contents
        const allTabs = document.querySelectorAll('.tab');
        const allContents = document.querySelectorAll('.editor-content > *');
        
        allTabs.forEach(tab => tab.classList.remove('active'));
        allContents.forEach(content => content.style.display = 'none');
        
        // Show selected tab
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
        const htmlContent = document.getElementById(`html${exerciseNumber}`)?.value || '';
        const cssContent = document.getElementById(`css${exerciseNumber}`)?.value || '';
        
        const previewFrame = document.getElementById(`previewFrame${exerciseNumber}`);
        if (previewFrame) {
            const fullHTML = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Preview</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                        ${cssContent}
                    </style>
                </head>
                <body>
                    ${htmlContent}
                    <script>
                        // Theme toggle functionality for exercise 2
                        function toggleTheme() {
                            const container = document.querySelector('.theme-container');
                            if (container) {
                                const currentTheme = container.getAttribute('data-theme');
                                container.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
                            }
                        }
                    </script>
                </body>
                </html>
            `;
            
            previewFrame.srcdoc = fullHTML;
        }
    }

    checkExercise(exerciseNumber) {
        const exercise = document.getElementById(`exercise${exerciseNumber}`);
        const status = document.getElementById(`status${exerciseNumber}`);
        const htmlContent = document.getElementById(`html${exerciseNumber}`)?.value || '';
        const cssContent = document.getElementById(`css${exerciseNumber}`)?.value || '';
        
        // Check if exercise has meaningful content
        const hasContent = htmlContent.trim().length > 50 && cssContent.trim().length > 100;
        
        if (hasContent) {
            // Mark as completed
            this.progress.exercises[exerciseNumber] = true;
            this.progress.completed = Object.values(this.progress.exercises).filter(Boolean).length;
            
            // Update UI
            status.textContent = '✅ Completed';
            status.classList.add('completed');
            exercise.classList.add('completed');
            
            // Add success animation
            exercise.classList.add('success');
            setTimeout(() => {
                exercise.classList.remove('success');
            }, 600);
            
            // Save progress
            this.saveProgress();
            this.updateUI();
            
            // Show notification
            this.showNotification(`Exercise ${exerciseNumber} completed! 🎉`, 'success');
            
            // Check if level is complete
            if (this.progress.completed >= this.progress.total) {
                this.completeLevel();
            }
        } else {
            this.showNotification('Please add more content to complete this exercise.', 'warning');
        }
    }

    completeLevel() {
        // Show completion message
        const completionMessage = document.getElementById('completionMessage');
        if (completionMessage) {
            completionMessage.style.display = 'block';
            completionMessage.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update main hub progress
        this.syncWithMainHub();
        
        // Show celebration
        this.showNotification('🎉 Level 9 completed! You are now a CSS Advanced Master!', 'success');
        
        // Add confetti effect
        this.createConfetti();
    }

    syncWithMainHub() {
        // Sync with main hub progress
        const mainHubProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainHubProgress.levels && mainHubProgress.levels[9]) {
            mainHubProgress.levels[9].completed = this.progress.completed;
            mainHubProgress.levels[9].levelCompleted = this.progress.completed >= this.progress.total;
            localStorage.setItem('frontend-mastery-progress', JSON.stringify(mainHubProgress));
        }
    }

    updateUI() {
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const percentage = Math.round((this.progress.completed / this.progress.total) * 100);
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}% Complete`;
        }
        
        // Update exercise statuses
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
            
            // Reset all exercise statuses
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
            
            // Hide completion message
            const completionMessage = document.getElementById('completionMessage');
            if (completionMessage) {
                completionMessage.style.display = 'none';
            }
            
            this.showNotification('Progress reset successfully!', 'info');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
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

        // Set background color based on type
        const colors = {
            success: '#48bb78',
            warning: '#ed8936',
            info: '#4299e1',
            error: '#f56565'
        };
        notification.style.background = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
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
        const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#f093fb', '#f5576c'];
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
        
        // Add confetti animation CSS
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

// Global functions for HTML onclick handlers
function switchTab(tabId) {
    level9Manager.switchTab(tabId);
}

function checkExercise(exerciseNumber) {
    level9Manager.checkExercise(exerciseNumber);
}

function resetProgress() {
    level9Manager.resetProgress();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.level9Manager = new Level9Manager();
    
    // Set up initial tab
    level9Manager.switchTab('html1');
    
    console.log('Level 9: CSS Advanced Techniques loaded!');
    console.log('Use checkExercise(1-5) to test individual exercises.');
    console.log('Use resetProgress() to reset your progress.');
});

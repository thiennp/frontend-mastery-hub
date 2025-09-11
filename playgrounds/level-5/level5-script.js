// Level 5: Full-Stack Integration - Interactive Script

class Level5Manager {
    constructor() {
        this.currentExercise = 1;
        this.totalExercises = 20;
        this.storageKey = 'level5-progress';
        this.progress = this.loadProgress();
        this.init();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            completed: 0,
            exercises: {
                1: { completed: false, code: '' },
                2: { completed: false, code: '' },
                3: { completed: false, code: '' },
                4: { completed: false, code: '' },
                5: { completed: false, code: '' },
                6: { completed: false, code: '' },
                7: { completed: false, code: '' },
                8: { completed: false, code: '' },
                9: { completed: false, code: '' },
                10: { completed: false, code: '' },
                11: { completed: false, code: '' },
                12: { completed: false, code: '' },
                13: { completed: false, code: '' },
                14: { completed: false, code: '' },
                15: { completed: false, code: '' },
                16: { completed: false, code: '' },
                17: { completed: false, code: '' },
                18: { completed: false, code: '' },
                19: { completed: false, code: '' },
                20: { completed: false, code: '' }
            }
        };
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.loadExerciseCode();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target);
            });
        });

        // Code editor changes
        document.querySelectorAll('.code-editor').forEach(editor => {
            editor.addEventListener('input', (e) => {
                this.updatePreview(e.target);
                this.saveCode(e.target);
            });
        });

        // Check button clicks
        document.querySelectorAll('.check-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const exerciseCard = e.target.closest('.exercise-card');
                const exerciseNum = parseInt(exerciseCard.dataset.exercise);
                this.checkExercise(exerciseNum);
            });
        });
    }

    switchTab(clickedTab) {
        const editorContent = clickedTab.closest('.exercise-editor');
        const tabs = editorContent.querySelectorAll('.tab');
        const contents = editorContent.querySelectorAll('.editor-content > *');

        // Remove active class from all tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');

        // Hide all contents
        contents.forEach(content => content.style.display = 'none');

        // Show corresponding content
        const tabType = clickedTab.dataset.tab;
        if (tabType === 'jsx') {
            const textarea = editorContent.querySelector('.code-editor[data-language="jsx"]');
            if (textarea) {
                textarea.style.display = 'block';
            }
        } else if (tabType === 'preview') {
            const previewFrame = editorContent.querySelector('.preview-frame');
            if (previewFrame) {
                previewFrame.style.display = 'block';
                this.updatePreview(editorContent.querySelector('.code-editor'));
            }
        }
    }

    updatePreview(editor) {
        const exerciseCard = editor.closest('.exercise-card');
        const exerciseNum = exerciseCard.dataset.exercise;
        const previewRoot = document.getElementById(`preview-root-${exerciseNum}`);
        
        if (previewRoot) {
            try {
                // Clear previous content
                previewRoot.innerHTML = '';
                
                // Get the JSX code
                const jsxCode = editor.value;
                
                // Create a script element to execute the React code
                const script = document.createElement('script');
                script.type = 'text/babel';
                
                // Add React and ReactDOM to the script context
                const fullScript = `
                    const { useState, useEffect, useContext, useReducer, useCallback, useMemo, memo, createContext } = React;
                    ${jsxCode}
                `;
                script.textContent = fullScript;
                
                // Execute the script
                previewRoot.appendChild(script);
                
                // Process with Babel if available
                if (window.Babel) {
                    try {
                        const result = Babel.transform(jsxCode, {
                            presets: ['react']
                        });
                        script.textContent = result.code;
                    } catch (e) {
                        console.log('Babel transformation failed, using original code');
                    }
                }
                
            } catch (error) {
                previewRoot.innerHTML = `<div style="color: red; padding: 1rem;">Error: ${error.message}</div>`;
            }
        }
    }

    saveCode(editor) {
        const exerciseCard = editor.closest('.exercise-card');
        const exerciseNum = parseInt(exerciseCard.dataset.exercise);
        this.progress.exercises[exerciseNum].code = editor.value;
        this.saveProgress();
    }

    loadExerciseCode() {
        Object.keys(this.progress.exercises).forEach(exerciseNum => {
            const exercise = this.progress.exercises[exerciseNum];
            const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
            if (exerciseCard && exercise.code) {
                const editor = exerciseCard.querySelector('.code-editor');
                if (editor) {
                    editor.value = exercise.code;
                }
            }
        });
    }

    checkExercise(exerciseNum) {
        const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
        const jsxEditor = exerciseCard.querySelector('.code-editor[data-language="jsx"]');
        
        let isCorrect = false;
        let feedback = '';

        switch (exerciseNum) {
            case 1:
                isCorrect = this.checkExercise1(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Excellent! You implemented API integration with proper error handling and loading states.' :
                    'Try creating API service functions, using fetch() for HTTP requests, and implementing custom hooks for data fetching.';
                break;
            case 2:
                isCorrect = this.checkExercise2(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Perfect! You implemented authentication with Context API, login/logout functionality, and protected components.' :
                    'Try using Context API for auth state, implementing login/logout functions, and creating protected components.';
                break;
            case 3:
                isCorrect = this.checkExercise3(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Awesome! You implemented complex state management with useReducer, action creators, and global state sharing.' :
                    'Try using useReducer for complex state, creating action types and action creators, and using Context API for global state.';
                break;
            case 4:
                isCorrect = this.checkExercise4(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Fantastic! You implemented real-time features with WebSockets and polling for live data updates.' :
                    'Try implementing WebSocket connections, polling mechanisms, and real-time data handling.';
                break;
            case 5:
                isCorrect = this.checkExercise5(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Great! You implemented production optimizations with React.memo, performance monitoring, and deployment readiness.' :
                    'Try using React.memo for optimization, implementing performance monitoring, and preparing for production deployment.';
                break;
        }

        this.showFeedback(exerciseCard, isCorrect, feedback);

        if (isCorrect && !this.progress.exercises[exerciseNum].completed) {
            this.completeExercise(exerciseNum);
        }
    }

    checkExercise1(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('fetch') &&
               lowerCode.includes('async') && lowerCode.includes('await') &&
               lowerCode.includes('useeffect') &&
               lowerCode.includes('loading') && lowerCode.includes('error') &&
               (lowerCode.includes('api') || lowerCode.includes('service'));
    }

    checkExercise2(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('createcontext') &&
               lowerCode.includes('useeffect') &&
               lowerCode.includes('localstorage') &&
               (lowerCode.includes('login') || lowerCode.includes('logout')) &&
               lowerCode.includes('auth');
    }

    checkExercise3(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('usereducer') &&
               lowerCode.includes('action') &&
               lowerCode.includes('dispatch') &&
               lowerCode.includes('context') &&
               (lowerCode.includes('store') || lowerCode.includes('provider'));
    }

    checkExercise4(code) {
        const lowerCode = code.toLowerCase();
        return (lowerCode.includes('websocket') || lowerCode.includes('polling')) &&
               lowerCode.includes('useeffect') &&
               lowerCode.includes('interval') &&
               (lowerCode.includes('real') || lowerCode.includes('live'));
    }

    checkExercise5(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('memo') &&
               lowerCode.includes('usememo') &&
               lowerCode.includes('performance') &&
               (lowerCode.includes('production') || lowerCode.includes('optimization'));
    }

    showFeedback(exerciseCard, isCorrect, message) {
        // Remove existing feedback
        const existingFeedback = exerciseCard.querySelector('.exercise-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `exercise-feedback ${isCorrect ? 'success' : 'error'}`;
        feedback.innerHTML = `
            <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="feedback-message">${message}</div>
        `;

        // Add to exercise card
        exerciseCard.querySelector('.exercise-content').appendChild(feedback);

        // Add success animation
        if (isCorrect) {
            exerciseCard.classList.add('success');
            setTimeout(() => {
                exerciseCard.classList.remove('success');
            }, 600);
        }

        // Auto-hide feedback after 5 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 5000);
    }

    completeExercise(exerciseNum) {
        this.progress.exercises[exerciseNum].completed = true;
        this.progress.completed = Math.max(this.progress.completed, exerciseNum);
        
        // Unlock next exercise
        if (exerciseNum < this.totalExercises) {
            this.unlockExercise(exerciseNum + 1);
        }

        this.saveProgress();
        this.updateUI();
        this.showNotification(`Exercise ${exerciseNum} completed! 🎉`, 'success');

        // Check for badges
        this.checkBadges(exerciseNum);
        
        // Sync with main hub
        this.syncWithMainHub();
    }

    unlockExercise(exerciseNum) {
        const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
        if (exerciseCard) {
            exerciseCard.classList.remove('locked');
            exerciseCard.classList.add('unlocking');
            
            const status = exerciseCard.querySelector('.exercise-status');
            status.textContent = 'Ready';
            status.className = 'exercise-status in-progress';

            const button = exerciseCard.querySelector('.check-button');
            button.disabled = false;

            setTimeout(() => {
                exerciseCard.classList.remove('unlocking');
            }, 600);
        }
    }

    checkBadges(exerciseNum) {
        // Full-Stack Master badge
        if (exerciseNum === 5 && !this.progress.badges?.fullStackMaster) {
            this.showNotification('🚀 Badge earned: Full-Stack Master!', 'badge');
            this.progress.badges = this.progress.badges || {};
            this.progress.badges.fullStackMaster = true;
            this.saveProgress();
        }
    }

    syncWithMainHub() {
        // Sync progress with main hub
        if (window.parent && window.parent.progressTracker) {
            window.parent.progressTracker.syncLevelProgress(5, this.progress.completed);
        }
        
        // Also sync via localStorage for cross-tab communication
        const mainProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainProgress.levels && mainProgress.levels[5]) {
            mainProgress.levels[5].completed = this.progress.completed;
            mainProgress.levels[5].levelCompleted = this.progress.completed >= this.totalExercises;
            localStorage.setItem('frontend-mastery-progress', JSON.stringify(mainProgress));
        }
    }

    updateUI() {
        // Update progress bar
        const progressFill = document.getElementById('level-progress');
        const progressText = document.getElementById('progress-text');
        const percentage = Math.round((this.progress.completed / this.totalExercises) * 100);

        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        if (progressText) {
            progressText.textContent = `${percentage}% Complete`;
        }

        // Update exercise cards
        Object.keys(this.progress.exercises).forEach(exerciseNum => {
            const exercise = this.progress.exercises[exerciseNum];
            const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
            
            if (exerciseCard) {
                const status = exerciseCard.querySelector('.exercise-status');
                const button = exerciseCard.querySelector('.check-button');

                if (exercise.completed) {
                    exerciseCard.classList.add('completed');
                    status.textContent = 'Completed';
                    status.className = 'exercise-status completed';
                    button.textContent = 'Completed ✓';
                    button.disabled = true;
                } else if (parseInt(exerciseNum) <= this.progress.completed + 1 || parseInt(exerciseNum) === 1) {
                    exerciseCard.classList.remove('locked');
                    status.textContent = 'Ready';
                    status.className = 'exercise-status in-progress';
                    button.disabled = false;
                }
            }
        });
    }

    showNotification(message, type = 'info') {
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
            box-shadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        });

        const colors = {
            success: '#667eea',
            badge: '#ed8936',
            info: '#4299e1',
            error: '#f56565'
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const level5Manager = new Level5Manager();

    // Make it globally available for debugging
    window.level5Manager = level5Manager;

    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    const activeEditor = document.querySelector('.code-editor:focus');
                    if (activeEditor) {
                        level5Manager.updatePreview(activeEditor);
                    }
                    break;
            }
        }
    });

    console.log('Level 5 loaded! Use level5Manager to interact with the exercises.');
});

// Global function for checkExercise (for onclick handlers)
function checkExercise(exerciseNum) {
    if (window.level5Manager) {
        window.level5Manager.checkExercise(exerciseNum);
    }
}

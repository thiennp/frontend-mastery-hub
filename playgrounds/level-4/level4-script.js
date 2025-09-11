// Level 4: Advanced React - Interactive Script

class Level4Manager {
    constructor() {
        this.currentExercise = 1;
        this.totalExercises = 18;
        this.storageKey = 'level4-progress';
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
                18: { completed: false, code: '' }
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
                    'Excellent! You created custom hooks that extract and share logic between components.' :
                    'Try creating custom hooks that start with "use" and return values that components can use. Include useState and useEffect in your hooks.';
                break;
            case 2:
                isCorrect = this.checkExercise2(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Perfect! You implemented React Context to share data without prop drilling.' :
                    'Try using createContext(), Context.Provider, and useContext() to share data across components. Create a custom hook for context usage.';
                break;
            case 3:
                isCorrect = this.checkExercise3(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Awesome! You used useReducer to manage complex state with predictable updates.' :
                    'Try using useReducer with a reducer function that handles different action types. Dispatch actions with type and payload properties.';
                break;
            case 4:
                isCorrect = this.checkExercise4(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Fantastic! You optimized React performance with useMemo, useCallback, and React.memo.' :
                    'Try using useMemo for expensive calculations, useCallback for memoized functions, and React.memo for component memoization.';
                break;
            case 5:
                isCorrect = this.checkExercise5(jsxEditor ? jsxEditor.value : '');
                feedback = isCorrect ? 
                    'Great! You implemented error boundaries to catch and handle JavaScript errors gracefully.' :
                    'Try creating a class component with getDerivedStateFromError and componentDidCatch methods. Wrap components that might throw errors.';
                break;
        }

        this.showFeedback(exerciseCard, isCorrect, feedback);

        if (isCorrect && !this.progress.exercises[exerciseNum].completed) {
            this.completeExercise(exerciseNum);
        }
    }

    checkExercise1(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('function use') &&
               lowerCode.includes('usestate') &&
               lowerCode.includes('useeffect') &&
               lowerCode.includes('return') &&
               (lowerCode.includes('uselocalstorage') || lowerCode.includes('useapi'));
    }

    checkExercise2(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('createcontext') &&
               lowerCode.includes('context.provider') &&
               lowerCode.includes('usecontext') &&
               lowerCode.includes('value=') &&
               lowerCode.includes('function usetheme');
    }

    checkExercise3(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('usereducer') &&
               lowerCode.includes('function') && lowerCode.includes('reducer') &&
               lowerCode.includes('switch') && lowerCode.includes('case') &&
               lowerCode.includes('dispatch') &&
               lowerCode.includes('action.type');
    }

    checkExercise4(code) {
        const lowerCode = code.toLowerCase();
        return (lowerCode.includes('usememo') || lowerCode.includes('usecallback')) &&
               lowerCode.includes('memo') &&
               lowerCode.includes('[]') &&
               (lowerCode.includes('expensive') || lowerCode.includes('calculation'));
    }

    checkExercise5(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('class') && lowerCode.includes('extends component') &&
               lowerCode.includes('getderivedstatefromerror') &&
               lowerCode.includes('componentdidcatch') &&
               lowerCode.includes('errorboundary') &&
               lowerCode.includes('haserror');
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
        // Advanced React Master badge
        if (exerciseNum === 5 && !this.progress.badges?.advancedReactMaster) {
            this.showNotification('🚀 Badge earned: Advanced React Master!', 'badge');
            this.progress.badges = this.progress.badges || {};
            this.progress.badges.advancedReactMaster = true;
            this.saveProgress();
        }
    }

    syncWithMainHub() {
        // Sync progress with main hub
        if (window.parent && window.parent.progressTracker) {
            window.parent.progressTracker.syncLevelProgress(4, this.progress.completed);
        }
        
        // Also sync via localStorage for cross-tab communication
        const mainProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainProgress.levels && mainProgress.levels[4]) {
            mainProgress.levels[4].completed = this.progress.completed;
            mainProgress.levels[4].levelCompleted = this.progress.completed >= this.totalExercises;
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
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        });

        const colors = {
            success: '#8b5cf6',
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
    const level4Manager = new Level4Manager();

    // Make it globally available for debugging
    window.level4Manager = level4Manager;

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
                        level4Manager.updatePreview(activeEditor);
                    }
                    break;
            }
        }
    });

    console.log('Level 4 loaded! Use level4Manager to interact with the exercises.');
});

// Global function for checkExercise (for onclick handlers)
function checkExercise(exerciseNum) {
    if (window.level4Manager) {
        window.level4Manager.checkExercise(exerciseNum);
    }
}

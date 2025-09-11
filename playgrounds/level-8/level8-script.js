// Level 8: JavaScript ES6+ Features - Interactive Script

class Level8Manager {
    constructor() {
        this.currentExercise = 1;
        this.totalExercises = 5;
        this.storageKey = 'level8-progress';
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
                5: { completed: false, code: '' }
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
        if (tabType === 'js') {
            const textarea = editorContent.querySelector('.code-editor[data-language="js"]');
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
                
                // Get the JavaScript code
                const jsCode = editor.value;
                
                // Create a script element to execute the code
                const script = document.createElement('script');
                script.textContent = jsCode;
                
                // Capture console output
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                
                let output = '';
                
                console.log = (...args) => {
                    output += args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ') + '\n';
                    originalLog(...args);
                };
                
                console.error = (...args) => {
                    output += 'ERROR: ' + args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ') + '\n';
                    originalError(...args);
                };
                
                console.warn = (...args) => {
                    output += 'WARN: ' + args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ') + '\n';
                    originalWarn(...args);
                };
                
                // Execute the script
                try {
                    eval(jsCode);
                } catch (error) {
                    output += 'ERROR: ' + error.message + '\n';
                }
                
                // Restore original console methods
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
                
                // Display the output
                previewRoot.textContent = output || 'No output generated. Check your code!';
                
            } catch (error) {
                previewRoot.textContent = 'Error: ' + error.message;
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
        const jsEditor = exerciseCard.querySelector('.code-editor[data-language="js"]');
        
        let isCorrect = false;
        let feedback = '';

        switch (exerciseNum) {
            case 1:
                isCorrect = this.checkExercise1(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Excellent! You mastered arrow functions, destructuring, and template literals.' :
                    'Try using arrow functions (=>), object/array destructuring, and template literals (${}).';
                break;
            case 2:
                isCorrect = this.checkExercise2(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Perfect! You implemented ES6 classes with inheritance and static methods.' :
                    'Try using class keyword, extends for inheritance, super() for parent calls, and static methods.';
                break;
            case 3:
                isCorrect = this.checkExercise3(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Awesome! You mastered Promises, async/await, and error handling.' :
                    'Try using Promise.all(), async/await syntax, try/catch blocks, and Promise.allSettled().';
                break;
            case 4:
                isCorrect = this.checkExercise4(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Fantastic! You implemented generators, iterators, and custom iterables.' :
                    'Try using function* for generators, yield keyword, Symbol.iterator, and for...of loops.';
                break;
            case 5:
                isCorrect = this.checkExercise5(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Great! You mastered Proxy objects and Reflect API for metaprogramming.' :
                    'Try using new Proxy(), Reflect methods, get/set traps, and custom property behavior.';
                break;
        }

        this.showFeedback(exerciseCard, isCorrect, feedback);

        if (isCorrect && !this.progress.exercises[exerciseNum].completed) {
            this.completeExercise(exerciseNum);
        }
    }

    checkExercise1(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('=>') &&
               (lowerCode.includes('destructur') || lowerCode.includes('{') && lowerCode.includes('}')) &&
               lowerCode.includes('`') &&
               lowerCode.includes('${');
    }

    checkExercise2(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('class ') &&
               lowerCode.includes('constructor') &&
               (lowerCode.includes('extends') || lowerCode.includes('static'));
    }

    checkExercise3(code) {
        const lowerCode = code.toLowerCase();
        return (lowerCode.includes('promise') || lowerCode.includes('async') || lowerCode.includes('await')) &&
               (lowerCode.includes('then') || lowerCode.includes('catch') || lowerCode.includes('try'));
    }

    checkExercise4(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('function*') &&
               lowerCode.includes('yield') &&
               (lowerCode.includes('symbol.iterator') || lowerCode.includes('for') && lowerCode.includes('of'));
    }

    checkExercise5(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('new proxy') &&
               (lowerCode.includes('get') || lowerCode.includes('set')) &&
               lowerCode.includes('reflect');
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
        // ES6+ Master badge
        if (exerciseNum === 5 && !this.progress.badges?.es6Master) {
            this.showNotification('⚡ Badge earned: ES6+ Master!', 'badge');
            this.progress.badges = this.progress.badges || {};
            this.progress.badges.es6Master = true;
            this.saveProgress();
        }
    }

    syncWithMainHub() {
        // Sync progress with main hub
        if (window.parent && window.parent.progressTracker) {
            window.parent.progressTracker.syncLevelProgress(8, this.progress.completed);
        }
        
        // Also sync via localStorage for cross-tab communication
        const mainProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainProgress.levels && mainProgress.levels[8]) {
            mainProgress.levels[8].completed = this.progress.completed;
            mainProgress.levels[8].levelCompleted = this.progress.completed >= this.totalExercises;
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
    const level8Manager = new Level8Manager();

    // Make it globally available for debugging
    window.level8Manager = level8Manager;

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
                        level8Manager.updatePreview(activeEditor);
                    }
                    break;
            }
        }
    });

    console.log('Level 8 loaded! Use level8Manager to interact with the exercises.');
});

// Global function for checkExercise (for onclick handlers)
function checkExercise(exerciseNum) {
    if (window.level8Manager) {
        window.level8Manager.checkExercise(exerciseNum);
    }
}

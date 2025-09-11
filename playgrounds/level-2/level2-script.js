// Level 2: JavaScript Basics - Interactive Script

class Level2Manager {
    constructor() {
        this.currentExercise = 1;
        this.totalExercises = 12;
        this.storageKey = 'level2-progress';
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
                12: { completed: false, code: '' }
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
        if (tabType === 'javascript') {
            const textarea = editorContent.querySelector('.code-editor[data-language="javascript"]');
            if (textarea) {
                textarea.style.display = 'block';
            }
        } else if (tabType === 'html') {
            const textarea = editorContent.querySelector('.code-editor[data-language="html"]');
            if (textarea) {
                textarea.style.display = 'block';
            }
        } else if (tabType === 'console') {
            const consoleOutput = editorContent.querySelector('.console-output');
            if (consoleOutput) {
                consoleOutput.style.display = 'block';
                this.runCode(editorContent);
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
        const previewFrame = exerciseCard.querySelector('iframe');
        
        if (previewFrame) {
            const htmlCode = editor.value;
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            previewFrame.src = url;
        }
    }

    runCode(editorContent) {
        const exerciseCard = editorContent.closest('.exercise-card');
        const exerciseNum = exerciseCard.dataset.exercise;
        const consoleOutput = exerciseCard.querySelector('.console-content');
        
        if (consoleOutput) {
            // Clear previous output
            consoleOutput.textContent = '';
            
            // Capture console.log output
            const originalLog = console.log;
            const logs = [];
            
            console.log = function(...args) {
                logs.push(args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' '));
                originalLog.apply(console, args);
            };
            
            try {
                // Get JavaScript code
                const jsEditor = editorContent.querySelector('.code-editor[data-language="javascript"]');
                if (jsEditor) {
                    eval(jsEditor.value);
                }
            } catch (error) {
                logs.push(`Error: ${error.message}`);
            }
            
            // Restore original console.log
            console.log = originalLog;
            
            // Display output
            consoleOutput.textContent = logs.join('\n');
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
                const editors = exerciseCard.querySelectorAll('.code-editor');
                editors.forEach(editor => {
                    editor.value = exercise.code;
                });
            }
        });
    }

    checkExercise(exerciseNum) {
        const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
        const jsEditor = exerciseCard.querySelector('.code-editor[data-language="javascript"]');
        const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
        
        let isCorrect = false;
        let feedback = '';

        switch (exerciseNum) {
            case 1:
                isCorrect = this.checkExercise1(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Great! You declared variables with different data types and used console.log.' :
                    'Try declaring variables with let/const, use different data types (string, number, boolean, array), and log them with console.log().';
                break;
            case 2:
                isCorrect = this.checkExercise2(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Excellent! You created both function declarations and arrow functions.' :
                    'Try creating a function declaration with the function keyword and an arrow function. Make sure to call both functions.';
                break;
            case 3:
                isCorrect = this.checkExercise3(htmlEditor ? htmlEditor.value : '', jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Perfect! You used DOM methods to select elements and added event listeners.' :
                    'Try using getElementById(), querySelector(), addEventListener(), and modify element properties.';
                break;
            case 4:
                isCorrect = this.checkExercise4(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Awesome! You worked with arrays and used different loop methods.' :
                    'Try creating an array, using for loop, forEach(), and map() methods.';
                break;
            case 5:
                isCorrect = this.checkExercise5(jsEditor ? jsEditor.value : '');
                feedback = isCorrect ? 
                    'Fantastic! You created an object with properties and methods.' :
                    'Try creating an object with properties, accessing them with dot notation, and adding a method.';
                break;
        }

        this.showFeedback(exerciseCard, isCorrect, feedback);

        if (isCorrect && !this.progress.exercises[exerciseNum].completed) {
            this.completeExercise(exerciseNum);
        }
    }

    checkExercise1(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('let') && 
               lowerCode.includes('console.log') &&
               (lowerCode.includes('"') || lowerCode.includes("'")) &&
               lowerCode.includes('[') && lowerCode.includes(']');
    }

    checkExercise2(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('function') && 
               lowerCode.includes('=>') &&
               lowerCode.includes('return') &&
               lowerCode.includes('console.log');
    }

    checkExercise3(htmlCode, jsCode) {
        const lowerHtml = htmlCode.toLowerCase();
        const lowerJs = jsCode.toLowerCase();
        return lowerHtml.includes('id=') && 
               lowerHtml.includes('class=') &&
               lowerJs.includes('getelementbyid') &&
               lowerJs.includes('queryselector') &&
               lowerJs.includes('addeventlistener');
    }

    checkExercise4(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('[') && lowerCode.includes(']') &&
               (lowerCode.includes('for') || lowerCode.includes('foreach') || lowerCode.includes('map')) &&
               lowerCode.includes('console.log');
    }

    checkExercise5(code) {
        const lowerCode = code.toLowerCase();
        return lowerCode.includes('{') && lowerCode.includes('}') &&
               lowerCode.includes('function') &&
               lowerCode.includes('this.') &&
               lowerCode.includes('console.log');
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
        // JavaScript Ninja badge
        if (exerciseNum === 5 && !this.progress.badges?.javascriptNinja) {
            this.showNotification('⚡ Badge earned: JavaScript Ninja!', 'badge');
            this.progress.badges = this.progress.badges || {};
            this.progress.badges.javascriptNinja = true;
            this.saveProgress();
        }
    }

    syncWithMainHub() {
        // Sync progress with main hub
        if (window.parent && window.parent.progressTracker) {
            window.parent.progressTracker.syncLevelProgress(2, this.progress.completed);
        }
        
        // Also sync via localStorage for cross-tab communication
        const mainProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainProgress.levels && mainProgress.levels[2]) {
            mainProgress.levels[2].completed = this.progress.completed;
            mainProgress.levels[2].levelCompleted = this.progress.completed >= this.totalExercises;
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
            success: '#48bb78',
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
    const level2Manager = new Level2Manager();

    // Make it globally available for debugging
    window.level2Manager = level2Manager;

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
                        const editorContent = activeEditor.closest('.exercise-editor');
                        const consoleTab = editorContent.querySelector('[data-tab="console"]');
                        if (consoleTab) {
                            level2Manager.runCode(editorContent);
                        }
                    }
                    break;
            }
        }
    });

    console.log('Level 2 loaded! Use level2Manager to interact with the exercises.');
});

// Global function for checkExercise (for onclick handlers)
function checkExercise(exerciseNum) {
    if (window.level2Manager) {
        window.level2Manager.checkExercise(exerciseNum);
    }
}

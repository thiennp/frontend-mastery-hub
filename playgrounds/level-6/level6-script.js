// Level 6: Advanced HTML & CSS - Interactive Script

class Level6Manager {
    constructor() {
        this.currentExercise = 1;
        this.totalExercises = 5;
        this.storageKey = 'level6-progress';
        this.progress = this.loadProgress();
        this.init();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            completed: 0,
            exercises: {
                1: { completed: false, html: '', css: '' },
                2: { completed: false, html: '', css: '' },
                3: { completed: false, html: '', css: '' },
                4: { completed: false, html: '', css: '' },
                5: { completed: false, html: '', css: '' }
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
        if (tabType === 'html') {
            const textarea = editorContent.querySelector('.code-editor[data-language="html"]');
            if (textarea) {
                textarea.style.display = 'block';
            }
        } else if (tabType === 'css') {
            const textarea = editorContent.querySelector('.code-editor[data-language="css"]');
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
                // Get HTML and CSS code
                const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
                const cssEditor = exerciseCard.querySelector('.code-editor[data-language="css"]');
                
                const htmlCode = htmlEditor ? htmlEditor.value : '';
                const cssCode = cssEditor ? cssEditor.value : '';
                
                // Create the preview content
                const previewContent = `
                    <style>${cssCode}</style>
                    ${htmlCode}
                `;
                
                previewRoot.innerHTML = previewContent;
                
            } catch (error) {
                previewRoot.innerHTML = `<div style="color: red; padding: 1rem;">Error: ${error.message}</div>`;
            }
        }
    }

    saveCode(editor) {
        const exerciseCard = editor.closest('.exercise-card');
        const exerciseNum = parseInt(exerciseCard.dataset.exercise);
        const language = editor.dataset.language;
        
        if (language === 'html') {
            this.progress.exercises[exerciseNum].html = editor.value;
        } else if (language === 'css') {
            this.progress.exercises[exerciseNum].css = editor.value;
        }
        
        this.saveProgress();
    }

    loadExerciseCode() {
        Object.keys(this.progress.exercises).forEach(exerciseNum => {
            const exercise = this.progress.exercises[exerciseNum];
            const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
            if (exerciseCard) {
                const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
                const cssEditor = exerciseCard.querySelector('.code-editor[data-language="css"]');
                
                if (htmlEditor && exercise.html) {
                    htmlEditor.value = exercise.html;
                }
                if (cssEditor && exercise.css) {
                    cssEditor.value = exercise.css;
                }
            }
        });
    }

    checkExercise(exerciseNum) {
        const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
        const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
        const cssEditor = exerciseCard.querySelector('.code-editor[data-language="css"]');
        
        let isCorrect = false;
        let feedback = '';

        switch (exerciseNum) {
            case 1:
                isCorrect = this.checkExercise1(htmlEditor ? htmlEditor.value : '', cssEditor ? cssEditor.value : '');
                feedback = isCorrect ? 
                    'Excellent! You created a complex grid layout with named areas and responsive design.' :
                    'Try using grid-template-areas, defining grid columns/rows, and making it responsive with media queries.';
                break;
            case 2:
                isCorrect = this.checkExercise2(htmlEditor ? htmlEditor.value : '', cssEditor ? cssEditor.value : '');
                feedback = isCorrect ? 
                    'Perfect! You mastered advanced Flexbox with flex-grow, flex-shrink, and proper alignment.' :
                    'Try using flex-grow, flex-shrink, flex-direction: column, and align-items for proper layout.';
                break;
            case 3:
                isCorrect = this.checkExercise3(htmlEditor ? htmlEditor.value : '', cssEditor ? cssEditor.value : '');
                feedback = isCorrect ? 
                    'Awesome! You created smooth animations with keyframes, transforms, and transitions.' :
                    'Try using @keyframes, animation property, transform, and transition for smooth effects.';
                break;
            case 4:
                isCorrect = this.checkExercise4(htmlEditor ? htmlEditor.value : '', cssEditor ? cssEditor.value : '');
                feedback = isCorrect ? 
                    'Fantastic! You implemented CSS custom properties for theming and maintainable code.' :
                    'Try using :root for global variables, var() function, and attribute selectors for theme switching.';
                break;
            case 5:
                isCorrect = this.checkExercise5(htmlEditor ? htmlEditor.value : '', cssEditor ? cssEditor.value : '');
                feedback = isCorrect ? 
                    'Great! You created a fully responsive design with mobile-first approach and proper breakpoints.' :
                    'Try using mobile-first approach, @media queries, relative units, and testing on different screen sizes.';
                break;
        }

        this.showFeedback(exerciseCard, isCorrect, feedback);

        if (isCorrect && !this.progress.exercises[exerciseNum].completed) {
            this.completeExercise(exerciseNum);
        }
    }

    checkExercise1(html, css) {
        const lowerCss = css.toLowerCase();
        return lowerCss.includes('display: grid') &&
               lowerCss.includes('grid-template-areas') &&
               lowerCss.includes('grid-template-columns') &&
               lowerCss.includes('@media');
    }

    checkExercise2(html, css) {
        const lowerCss = css.toLowerCase();
        return lowerCss.includes('display: flex') &&
               lowerCss.includes('flex-grow') &&
               lowerCss.includes('flex-direction: column') &&
               lowerCss.includes('align-items');
    }

    checkExercise3(html, css) {
        const lowerCss = css.toLowerCase();
        return lowerCss.includes('@keyframes') &&
               lowerCss.includes('animation:') &&
               lowerCss.includes('transform:') &&
               lowerCss.includes('transition:');
    }

    checkExercise4(html, css) {
        const lowerCss = css.toLowerCase();
        return lowerCss.includes(':root') &&
               lowerCss.includes('var(') &&
               lowerCss.includes('--') &&
               (lowerCss.includes('[data-theme') || lowerCss.includes('settheme'));
    }

    checkExercise5(html, css) {
        const lowerCss = css.toLowerCase();
        return lowerCss.includes('@media') &&
               lowerCss.includes('min-width') &&
               lowerCss.includes('max-width') &&
               (lowerCss.includes('rem') || lowerCss.includes('%'));
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
        // Advanced CSS Master badge
        if (exerciseNum === 5 && !this.progress.badges?.advancedCssMaster) {
            this.showNotification('🎨 Badge earned: Advanced CSS Master!', 'badge');
            this.progress.badges = this.progress.badges || {};
            this.progress.badges.advancedCssMaster = true;
            this.saveProgress();
        }
    }

    syncWithMainHub() {
        // Sync progress with main hub
        if (window.parent && window.parent.progressTracker) {
            window.parent.progressTracker.syncLevelProgress(6, this.progress.completed);
        }
        
        // Also sync via localStorage for cross-tab communication
        const mainProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        if (mainProgress.levels && mainProgress.levels[6]) {
            mainProgress.levels[6].completed = this.progress.completed;
            mainProgress.levels[6].levelCompleted = this.progress.completed >= this.totalExercises;
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
    const level6Manager = new Level6Manager();

    // Make it globally available for debugging
    window.level6Manager = level6Manager;

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
                        level6Manager.updatePreview(activeEditor);
                    }
                    break;
            }
        }
    });

    console.log('Level 6 loaded! Use level6Manager to interact with the exercises.');
});

// Global function for checkExercise (for onclick handlers)
function checkExercise(exerciseNum) {
    if (window.level6Manager) {
        window.level6Manager.checkExercise(exerciseNum);
    }
}

// Level 1: HTML & CSS Fundamentals - Interactive Script

class Level1Manager {
    constructor() {
        this.currentExercise = 1;
        this.totalExercises = 5;
        this.storageKey = 'level1-progress';
        this.progress = this.loadProgress();
        this.init();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {
            completed: 0,
            exercises: {
                1: { completed: false, htmlCode: '', cssCode: '' },
                2: { completed: false, htmlCode: '', cssCode: '' },
                3: { completed: false, htmlCode: '', cssCode: '' },
                4: { completed: false, htmlCode: '', cssCode: '' },
                5: { completed: false, htmlCode: '', cssCode: '' }
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
            
            // Auto-save every 5 seconds
            setInterval(() => {
                if (editor.value) {
                    this.saveCode(editor);
                }
            }, 5000);
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
            const textarea = editorContent.querySelector('.code-editor');
            textarea.style.display = 'block';
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
        const previewFrame = exerciseCard.querySelector('iframe');
        
        if (previewFrame) {
            let code = editor.value;
            
            // If this is a CSS editor, combine with HTML
            if (editor.dataset.language === 'css') {
                const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
                if (htmlEditor) {
                    // Replace the CSS in the style tag
                    code = htmlEditor.value.replace(
                        /<style>[\s\S]*?<\/style>/,
                        `<style>\n${editor.value}\n</style>`
                    );
                }
            }
            
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            previewFrame.src = url;
        }
    }

    saveCode(editor) {
        const exerciseCard = editor.closest('.exercise-card');
        const exerciseNum = parseInt(exerciseCard.dataset.exercise);
        
        // Initialize exercise data if it doesn't exist
        if (!this.progress.exercises[exerciseNum]) {
            this.progress.exercises[exerciseNum] = { completed: false, htmlCode: '', cssCode: '' };
        }
        
        // Save based on editor type
        if (editor.dataset.language === 'css') {
            this.progress.exercises[exerciseNum].cssCode = editor.value;
        } else {
            this.progress.exercises[exerciseNum].htmlCode = editor.value;
        }
        
        this.saveProgress();
    }

    loadExerciseCode() {
        Object.keys(this.progress.exercises).forEach(exerciseNum => {
            const exercise = this.progress.exercises[exerciseNum];
            const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
            if (exerciseCard) {
                // Load HTML code
                if (exercise.htmlCode) {
                    const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
                    if (htmlEditor) {
                        htmlEditor.value = exercise.htmlCode;
                    }
                }
                
                // Load CSS code
                if (exercise.cssCode) {
                    const cssEditor = exerciseCard.querySelector('.code-editor[data-language="css"]');
                    if (cssEditor) {
                        cssEditor.value = exercise.cssCode;
                    }
                }
                
                // Handle legacy code format
                if (exercise.code && !exercise.htmlCode) {
                    const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
                    if (htmlEditor) {
                        htmlEditor.value = exercise.code;
                    }
                }
            }
        });
    }

    checkExercise(exerciseNum) {
        const exerciseCard = document.querySelector(`[data-exercise="${exerciseNum}"]`);
        const htmlEditor = exerciseCard.querySelector('.code-editor[data-language="html"]');
        const cssEditor = exerciseCard.querySelector('.code-editor[data-language="css"]');
        
        let htmlCode = htmlEditor ? htmlEditor.value.toLowerCase() : '';
        let cssCode = cssEditor ? cssEditor.value.toLowerCase() : '';
        let combinedCode = htmlCode + ' ' + cssCode;

        let isCorrect = false;
        let feedback = '';

        switch (exerciseNum) {
            case 1:
                isCorrect = this.checkExercise1(htmlCode);
                feedback = isCorrect ? 
                    'Great! You created a proper HTML structure with DOCTYPE, html, head, and body tags.' :
                    'Try including DOCTYPE, html, head, and body tags in your HTML structure.';
                break;
            case 2:
                isCorrect = this.checkExercise2(htmlCode);
                feedback = isCorrect ? 
                    'Excellent! You used various HTML elements like headings, paragraphs, lists, and links.' :
                    'Try using different HTML elements: headings (h1-h6), paragraphs (p), lists (ul, li), and links (a).';
                break;
            case 3:
                isCorrect = this.checkExercise3(combinedCode);
                feedback = isCorrect ? 
                    'Perfect! You added CSS styling with internal stylesheets and basic selectors.' :
                    'Try adding CSS using the <style> tag in the head section and target elements with selectors.';
                break;
            case 4:
                isCorrect = this.checkExercise4(combinedCode);
                feedback = isCorrect ? 
                    'Awesome! You used different CSS selectors including element, class, and ID selectors.' :
                    'Try using different selectors: # for IDs, . for classes, and element selectors.';
                break;
            case 5:
                isCorrect = this.checkExercise5(combinedCode);
                feedback = isCorrect ? 
                    'Fantastic! You applied the CSS box model with margin, padding, and border properties.' :
                    'Try using box model properties like margin, padding, border, width, and height.';
                break;
        }

        this.showFeedback(exerciseCard, isCorrect, feedback);

        if (isCorrect && !this.progress.exercises[exerciseNum].completed) {
            this.completeExercise(exerciseNum);
        }
    }

    checkExercise1(code) {
        return code.includes('<!doctype html>') && 
               code.includes('<html') && 
               code.includes('<head') && 
               code.includes('<body') &&
               code.includes('</html>') &&
               code.includes('<title');
    }

    checkExercise2(code) {
        return code.includes('<h1') && 
               code.includes('<p') && 
               (code.includes('<ul') || code.includes('<ol')) &&
               code.includes('<a href');
    }

    checkExercise3(code) {
        return code.includes('<style>') && 
               code.includes('color') && 
               (code.includes('h1') || code.includes('p'));
    }

    checkExercise4(code) {
        return code.includes('#main-title') && 
               code.includes('.intro') && 
               code.includes('.content p') &&
               code.includes('span.highlight');
    }

    checkExercise5(code) {
        return code.includes('margin') && 
               code.includes('padding') && 
               (code.includes('border') || code.includes('width'));
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

        // Style the feedback
        Object.assign(feedback.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            marginTop: '1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500'
        });

        if (isCorrect) {
            feedback.style.background = '#c6f6d5';
            feedback.style.color = '#2f855a';
            feedback.style.border = '1px solid #9ae6b4';
        } else {
            feedback.style.background = '#fed7d7';
            feedback.style.color = '#c53030';
            feedback.style.border = '1px solid #feb2b2';
        }

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
        
        // Check if all exercises are completed
        if (this.progress.completed >= this.totalExercises) {
            this.showLevelCompletion();
        }
        
        // Sync with main hub progress
        this.syncWithMainHub();
    }

    syncWithMainHub() {
        // Update main hub progress
        const mainHubProgress = JSON.parse(localStorage.getItem('frontend-mastery-progress') || '{}');
        
        if (!mainHubProgress.levels) {
            mainHubProgress.levels = {};
        }
        
        if (!mainHubProgress.levels[1]) {
            mainHubProgress.levels[1] = { completed: 0, total: 5, unlocked: true };
        }
        
        // Update level 1 progress
        mainHubProgress.levels[1].completed = this.progress.completed;
        
        // Update badges
        if (!mainHubProgress.badges) {
            mainHubProgress.badges = {};
        }
        
        if (this.progress.badges?.firstSteps) {
            mainHubProgress.badges['first-steps'] = true;
        }
        
        if (this.progress.badges?.cssArtist) {
            mainHubProgress.badges['css-artist'] = true;
        }
        
        // Save to main hub storage
        localStorage.setItem('frontend-mastery-progress', JSON.stringify(mainHubProgress));
    }

    showLevelCompletion() {
        // Create celebration modal
        const modal = document.createElement('div');
        modal.className = 'level-completion-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="celebration-icon">🎉</div>
                <h2>Congratulations!</h2>
                <p>You've completed Level 1: HTML & CSS Fundamentals!</p>
                <div class="completion-stats">
                    <div class="stat">
                        <span class="stat-number">${this.totalExercises}</span>
                        <span class="stat-label">Exercises Completed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${Object.keys(this.progress.badges || {}).length}</span>
                        <span class="stat-label">Badges Earned</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <a href="../../index.html" class="btn btn-primary">Back to Hub</a>
                    <button class="btn btn-secondary" onclick="this.closest('.level-completion-modal').remove()">Continue Learning</button>
                </div>
            </div>
        `;

        // Style the modal
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000',
            animation: 'fadeIn 0.3s ease'
        });

        const modalContent = modal.querySelector('.modal-content');
        Object.assign(modalContent.style, {
            background: 'white',
            padding: '3rem',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease'
        });

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .celebration-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
                animation: bounce 1s infinite;
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            .completion-stats {
                display: flex;
                justify-content: center;
                gap: 2rem;
                margin: 2rem 0;
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
            }
            .btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            .btn-primary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }
            .btn-secondary {
                background: #e2e8f0;
                color: #4a5568;
            }
            .btn:hover {
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
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
        // First Steps badge
        if (exerciseNum === 1 && !this.progress.badges?.firstSteps) {
            this.showNotification('🏆 Badge earned: First Steps!', 'badge');
            this.progress.badges = this.progress.badges || {};
            this.progress.badges.firstSteps = true;
            this.saveProgress();
        }

        // CSS Artist badge
        if (exerciseNum === 3 && !this.progress.badges?.cssArtist) {
            this.showNotification('🎨 Badge earned: CSS Artist!', 'badge');
            this.progress.badges = this.progress.badges || {};
            this.progress.badges.cssArtist = true;
            this.saveProgress();
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
    const level1Manager = new Level1Manager();

    // Make it globally available for debugging
    window.level1Manager = level1Manager;

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
                        level1Manager.updatePreview(activeEditor);
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    const activeExercise = document.querySelector('.exercise-card:not(.locked) .check-button:not(:disabled)');
                    if (activeExercise) {
                        activeExercise.click();
                    }
                    break;
            }
        }
        
        // Tab navigation for exercises
        if (e.key === 'Tab' && e.shiftKey === false) {
            const activeEditor = document.querySelector('.code-editor:focus');
            if (activeEditor) {
                const exerciseCard = activeEditor.closest('.exercise-card');
                const nextEditor = exerciseCard.querySelector('.code-editor:not(:focus)');
                if (nextEditor) {
                    e.preventDefault();
                    nextEditor.focus();
                }
            }
        }
    });

    console.log('Level 1 loaded! Use level1Manager to interact with the exercises.');
});

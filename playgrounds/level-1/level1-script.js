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
		this.syncHubProgress();
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
            const code = editor.value;
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            previewFrame.src = url;
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
        const editor = exerciseCard.querySelector('.code-editor');
        const code = editor.value.toLowerCase();

        let isCorrect = false;
        let feedback = '';

        switch (exerciseNum) {
            case 1:
                isCorrect = this.checkExercise1(code);
                feedback = isCorrect ? 
                    'Great! You created a proper HTML structure with DOCTYPE, html, head, and body tags.' :
                    'Try including DOCTYPE, html, head, and body tags in your HTML structure.';
                break;
            case 2:
                isCorrect = this.checkExercise2(code);
                feedback = isCorrect ? 
                    'Excellent! You used various HTML elements like headings, paragraphs, lists, and links.' :
                    'Try using different HTML elements: headings (h1-h6), paragraphs (p), lists (ul, li), and links (a).';
                break;
            case 3:
                isCorrect = this.checkExercise3(code);
                feedback = isCorrect ? 
                    'Perfect! You added CSS styling with internal stylesheets and basic selectors.' :
                    'Try adding CSS using the <style> tag in the head section and target elements with selectors.';
                break;
            case 4:
                isCorrect = this.checkExercise4(code);
                feedback = isCorrect ? 
                    'Awesome! You used different CSS selectors including element, class, and ID selectors.' :
                    'Try using different selectors: # for IDs, . for classes, and element selectors.';
                break;
            case 5:
                isCorrect = this.checkExercise5(code);
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
               code.includes('</html>');
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
		this.syncHubProgress();
        this.updateUI();
        this.showNotification(`Exercise ${exerciseNum} completed! 🎉`, 'success');

        // Check for badges
        this.checkBadges(exerciseNum);
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

	// Sync Level 1 progress to the global hub progress used on the main page
	syncHubProgress() {
		try {
			const hubStorageKey = 'frontend-mastery-progress';
			const savedHub = localStorage.getItem(hubStorageKey);
			let hubProgress = savedHub ? JSON.parse(savedHub) : {
				levels: {
					1: { completed: 0, total: this.totalExercises, unlocked: true },
					2: { completed: 0, total: 12, unlocked: false },
					3: { completed: 0, total: 15, unlocked: false },
					4: { completed: 0, total: 18, unlocked: false },
					5: { completed: 0, total: 20, unlocked: false }
				},
				badges: {
					'first-steps': false,
					'css-artist': false,
					'javascript-ninja': false,
					'react-master': false
				}
			};

			// Ensure structures exist
			hubProgress.levels = hubProgress.levels || {};
			hubProgress.badges = hubProgress.badges || {};

			// Update Level 1 progress
			hubProgress.levels[1] = hubProgress.levels[1] || { completed: 0, total: this.totalExercises, unlocked: true };
			hubProgress.levels[1].total = this.totalExercises;
			hubProgress.levels[1].completed = Math.max(hubProgress.levels[1].completed || 0, this.progress.completed);
			hubProgress.levels[1].unlocked = true;

			// Unlock Level 2 if Level 1 completed
			if (hubProgress.levels[1].completed >= hubProgress.levels[1].total) {
				if (!hubProgress.levels[2]) hubProgress.levels[2] = { completed: 0, total: 12, unlocked: false };
				hubProgress.levels[2].unlocked = true;
			}

			// Sync badges earned in Level 1
			if (this.progress.badges?.firstSteps) hubProgress.badges['first-steps'] = true;
			if (this.progress.badges?.cssArtist) hubProgress.badges['css-artist'] = true;

			localStorage.setItem(hubStorageKey, JSON.stringify(hubProgress));
		} catch (error) {
			console.warn('Failed to sync hub progress', error);
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
            }
        }
    });

    console.log('Level 1 loaded! Use level1Manager to interact with the exercises.');
});

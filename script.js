// Frontend Mastery Hub - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Progress tracking system
    class ProgressTracker {
        constructor() {
            this.storageKey = 'frontend-mastery-progress';
            this.progress = this.loadProgress();
            this.updateUI();
        }

        loadProgress() {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {
                levels: {
                    1: { completed: 0, total: 5, unlocked: true },
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
        }

        saveProgress() {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        }

        updateUI() {
            // Update level progress
            Object.keys(this.progress.levels).forEach(levelNum => {
                const level = this.progress.levels[levelNum];
                const levelCard = document.querySelector(`.level-card:nth-child(${levelNum})`);
                
                if (levelCard) {
                    const progressFill = levelCard.querySelector('.progress-fill');
                    const progressText = levelCard.querySelector('.progress-text');
                    const percentage = Math.round((level.completed / level.total) * 100);
                    
                    if (progressFill) {
                        progressFill.style.width = `${percentage}%`;
                    }
                    
                    if (progressText) {
                        if (level.unlocked) {
                            progressText.textContent = `${percentage}% Complete`;
                        } else {
                            progressText.textContent = 'Locked';
                        }
                    }

                    // Update card state
                    if (level.unlocked) {
                        levelCard.classList.remove('locked');
                        const button = levelCard.querySelector('.level-button');
                        if (button) {
                            button.classList.remove('disabled');
                            button.disabled = false;
                        }
                    }
                }
            });

            // Update badges
            Object.keys(this.progress.badges).forEach(badgeKey => {
                const badgeEarned = this.progress.badges[badgeKey];
                const badgeCard = document.querySelector(`[data-badge="${badgeKey}"]`);
                
                if (badgeCard) {
                    const status = badgeCard.querySelector('.badge-status');
                    if (status) {
                        if (badgeEarned) {
                            status.textContent = 'Earned!';
                            status.classList.remove('locked');
                            status.classList.add('earned');
                        } else {
                            status.textContent = 'Locked';
                            status.classList.remove('earned');
                            status.classList.add('locked');
                        }
                    }
                }
            });
        }

        completeExercise(levelNum, exerciseNum) {
            if (this.progress.levels[levelNum] && this.progress.levels[levelNum].unlocked) {
                const level = this.progress.levels[levelNum];
                if (exerciseNum <= level.total) {
                    level.completed = Math.max(level.completed, exerciseNum);
                    
                    // Check if level is complete
                    if (level.completed >= level.total) {
                        this.unlockNextLevel(levelNum);
                        this.checkBadges(levelNum);
                    }
                    
                    this.saveProgress();
                    this.updateUI();
                    this.showNotification(`Exercise ${exerciseNum} completed!`, 'success');
                }
            }
        }

        unlockNextLevel(currentLevel) {
            const nextLevel = parseInt(currentLevel) + 1;
            if (this.progress.levels[nextLevel]) {
                this.progress.levels[nextLevel].unlocked = true;
                this.showNotification(`Level ${nextLevel} unlocked!`, 'success');
            }
        }

        checkBadges(levelNum) {
            const level = this.progress.levels[levelNum];
            
            // First Steps badge
            if (levelNum == 1 && level.completed >= 1 && !this.progress.badges['first-steps']) {
                this.progress.badges['first-steps'] = true;
                this.showNotification('🏆 Badge earned: First Steps!', 'badge');
            }
            
            // CSS Artist badge
            if (levelNum == 1 && level.completed >= 5 && !this.progress.badges['css-artist']) {
                this.progress.badges['css-artist'] = true;
                this.showNotification('🎨 Badge earned: CSS Artist!', 'badge');
            }
            
            // JavaScript Ninja badge
            if (levelNum == 2 && level.completed >= 10 && !this.progress.badges['javascript-ninja']) {
                this.progress.badges['javascript-ninja'] = true;
                this.showNotification('⚡ Badge earned: JavaScript Ninja!', 'badge');
            }
            
            // React Master badge
            if (levelNum == 3 && level.completed >= 15 && !this.progress.badges['react-master']) {
                this.progress.badges['react-master'] = true;
                this.showNotification('🚀 Badge earned: React Master!', 'badge');
            }
        }

        showNotification(message, type = 'info') {
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
                badge: '#ed8936',
                info: '#4299e1'
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
    }

    // Initialize progress tracker
    const progressTracker = new ProgressTracker();

    // Add click handlers for level buttons
    const levelButtons = document.querySelectorAll('.level-button:not(.disabled)');
    levelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const levelCard = this.closest('.level-card');
            const levelNumber = levelCard.querySelector('.level-number').textContent;
            
            // For demo purposes, simulate completing an exercise
            if (levelNumber === '1') {
                const currentCompleted = progressTracker.progress.levels[1].completed;
                if (currentCompleted < progressTracker.progress.levels[1].total) {
                    progressTracker.completeExercise(1, currentCompleted + 1);
                }
            }
        });
    });

    // Add badge data attributes for easier selection
    const badgeCards = document.querySelectorAll('.badge-card');
    const badgeKeys = ['first-steps', 'css-artist', 'javascript-ninja', 'react-master'];
    badgeCards.forEach((card, index) => {
        if (badgeKeys[index]) {
            card.setAttribute('data-badge', badgeKeys[index]);
        }
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.level-card, .badge-card, .project-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #667eea !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for scroll animations
    const cards = document.querySelectorAll('.level-card, .badge-card, .project-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add demo functionality for testing
    window.demoCompleteExercise = function(level, exercise) {
        progressTracker.completeExercise(level, exercise);
    };

    window.demoResetProgress = function() {
        localStorage.removeItem(progressTracker.storageKey);
        progressTracker.progress = progressTracker.loadProgress();
        progressTracker.updateUI();
        console.log('Progress reset!');
    };

    console.log('Frontend Mastery Hub loaded! Try demoCompleteExercise(1, 1) to test progress tracking.');
});

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

    // Enhanced Progress tracking system with level completion checking
    class ProgressTracker {
        constructor() {
            this.storageKey = 'frontend-mastery-progress';
            this.progress = this.loadProgress();
            this.checkLevelCompletions();
            this.updateUI();
        }

        loadProgress() {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {
                levels: {
                    1: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    2: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    3: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    4: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    5: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    6: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    7: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    8: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    9: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    10: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    11: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    12: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    13: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    14: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    15: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    16: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    17: { completed: 5, total: 5, unlocked: true, levelCompleted: true },
                    18: { completed: 0, total: 5, unlocked: true, levelCompleted: false }
                },
                badges: {
                    'first-steps': true,
                    'css-artist': true,
                    'javascript-ninja': true,
                    'react-master': true,
                    'advanced-react-master': true,
                    'full-stack-master': true,
                    'css-advanced-master': true,
                    'testing-master': true,
                    'typescript-master': true,
                    'typescript-advanced-master': true
                },
                lastUpdated: Date.now()
            };
        }

        saveProgress() {
            this.progress.lastUpdated = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        }

        // Check for completed levels by examining individual level progress
        checkLevelCompletions() {
            // Check Level 1 completion
            const level1Progress = this.getLevelProgress(1);
            if (level1Progress && level1Progress.completed >= level1Progress.total) {
                this.progress.levels[1].levelCompleted = true;
                this.progress.levels[1].completed = level1Progress.total;
                this.unlockNextLevel(1);
            }

            // Check other levels if they exist
            for (let levelNum = 2; levelNum <= 18; levelNum++) {
                const levelProgress = this.getLevelProgress(levelNum);
                if (levelProgress && levelProgress.completed >= levelProgress.total) {
                    this.progress.levels[levelNum].levelCompleted = true;
                    this.progress.levels[levelNum].completed = levelProgress.total;
                    this.unlockNextLevel(levelNum);
                }
            }

            this.saveProgress();
        }

        // Get progress from individual level storage
        getLevelProgress(levelNum) {
            // Try new format first (used by Level 13+)
            const newKey = `level${levelNum}Progress`;
            let saved = localStorage.getItem(newKey);
            
            if (saved) {
                const levelData = JSON.parse(saved);
                if (levelData.exercises) {
                    // New format with exercises array
                    const completed = levelData.exercises.filter(ex => ex.completed).length;
                    return {
                        completed: completed,
                        total: levelData.exercises.length
                    };
                }
            }
            
            // Try old format (used by Level 1-12)
            const oldKey = `level${levelNum}-progress`;
            saved = localStorage.getItem(oldKey);
            if (saved) {
                const levelData = JSON.parse(saved);
                return {
                    completed: levelData.completed || 0,
                    total: levelData.total || 10
                };
            }
            return null;
        }

        // Sync progress from level page to main hub
        syncLevelProgress(levelNum, exerciseNum) {
            if (this.progress.levels[levelNum] && this.progress.levels[levelNum].unlocked) {
                const level = this.progress.levels[levelNum];
                if (exerciseNum <= level.total) {
                    level.completed = Math.max(level.completed, exerciseNum);
                    
                    // Check if level is complete
                    if (level.completed >= level.total) {
                        level.levelCompleted = true;
                        this.unlockNextLevel(levelNum);
                        this.checkBadges(levelNum);
                        this.showNotification(`🎉 Level ${levelNum} completed!`, 'success');
                    }
                    
                    this.saveProgress();
                    this.updateUI();
                }
            }
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
                            if (level.levelCompleted) {
                                progressText.textContent = 'Completed! 🎉';
                                levelCard.classList.add('completed');
                            } else {
                                progressText.textContent = `${percentage}% Complete`;
                            }
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
                            
                            if (level.levelCompleted) {
                                button.textContent = 'Level Completed ✓';
                                button.classList.add('completed');
                            } else {
                                button.textContent = levelNum === 1 ? 'Continue Level 1' : `Start Level ${levelNum}`;
                            }
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
                            status.textContent = 'Earned! 🏆';
                            status.classList.remove('locked');
                            status.classList.add('earned');
                            badgeCard.classList.add('earned');
                        } else {
                            status.textContent = 'Locked';
                            status.classList.remove('earned');
                            status.classList.add('locked');
                            badgeCard.classList.remove('earned');
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
                        level.levelCompleted = true;
                        this.unlockNextLevel(levelNum);
                        this.checkBadges(levelNum);
                        this.showNotification(`🎉 Level ${levelNum} completed!`, 'success');
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
                this.showNotification(`🚀 Level ${nextLevel} unlocked!`, 'success');
                
                // Add unlock animation
                const nextLevelCard = document.querySelector(`.level-card:nth-child(${nextLevel})`);
                if (nextLevelCard) {
                    nextLevelCard.classList.add('unlocking');
                    setTimeout(() => {
                        nextLevelCard.classList.remove('unlocking');
                    }, 1000);
                }
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
            if (levelNum == 2 && level.completed >= 5 && !this.progress.badges['javascript-ninja']) {
                this.progress.badges['javascript-ninja'] = true;
                this.showNotification('⚡ Badge earned: JavaScript Ninja!', 'badge');
            }
            
            // React Master badge
            if (levelNum == 3 && level.completed >= 5 && !this.progress.badges['react-master']) {
                this.progress.badges['react-master'] = true;
                this.showNotification('🚀 Badge earned: React Master!', 'badge');
            }
            
            // Advanced React Master badge
            if (levelNum == 4 && level.completed >= 5 && !this.progress.badges['advanced-react-master']) {
                this.progress.badges['advanced-react-master'] = true;
                this.showNotification('🎯 Badge earned: Advanced React Master!', 'badge');
            }
            
            // Full-Stack Master badge
            if (levelNum == 5 && level.completed >= 5 && !this.progress.badges['full-stack-master']) {
                this.progress.badges['full-stack-master'] = true;
                this.showNotification('🌟 Badge earned: Full-Stack Master!', 'badge');
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

        // Method to reset all progress
        resetProgress() {
            localStorage.removeItem(this.storageKey);
            // Also reset individual level progress
            for (let i = 1; i <= 13; i++) {
                localStorage.removeItem(`level${i}-progress`);
            }
            this.progress = this.loadProgress();
            this.updateUI();
            this.showNotification('Progress reset successfully!', 'info');
        }

        // Method to get current progress summary
        getProgressSummary() {
            const completedLevels = Object.values(this.progress.levels).filter(level => level.levelCompleted).length;
            const totalLevels = Object.keys(this.progress.levels).length;
            const earnedBadges = Object.values(this.progress.badges).filter(badge => badge).length;
            const totalBadges = Object.keys(this.progress.badges).length;
            
            return {
                completedLevels,
                totalLevels,
                earnedBadges,
                totalBadges,
                overallProgress: Math.round((completedLevels / totalLevels) * 100)
            };
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
            
            // Navigate to the appropriate level page
            if (levelNumber === '1') {
                window.location.href = 'playgrounds/level-1/index.html';
            } else if (levelNumber === '2') {
                window.location.href = 'playgrounds/level-2/index.html';
            } else if (levelNumber === '3') {
                window.location.href = 'playgrounds/level-3/index.html';
            } else if (levelNumber === '4') {
                window.location.href = 'playgrounds/level-4/index.html';
            } else if (levelNumber === '5') {
                window.location.href = 'playgrounds/level-5/index.html';
            } else if (levelNumber === '6') {
                window.location.href = 'playgrounds/level-6/index.html';
            } else if (levelNumber === '7') {
                window.location.href = 'playgrounds/level-7/index.html';
            } else if (levelNumber === '8') {
                window.location.href = 'playgrounds/level-8/index.html';
            } else if (levelNumber === '9') {
                window.location.href = 'playgrounds/level-9/index.html';
            } else if (levelNumber === '10') {
                window.location.href = 'playgrounds/level-10/index.html';
            } else if (levelNumber === '11') {
                window.location.href = 'playgrounds/level-11/index.html';
            } else if (levelNumber === '12') {
                window.location.href = 'playgrounds/level-12/index.html';
            } else if (levelNumber === '13') {
                window.location.href = 'playgrounds/level-13/index.html';
            } else if (levelNumber === '14') {
                window.location.href = 'playgrounds/level-14/index.html';
            } else if (levelNumber === '15') {
                window.location.href = 'playgrounds/level-15/index.html';
            } else if (levelNumber === '16') {
                window.location.href = 'playgrounds/level-16/index.html';
            } else if (levelNumber === '17') {
                window.location.href = 'playgrounds/level-17/index.html';
            } else if (levelNumber === '18') {
                window.location.href = 'playgrounds/level-18/index.html';
            } else {
                // For demo purposes, simulate completing an exercise
                const currentCompleted = progressTracker.progress.levels[levelNumber].completed;
                if (currentCompleted < progressTracker.progress.levels[levelNumber].total) {
                    progressTracker.completeExercise(parseInt(levelNumber), currentCompleted + 1);
                }
            }
        });
    });

    // Add badge data attributes for easier selection
    const badgeCards = document.querySelectorAll('.badge-card');
    const badgeKeys = ['first-steps', 'css-artist', 'javascript-ninja', 'react-master', 'advanced-react-master', 'full-stack-master', 'css-advanced-master', 'testing-master', 'typescript-master', 'typescript-advanced-master'];
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
        
        .level-card.completed {
            border-color: #48bb78;
            background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
        }
        
        .level-card.unlocking {
            animation: unlockPulse 1s ease-in-out;
        }
        
        @keyframes unlockPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(72, 187, 120, 0.5); }
            100% { transform: scale(1); }
        }
        
        .badge-card.earned {
            border-color: #ed8936;
            background: linear-gradient(135deg, #fffaf0 0%, #fbd38d 100%);
        }
        
        .level-button.completed {
            background: #48bb78;
            color: white;
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
        progressTracker.resetProgress();
        console.log('Progress reset!');
    };

    window.demoSyncLevelProgress = function(level, exercise) {
        progressTracker.syncLevelProgress(level, exercise);
    };

    window.demoGetProgressSummary = function() {
        const summary = progressTracker.getProgressSummary();
        console.log('Progress Summary:', summary);
        return summary;
    };

    // Make progress tracker globally available
    window.progressTracker = progressTracker;

    console.log('Frontend Mastery Hub loaded! Try demoCompleteExercise(1, 1) to test progress tracking.');
    console.log('Use demoGetProgressSummary() to see your current progress.');
});

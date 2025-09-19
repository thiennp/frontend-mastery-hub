// Level 22: Mobile Development Script

class MobileDevelopmentLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'React Native Fundamentals', completed: false },
            { id: 2, name: 'Flutter Development', completed: false },
            { id: 3, name: 'Progressive Web Apps', completed: false },
            { id: 4, name: 'Mobile Optimization', completed: false },
            { id: 5, name: 'Cross-Platform Development', completed: false }
        ];
        this.currentExercise = 1;
        this.mobileMetrics = {
            rnComponents: 0,
            rnScreens: 0,
            rnPlatform: 'iOS/Android',
            flutterWidgets: 0,
            flutterScreens: 0,
            flutterPlatform: 'iOS/Android',
            pwaSwStatus: 'Not Registered',
            pwaManifestStatus: 'Not Loaded',
            pwaInstallable: 'No',
            mobileFps: 60,
            mobileMemory: 0,
            mobileDevice: 'Mobile',
            crossPlatform: 'Web',
            crossFeatures: 0,
            crossCompatibility: 100
        };
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.initializeMobileSimulation();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Exercise completion tracking
        document.querySelectorAll('.exercise-card').forEach(card => {
            const exerciseId = parseInt(card.dataset.exercise);
            const runBtn = card.querySelector('.run-btn');
            runBtn.addEventListener('click', () => this.runExercise(exerciseId));
        });

        // Level completion
        document.getElementById('completeBtn').addEventListener('click', () => this.completeLevel());
        
        // Reset level
        document.querySelector('.btn-secondary').addEventListener('click', () => this.resetLevel());
    }

    initializeMobileSimulation() {
        // Simulate mobile platform status updates
        this.simulateMobilePlatforms();
        this.detectDeviceType();
    }

    simulateMobilePlatforms() {
        // Simulate random mobile platform status changes
        setInterval(() => {
            if (Math.random() > 0.8) {
                this.updateRandomMobileMetric();
            }
        }, 4000);
    }

    detectDeviceType() {
        const userAgent = navigator.userAgent;
        if (/Android/i.test(userAgent)) {
            this.mobileMetrics.mobileDevice = 'Android';
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            this.mobileMetrics.mobileDevice = 'iOS';
        } else if (/Windows Phone/i.test(userAgent)) {
            this.mobileMetrics.mobileDevice = 'Windows Phone';
        } else {
            this.mobileMetrics.mobileDevice = 'Desktop';
        }
        this.updateMetricsDisplay();
    }

    updateRandomMobileMetric() {
        const metrics = Object.keys(this.mobileMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Status')) {
            const statuses = ['Running', 'Stopped', 'Pending', 'Error'];
            this.mobileMetrics[randomMetric] = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (randomMetric.includes('Components') || randomMetric.includes('Widgets') || randomMetric.includes('Screens')) {
            this.mobileMetrics[randomMetric] = Math.floor(Math.random() * 20) + 5;
        } else if (randomMetric.includes('Fps')) {
            this.mobileMetrics[randomMetric] = Math.floor(Math.random() * 20) + 50;
        } else if (randomMetric.includes('Memory')) {
            this.mobileMetrics[randomMetric] = Math.floor(Math.random() * 100) + 10;
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        // Update status to in-progress
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Running...</span>';
        
        // Simulate exercise execution
        setTimeout(() => {
            this.executeExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 2000);
    }

    executeExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeReactNative(outputContent);
                break;
            case 2:
                this.executeFlutter(outputContent);
                break;
            case 3:
                this.executePWA(outputContent);
                break;
            case 4:
                this.executeMobileOptimization(outputContent);
                break;
            case 5:
                this.executeCrossPlatform(outputContent);
                break;
        }
    }

    executeReactNative(outputContent) {
        this.mobileMetrics.rnComponents = 15;
        this.mobileMetrics.rnScreens = 3;
        this.mobileMetrics.rnPlatform = 'iOS/Android';

        outputContent.innerHTML = `
<div class="react-native-app">
    <h4>⚛️ React Native App Deployed</h4>
    <div class="mobile-device">
        <div class="mobile-screen">
            <div class="app-header">
                <div class="app-title">React Native Todo</div>
                <div class="app-status">
                    <div class="status-indicator"></div>
                    <span>Running</span>
                </div>
            </div>
            
            <div class="todo-list">
                <div class="todo-item">
                    <input type="checkbox" checked>
                    <span>Learn React Native</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox">
                    <span>Build mobile app</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox" checked>
                    <span>Deploy to stores</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="react-native-features">
        <h5>🎯 React Native Features:</h5>
        <div class="feature-badges">
            <span class="mobile-platform react-native">Components: 15</span>
            <span class="mobile-platform react-native">Screens: 3</span>
            <span class="mobile-platform react-native">Navigation</span>
            <span class="mobile-platform react-native">State Management</span>
            <span class="mobile-platform react-native">Platform APIs</span>
        </div>
    </div>
    
    <div class="platform-statuses">
        <span class="platform-status platform-running">iOS: Running</span>
        <span class="platform-status platform-running">Android: Running</span>
        <span class="platform-status platform-pending">Web: Pending</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeFlutter(outputContent) {
        this.mobileMetrics.flutterWidgets = 18;
        this.mobileMetrics.flutterScreens = 4;
        this.mobileMetrics.flutterPlatform = 'iOS/Android';

        outputContent.innerHTML = `
<div class="flutter-app">
    <h4>🎯 Flutter App Deployed</h4>
    <div class="mobile-device">
        <div class="mobile-screen">
            <div class="app-header">
                <div class="app-title">Flutter Todo</div>
                <div class="app-status">
                    <div class="status-indicator"></div>
                    <span>Running</span>
                </div>
            </div>
            
            <div class="todo-list">
                <div class="todo-item">
                    <input type="checkbox" checked>
                    <span>Learn Flutter</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox">
                    <span>Create widgets</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox" checked>
                    <span>State management</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox">
                    <span>Platform channels</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="flutter-features">
        <h5>🎯 Flutter Features:</h5>
        <div class="feature-badges">
            <span class="mobile-platform flutter">Widgets: 18</span>
            <span class="mobile-platform flutter">Screens: 4</span>
            <span class="mobile-platform flutter">Material Design</span>
            <span class="mobile-platform flutter">Cupertino</span>
            <span class="mobile-platform flutter">Hot Reload</span>
        </div>
    </div>
    
    <div class="platform-statuses">
        <span class="platform-status platform-running">iOS: Running</span>
        <span class="platform-status platform-running">Android: Running</span>
        <span class="platform-status platform-running">Web: Running</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executePWA(outputContent) {
        this.mobileMetrics.pwaSwStatus = 'Registered';
        this.mobileMetrics.pwaManifestStatus = 'Loaded';
        this.mobileMetrics.pwaInstallable = 'Yes';

        outputContent.innerHTML = `
<div class="pwa-app">
    <h4>🌐 Progressive Web App Deployed</h4>
    <div class="mobile-device">
        <div class="mobile-screen">
            <div class="app-header">
                <div class="app-title">PWA Todo</div>
                <div class="app-status">
                    <div class="status-indicator"></div>
                    <span>Installed</span>
                </div>
            </div>
            
            <div class="todo-list">
                <div class="todo-item">
                    <input type="checkbox" checked>
                    <span>Service Worker</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox" checked>
                    <span>Web Manifest</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox">
                    <span>Offline sync</span>
                </div>
                <div class="todo-item">
                    <input type="checkbox" checked>
                    <span>Push notifications</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="pwa-features">
        <h5>🎯 PWA Features:</h5>
        <div class="feature-badges">
            <span class="mobile-platform pwa">Service Worker: Active</span>
            <span class="mobile-platform pwa">Manifest: Loaded</span>
            <span class="mobile-platform pwa">Offline Support</span>
            <span class="mobile-platform pwa">Installable</span>
            <span class="mobile-platform pwa">Push Notifications</span>
        </div>
    </div>
    
    <div class="pwa-metrics">
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">Cache Size</div>
                <div class="metric-value">2.4 MB</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Offline Time</div>
                <div class="metric-value">24h</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Install Rate</div>
                <div class="metric-value">85%</div>
            </div>
        </div>
    </div>
    
    <div class="platform-statuses">
        <span class="platform-status platform-running">Service Worker: Registered</span>
        <span class="platform-status platform-running">Manifest: Loaded</span>
        <span class="platform-status platform-running">Installable: Yes</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeMobileOptimization(outputContent) {
        this.mobileMetrics.mobileFps = 58;
        this.mobileMetrics.mobileMemory = 45;
        this.mobileMetrics.mobileDevice = this.detectDeviceType();

        outputContent.innerHTML = `
<div class="mobile-optimization">
    <h4>⚡ Mobile Optimization Applied</h4>
    <div class="mobile-device">
        <div class="mobile-screen">
            <div class="app-header">
                <div class="app-title">Optimized Mobile App</div>
                <div class="app-status">
                    <div class="status-indicator"></div>
                    <span>Optimized</span>
                </div>
            </div>
            
            <div class="performance-display">
                <div class="perf-item">
                    <span class="perf-label">FPS:</span>
                    <span class="perf-value">58</span>
                </div>
                <div class="perf-item">
                    <span class="perf-label">Memory:</span>
                    <span class="perf-value">45 MB</span>
                </div>
                <div class="perf-item">
                    <span class="perf-label">Device:</span>
                    <span class="perf-value">${this.mobileMetrics.mobileDevice}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="optimization-features">
        <h5>🎯 Optimization Features:</h5>
        <div class="feature-badges">
            <span class="mobile-platform">Touch Events</span>
            <span class="mobile-platform">Lazy Loading</span>
            <span class="mobile-platform">Responsive Design</span>
            <span class="mobile-platform">Performance Monitoring</span>
            <span class="mobile-platform">Gesture Support</span>
        </div>
    </div>
    
    <div class="optimization-metrics">
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">Touch Response</div>
                <div class="metric-value">16ms</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Load Time</div>
                <div class="metric-value">1.2s</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Bundle Size</div>
                <div class="metric-value">245 KB</div>
            </div>
        </div>
    </div>
    
    <div class="platform-statuses">
        <span class="platform-status platform-running">FPS: 58</span>
        <span class="platform-status platform-running">Memory: 45 MB</span>
        <span class="platform-status platform-running">Device: ${this.mobileMetrics.mobileDevice}</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeCrossPlatform(outputContent) {
        this.mobileMetrics.crossPlatform = 'Multi-Platform';
        this.mobileMetrics.crossFeatures = 12;
        this.mobileMetrics.crossCompatibility = 95;

        outputContent.innerHTML = `
<div class="cross-platform-app">
    <h4>🔄 Cross-Platform App Deployed</h4>
    <div class="platform-comparison">
        <div class="platform-card">
            <div class="platform-header">
                <span class="platform-icon">📱</span>
                <span class="platform-name">Mobile</span>
            </div>
            <div class="platform-features">
                <div class="feature-item">React Native</div>
                <div class="feature-item">Flutter</div>
                <div class="feature-item">PWA</div>
            </div>
        </div>
        
        <div class="platform-card">
            <div class="platform-header">
                <span class="platform-icon">💻</span>
                <span class="platform-name">Desktop</span>
            </div>
            <div class="platform-features">
                <div class="feature-item">Electron</div>
                <div class="feature-item">Tauri</div>
                <div class="feature-item">Web App</div>
            </div>
        </div>
        
        <div class="platform-card">
            <div class="platform-header">
                <span class="platform-icon">🌐</span>
                <span class="platform-name">Web</span>
            </div>
            <div class="platform-features">
                <div class="feature-item">React</div>
                <div class="feature-item">Vue</div>
                <div class="feature-item">Angular</div>
            </div>
        </div>
    </div>
    
    <div class="cross-platform-features">
        <h5>🎯 Cross-Platform Features:</h5>
        <div class="feature-badges">
            <span class="mobile-platform">Code Sharing: 80%</span>
            <span class="mobile-platform">Platform APIs: 12</span>
            <span class="mobile-platform">Unified Workflow</span>
            <span class="mobile-platform">Shared State</span>
            <span class="mobile-platform">Testing Suite</span>
        </div>
    </div>
    
    <div class="compatibility-metrics">
        <div class="performance-metrics">
            <div class="performance-metric">
                <div class="metric-title">Platforms</div>
                <div class="metric-value">6</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Features</div>
                <div class="metric-value">12</div>
            </div>
            <div class="performance-metric">
                <div class="metric-title">Compatibility</div>
                <div class="metric-value">95%</div>
            </div>
        </div>
    </div>
    
    <div class="platform-statuses">
        <span class="platform-status platform-running">Platform: Multi-Platform</span>
        <span class="platform-status platform-running">Features: 12</span>
        <span class="platform-status platform-running">Compatibility: 95%</span>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    markExerciseComplete(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        exercise.completed = true;
        
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const statusElement = card.querySelector('.exercise-status');
        
        card.classList.add('completed');
        statusElement.innerHTML = '<i class="fas fa-circle status-completed"></i><span>Completed</span>';
        
        // Add success animation
        card.classList.add('success-animation');
        setTimeout(() => {
            card.classList.remove('success-animation');
        }, 600);
        
        this.saveProgress();
    }

    updateMetricsDisplay() {
        // Update React Native metrics
        document.getElementById('rnComponents').textContent = this.mobileMetrics.rnComponents;
        document.getElementById('rnScreens').textContent = this.mobileMetrics.rnScreens;
        document.getElementById('rnPlatform').textContent = this.mobileMetrics.rnPlatform;

        // Update Flutter metrics
        document.getElementById('flutterWidgets').textContent = this.mobileMetrics.flutterWidgets;
        document.getElementById('flutterScreens').textContent = this.mobileMetrics.flutterScreens;
        document.getElementById('flutterPlatform').textContent = this.mobileMetrics.flutterPlatform;

        // Update PWA metrics
        document.getElementById('pwaSwStatus').textContent = this.mobileMetrics.pwaSwStatus;
        document.getElementById('pwaManifestStatus').textContent = this.mobileMetrics.pwaManifestStatus;
        document.getElementById('pwaInstallable').textContent = this.mobileMetrics.pwaInstallable;

        // Update mobile optimization metrics
        document.getElementById('mobileFps').textContent = this.mobileMetrics.mobileFps;
        document.getElementById('mobileMemory').textContent = `${this.mobileMetrics.mobileMemory} MB`;
        document.getElementById('mobileDevice').textContent = this.mobileMetrics.mobileDevice;

        // Update cross-platform metrics
        document.getElementById('crossPlatform').textContent = this.mobileMetrics.crossPlatform;
        document.getElementById('crossFeatures').textContent = this.mobileMetrics.crossFeatures;
        document.getElementById('crossCompatibility').textContent = `${this.mobileMetrics.crossCompatibility}%`;
    }

    updateProgressDisplay() {
        const completedCount = this.exercises.filter(ex => ex.completed).length;
        const totalCount = this.exercises.length;
        const percentage = (completedCount / totalCount) * 100;

        // Update progress bar
        const progressFill = document.getElementById('overallProgress');
        progressFill.style.width = `${percentage}%`;

        // Update progress text
        const progressText = document.querySelector('.progress-text');
        progressText.textContent = `${completedCount}/${totalCount} Complete`;

        // Enable/disable complete button
        const completeBtn = document.getElementById('completeBtn');
        completeBtn.disabled = completedCount < totalCount;
    }

    completeLevel() {
        if (this.exercises.every(ex => ex.completed)) {
            // Show completion animation
            this.showCompletionAnimation();
            
            // Update local storage
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(22)) {
                completedLevels.push(22);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            // Update progress
            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 22).toString());

            // Show success message
            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 22: Mobile Development!\n\nYou\'ve mastered:\n• React Native fundamentals and components\n• Flutter development with widgets\n• Progressive Web Apps (PWA)\n• Mobile optimization techniques\n• Cross-platform development strategies');
                
                // Redirect to main hub
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        // Create mobile device confetti effect
        for (let i = 0; i < 25; i++) {
            const device = document.createElement('div');
            device.style.position = 'absolute';
            device.style.width = '20px';
            device.style.height = '30px';
            device.style.backgroundColor = ['#007AFF', '#34C759', '#FF3B30', '#61DAFB'][Math.floor(Math.random() * 4)];
            device.style.left = Math.random() * 100 + '%';
            device.style.top = '-30px';
            device.style.borderRadius = '10px';
            device.style.animation = `deviceFall ${Math.random() * 2 + 2}s linear forwards`;
            device.style.opacity = '0.8';
            container.appendChild(device);

            setTimeout(() => device.remove(), 4000);
        }

        // Add device animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes deviceFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            // Reset UI
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            // Clear outputs
            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            // Reset metrics
            this.mobileMetrics = {
                rnComponents: 0,
                rnScreens: 0,
                rnPlatform: 'iOS/Android',
                flutterWidgets: 0,
                flutterScreens: 0,
                flutterPlatform: 'iOS/Android',
                pwaSwStatus: 'Not Registered',
                pwaManifestStatus: 'Not Loaded',
                pwaInstallable: 'No',
                mobileFps: 60,
                mobileMemory: 0,
                mobileDevice: 'Mobile',
                crossPlatform: 'Web',
                crossFeatures: 0,
                crossCompatibility: 100
            };

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level22Progress', JSON.stringify({
            exercises: this.exercises,
            mobileMetrics: this.mobileMetrics
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level22Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.mobileMetrics = data.mobileMetrics || this.mobileMetrics;
            
            // Update UI based on saved progress
            this.exercises.forEach((exercise, index) => {
                if (exercise.completed) {
                    const card = document.querySelector(`[data-exercise="${index + 1}"]`);
                    if (card) {
                        card.classList.add('completed');
                        const statusElement = card.querySelector('.exercise-status');
                        statusElement.innerHTML = '<i class="fas fa-circle status-completed"></i><span>Completed</span>';
                    }
                }
            });
        }
    }
}

// Global functions for HTML onclick handlers
function runExercise(exerciseId) {
    if (window.mobileLevel) {
        window.mobileLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.mobileLevel) {
        window.mobileLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.mobileLevel) {
        window.mobileLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mobileLevel = new MobileDevelopmentLevel();
});

// Add additional CSS for the dynamic content
const additionalStyles = `
<style>
.feature-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.feature-badges .mobile-platform {
    background: rgba(0, 122, 255, 0.1);
    color: var(--primary-color);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    border: 1px solid rgba(0, 122, 255, 0.3);
}

.react-native {
    background: rgba(97, 218, 251, 0.1);
    color: var(--react-color);
    border-color: rgba(97, 218, 251, 0.3);
}

.flutter {
    background: rgba(2, 86, 155, 0.1);
    color: var(--flutter-color);
    border-color: rgba(2, 86, 155, 0.3);
}

.pwa {
    background: rgba(255, 107, 53, 0.1);
    color: var(--pwa-color);
    border-color: rgba(255, 107, 53, 0.3);
}

.platform-statuses {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
}

.platform-status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 2px;
}

.platform-running {
    background: rgba(40, 167, 69, 0.1);
    color: var(--success-color);
    border: 1px solid rgba(40, 167, 69, 0.3);
}

.platform-stopped {
    background: rgba(220, 53, 69, 0.1);
    color: var(--error-color);
    border: 1px solid rgba(220, 53, 69, 0.3);
}

.platform-pending {
    background: rgba(255, 193, 7, 0.1);
    color: var(--warning-color);
    border: 1px solid rgba(255, 193, 7, 0.3);
}

.todo-list {
    margin-top: 15px;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    background: var(--surface-color);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.todo-item input[type="checkbox"] {
    margin-right: 10px;
}

.todo-item span {
    flex: 1;
    color: var(--text-primary);
}

.performance-display {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
}

.perf-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--surface-color);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.perf-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.perf-value {
    color: var(--accent-color);
    font-weight: bold;
}

.platform-comparison {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 15px 0;
}

.platform-card {
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    text-align: center;
}

.platform-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 15px;
}

.platform-icon {
    font-size: 1.5rem;
}

.platform-name {
    font-weight: bold;
    color: var(--text-primary);
}

.platform-features {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.feature-item {
    background: rgba(0, 122, 255, 0.1);
    color: var(--primary-color);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    border: 1px solid rgba(0, 122, 255, 0.3);
}

.compatibility-metrics {
    margin: 15px 0;
}

@media (max-width: 768px) {
    .platform-comparison {
        grid-template-columns: 1fr;
    }
    
    .platform-statuses {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .performance-metrics {
        grid-template-columns: 1fr;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

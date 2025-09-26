// Level 47: Advanced Backend Development - Interactive Script

class Level47Manager {
    constructor() {
        this.exercises = {
            1: { completed: false, code: '', output: '' },
            2: { completed: false, code: '', output: '' },
            3: { completed: false, code: '', output: '' },
            4: { completed: false, code: '', output: '' },
            5: { completed: false, code: '', output: '' }
        };
        this.currentExercise = 1;
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.updateUI();
        this.setupCodeEditors();
    }

    setupEventListeners() {
        // Code input change listeners
        for (let i = 1; i <= 5; i++) {
            const codeInput = document.getElementById(`code${i}`);
            if (codeInput) {
                codeInput.addEventListener('input', (e) => {
                    this.exercises[i].code = e.target.value;
                    this.saveProgress();
                });
            }
        }

        // Badge click listeners
        document.querySelectorAll('.badge').forEach((badge, index) => {
            badge.addEventListener('click', () => {
                this.showBadgeInfo(index + 1);
            });
        });
    }

    setupCodeEditors() {
        // Initialize code editors with syntax highlighting
        for (let i = 1; i <= 5; i++) {
            const codeInput = document.getElementById(`code${i}`);
            if (codeInput) {
                // Add line numbers
                this.addLineNumbers(codeInput);
                
                // Add auto-completion hints
                this.addAutoCompletion(codeInput, i);
            }
        }
    }

    addLineNumbers(textarea) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        
        const lineNumbers = document.createElement('div');
        lineNumbers.style.position = 'absolute';
        lineNumbers.style.left = '0';
        lineNumbers.style.top = '0';
        lineNumbers.style.width = '40px';
        lineNumbers.style.height = '100%';
        lineNumbers.style.backgroundColor = '#1e293b';
        lineNumbers.style.color = '#94a3b8';
        lineNumbers.style.fontFamily = 'Fira Code, Monaco, Consolas, monospace';
        lineNumbers.style.fontSize = '0.9rem';
        lineNumbers.style.lineHeight = '1.5';
        lineNumbers.style.padding = '1.5rem 0.5rem';
        lineNumbers.style.borderRight = '1px solid #475569';
        lineNumbers.style.userSelect = 'none';
        
        textarea.style.paddingLeft = '50px';
        textarea.parentNode.insertBefore(wrapper, textarea);
        wrapper.appendChild(lineNumbers);
        wrapper.appendChild(textarea);
        
        const updateLineNumbers = () => {
            const lines = textarea.value.split('\n').length;
            lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
        };
        
        textarea.addEventListener('input', updateLineNumbers);
        updateLineNumbers();
    }

    addAutoCompletion(textarea, exerciseNumber) {
        const completions = this.getAutoCompletions(exerciseNumber);
        
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab(textarea);
            }
        });

        // Add placeholder text that shows on focus
        textarea.addEventListener('focus', () => {
            if (!textarea.value.trim()) {
                textarea.placeholder = this.getPlaceholderText(exerciseNumber);
            }
        });
    }

    getAutoCompletions(exerciseNumber) {
        const completions = {
            1: ['registerService', 'discoverService', 'loadBalance', 'circuitBreaker', 'APIGateway', 'ServiceRegistry'],
            2: ['getConnection', 'optimizeQuery', 'createIndex', 'cacheQuery', 'monitorPerformance', 'ConnectionPool'],
            3: ['defineRoute', 'use', 'version', 'rateLimit', 'authenticate', 'RateLimiter', 'AuthManager'],
            4: ['deployFunction', 'handleEvent', 'optimizeColdStart', 'autoScale', 'manageResources', 'EventBus'],
            5: ['implementCQRS', 'implementEventSourcing', 'implementSaga', 'publishDomainEvent', 'CommandBus', 'QueryBus']
        };
        return completions[exerciseNumber] || [];
    }

    getPlaceholderText(exerciseNumber) {
        const placeholders = {
            1: '// Implement microservices architecture patterns\n// Focus on service registration, discovery, and load balancing',
            2: '// Implement database optimization techniques\n// Focus on connection pooling, query optimization, and caching',
            3: '// Implement API design patterns\n// Focus on RESTful design, versioning, and authentication',
            4: '// Implement serverless computing patterns\n// Focus on event-driven architecture and resource management',
            5: '// Implement advanced backend patterns\n// Focus on CQRS, Event Sourcing, and Saga patterns'
        };
        return placeholders[exerciseNumber] || '';
    }

    insertTab(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        
        textarea.value = value.substring(0, start) + '    ' + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
    }

    runExercise(exerciseNumber) {
        const code = document.getElementById(`code${exerciseNumber}`).value;
        const output = document.getElementById(`output${exerciseNumber}`);
        
        if (!code.trim()) {
            this.showOutput(output, 'Please write some code before running the exercise.', 'warning');
            return;
        }

        try {
            // Simulate code execution with validation
            const result = this.validateExercise(exerciseNumber, code);
            this.showOutput(output, result.message, result.type);
            
            if (result.type === 'success') {
                this.completeExercise(exerciseNumber);
            }
        } catch (error) {
            this.showOutput(output, `Error: ${error.message}`, 'error');
        }
    }

    validateExercise(exerciseNumber, code) {
        const validations = {
            1: this.validateMicroservicesArchitecture,
            2: this.validateDatabaseOptimization,
            3: this.validateAPIDesign,
            4: this.validateServerlessComputing,
            5: this.validateAdvancedBackendPatterns
        };

        const validator = validations[exerciseNumber];
        if (validator) {
            return validator(code);
        }
        
        return { type: 'error', message: 'Unknown exercise' };
    }

    validateMicroservicesArchitecture(code) {
        const requiredPatterns = [
            'registerService',
            'discoverService',
            'loadBalance',
            'circuitBreaker',
            'ServiceRegistry',
            'APIGateway'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 4) {
            return {
                type: 'success',
                message: `✅ Microservices Architecture Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- Service registration and discovery\n- Load balancing strategies\n- Circuit breaker pattern\n- API Gateway implementation\n- Service registry management\n\nYour microservices architecture is ready for production!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing patterns to complete the exercise.`
            };
        }
    }

    validateDatabaseOptimization(code) {
        const requiredPatterns = [
            'getConnection',
            'optimizeQuery',
            'createIndex',
            'cacheQuery',
            'monitorPerformance',
            'ConnectionPool'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 4) {
            return {
                type: 'success',
                message: `✅ Database Optimization Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- Connection pooling management\n- Query optimization strategies\n- Index creation and management\n- Query caching implementation\n- Performance monitoring\n\nYour database is optimized for high performance!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing optimization patterns.`
            };
        }
    }

    validateAPIDesign(code) {
        const requiredPatterns = [
            'defineRoute',
            'use',
            'version',
            'rateLimit',
            'authenticate',
            'RateLimiter',
            'AuthManager'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 4) {
            return {
                type: 'success',
                message: `✅ API Design Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- RESTful route definition\n- Middleware system\n- API versioning strategies\n- Rate limiting implementation\n- Authentication management\n\nYour API is well-designed and production-ready!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing API design patterns.`
            };
        }
    }

    validateServerlessComputing(code) {
        const requiredPatterns = [
            'deployFunction',
            'handleEvent',
            'optimizeColdStart',
            'autoScale',
            'manageResources',
            'EventBus'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 4) {
            return {
                type: 'success',
                message: `✅ Serverless Computing Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- Function deployment management\n- Event-driven architecture\n- Cold start optimization\n- Auto-scaling implementation\n- Resource management\n\nYour serverless platform is ready for production!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing serverless patterns.`
            };
        }
    }

    validateAdvancedBackendPatterns(code) {
        const requiredPatterns = [
            'implementCQRS',
            'implementEventSourcing',
            'implementSaga',
            'publishDomainEvent',
            'CommandBus',
            'QueryBus',
            'EventStore'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 5) {
            return {
                type: 'success',
                message: `✅ Advanced Backend Patterns Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- CQRS pattern implementation\n- Event Sourcing architecture\n- Saga pattern for distributed transactions\n- Domain event publishing\n- Command and Query bus separation\n- Event store management\n\nYou've mastered advanced backend patterns!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing advanced patterns.`
            };
        }
    }

    showOutput(outputElement, message, type) {
        outputElement.textContent = message;
        outputElement.className = `output ${type}`;
        
        // Add animation
        outputElement.style.opacity = '0';
        setTimeout(() => {
            outputElement.style.opacity = '1';
            outputElement.style.transition = 'opacity 0.3s ease';
        }, 10);
    }

    completeExercise(exerciseNumber) {
        if (this.exercises[exerciseNumber].completed) return;

        this.exercises[exerciseNumber].completed = true;
        
        // Update UI
        const statusElement = document.getElementById(`status${exerciseNumber}`);
        const exerciseCard = document.getElementById(`exercise${exerciseNumber}`);
        const badge = document.getElementById(`badge${exerciseNumber}`);

        if (statusElement) {
            statusElement.classList.add('completed');
            statusElement.innerHTML = '<i class="fas fa-check"></i>';
        }

        if (exerciseCard) {
            exerciseCard.classList.add('completed');
        }

        if (badge) {
            badge.classList.add('earned');
        }

        // Show completion animation
        this.showCompletionAnimation(exerciseNumber);

        // Save progress
        this.saveProgress();
        this.updateUI();

        // Check if all exercises are complete
        if (this.isLevelComplete()) {
            this.completeLevel();
        }
    }

    showCompletionAnimation(exerciseNumber) {
        const exerciseCard = document.getElementById(`exercise${exerciseNumber}`);
        if (exerciseCard) {
            exerciseCard.classList.add('bounce-in');
            setTimeout(() => {
                exerciseCard.classList.remove('bounce-in');
            }, 600);
        }
    }

    isLevelComplete() {
        return Object.values(this.exercises).every(exercise => exercise.completed);
    }

    completeLevel() {
        // Show level completion message
        setTimeout(() => {
            alert('🎉 Congratulations! You have completed Level 47: Advanced Backend Development!\n\nYou have mastered:\n- Microservices Architecture\n- Database Optimization\n- API Design\n- Serverless Computing\n- Advanced Backend Patterns\n\nYour backend development skills are now at an expert level!');
        }, 1000);

        // Update progress in main hub
        this.updateMainHubProgress();
    }

    updateMainHubProgress() {
        const progress = localStorage.getItem('frontendMasteryProgress');
        if (progress) {
            const progressData = JSON.parse(progress);
            progressData.level47 = {
                completed: true,
                completedAt: new Date().toISOString(),
                exercises: this.exercises
            };
            localStorage.setItem('frontendMasteryProgress', JSON.stringify(progressData));
        }
    }

    updateUI() {
        const completedCount = Object.values(this.exercises).filter(ex => ex.completed).length;
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (progressFill) {
            progressFill.style.width = `${(completedCount / 5) * 100}%`;
        }

        if (progressText) {
            progressText.textContent = `${completedCount}/5 Complete`;
        }
    }

    saveProgress() {
        const progress = {
            level47: {
                exercises: this.exercises,
                lastUpdated: new Date().toISOString()
            }
        };

        localStorage.setItem('frontendMasteryProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const progress = localStorage.getItem('frontendMasteryProgress');
        if (progress) {
            try {
                const progressData = JSON.parse(progress);
                if (progressData.level47 && progressData.level47.exercises) {
                    this.exercises = { ...this.exercises, ...progressData.level47.exercises };
                    
                    // Update UI based on loaded progress
                    Object.keys(this.exercises).forEach(exerciseNumber => {
                        if (this.exercises[exerciseNumber].completed) {
                            const statusElement = document.getElementById(`status${exerciseNumber}`);
                            const exerciseCard = document.getElementById(`exercise${exerciseNumber}`);
                            const badge = document.getElementById(`badge${exerciseNumber}`);

                            if (statusElement) {
                                statusElement.classList.add('completed');
                                statusElement.innerHTML = '<i class="fas fa-check"></i>';
                            }

                            if (exerciseCard) {
                                exerciseCard.classList.add('completed');
                            }

                            if (badge) {
                                badge.classList.add('earned');
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        }
    }

    showBadgeInfo(badgeNumber) {
        const badgeInfo = {
            1: {
                title: 'Microservices Architecture',
                description: 'Mastered service decomposition, API Gateway patterns, and distributed system design.',
                icon: 'fas fa-cubes'
            },
            2: {
                title: 'Database Optimization',
                description: 'Expert in query optimization, indexing strategies, and performance tuning.',
                icon: 'fas fa-database'
            },
            3: {
                title: 'API Design',
                description: 'Skilled in RESTful API design, versioning, and authentication patterns.',
                icon: 'fas fa-code'
            },
            4: {
                title: 'Serverless Computing',
                description: 'Proficient in event-driven architecture and serverless function optimization.',
                icon: 'fas fa-cloud'
            },
            5: {
                title: 'Backend Master',
                description: 'Expert in advanced backend patterns including CQRS, Event Sourcing, and Saga patterns.',
                icon: 'fas fa-crown'
            }
        };

        const info = badgeInfo[badgeNumber];
        if (info) {
            alert(`${info.title}\n\n${info.description}`);
        }
    }
}

// Global function for running exercises
function runExercise(exerciseNumber) {
    if (window.level47Manager) {
        window.level47Manager.runExercise(exerciseNumber);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.level47Manager = new Level47Manager();
});

// Add some helpful utility functions
window.backendUtils = {
    // Generate sample microservice configuration
    generateMicroserviceConfig: () => {
        return {
            name: 'user-service',
            port: 3001,
            dependencies: ['auth-service', 'notification-service'],
            endpoints: ['/users', '/users/:id', '/users/:id/profile'],
            healthCheck: '/health',
            version: '1.0.0'
        };
    },

    // Generate sample database query
    generateOptimizedQuery: () => {
        return {
            query: 'SELECT u.id, u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id WHERE u.active = true',
            indexes: ['users(active)', 'posts(user_id)'],
            executionTime: '2.3ms',
            optimization: 'Index scan on users.active, hash join with posts'
        };
    },

    // Generate sample API endpoint
    generateAPIEndpoint: () => {
        return {
            method: 'GET',
            path: '/api/v1/users/:id',
            headers: { 'Authorization': 'Bearer <token>' },
            response: { 'id': 123, 'name': 'John Doe', 'email': 'john@example.com' },
            statusCode: 200
        };
    },

    // Generate sample serverless function
    generateServerlessFunction: () => {
        return {
            name: 'process-payment',
            runtime: 'nodejs18.x',
            memory: '256MB',
            timeout: '30s',
            events: ['payment.created', 'payment.updated'],
            environment: { 'STRIPE_KEY': 'sk_test_...' }
        };
    },

    // Generate sample CQRS command
    generateCQRSCommand: () => {
        return {
            type: 'CreateUserCommand',
            payload: { 'name': 'Jane Doe', 'email': 'jane@example.com' },
            handler: 'UserCommandHandler',
            validation: ['name.required', 'email.valid']
        };
    }
};

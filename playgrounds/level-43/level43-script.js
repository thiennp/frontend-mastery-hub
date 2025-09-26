// Level 43: Advanced Security Patterns - Interactive Script

class Level43Manager {
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
        lineNumbers.style.backgroundColor = '#1a1616';
        lineNumbers.style.color = '#94a3b8';
        lineNumbers.style.fontFamily = 'Fira Code, Monaco, Consolas, monospace';
        lineNumbers.style.fontSize = '0.9rem';
        lineNumbers.style.lineHeight = '1.5';
        lineNumbers.style.padding = '1.5rem 0.5rem';
        lineNumbers.style.borderRight = '1px solid #4a3a3a';
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
            1: ['verifyAccess', 'enforceLeastPrivilege', 'createMicroSegment', 'monitorAccess', 'assessRisk', 'IdentityProvider', 'AccessController'],
            2: ['performSTRIDEAnalysis', 'analyzeAttackSurface', 'profileThreatActors', 'assessVulnerabilities', 'mitigateRisks', 'STRIDEAnalysis', 'AttackSurfaceAnalysis'],
            3: ['detectThreats', 'respondToThreat', 'monitorCompliance', 'enforcePolicies', 'automateIncidentResponse', 'ThreatDetector', 'ResponseOrchestrator'],
            4: ['detectIncident', 'analyzeIncident', 'containIncident', 'eradicateThreat', 'recoverSystem', 'IncidentDetector', 'IncidentAnalyzer'],
            5: ['implementDefenseInDepth', 'implementSecurityByDesign', 'implementAdaptiveSecurity', 'orchestrateSecurity', 'integrateThreatIntelligence', 'DefenseInDepth', 'SecurityByDesign']
        };
        return completions[exerciseNumber] || [];
    }

    getPlaceholderText(exerciseNumber) {
        const placeholders = {
            1: '// Implement Zero Trust Architecture\n// Focus on continuous verification and least privilege access',
            2: '// Implement Threat Modeling\n// Focus on STRIDE analysis and attack surface identification',
            3: '// Implement Security Automation\n// Focus on automated threat detection and response orchestration',
            4: '// Implement Incident Response\n// Focus on detection, analysis, containment, and recovery',
            5: '// Implement Advanced Security Patterns\n// Focus on defense in depth and security by design'
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
            1: this.validateZeroTrustArchitecture,
            2: this.validateThreatModeling,
            3: this.validateSecurityAutomation,
            4: this.validateIncidentResponse,
            5: this.validateAdvancedSecurityPatterns
        };

        const validator = validations[exerciseNumber];
        if (validator) {
            return validator(code);
        }
        
        return { type: 'error', message: 'Unknown exercise' };
    }

    validateZeroTrustArchitecture(code) {
        const requiredPatterns = [
            'verifyAccess',
            'enforceLeastPrivilege',
            'createMicroSegment',
            'monitorAccess',
            'assessRisk',
            'IdentityProvider',
            'AccessController'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 5) {
            return {
                type: 'success',
                message: `✅ Zero Trust Architecture Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- Continuous verification and authentication\n- Least privilege access enforcement\n- Micro-segmentation implementation\n- Continuous monitoring and analytics\n- Risk assessment and management\n- Identity and access management\n- Network segmentation controls\n\nYour Zero Trust Architecture is secure and production-ready!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing Zero Trust patterns to complete the exercise.`
            };
        }
    }

    validateThreatModeling(code) {
        const requiredPatterns = [
            'performSTRIDEAnalysis',
            'analyzeAttackSurface',
            'profileThreatActors',
            'assessVulnerabilities',
            'mitigateRisks',
            'STRIDEAnalysis',
            'AttackSurfaceAnalysis'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 5) {
            return {
                type: 'success',
                message: `✅ Threat Modeling Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- STRIDE threat modeling methodology\n- Attack surface identification and analysis\n- Threat actor profiling and assessment\n- Vulnerability assessment and management\n- Risk mitigation strategies\n- Comprehensive threat analysis\n- Security risk evaluation\n\nYour threat modeling system is comprehensive and effective!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing threat modeling patterns.`
            };
        }
    }

    validateSecurityAutomation(code) {
        const requiredPatterns = [
            'detectThreats',
            'respondToThreat',
            'monitorCompliance',
            'enforcePolicies',
            'automateIncidentResponse',
            'ThreatDetector',
            'ResponseOrchestrator'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 5) {
            return {
                type: 'success',
                message: `✅ Security Automation Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- Automated threat detection and response\n- Security orchestration and automation\n- Compliance monitoring and reporting\n- Security policy enforcement\n- Incident response automation\n- Machine learning-based detection\n- Automated remediation workflows\n\nYour security automation system is advanced and efficient!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing security automation patterns.`
            };
        }
    }

    validateIncidentResponse(code) {
        const requiredPatterns = [
            'detectIncident',
            'analyzeIncident',
            'containIncident',
            'eradicateThreat',
            'recoverSystem',
            'IncidentDetector',
            'IncidentAnalyzer'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 5) {
            return {
                type: 'success',
                message: `✅ Incident Response Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- Incident detection and classification\n- Incident analysis and investigation\n- Containment and isolation procedures\n- Threat eradication and removal\n- System recovery and restoration\n- Forensic analysis and evidence collection\n- Post-incident analysis and lessons learned\n\nYour incident response system is comprehensive and effective!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing incident response patterns.`
            };
        }
    }

    validateAdvancedSecurityPatterns(code) {
        const requiredPatterns = [
            'implementDefenseInDepth',
            'implementSecurityByDesign',
            'implementAdaptiveSecurity',
            'orchestrateSecurity',
            'integrateThreatIntelligence',
            'DefenseInDepth',
            'SecurityByDesign',
            'AdaptiveSecurity'
        ];

        const foundPatterns = requiredPatterns.filter(pattern => 
            code.includes(pattern)
        );

        if (foundPatterns.length >= 6) {
            return {
                type: 'success',
                message: `✅ Advanced Security Patterns Implementation Complete!\n\nImplemented patterns: ${foundPatterns.join(', ')}\n\nKey Features:\n- Defense in depth strategies\n- Security by design principles\n- Adaptive security architectures\n- Security orchestration and automation\n- Threat intelligence integration\n- Advanced security governance\n- Comprehensive security metrics\n\nYou've mastered advanced security patterns!`
            };
        } else {
            return {
                type: 'warning',
                message: `⚠️ Partial Implementation Detected\n\nFound patterns: ${foundPatterns.join(', ') || 'None'}\nMissing patterns: ${requiredPatterns.filter(p => !foundPatterns.includes(p)).join(', ')}\n\nTry implementing the missing advanced security patterns.`
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
            alert('🎉 Congratulations! You have completed Level 43: Advanced Security Patterns!\n\nYou have mastered:\n- Zero Trust Architecture\n- Threat Modeling\n- Security Automation\n- Incident Response\n- Advanced Security Patterns\n\nYour security expertise is now at an expert level!');
        }, 1000);

        // Update progress in main hub
        this.updateMainHubProgress();
    }

    updateMainHubProgress() {
        const progress = localStorage.getItem('frontendMasteryProgress');
        if (progress) {
            const progressData = JSON.parse(progress);
            progressData.level43 = {
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
            level43: {
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
                if (progressData.level43 && progressData.level43.exercises) {
                    this.exercises = { ...this.exercises, ...progressData.level43.exercises };
                    
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
                title: 'Zero Trust Architecture',
                description: 'Mastered continuous verification, least privilege access, and micro-segmentation.',
                icon: 'fas fa-shield-virus'
            },
            2: {
                title: 'Threat Modeling',
                description: 'Expert in STRIDE methodology, attack surface analysis, and threat actor profiling.',
                icon: 'fas fa-search'
            },
            3: {
                title: 'Security Automation',
                description: 'Skilled in automated threat detection, response orchestration, and compliance monitoring.',
                icon: 'fas fa-robot'
            },
            4: {
                title: 'Incident Response',
                description: 'Proficient in incident detection, analysis, containment, and recovery procedures.',
                icon: 'fas fa-exclamation-triangle'
            },
            5: {
                title: 'Security Master',
                description: 'Expert in advanced security patterns including defense in depth and security by design.',
                icon: 'fas fa-lock'
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
    if (window.level43Manager) {
        window.level43Manager.runExercise(exerciseNumber);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.level43Manager = new Level43Manager();
});

// Add some helpful utility functions
window.securityUtils = {
    // Generate sample Zero Trust configuration
    generateZeroTrustConfig: () => {
        return {
            identityProvider: 'Azure AD',
            accessController: 'Policy Engine',
            networkSegmentation: 'Micro-segments',
            monitoringSystem: 'SIEM',
            policyEngine: 'Dynamic Policies',
            verificationLevel: 'Continuous',
            trustScore: 'Risk-based'
        };
    },

    // Generate sample threat model
    generateThreatModel: () => {
        return {
            system: 'E-commerce Platform',
            threats: ['SQL Injection', 'XSS', 'CSRF', 'Privilege Escalation'],
            attackVectors: ['Web Interface', 'API Endpoints', 'Database'],
            vulnerabilities: ['Input Validation', 'Authentication', 'Authorization'],
            mitigations: ['Input Sanitization', 'MFA', 'RBAC']
        };
    },

    // Generate sample security automation config
    generateSecurityAutomationConfig: () => {
        return {
            threatDetector: 'ML-based Detection',
            responseOrchestrator: 'SOAR Platform',
            complianceMonitor: 'Continuous Monitoring',
            policyEnforcer: 'Automated Enforcement',
            incidentResponder: 'Automated Playbooks'
        };
    },

    // Generate sample incident response plan
    generateIncidentResponsePlan: () => {
        return {
            detection: 'Automated Monitoring',
            analysis: 'Forensic Investigation',
            containment: 'System Isolation',
            eradication: 'Threat Removal',
            recovery: 'System Restoration',
            lessonsLearned: 'Post-Incident Review'
        };
    },

    // Generate sample security pattern
    generateSecurityPattern: () => {
        return {
            defenseInDepth: 'Multiple Security Layers',
            securityByDesign: 'Built-in Security',
            adaptiveSecurity: 'Context-Aware',
            securityOrchestration: 'Automated Workflows',
            threatIntelligence: 'Real-time Feeds'
        };
    }
};

// Level 33: Security & Authentication Script

// Exercise validation patterns
const exercisePatterns = {
    1: {
        required: ['OAuth2Provider', 'OAuth2Client', 'generateAuthUrl', 'exchangeCodeForToken'],
        description: 'OAuth 2.0 Implementation'
    },
    2: {
        required: ['JWTManager', 'SecureTokenStorage', 'AuthenticationService', 'createToken', 'verifyToken'],
        description: 'JWT Token Management'
    },
    3: {
        required: ['PasswordSecurity', 'PasswordPolicyManager', 'validatePassword', 'hashPassword'],
        description: 'Password Security'
    },
    4: {
        required: ['SecurityHeadersManager', 'HTTPSEnforcer', 'CORSManager', 'SecurityMonitor'],
        description: 'Security Headers'
    },
    5: {
        required: ['PenetrationTester', 'VulnerabilityScanner', 'scanTarget', 'testSQLInjection'],
        description: 'Penetration Testing'
    }
};

// Initialize level
document.addEventListener('DOMContentLoaded', function() {
    initializeLevel();
    loadProgress();
});

function initializeLevel() {
    // Set up code editors
    for (let i = 1; i <= 5; i++) {
        const textarea = document.getElementById(`code${i}`);
        if (textarea) {
            textarea.addEventListener('input', function() {
                clearOutput(i);
            });
        }
    }
    
    // Initialize progress
    updateProgress();
}

function runCode(exerciseNumber) {
    const code = document.getElementById(`code${exerciseNumber}`).value;
    const output = document.getElementById(`output${exerciseNumber}`);
    
    if (!code.trim()) {
        showOutput(exerciseNumber, 'Please enter some code to run.', 'error');
        return;
    }
    
    try {
        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;
        let outputText = '';
        
        console.log = function(...args) {
            outputText += args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
        };
        
        console.error = function(...args) {
            outputText += 'ERROR: ' + args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
        };
        
        // Execute code
        const result = eval(code);
        
        // Restore console
        console.log = originalLog;
        console.error = originalError;
        
        // Show output
        if (outputText) {
            showOutput(exerciseNumber, outputText, 'success');
        } else if (result !== undefined) {
            showOutput(exerciseNumber, JSON.stringify(result, null, 2), 'success');
        } else {
            showOutput(exerciseNumber, 'Code executed successfully!', 'success');
        }
        
    } catch (error) {
        showOutput(exerciseNumber, `Error: ${error.message}`, 'error');
    }
}

function validateExercise(exerciseNumber) {
    const code = document.getElementById(`code${exerciseNumber}`).value;
    const pattern = exercisePatterns[exerciseNumber];
    
    if (!pattern) {
        showOutput(exerciseNumber, 'Validation pattern not found.', 'error');
        return;
    }
    
    let missing = [];
    let found = [];
    
    // Check for required patterns
    for (const required of pattern.required) {
        if (code.includes(required)) {
            found.push(required);
        } else {
            missing.push(required);
        }
    }
    
    let message = `Validating ${pattern.description}...\n\n`;
    
    if (found.length > 0) {
        message += `✅ Found: ${found.join(', ')}\n`;
    }
    
    if (missing.length > 0) {
        message += `❌ Missing: ${missing.join(', ')}\n`;
    }
    
    if (missing.length === 0) {
        message += `\n🎉 Exercise completed successfully!`;
        markExerciseComplete(exerciseNumber);
        showOutput(exerciseNumber, message, 'success');
    } else {
        message += `\n📝 Please implement the missing components.`;
        showOutput(exerciseNumber, message, 'error');
    }
}

function showOutput(exerciseNumber, message, type = 'success') {
    const output = document.getElementById(`output${exerciseNumber}`);
    output.textContent = message;
    output.className = `output ${type}`;
}

function clearOutput(exerciseNumber) {
    const output = document.getElementById(`output${exerciseNumber}`);
    output.textContent = '';
    output.className = 'output';
}

function markExerciseComplete(exerciseNumber) {
    const exercise = document.getElementById(`exercise${exerciseNumber}`);
    exercise.classList.add('completed');
    
    // Update progress
    updateProgress();
    saveProgress();
}

function updateProgress() {
    const completedExercises = document.querySelectorAll('.exercise.completed').length;
    const progressFill = document.getElementById('progressFill');
    const completedSpan = document.getElementById('completedExercises');
    
    const progress = (completedExercises / 5) * 100;
    progressFill.style.width = `${progress}%`;
    completedSpan.textContent = completedExercises;
    
    // Update badge count
    const badgeCount = document.getElementById('badgeCount');
    badgeCount.textContent = Math.floor(completedExercises / 5) * 10;
}

function saveProgress() {
    const progress = {
        level: 33,
        completedExercises: document.querySelectorAll('.exercise.completed').length,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('level33Progress', JSON.stringify(progress));
    
    // Update main hub progress
    updateMainHubProgress();
}

function loadProgress() {
    const saved = localStorage.getItem('level33Progress');
    if (saved) {
        const progress = JSON.parse(saved);
        
        // Mark completed exercises
        for (let i = 1; i <= progress.completedExercises; i++) {
            markExerciseComplete(i);
        }
    }
}

function updateMainHubProgress() {
    // Update main hub progress if available
    if (typeof updateLevelProgress === 'function') {
        updateLevelProgress(33, document.querySelectorAll('.exercise.completed').length, 5);
    }
}

// Navigation functions
function goToLevel(levelNumber) {
    if (levelNumber < 1 || levelNumber > 200) {
        alert('Invalid level number');
        return;
    }
    
    if (levelNumber === 33) {
        // Already on this level
        return;
    }
    
    // Save current progress before navigating
    saveProgress();
    
    // Navigate to level
    if (levelNumber === 1) {
        window.location.href = '../level-1/index.html';
    } else if (levelNumber <= 32) {
        window.location.href = `../level-${levelNumber}/index.html`;
    } else if (levelNumber === 34) {
        // Next level not implemented yet
        alert('Level 34 is not implemented yet. Stay tuned!');
        return;
    } else {
        window.location.href = `../level-${levelNumber}/index.html`;
    }
}

// Security-specific helper functions
function generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

function hashPassword(password, salt) {
    // Simple hash simulation
    let hash = 0;
    const input = password + salt;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

function validatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    if (score <= 4) return 'strong';
    return 'very-strong';
}

function generateCSPHeader(directives) {
    const cspParts = [];
    for (const [directive, sources] of Object.entries(directives)) {
        cspParts.push(`${directive} ${sources.join(' ')}`);
    }
    return cspParts.join('; ');
}

function simulateSecurityScan(target) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const vulnerabilities = [];
            
            // Simulate random vulnerabilities
            if (Math.random() > 0.7) {
                vulnerabilities.push({
                    type: 'SQL Injection',
                    severity: 'High',
                    description: 'Potential SQL injection vulnerability detected'
                });
            }
            
            if (Math.random() > 0.8) {
                vulnerabilities.push({
                    type: 'XSS',
                    severity: 'Medium',
                    description: 'Cross-site scripting vulnerability detected'
                });
            }
            
            resolve(vulnerabilities);
        }, 2000);
    });
}

function createSecurityHeaders() {
    return {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    };
}

function validateJWTToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }
        
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp < now) {
            throw new Error('Token expired');
        }
        
        return payload;
    } catch (error) {
        throw new Error(`Token validation failed: ${error.message}`);
    }
}

function generateOAuth2AuthUrl(clientId, redirectUri, scope, state) {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
        state: state
    });
    
    return `https://oauth.provider.com/auth?${params.toString()}`;
}

function simulatePasswordBreach(password) {
    const commonPasswords = ['password', '123456', 'admin', 'qwerty'];
    return commonPasswords.includes(password.toLowerCase());
}

function createSecurityReport(vulnerabilities) {
    const severityCounts = { High: 0, Medium: 0, Low: 0 };
    
    vulnerabilities.forEach(vuln => {
        severityCounts[vuln.severity]++;
    });
    
    return {
        totalVulnerabilities: vulnerabilities.length,
        severityCounts,
        riskLevel: severityCounts.High > 0 ? 'Critical' : 
                  severityCounts.Medium > 2 ? 'High' : 
                  severityCounts.Medium > 0 ? 'Medium' : 'Low'
    };
}

function encryptData(data, key) {
    // Simple encryption simulation
    return btoa(data + key);
}

function decryptData(encryptedData, key) {
    // Simple decryption simulation
    try {
        return atob(encryptedData).replace(key, '');
    } catch (error) {
        throw new Error('Decryption failed');
    }
}

function generateSalt() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';
    for (let i = 0; i < 16; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return salt;
}

function validateCSRFToken(token, sessionToken) {
    return token === sessionToken;
}

function generateCSRFToken() {
    return generateSecureToken(32);
}

function checkSecurityHeaders(headers) {
    const requiredHeaders = [
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => !headers[header]);
    
    return {
        secure: missingHeaders.length === 0,
        missingHeaders,
        score: ((requiredHeaders.length - missingHeaders.length) / requiredHeaders.length) * 100
    };
}

// Export functions for global access
window.runCode = runCode;
window.validateExercise = validateExercise;
window.goToLevel = goToLevel;
window.generateSecureToken = generateSecureToken;
window.hashPassword = hashPassword;
window.validatePasswordStrength = validatePasswordStrength;
window.generateCSPHeader = generateCSPHeader;
window.simulateSecurityScan = simulateSecurityScan;
window.createSecurityHeaders = createSecurityHeaders;
window.validateJWTToken = validateJWTToken;
window.generateOAuth2AuthUrl = generateOAuth2AuthUrl;
window.simulatePasswordBreach = simulatePasswordBreach;
window.createSecurityReport = createSecurityReport;
window.encryptData = encryptData;
window.decryptData = decryptData;
window.generateSalt = generateSalt;
window.validateCSRFToken = validateCSRFToken;
window.generateCSRFToken = generateCSRFToken;
window.checkSecurityHeaders = checkSecurityHeaders;

document.addEventListener('DOMContentLoaded', () => {
    // Function to run Web Standards exercise
    window.runWebStandards = () => {
        const code = document.getElementById('web-standards-code').value;
        const output = document.getElementById('web-standards-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Modern Web APIs initialized!\n\nFeatures implemented:\n- Intersection Observer for lazy loading\n- Performance Observer for monitoring\n- Web Workers for background processing\n- Service Worker registration\n\nSimulation: All modern web APIs are ready for use.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run PWA Development exercise
    window.runPWADevelopment = () => {
        const code = document.getElementById('pwa-development-code').value;
        const output = document.getElementById('pwa-development-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ PWA Manager initialized!\n\nFeatures implemented:\n- PWA installation prompts\n- Service Worker registration\n- Push notifications\n- Offline storage and caching\n- Background sync\n\nSimulation: PWA features are ready for deployment.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Web Performance exercise
    window.runWebPerformance = () => {
        const code = document.getElementById('web-performance-code').value;
        const output = document.getElementById('web-performance-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Web Performance Optimizer initialized!\n\nFeatures implemented:\n- Core Web Vitals monitoring\n- Resource optimization\n- Critical CSS extraction\n- Preloading strategies\n- Performance metrics tracking\n\nSimulation: Performance optimization applied - 95+ Lighthouse score achieved.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Advanced CSS exercise
    window.runAdvancedCSS = () => {
        const code = document.getElementById('advanced-css-code').value;
        const output = document.getElementById('advanced-css-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Advanced CSS Manager initialized!\n\nFeatures implemented:\n- Container Queries support\n- CSS Custom Properties management\n- Advanced Grid layouts\n- Responsive typography\n- CSS-in-JS simulation\n\nSimulation: Modern CSS features are ready for use.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Web Security exercise
    window.runWebSecurity = () => {
        const code = document.getElementById('web-security-code').value;
        const output = document.getElementById('web-security-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Web Security Manager initialized!\n\nFeatures implemented:\n- Content Security Policy (CSP)\n- Security headers configuration\n- Input sanitization\n- XSS prevention\n- CSRF protection\n- Secure cookie handling\n\nSimulation: Security measures are active and protecting the application.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Add web development-themed visual effects
    const exerciseSections = document.querySelectorAll('.exercise-section');
    exerciseSections.forEach((section, index) => {
        section.addEventListener('mouseenter', () => {
            section.classList.add('web-animation');
        });
        
        section.addEventListener('mouseleave', () => {
            section.classList.remove('web-animation');
        });
    });

    // Simulate web development processes
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.textContent = '🌐 Processing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = button.textContent.replace('🌐 Processing...', 'Run Code');
                button.disabled = false;
            }, 2000);
        });
    });

    // Add web standards compliance indicators
    const addWebIndicators = () => {
        const sections = document.querySelectorAll('.exercise-section');
        sections.forEach((section, index) => {
            switch(index) {
                case 0:
                    section.classList.add('web-standard-indicator');
                    break;
                case 1:
                    section.classList.add('pwa-indicator');
                    break;
                case 2:
                    section.classList.add('performance-indicator');
                    break;
                case 3:
                    section.classList.add('standards-compliant');
                    break;
                case 4:
                    section.classList.add('security-indicator');
                    break;
            }
        });
    };

    addWebIndicators();

    // Add web development simulation
    const container = document.querySelector('.container');
    const webSimulator = document.createElement('div');
    webSimulator.className = 'web-simulator';
    webSimulator.innerHTML = `
        <div class="browser-window">
            <div class="browser-header">
                <div class="browser-controls">
                    <div class="control close"></div>
                    <div class="control minimize"></div>
                    <div class="control maximize"></div>
                </div>
                <div class="browser-url">https://advanced-web-dev.example.com</div>
            </div>
            <div class="browser-content">
                <div class="web-content">
                    <div class="web-icon">🌐</div>
                    <div class="web-title">Advanced Web App</div>
                    <div class="web-status">PWA Ready</div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(webSimulator);

    // Add CSS for web simulator
    const style = document.createElement('style');
    style.textContent = `
        .web-simulator {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            pointer-events: none;
        }
        
        .browser-window {
            width: 300px;
            height: 200px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .browser-header {
            background: #f5f5f5;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .browser-controls {
            display: flex;
            gap: 4px;
        }
        
        .control {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        
        .control.close { background: #ff5f57; }
        .control.minimize { background: #ffbd2e; }
        .control.maximize { background: #28ca42; }
        
        .browser-url {
            background: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #666;
            flex: 1;
        }
        
        .browser-content {
            padding: 20px;
            text-align: center;
        }
        
        .web-icon {
            font-size: 32px;
            margin-bottom: 8px;
        }
        
        .web-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        
        .web-status {
            font-size: 10px;
            color: #28ca42;
            background: #e8f5e8;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
        }
        
        @keyframes web-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .web-simulator:hover .browser-content {
            animation: web-pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);

    // Add performance monitoring simulation
    const performanceMonitor = {
        startTime: Date.now(),
        measurePerformance: () => {
            const endTime = Date.now();
            const duration = endTime - performanceMonitor.startTime;
            console.log(`Web Performance: ${duration}ms`);
            return duration;
        }
    };
    
    // Monitor performance on page load
    window.addEventListener('load', () => {
        performanceMonitor.measurePerformance();
    });

    // Add web standards detection
    const webStandardsDetector = {
        checkSupport: () => {
            const features = {
                'Service Worker': 'serviceWorker' in navigator,
                'Web Workers': typeof Worker !== 'undefined',
                'Intersection Observer': 'IntersectionObserver' in window,
                'Performance Observer': 'PerformanceObserver' in window,
                'CSS Grid': CSS.supports('display', 'grid'),
                'CSS Flexbox': CSS.supports('display', 'flex'),
                'CSS Custom Properties': CSS.supports('--custom-property', 'value'),
                'Container Queries': CSS.supports('container-type', 'inline-size')
            };
            
            console.log('Web Standards Support:', features);
            return features;
        }
    };
    
    // Check web standards support
    webStandardsDetector.checkSupport();
});

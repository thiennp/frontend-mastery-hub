document.addEventListener('DOMContentLoaded', () => {
    // Function to run React Native Advanced exercise
    window.runReactNativeAdvanced = () => {
        const code = document.getElementById('react-native-advanced-code').value;
        const output = document.getElementById('react-native-advanced-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Advanced React Native Component created!\n\nFeatures implemented:\n- Memoized expensive calculations\n- Optimized list rendering\n- Performance optimizations\n- Memory management\n\nSimulation: Component rendered with 60fps performance.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Cross-Platform State Management exercise
    window.runCrossPlatformState = () => {
        const code = document.getElementById('cross-platform-state-code').value;
        const output = document.getElementById('cross-platform-state-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Cross-Platform State Management configured!\n\nFeatures implemented:\n- Redux store configuration\n- Redux Persist integration\n- AsyncStorage for persistence\n- Combined reducers\n\nSimulation: State management system initialized successfully.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Mobile Performance Optimization exercise
    window.runMobilePerformance = () => {
        const code = document.getElementById('mobile-performance-code').value;
        const output = document.getElementById('mobile-performance-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Mobile Performance Optimizer initialized!\n\nFeatures implemented:\n- Image optimization and caching\n- Lazy loading implementation\n- Memory management\n- Performance monitoring\n\nSimulation: Performance optimization applied - 40% faster load times.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Native Module Integration exercise
    window.runNativeModule = () => {
        const code = document.getElementById('native-module-code').value;
        const output = document.getElementById('native-module-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Native Module Manager initialized!\n\nFeatures implemented:\n- Platform-specific module loading\n- Biometric authentication\n- Camera integration\n- Location services\n\nSimulation: Native modules loaded successfully for iOS/Android.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Function to run Mobile Testing exercise
    window.runMobileTesting = () => {
        const code = document.getElementById('mobile-testing-code').value;
        const output = document.getElementById('mobile-testing-output');
        try {
            const result = eval(code); // DANGER: In a real app, use a secure sandbox!
            output.textContent = `✅ Mobile Test Suite initialized!\n\nFeatures implemented:\n- Unit testing with Jest\n- Integration testing with Detox\n- E2E testing with Appium\n- Test coverage reporting\n\nSimulation: Test suite executed - 95% coverage achieved.`;
            output.style.color = 'green';
        } catch (e) {
            output.textContent = `❌ Error: ${e.message}`;
            output.style.color = 'red';
        }
    };

    // Add mobile-themed visual effects
    const exerciseSections = document.querySelectorAll('.exercise-section');
    exerciseSections.forEach((section, index) => {
        section.addEventListener('mouseenter', () => {
            section.classList.add('mobile-animation');
        });
        
        section.addEventListener('mouseleave', () => {
            section.classList.remove('mobile-animation');
        });
    });

    // Simulate mobile device interactions
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.textContent = '📱 Processing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = button.textContent.replace('📱 Processing...', 'Run Code');
                button.disabled = false;
            }, 2000);
        });
    });

    // Add mobile device simulation
    const container = document.querySelector('.container');
    const mobileSimulator = document.createElement('div');
    mobileSimulator.className = 'mobile-simulator';
    mobileSimulator.innerHTML = `
        <div class="phone-frame">
            <div class="phone-screen">
                <div class="status-bar">
                    <span class="time">9:41</span>
                    <span class="battery">100%</span>
                </div>
                <div class="app-content">
                    <div class="app-icon">📱</div>
                    <div class="app-title">Mobile App</div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(mobileSimulator);

    // Add CSS for mobile simulator
    const style = document.createElement('style');
    style.textContent = `
        .mobile-simulator {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            pointer-events: none;
        }
        
        .phone-frame {
            width: 200px;
            height: 400px;
            background: #000;
            border-radius: 25px;
            padding: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .phone-screen {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            position: relative;
            overflow: hidden;
        }
        
        .status-bar {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .app-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: calc(100% - 40px);
            color: white;
        }
        
        .app-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        
        .app-title {
            font-size: 16px;
            font-weight: bold;
        }
        
        @keyframes mobile-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .mobile-simulator:hover .phone-screen {
            animation: mobile-pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);

    // Add touch gesture simulation
    let touchStartY = 0;
    let touchStartX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaY = touchStartY - touchEndY;
        const deltaX = touchStartX - touchEndX;
        
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 0) {
                console.log('Swipe up detected');
            } else {
                console.log('Swipe down detected');
            }
        } else {
            if (deltaX > 0) {
                console.log('Swipe left detected');
            } else {
                console.log('Swipe right detected');
            }
        }
    });

    // Add performance monitoring
    const performanceMonitor = {
        startTime: Date.now(),
        measurePerformance: () => {
            const endTime = Date.now();
            const duration = endTime - performanceMonitor.startTime;
            console.log(`Performance: ${duration}ms`);
            return duration;
        }
    };
    
    // Monitor performance on page load
    window.addEventListener('load', () => {
        performanceMonitor.measurePerformance();
    });
});

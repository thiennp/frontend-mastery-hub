// Level 27: Advanced CSS & Design Systems Script

class AdvancedCSSLevel {
    constructor() {
        this.exercises = [
            { id: 1, name: 'CSS Grid Mastery', completed: false },
            { id: 2, name: 'Flexbox Advanced', completed: false },
            { id: 3, name: 'CSS Animations', completed: false },
            { id: 4, name: 'Design Tokens', completed: false },
            { id: 5, name: 'Component Libraries', completed: false }
        ];
        this.cssMetrics = {
            gridColumns: 0,
            gridRows: 0,
            gridGap: 0,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            flexItems: 0,
            animationFPS: 60,
            animationDuration: 0,
            animationEasing: 'ease',
            designTokens: 0,
            currentTheme: 'Light',
            componentCount: 0,
            libraryComponents: 0,
            componentVariants: 0,
            reusabilityScore: 0
        };
        this.animations = [];
        this.designTokens = new Map();
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.simulateCSSEnvironment();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        document.querySelectorAll('.exercise-card').forEach(card => {
            const exerciseId = parseInt(card.dataset.exercise);
            const runBtn = card.querySelector('.run-btn');
            runBtn.addEventListener('click', () => this.runExercise(exerciseId));
        });

        document.getElementById('completeBtn').addEventListener('click', () => this.completeLevel());
        document.querySelector('.btn-secondary').addEventListener('click', () => this.resetLevel());
    }

    simulateCSSEnvironment() {
        // Simulate dynamic CSS metrics updates
        setInterval(() => {
            if (Math.random() > 0.6) {
                this.updateRandomCSSMetric();
            }
        }, 5000);
    }

    updateRandomCSSMetric() {
        const metrics = Object.keys(this.cssMetrics);
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
        
        if (randomMetric.includes('Columns') || randomMetric.includes('Rows') || randomMetric.includes('Items') || randomMetric.includes('Tokens') || randomMetric.includes('Components')) {
            this.cssMetrics[randomMetric] = Math.floor(Math.random() * 20) + 5;
        } else if (randomMetric.includes('Gap')) {
            this.cssMetrics[randomMetric] = Math.floor(Math.random() * 20) + 10;
        } else if (randomMetric.includes('FPS')) {
            this.cssMetrics[randomMetric] = Math.floor(Math.random() * 20) + 50;
        } else if (randomMetric.includes('Duration')) {
            this.cssMetrics[randomMetric] = (Math.random() * 3 + 0.5).toFixed(1);
        } else if (randomMetric.includes('Score')) {
            this.cssMetrics[randomMetric] = Math.floor(Math.random() * 30) + 70;
        } else if (randomMetric.includes('Theme')) {
            const themes = ['Light', 'Dark', 'Auto'];
            this.cssMetrics[randomMetric] = themes[Math.floor(Math.random() * themes.length)];
        } else if (randomMetric.includes('Direction')) {
            const directions = ['row', 'column', 'row-reverse', 'column-reverse'];
            this.cssMetrics[randomMetric] = directions[Math.floor(Math.random() * directions.length)];
        } else if (randomMetric.includes('Wrap')) {
            const wraps = ['nowrap', 'wrap', 'wrap-reverse'];
            this.cssMetrics[randomMetric] = wraps[Math.floor(Math.random() * wraps.length)];
        } else if (randomMetric.includes('Easing')) {
            const easings = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
            this.cssMetrics[randomMetric] = easings[Math.floor(Math.random() * easings.length)];
        }
        
        this.updateMetricsDisplay();
    }

    runExercise(exerciseId) {
        const exercise = this.exercises[exerciseId - 1];
        const card = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const outputContent = document.getElementById(`outputContent${exerciseId}`);
        const statusElement = card.querySelector('.exercise-status');
        
        statusElement.innerHTML = '<i class="fas fa-circle status-in-progress"></i><span>Processing CSS...</span>';
        
        setTimeout(() => {
            this.executeCSSExercise(exerciseId, outputContent);
            this.markExerciseComplete(exerciseId);
            this.updateProgressDisplay();
        }, 4000);
    }

    executeCSSExercise(exerciseId, outputContent) {
        switch (exerciseId) {
            case 1:
                this.executeCSSGrid(outputContent);
                break;
            case 2:
                this.executeFlexboxAdvanced(outputContent);
                break;
            case 3:
                this.executeCSSAnimations(outputContent);
                break;
            case 4:
                this.executeDesignTokens(outputContent);
                break;
            case 5:
                this.executeComponentLibraries(outputContent);
                break;
        }
    }

    executeCSSGrid(outputContent) {
        this.cssMetrics.gridColumns = 12;
        this.cssMetrics.gridRows = 8;
        this.cssMetrics.gridGap = 16;

        outputContent.innerHTML = `
<div class="css-grid-demo">
    <h4>📐 CSS Grid Layout Applied</h4>
    
    <div class="grid-demo">
        <div class="grid-item">1</div>
        <div class="grid-item">2</div>
        <div class="grid-item">3</div>
        <div class="grid-item">4</div>
        <div class="grid-item">5</div>
        <div class="grid-item">6</div>
        <div class="grid-item">7</div>
        <div class="grid-item">8</div>
    </div>
    
    <div class="grid-features">
        <h5>🎯 Grid Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="css-result grid-layout">12-Column Grid ✓</span>
            <span class="css-result grid-layout">Auto-fit Columns ✓</span>
            <span class="css-result grid-layout">Named Grid Areas ✓</span>
            <span class="css-result grid-layout">Responsive Breakpoints ✓</span>
        </div>
    </div>
    
    <div class="grid-metrics">
        <h5>📊 Grid Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Columns: ${this.cssMetrics.gridColumns}<br>
            Rows: ${this.cssMetrics.gridRows}<br>
            Gap: ${this.cssMetrics.gridGap}px<br>
            Grid Areas: 4 (header, sidebar, main, footer)<br>
            Responsive Breakpoints: 3 (mobile, tablet, desktop)
        </div>
    </div>
    
    <div class="grid-examples">
        <h5>💡 Grid Use Cases:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Dashboard Layout:</strong> 3-column grid with sidebar, main content, and widgets<br>
            <strong>Card Gallery:</strong> Auto-fit grid with minmax(300px, 1fr)<br>
            <strong>Form Layout:</strong> 2-column grid for label/input pairs<br>
            <strong>Photo Gallery:</strong> Masonry-style grid with different sized items
        </div>
    </div>
    
    <div class="grid-performance">
        <h5>⚡ Performance Optimizations:</h5>
        <div style="margin: 10px 0;">
            <span class="css-result css-optimized">Subgrid Support ✓</span>
            <span class="css-result css-optimized">Grid Auto-fit ✓</span>
            <span class="css-result css-optimized">Minmax Functions ✓</span>
            <span class="css-result css-optimized">Gap Property ✓</span>
        </div>
    </div>
    
    <div class="grid-compatibility">
        <h5>🌐 Browser Support:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Chrome: 57+ ✓<br>
            Firefox: 52+ ✓<br>
            Safari: 10.1+ ✓<br>
            Edge: 16+ ✓<br>
            <br>
            Overall Support: 95.2% of browsers
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeFlexboxAdvanced(outputContent) {
        this.cssMetrics.flexDirection = 'row';
        this.cssMetrics.flexWrap = 'wrap';
        this.cssMetrics.flexItems = 6;

        outputContent.innerHTML = `
<div class="flexbox-advanced-demo">
    <h4>📦 Advanced Flexbox Layout Applied</h4>
    
    <div class="flexbox-demo">
        <div class="flex-item">Item 1</div>
        <div class="flex-item">Item 2</div>
        <div class="flex-item">Item 3</div>
        <div class="flex-item">Item 4</div>
        <div class="flex-item">Item 5</div>
        <div class="flex-item">Item 6</div>
    </div>
    
    <div class="flexbox-features">
        <h5>🎯 Flexbox Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="css-result flexbox-layout">Flex Direction: ${this.cssMetrics.flexDirection} ✓</span>
            <span class="css-result flexbox-layout">Flex Wrap: ${this.cssMetrics.flexWrap} ✓</span>
            <span class="css-result flexbox-layout">Justify Content ✓</span>
            <span class="css-result flexbox-layout">Align Items ✓</span>
        </div>
    </div>
    
    <div class="flexbox-metrics">
        <h5>📊 Flexbox Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Direction: ${this.cssMetrics.flexDirection}<br>
            Wrap: ${this.cssMetrics.flexWrap}<br>
            Items: ${this.cssMetrics.flexItems}<br>
            Alignment: center<br>
            Distribution: space-between
        </div>
    </div>
    
    <div class="flexbox-examples">
        <h5>💡 Flexbox Use Cases:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Navigation Bar:</strong> Space-between with logo, menu, and actions<br>
            <strong>Card Layout:</strong> Equal height cards with flex: 1<br>
            <strong>Centering:</strong> Perfect centering with justify-content and align-items<br>
            <strong>Form Layout:</strong> Label/input pairs with flex-grow
        </div>
    </div>
    
    <div class="flexbox-advanced">
        <h5>🔧 Advanced Flexbox Properties:</h5>
        <div style="margin: 10px 0;">
            <span class="css-result css-optimized">Flex Grow/Shrink ✓</span>
            <span class="css-result css-optimized">Flex Basis ✓</span>
            <span class="css-result css-optimized">Align Self ✓</span>
            <span class="css-result css-optimized">Order Property ✓</span>
        </div>
    </div>
    
    <div class="flexbox-vs-grid">
        <h5>⚖️ Flexbox vs Grid:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            <strong>Use Flexbox for:</strong> 1D layouts, component alignment, space distribution<br>
            <strong>Use Grid for:</strong> 2D layouts, complex page structures, precise positioning<br>
            <strong>Best Practice:</strong> Combine both for optimal layouts
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    executeCSSAnimations(outputContent) {
        this.cssMetrics.animationFPS = 60;
        this.cssMetrics.animationDuration = 1.5;
        this.cssMetrics.animationEasing = 'ease-in-out';

        // Start animations
        this.startAnimationDemo();

        outputContent.innerHTML = `
<div class="css-animations-demo">
    <h4>✨ CSS Animations Applied</h4>
    
    <div class="animation-demo">
        <div class="animated-element bounce">B</div>
        <div class="animated-element pulse">P</div>
        <div class="animated-element rotate">R</div>
        <div class="animated-element fade">F</div>
    </div>
    
    <div class="animation-features">
        <h5>🎯 Animation Features Implemented:</h5>
        <div style="margin: 15px 0;">
            <span class="css-result animation-effect">Keyframe Animations ✓</span>
            <span class="css-result animation-effect">Transform Properties ✓</span>
            <span class="css-result animation-effect">Transition Effects ✓</span>
            <span class="css-result animation-effect">Performance Optimized ✓</span>
        </div>
    </div>
    
    <div class="animation-metrics">
        <h5>📊 Animation Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            FPS: ${this.cssMetrics.animationFPS}<br>
            Duration: ${this.cssMetrics.animationDuration}s<br>
            Easing: ${this.cssMetrics.animationEasing}<br>
            GPU Acceleration: ✓<br>
            Will-change: transform, opacity
        </div>
    </div>
    
    <div class="animation-types">
        <h5>🎨 Animation Types:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Bounce:</strong> Playful, attention-grabbing<br>
            <strong>Pulse:</strong> Subtle, breathing effect<br>
            <strong>Rotate:</strong> Loading, processing indicator<br>
            <strong>Fade:</strong> Smooth, elegant transitions
        </div>
    </div>
    
    <div class="animation-performance">
        <h5>⚡ Performance Tips:</h5>
        <div style="margin: 10px 0;">
            <span class="css-result css-optimized">Transform over Position ✓</span>
            <span class="css-result css-optimized">GPU Acceleration ✓</span>
            <span class="css-result css-optimized">Will-change Property ✓</span>
            <span class="css-result css-optimized">60fps Target ✓</span>
        </div>
    </div>
    
    <div class="animation-accessibility">
        <h5>♿ Accessibility Considerations:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Respects prefers-reduced-motion<br>
            Provides alternative static states<br>
            Maintains focus indicators<br>
            Doesn't interfere with screen readers
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    startAnimationDemo() {
        // Add animation classes to demo elements
        const animatedElements = document.querySelectorAll('.animated-element');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, index * 200);
        });
    }

    executeDesignTokens(outputContent) {
        this.cssMetrics.designTokens = 45;
        this.cssMetrics.currentTheme = 'Light';
        this.cssMetrics.componentCount = 12;

        // Initialize design tokens
        this.initializeDesignTokens();

        outputContent.innerHTML = `
<div class="design-tokens-demo">
    <h4>🎨 Design Tokens System Applied</h4>
    
    <div class="token-demo">
        <div class="token-item color-token">Primary</div>
        <div class="token-item color-token">Secondary</div>
        <div class="token-item spacing-token">Spacing</div>
        <div class="token-item typography-token">Typography</div>
        <div class="token-item color-token">Accent</div>
        <div class="token-item spacing-token">Border</div>
    </div>
    
    <div class="design-token-features">
        <h5>🎯 Design Token Features:</h5>
        <div style="margin: 15px 0;">
            <span class="css-result design-token">CSS Custom Properties ✓</span>
            <span class="css-result design-token">Color System ✓</span>
            <span class="css-result design-token">Typography Scale ✓</span>
            <span class="css-result design-token">Spacing System ✓</span>
        </div>
    </div>
    
    <div class="design-token-metrics">
        <h5>📊 Design Token Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Total Tokens: ${this.cssMetrics.designTokens}<br>
            Current Theme: ${this.cssMetrics.currentTheme}<br>
            Components: ${this.cssMetrics.componentCount}<br>
            Color Tokens: 20<br>
            Spacing Tokens: 12<br>
            Typography Tokens: 13
        </div>
    </div>
    
    <div class="token-categories">
        <h5>📋 Token Categories:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Colors:</strong> Primary, secondary, neutral, semantic colors<br>
            <strong>Typography:</strong> Font families, sizes, weights, line heights<br>
            <strong>Spacing:</strong> Consistent spacing scale (4px base unit)<br>
            <strong>Shadows:</strong> Elevation and depth system<br>
            <strong>Border Radius:</strong> Consistent corner rounding
        </div>
    </div>
    
    <div class="theme-switching">
        <h5>🌓 Theme Switching:</h5>
        <div style="margin: 10px 0;">
            <span class="css-result design-token">Light Theme ✓</span>
            <span class="css-result design-token">Dark Theme ✓</span>
            <span class="css-result design-token">Auto Theme ✓</span>
            <span class="css-result design-token">Custom Themes ✓</span>
        </div>
    </div>
    
    <div class="token-benefits">
        <h5>💡 Design Token Benefits:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Consistent design across components<br>
            Easy theme switching and customization<br>
            Better maintainability and scalability<br>
            Improved developer experience<br>
            Design-to-code handoff efficiency
        </div>
    </div>
</div>`;

        this.updateMetricsDisplay();
    }

    initializeDesignTokens() {
        // Simulate design token initialization
        const tokenCategories = ['colors', 'typography', 'spacing', 'shadows', 'borders'];
        tokenCategories.forEach(category => {
            this.designTokens.set(category, Math.floor(Math.random() * 10) + 5);
        });
    }

    executeComponentLibraries(outputContent) {
        this.cssMetrics.libraryComponents = 15;
        this.cssMetrics.componentVariants = 8;
        this.cssMetrics.reusabilityScore = 92;

        outputContent.innerHTML = `
<div class="component-library-demo">
    <h4>🧩 Component Library Built</h4>
    
    <div class="component-demo">
        <div class="component-item component-button">Button</div>
        <div class="component-item component-card">Card</div>
        <div class="component-item component-input">Input</div>
        <div class="component-item component-button">Modal</div>
        <div class="component-item component-card">Badge</div>
        <div class="component-item component-input">Alert</div>
    </div>
    
    <div class="component-features">
        <h5>🎯 Component Features:</h5>
        <div style="margin: 15px 0;">
            <span class="css-result component-built">Reusable Components ✓</span>
            <span class="css-result component-built">Variant System ✓</span>
            <span class="css-result component-built">Consistent Styling ✓</span>
            <span class="css-result component-built">Documentation ✓</span>
        </div>
    </div>
    
    <div class="component-metrics">
        <h5>📊 Component Metrics:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Library Components: ${this.cssMetrics.libraryComponents}<br>
            Component Variants: ${this.cssMetrics.componentVariants}<br>
            Reusability Score: ${this.cssMetrics.reusabilityScore}%<br>
            Documentation Coverage: 95%<br>
            Test Coverage: 88%
        </div>
    </div>
    
    <div class="component-types">
        <h5>🧩 Component Types:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color);">
            <strong>Buttons:</strong> Primary, secondary, outline, ghost variants<br>
            <strong>Cards:</strong> Header, body, footer sections with consistent spacing<br>
            <strong>Forms:</strong> Inputs, labels, validation states, error messages<br>
            <strong>Navigation:</strong> Menus, breadcrumbs, pagination components<br>
            <strong>Feedback:</strong> Alerts, toasts, loading states, progress bars
        </div>
    </div>
    
    <div class="component-architecture">
        <h5>🏗️ Component Architecture:</h5>
        <div style="margin: 10px 0;">
            <span class="css-result css-optimized">Atomic Design ✓</span>
            <span class="css-result css-optimized">BEM Methodology ✓</span>
            <span class="css-result css-optimized">CSS Modules ✓</span>
            <span class="css-result css-optimized">Design Tokens ✓</span>
        </div>
    </div>
    
    <div class="component-benefits">
        <h5>💡 Component Library Benefits:</h5>
        <div style="color: var(--text-secondary); margin: 10px 0;">
            Faster development with pre-built components<br>
            Consistent user experience across applications<br>
            Easier maintenance and updates<br>
            Better collaboration between design and development<br>
            Reduced code duplication and improved quality
        </div>
    </div>
    
    <div class="component-usage">
        <h5>📖 Usage Examples:</h5>
        <div style="background: var(--surface-color); padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem;">
            &lt;button class="btn btn-primary"&gt;Click me&lt;/button&gt;<br>
            &lt;div class="card"&gt;<br>
            &nbsp;&nbsp;&lt;div class="card-header"&gt;Title&lt;/div&gt;<br>
            &nbsp;&nbsp;&lt;div class="card-body"&gt;Content&lt;/div&gt;<br>
            &lt;/div&gt;
        </div>
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
        
        card.classList.add('success-animation');
        setTimeout(() => {
            card.classList.remove('success-animation');
        }, 600);
        
        this.saveProgress();
    }

    updateMetricsDisplay() {
        // Update CSS Grid metrics
        document.getElementById('gridColumns').textContent = this.cssMetrics.gridColumns;
        document.getElementById('gridRows').textContent = this.cssMetrics.gridRows;
        document.getElementById('gridGap').textContent = `${this.cssMetrics.gridGap}px`;

        // Update Flexbox metrics
        document.getElementById('flexDirection').textContent = this.cssMetrics.flexDirection;
        document.getElementById('flexWrap').textContent = this.cssMetrics.flexWrap;
        document.getElementById('flexItems').textContent = this.cssMetrics.flexItems;

        // Update Animation metrics
        document.getElementById('animationFPS').textContent = this.cssMetrics.animationFPS;
        document.getElementById('animationDuration').textContent = `${this.cssMetrics.animationDuration}s`;
        document.getElementById('animationEasing').textContent = this.cssMetrics.animationEasing;

        // Update Design Tokens metrics
        document.getElementById('designTokens').textContent = this.cssMetrics.designTokens;
        document.getElementById('currentTheme').textContent = this.cssMetrics.currentTheme;
        document.getElementById('componentCount').textContent = this.cssMetrics.componentCount;

        // Update Component Library metrics
        document.getElementById('libraryComponents').textContent = this.cssMetrics.libraryComponents;
        document.getElementById('componentVariants').textContent = this.cssMetrics.componentVariants;
        document.getElementById('reusabilityScore').textContent = `${this.cssMetrics.reusabilityScore}%`;
    }

    updateProgressDisplay() {
        const completedCount = this.exercises.filter(ex => ex.completed).length;
        const totalCount = this.exercises.length;
        const percentage = (completedCount / totalCount) * 100;

        const progressFill = document.getElementById('overallProgress');
        progressFill.style.width = `${percentage}%`;

        const progressText = document.querySelector('.progress-text');
        progressText.textContent = `${completedCount}/${totalCount} Complete`;

        const completeBtn = document.getElementById('completeBtn');
        completeBtn.disabled = completedCount < totalCount;
    }

    completeLevel() {
        if (this.exercises.every(ex => ex.completed)) {
            this.showCompletionAnimation();
            
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
            if (!completedLevels.includes(27)) {
                completedLevels.push(27);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }

            const totalProgress = JSON.parse(localStorage.getItem('totalProgress') || '0');
            localStorage.setItem('totalProgress', Math.max(totalProgress, 27).toString());

            setTimeout(() => {
                alert('🎉 Congratulations! You\'ve completed Level 27: Advanced CSS & Design Systems!\n\nYou\'ve mastered:\n• CSS Grid layout with complex responsive designs\n• Advanced Flexbox techniques and alignment\n• CSS animations and performance optimization\n• Design tokens and theming systems\n• Component library architecture and reusability');
                
                window.location.href = '../../index.html';
            }, 2000);
        }
    }

    showCompletionAnimation() {
        const container = document.querySelector('.level-container');
        container.style.position = 'relative';
        container.style.overflow: 'hidden';

        for (let i = 0; i < 50; i++) {
            const cssIcon = document.createElement('div');
            cssIcon.style.position = 'absolute';
            cssIcon.style.fontSize = '20px';
            cssIcon.innerHTML = ['🎨', '📐', '📦', '✨', '🧩', '🎯', '⚡'][Math.floor(Math.random() * 7)];
            cssIcon.style.left = Math.random() * 100 + '%';
            cssIcon.style.top = '-30px';
            cssIcon.style.animation = `cssFall ${Math.random() * 2 + 2}s linear forwards`;
            cssIcon.style.opacity = '0.8';
            cssIcon.classList.add('css-processing');
            container.appendChild(cssIcon);

            setTimeout(() => cssIcon.remove(), 4000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes cssFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    resetLevel() {
        if (confirm('Are you sure you want to reset this level? All CSS progress will be lost.')) {
            this.exercises.forEach(ex => ex.completed = false);
            
            document.querySelectorAll('.exercise-card').forEach(card => {
                card.classList.remove('completed');
                const statusElement = card.querySelector('.exercise-status');
                statusElement.innerHTML = '<i class="fas fa-circle status-pending"></i><span>Pending</span>';
            });

            document.querySelectorAll('.output-content').forEach(output => {
                output.innerHTML = '';
            });

            this.cssMetrics = {
                gridColumns: 0, gridRows: 0, gridGap: 0,
                flexDirection: 'row', flexWrap: 'nowrap', flexItems: 0,
                animationFPS: 60, animationDuration: 0, animationEasing: 'ease',
                designTokens: 0, currentTheme: 'Light', componentCount: 0,
                libraryComponents: 0, componentVariants: 0, reusabilityScore: 0
            };

            this.animations = [];
            this.designTokens.clear();

            this.updateProgressDisplay();
            this.updateMetricsDisplay();
            this.saveProgress();
        }
    }

    saveProgress() {
        localStorage.setItem('level27Progress', JSON.stringify({
            exercises: this.exercises,
            cssMetrics: this.cssMetrics,
            designTokens: Array.from(this.designTokens.entries())
        }));
    }

    loadProgress() {
        const saved = localStorage.getItem('level27Progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.exercises = data.exercises || this.exercises;
            this.cssMetrics = data.cssMetrics || this.cssMetrics;
            this.designTokens = new Map(data.designTokens || []);
            
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
    if (window.cssLevel) {
        window.cssLevel.runExercise(exerciseId);
    }
}

function completeLevel() {
    if (window.cssLevel) {
        window.cssLevel.completeLevel();
    }
}

function resetLevel() {
    if (window.cssLevel) {
        window.cssLevel.resetLevel();
    }
}

// Initialize the level when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cssLevel = new AdvancedCSSLevel();
});

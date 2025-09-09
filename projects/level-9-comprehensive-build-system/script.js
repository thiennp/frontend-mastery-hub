// Build System JavaScript - Level 9

class BuildSystemDemo {
  constructor() {
    this.currentTool = 'vite';
    this.currentOptimization = 'tree-shaking';
    this.currentPipeline = 'development';
    this.buildProgress = 0;
    this.isBuilding = false;
    this.buildLog = [];
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupToolComparisons();
    this.setupOptimizationDemos();
    this.setupPipelineDemos();
    this.setupBuildSimulation();
    this.setupInteractiveFeatures();
  }

  setupEventListeners() {
    // Tool selection
    const toolSelect = document.getElementById('tool-select');
    if (toolSelect) {
      toolSelect.addEventListener('change', (e) => {
        this.currentTool = e.target.value;
        this.updateToolComparison();
      });
    }

    // Optimization selection
    const optimizationSelect = document.getElementById('optimization-select');
    if (optimizationSelect) {
      optimizationSelect.addEventListener('change', (e) => {
        this.currentOptimization = e.target.value;
        this.updateOptimizationDemo();
      });
    }

    // Pipeline selection
    const pipelineSelect = document.getElementById('pipeline-select');
    if (pipelineSelect) {
      pipelineSelect.addEventListener('change', (e) => {
        this.currentPipeline = e.target.value;
        this.updatePipelineDemo();
      });
    }

    // Build simulation buttons
    const buildButtons = document.querySelectorAll('.build-button');
    buildButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tool = e.target.dataset.tool;
        this.simulateBuild(tool);
      });
    });

    // Optimization demo buttons
    const optimizeButtons = document.querySelectorAll('.optimize-button');
    optimizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const optimization = e.target.dataset.optimization;
        this.simulateOptimization(optimization);
      });
    });

    // Pipeline demo buttons
    const pipelineButtons = document.querySelectorAll('.pipeline-button');
    pipelineButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const pipeline = e.target.dataset.pipeline;
        this.simulatePipeline(pipeline);
      });
    });
  }

  setupToolComparisons() {
    this.toolData = {
      vite: {
        name: 'Vite',
        description: 'Next generation frontend tooling',
        features: ['ESM-based', 'Hot Module Replacement', 'TypeScript', 'CSS Preprocessing'],
        metrics: { speed: 95, bundle: 90, devx: 98, ecosystem: 85 },
        badge: 'excellent'
      },
      webpack: {
        name: 'Webpack',
        description: 'The most mature bundler',
        features: ['Code Splitting', 'Tree Shaking', 'Plugin System', 'Asset Management'],
        metrics: { speed: 70, bundle: 95, devx: 75, ecosystem: 98 },
        badge: 'good'
      },
      rollup: {
        name: 'Rollup',
        description: 'Efficient bundler for libraries',
        features: ['Tree Shaking', 'ES Modules', 'Small Bundles', 'Plugin API'],
        metrics: { speed: 85, bundle: 98, devx: 80, ecosystem: 70 },
        badge: 'good'
      },
      parcel: {
        name: 'Parcel',
        description: 'Zero-configuration bundler',
        features: ['Zero Config', 'Fast Builds', 'Asset Pipeline', 'Hot Reload'],
        metrics: { speed: 80, bundle: 75, devx: 90, ecosystem: 60 },
        badge: 'average'
      }
    };

    this.updateToolComparison();
  }

  updateToolComparison() {
    const tool = this.toolData[this.currentTool];
    if (!tool) return;

    // Update tool card
    const toolCard = document.querySelector('.tool-card');
    if (toolCard) {
      const title = toolCard.querySelector('.tool-card__title');
      const description = toolCard.querySelector('.tool-card__description');
      const badge = toolCard.querySelector('.tool-card__badge');
      const features = toolCard.querySelector('.tool-card__features');
      const metrics = toolCard.querySelector('.tool-card__metrics');

      if (title) title.textContent = tool.name;
      if (description) description.textContent = tool.description;
      
      if (badge) {
        badge.textContent = tool.badge;
        badge.className = `tool-card__badge tool-card__badge--${tool.badge}`;
      }

      if (features) {
        features.innerHTML = tool.features.map(feature => `
          <div class="feature">
            <span class="feature__icon">✓</span>
            <span class="feature__text">${feature}</span>
          </div>
        `).join('');
      }

      if (metrics) {
        metrics.innerHTML = Object.entries(tool.metrics).map(([key, value]) => `
          <div class="metric">
            <span class="metric__label">${key}</span>
            <span class="metric__value">${value}%</span>
          </div>
        `).join('');
      }
    }
  }

  setupOptimizationDemos() {
    this.optimizationData = {
      'tree-shaking': {
        name: 'Tree Shaking',
        description: 'Remove unused code from bundles',
        before: { size: '2.5MB', files: 150, unused: '45%' },
        after: { size: '1.2MB', files: 85, unused: '5%' },
        improvement: '52%'
      },
      'code-splitting': {
        name: 'Code Splitting',
        description: 'Split code into smaller chunks',
        before: { size: '3.2MB', chunks: 1, loadTime: '4.2s' },
        after: { size: '1.8MB', chunks: 8, loadTime: '1.8s' },
        improvement: '44%'
      },
      'minification': {
        name: 'Minification',
        description: 'Compress and optimize code',
        before: { size: '1.8MB', gzip: '450KB', readability: 'High' },
        after: { size: '650KB', gzip: '180KB', readability: 'Low' },
        improvement: '64%'
      },
      'asset-optimization': {
        name: 'Asset Optimization',
        description: 'Optimize images and assets',
        before: { images: '12MB', fonts: '2.1MB', total: '14.1MB' },
        after: { images: '3.2MB', fonts: '680KB', total: '3.88MB' },
        improvement: '72%'
      }
    };

    this.updateOptimizationDemo();
  }

  updateOptimizationDemo() {
    const optimization = this.optimizationData[this.currentOptimization];
    if (!optimization) return;

    const demoContainer = document.querySelector('.demo-container');
    if (demoContainer) {
      const title = demoContainer.querySelector('.optimization-card__title');
      const description = demoContainer.querySelector('.optimization-card__description');
      const metricsGrid = demoContainer.querySelector('.metrics-grid');

      if (title) title.textContent = optimization.name;
      if (description) description.textContent = optimization.description;

      if (metricsGrid) {
        metricsGrid.innerHTML = `
          <div class="metric-card">
            <div class="metric-card__label">Before</div>
            <div class="metric-card__value">${Object.values(optimization.before).join(' / ')}</div>
          </div>
          <div class="metric-card">
            <div class="metric-card__label">After</div>
            <div class="metric-card__value">${Object.values(optimization.after).join(' / ')}</div>
          </div>
          <div class="metric-card">
            <div class="metric-card__label">Improvement</div>
            <div class="metric-card__value text-primary">${optimization.improvement}</div>
          </div>
        `;
      }
    }
  }

  setupPipelineDemos() {
    this.pipelineData = {
      development: {
        name: 'Development Pipeline',
        steps: [
          { icon: '📦', title: 'Install Dependencies', description: 'npm install' },
          { icon: '🔧', title: 'Lint Code', description: 'eslint src/' },
          { icon: '🧪', title: 'Run Tests', description: 'jest --watch' },
          { icon: '🚀', title: 'Start Dev Server', description: 'vite dev' }
        ]
      },
      production: {
        name: 'Production Pipeline',
        steps: [
          { icon: '📦', title: 'Install Dependencies', description: 'npm ci' },
          { icon: '🔧', title: 'Lint & Format', description: 'eslint + prettier' },
          { icon: '🧪', title: 'Run Tests', description: 'jest --coverage' },
          { icon: '🏗️', title: 'Build Application', description: 'vite build' },
          { icon: '📊', title: 'Analyze Bundle', description: 'bundle-analyzer' },
          { icon: '🚀', title: 'Deploy', description: 'deploy to CDN' }
        ]
      },
      ci: {
        name: 'CI/CD Pipeline',
        steps: [
          { icon: '📥', title: 'Checkout Code', description: 'git checkout' },
          { icon: '📦', title: 'Cache Dependencies', description: 'npm ci --cache' },
          { icon: '🔧', title: 'Lint & Format', description: 'eslint + prettier' },
          { icon: '🧪', title: 'Run Tests', description: 'jest --coverage' },
          { icon: '🏗️', title: 'Build Application', description: 'vite build' },
          { icon: '📊', title: 'Security Scan', description: 'npm audit' },
          { icon: '🐳', title: 'Build Docker', description: 'docker build' },
          { icon: '🚀', title: 'Deploy', description: 'k8s deploy' }
        ]
      }
    };

    this.updatePipelineDemo();
  }

  updatePipelineDemo() {
    const pipeline = this.pipelineData[this.currentPipeline];
    if (!pipeline) return;

    const pipelineSteps = document.querySelector('.pipeline-steps');
    if (pipelineSteps) {
      pipelineSteps.innerHTML = pipeline.steps.map(step => `
        <div class="pipeline-step">
          <div class="pipeline-step__icon">${step.icon}</div>
          <div class="pipeline-step__content">
            <div class="pipeline-step__title">${step.title}</div>
            <div class="pipeline-step__description">${step.description}</div>
          </div>
        </div>
      `).join('');
    }
  }

  setupBuildSimulation() {
    this.buildSimulations = {
      vite: {
        steps: [
          { message: 'Starting Vite dev server...', type: 'info' },
          { message: 'Resolving dependencies...', type: 'info' },
          { message: 'Pre-bundling dependencies...', type: 'info' },
          { message: 'Starting dev server on http://localhost:3000', type: 'success' },
          { message: 'Hot Module Replacement enabled', type: 'success' }
        ],
        duration: 2000
      },
      webpack: {
        steps: [
          { message: 'Starting Webpack compilation...', type: 'info' },
          { message: 'Loading configuration...', type: 'info' },
          { message: 'Resolving modules...', type: 'info' },
          { message: 'Building dependency graph...', type: 'info' },
          { message: 'Optimizing chunks...', type: 'info' },
          { message: 'Emitting assets...', type: 'info' },
          { message: 'Compilation completed successfully', type: 'success' }
        ],
        duration: 4000
      },
      rollup: {
        steps: [
          { message: 'Starting Rollup bundling...', type: 'info' },
          { message: 'Loading plugins...', type: 'info' },
          { message: 'Resolving entry points...', type: 'info' },
          { message: 'Tree shaking...', type: 'info' },
          { message: 'Generating chunks...', type: 'info' },
          { message: 'Writing bundle...', type: 'info' },
          { message: 'Bundle generated successfully', type: 'success' }
        ],
        duration: 3000
      }
    };
  }

  simulateBuild(tool) {
    if (this.isBuilding) return;

    this.isBuilding = true;
    this.buildProgress = 0;
    this.buildLog = [];

    const simulation = this.buildSimulations[tool];
    if (!simulation) return;

    const buildLog = document.querySelector('.build-log');
    const progressBar = document.querySelector('.progress-fill');
    const buildButton = document.querySelector(`[data-tool="${tool}"]`);

    if (buildButton) {
      buildButton.disabled = true;
      buildButton.textContent = 'Building...';
    }

    let stepIndex = 0;
    const stepInterval = simulation.duration / simulation.steps.length;

    const runStep = () => {
      if (stepIndex < simulation.steps.length) {
        const step = simulation.steps[stepIndex];
        this.buildLog.push(step);
        
        if (buildLog) {
          buildLog.innerHTML = this.buildLog.map(log => `
            <div class="log-entry log-entry--${log.type}">
              [${new Date().toLocaleTimeString()}] ${log.message}
            </div>
          `).join('');
          buildLog.scrollTop = buildLog.scrollHeight;
        }

        this.buildProgress = ((stepIndex + 1) / simulation.steps.length) * 100;
        if (progressBar) {
          progressBar.style.width = `${this.buildProgress}%`;
        }

        stepIndex++;
        setTimeout(runStep, stepInterval);
      } else {
        this.isBuilding = false;
        if (buildButton) {
          buildButton.disabled = false;
          buildButton.textContent = 'Build Complete';
          setTimeout(() => {
            buildButton.textContent = `Build with ${tool.charAt(0).toUpperCase() + tool.slice(1)}`;
          }, 2000);
        }
      }
    };

    runStep();
  }

  simulateOptimization(optimization) {
    const optimizationData = this.optimizationData[optimization];
    if (!optimizationData) return;

    const demoContainer = document.querySelector('.demo-container');
    if (!demoContainer) return;

    // Show loading state
    const optimizeButton = document.querySelector(`[data-optimization="${optimization}"]`);
    if (optimizeButton) {
      optimizeButton.disabled = true;
      optimizeButton.textContent = 'Optimizing...';
    }

    // Simulate optimization process
    setTimeout(() => {
      this.updateOptimizationDemo();
      
      if (optimizeButton) {
        optimizeButton.disabled = false;
        optimizeButton.textContent = 'Optimize Complete';
        setTimeout(() => {
          optimizeButton.textContent = `Optimize ${optimizationData.name}`;
        }, 2000);
      }

      // Show success message
      this.showStatus(`Optimization complete! Bundle size reduced by ${optimizationData.improvement}`, 'success');
    }, 1500);
  }

  simulatePipeline(pipeline) {
    const pipelineData = this.pipelineData[pipeline];
    if (!pipelineData) return;

    const pipelineButton = document.querySelector(`[data-pipeline="${pipeline}"]`);
    if (pipelineButton) {
      pipelineButton.disabled = true;
      pipelineButton.textContent = 'Running Pipeline...';
    }

    // Simulate pipeline execution
    const steps = document.querySelectorAll('.pipeline-step');
    let currentStep = 0;

    const runStep = () => {
      if (currentStep < steps.length) {
        steps[currentStep].style.opacity = '0.5';
        steps[currentStep].style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          steps[currentStep].style.opacity = '1';
          steps[currentStep].style.transform = 'scale(1)';
          steps[currentStep].style.background = '#dcfce7';
          steps[currentStep].style.borderColor = '#bbf7d0';
          currentStep++;
          runStep();
        }, 800);
      } else {
        if (pipelineButton) {
          pipelineButton.disabled = false;
          pipelineButton.textContent = 'Pipeline Complete';
          setTimeout(() => {
            pipelineButton.textContent = `Run ${pipelineData.name}`;
          }, 2000);
        }
        this.showStatus('Pipeline executed successfully!', 'success');
      }
    };

    runStep();
  }

  setupInteractiveFeatures() {
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Add intersection observer for animations
    this.setupScrollAnimations();

    // Add keyboard navigation
    this.setupKeyboardNavigation();

    // Add tooltips
    this.setupTooltips();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe cards for animation
    const cards = document.querySelectorAll('.tool-card, .optimization-card, .automation-card');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape key to close any open modals or reset demos
      if (e.key === 'Escape') {
        this.resetDemos();
      }

      // Arrow keys for tool selection
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const toolSelect = document.getElementById('tool-select');
        if (toolSelect && document.activeElement === toolSelect) {
          e.preventDefault();
          const options = Array.from(toolSelect.options);
          const currentIndex = options.findIndex(option => option.value === toolSelect.value);
          let newIndex;
          
          if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          } else {
            newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          }
          
          toolSelect.value = options[newIndex].value;
          toolSelect.dispatchEvent(new Event('change'));
        }
      }
    });
  }

  setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      });
      
      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--color-gray-800);
      color: white;
      padding: var(--spacing-2) var(--spacing-3);
      border-radius: var(--border-radius);
      font-size: var(--font-size-sm);
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--transition-fast);
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;

    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);

    this.currentTooltip = tooltip;
  }

  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.style.opacity = '0';
      setTimeout(() => {
        if (this.currentTooltip && this.currentTooltip.parentNode) {
          this.currentTooltip.parentNode.removeChild(this.currentTooltip);
        }
        this.currentTooltip = null;
      }, 150);
    }
  }

  showStatus(message, type = 'info') {
    const status = document.createElement('div');
    status.className = `status status--${type}`;
    status.textContent = message;
    status.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      transition: all var(--transition);
    `;

    document.body.appendChild(status);

    setTimeout(() => {
      status.style.opacity = '1';
      status.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
      status.style.opacity = '0';
      status.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (status.parentNode) {
          status.parentNode.removeChild(status);
        }
      }, 300);
    }, 3000);
  }

  resetDemos() {
    // Reset build simulation
    this.isBuilding = false;
    this.buildProgress = 0;
    this.buildLog = [];

    const buildLog = document.querySelector('.build-log');
    const progressBar = document.querySelector('.progress-fill');
    const buildButtons = document.querySelectorAll('.build-button');

    if (buildLog) buildLog.innerHTML = '';
    if (progressBar) progressBar.style.width = '0%';
    
    buildButtons.forEach(button => {
      button.disabled = false;
      button.textContent = button.textContent.replace('Complete', '').replace('...', '');
    });

    // Reset pipeline steps
    const pipelineSteps = document.querySelectorAll('.pipeline-step');
    pipelineSteps.forEach(step => {
      step.style.background = '';
      step.style.borderColor = '';
    });

    // Reset optimization demo
    this.updateOptimizationDemo();
  }

  // Performance monitoring
  measurePerformance() {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Operation completed in ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  }

  // Bundle size calculator
  calculateBundleSize(files) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const gzipSize = totalSize * 0.3; // Rough gzip compression ratio
    
    return {
      original: this.formatBytes(totalSize),
      gzipped: this.formatBytes(gzipSize),
      savings: this.formatBytes(totalSize - gzipSize)
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Build configuration generator
  generateBuildConfig(tool, options = {}) {
    const configs = {
      vite: {
        build: {
          outDir: 'dist',
          sourcemap: options.sourcemap || false,
          minify: options.minify || 'terser',
          rollupOptions: {
            output: {
              manualChunks: options.manualChunks || undefined
            }
          }
        }
      },
      webpack: {
        mode: options.mode || 'production',
        optimization: {
          splitChunks: options.splitChunks || {},
          usedExports: options.treeShaking || true
        }
      },
      rollup: {
        output: {
          format: options.format || 'es',
          dir: 'dist',
          sourcemap: options.sourcemap || false
        }
      }
    };

    return configs[tool] || {};
  }
}

// Initialize the demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.buildSystemDemo = new BuildSystemDemo();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BuildSystemDemo;
}

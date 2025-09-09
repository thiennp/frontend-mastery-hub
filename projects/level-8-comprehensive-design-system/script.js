// Design System JavaScript - Level 8

// Utility Functions
const utils = {
  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Generate unique IDs
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Modal Component
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.overlay = this.modal?.querySelector('.modal__overlay');
    this.closeButton = this.modal?.querySelector('.modal__close');
    this.isOpen = false;
    
    this.init();
  }

  init() {
    if (!this.modal) return;

    // Close modal when clicking overlay
    this.overlay?.addEventListener('click', () => this.close());
    
    // Close modal when clicking close button
    this.closeButton?.addEventListener('click', () => this.close());
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Trap focus within modal when open
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && this.isOpen) {
        this.trapFocus(e);
      }
    });
  }

  open() {
    if (!this.modal) return;
    
    this.modal.classList.add('modal--open');
    this.isOpen = true;
    
    // Focus first focusable element
    const firstFocusable = this.modal.querySelector('button, input, textarea, select, a[href]');
    firstFocusable?.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Dispatch custom event
    this.modal.dispatchEvent(new CustomEvent('modal:open'));
  }

  close() {
    if (!this.modal) return;
    
    this.modal.classList.remove('modal--open');
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Dispatch custom event
    this.modal.dispatchEvent(new CustomEvent('modal:close'));
  }

  trapFocus(e) {
    const focusableElements = this.modal.querySelectorAll(
      'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }
}

// Interactive Demo Component
class InteractiveDemo {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) return;

    // Button variant demo
    this.setupButtonDemo();
    
    // Color picker demo
    this.setupColorDemo();
    
    // Typography scale demo
    this.setupTypographyDemo();
    
    // Spacing demo
    this.setupSpacingDemo();
  }

  setupButtonDemo() {
    const variantSelect = this.container.querySelector('#buttonVariant');
    const sizeSelect = this.container.querySelector('#buttonSize');
    const demoButton = this.container.querySelector('#demoButton');

    if (!variantSelect || !sizeSelect || !demoButton) return;

    const updateButton = () => {
      // Remove all existing classes
      demoButton.className = 'button';
      
      // Add new classes
      demoButton.classList.add(`button--${variantSelect.value}`);
      demoButton.classList.add(`button--${sizeSelect.value}`);
    };

    variantSelect.addEventListener('change', updateButton);
    sizeSelect.addEventListener('change', updateButton);
    
    // Add click handler for demo
    demoButton.addEventListener('click', () => {
      this.showNotification('Button clicked! This demonstrates the interactive nature of design system components.', 'info');
    });
  }

  setupColorDemo() {
    const colorSwatches = this.container.querySelectorAll('.color-swatch');
    
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const colorName = swatch.querySelector('.color-swatch__name').textContent;
        const computedStyle = getComputedStyle(swatch);
        const backgroundColor = computedStyle.backgroundColor;
        
        this.showNotification(`Color: ${colorName} (${backgroundColor})`, 'info');
      });
    });
  }

  setupTypographyDemo() {
    const typographyItems = this.container.querySelectorAll('.typography-item');
    
    typographyItems.forEach(item => {
      item.addEventListener('click', () => {
        const fontSize = getComputedStyle(item).fontSize;
        const fontWeight = getComputedStyle(item).fontWeight;
        
        this.showNotification(`Typography: ${fontSize}, Weight: ${fontWeight}`, 'info');
      });
    });
  }

  setupSpacingDemo() {
    const spacingItems = this.container.querySelectorAll('.spacing-item');
    
    spacingItems.forEach(item => {
      item.addEventListener('click', () => {
        const width = getComputedStyle(item).width;
        const height = getComputedStyle(item).height;
        
        this.showNotification(`Spacing: ${width} × ${height}`, 'info');
      });
    });
  }

  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__message">${message}</span>
        <button class="notification__close" onclick="this.parentElement.parentElement.remove()">&times;</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid var(--color-gray-200);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Form Validation Component
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.rules = {};
    this.init();
  }

  init() {
    if (!this.form) return;

    // Add validation rules
    this.setupValidationRules();
    
    // Add event listeners
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', utils.debounce(() => this.validateField(input), 300));
    });
  }

  setupValidationRules() {
    this.rules = {
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      required: {
        pattern: /.+/,
        message: 'This field is required'
      },
      minLength: (min) => ({
        pattern: new RegExp(`.{${min},}`),
        message: `Must be at least ${min} characters long`
      })
    };
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = this.rules.required.message;
    }

    // Email validation
    if (field.type === 'email' && value && !this.rules.email.pattern.test(value)) {
      isValid = false;
      errorMessage = this.rules.email.message;
    }

    // Min length validation
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      isValid = false;
      errorMessage = this.rules.minLength(parseInt(minLength)).message;
    }

    // Update field appearance
    this.updateFieldState(field, isValid, errorMessage);
    
    return isValid;
  }

  updateFieldState(field, isValid, errorMessage) {
    const inputGroup = field.closest('.input-group, .form__group');
    if (!inputGroup) return;

    // Remove existing error state
    field.classList.remove('input--error');
    const existingError = inputGroup.querySelector('.input-error');
    if (existingError) {
      existingError.remove();
    }

    if (!isValid) {
      // Add error state
      field.classList.add('input--error');
      
      // Add error message
      const errorElement = document.createElement('div');
      errorElement.className = 'input-error';
      errorElement.textContent = errorMessage;
      inputGroup.appendChild(errorElement);
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    inputs.forEach(input => {
      const isFieldValid = this.validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.showSuccessMessage('Form submitted successfully!');
      this.form.reset();
    } else {
      this.showErrorMessage('Please fix the errors and try again.');
    }
  }

  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  showMessage(message, type) {
    // Remove existing message
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;

    // Add styles
    messageElement.style.cssText = `
      padding: var(--spacing-3);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--spacing-4);
      font-size: var(--font-size-sm);
      ${type === 'success' ? 
        'background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' :
        'background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca;'
      }
    `;

    // Insert at the beginning of the form
    this.form.insertBefore(messageElement, this.form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageElement.parentElement) {
        messageElement.remove();
      }
    }, 5000);
  }
}

// Smooth Scrolling for Navigation
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scrolling to all anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e));
    });
  }

  handleClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (!href || href === '#') return;

    e.preventDefault();
    
    const target = document.querySelector(href);
    if (target) {
      utils.scrollToElement(target, 80); // 80px offset for fixed header
    }
  }
}

// Intersection Observer for Animations
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    // Only run if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all cards and sections
    const elements = document.querySelectorAll('.token-card, .component-card, .pattern-card, .doc-card, .section');
    elements.forEach(el => {
      observer.observe(el);
    });
  }
}

// Theme Toggle (for future dark mode support)
class ThemeToggle {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    // Apply saved theme
    this.applyTheme(this.currentTheme);
    
    // Create theme toggle button (if needed)
    this.createToggleButton();
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.innerHTML = '🌙';
    button.setAttribute('aria-label', 'Toggle theme');
    
    // Add to header
    const header = document.querySelector('.header__content');
    if (header) {
      header.appendChild(button);
      
      button.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      this.measurePageLoad();
    });

    // Monitor component interaction performance
    this.monitorInteractions();
  }

  measurePageLoad() {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // Send to analytics (if configured)
      this.sendAnalytics('page_load', { loadTime });
    }
  }

  monitorInteractions() {
    // Monitor button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.button')) {
        this.sendAnalytics('button_click', {
          buttonText: e.target.textContent.trim(),
          buttonVariant: e.target.className.match(/button--(\w+)/)?.[1] || 'unknown'
        });
      }
    });

    // Monitor form submissions
    document.addEventListener('submit', (e) => {
      this.sendAnalytics('form_submit', {
        formId: e.target.id || 'unknown'
      });
    });
  }

  sendAnalytics(event, data) {
    // This would integrate with your analytics service
    console.log('Analytics:', event, data);
  }
}

// Accessibility Enhancements
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    // Add skip links
    this.addSkipLinks();
    
    // Enhance keyboard navigation
    this.enhanceKeyboardNavigation();
    
    // Add ARIA labels where needed
    this.addAriaLabels();
    
    // Monitor focus management
    this.monitorFocus();
  }

  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--color-primary-600);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  enhanceKeyboardNavigation() {
    // Add keyboard navigation for custom components
    const interactiveElements = document.querySelectorAll('.token-card, .component-card, .pattern-card');
    
    interactiveElements.forEach((element, index) => {
      element.setAttribute('tabindex', '0');
      element.setAttribute('role', 'button');
      element.setAttribute('aria-label', `View details for ${element.querySelector('h3')?.textContent || 'item'}`);
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });
  }

  addAriaLabels() {
    // Add ARIA labels to buttons without text
    const iconButtons = document.querySelectorAll('button:not([aria-label]):empty');
    iconButtons.forEach(button => {
      const context = button.closest('.modal, .card, .alert');
      if (context) {
        button.setAttribute('aria-label', 'Close');
      }
    });
  }

  monitorFocus() {
    // Add focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  new Modal('modal');
  new InteractiveDemo('components');
  new FormValidator('contact-form');
  new SmoothScroll();
  new ScrollAnimations();
  new ThemeToggle();
  new PerformanceMonitor();
  new AccessibilityEnhancer();
  
  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .token-card, .component-card, .pattern-card, .doc-card, .section {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .token-card.animate-in, .component-card.animate-in, .pattern-card.animate-in, .doc-card.animate-in, .section.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .keyboard-navigation *:focus {
      outline: 2px solid var(--color-primary-500) !important;
      outline-offset: 2px !important;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .notification {
      animation: slideIn 0.3s ease;
    }
  `;
  document.head.appendChild(style);
});

// Global functions for HTML onclick handlers
function openModal() {
  const modal = new Modal('modal');
  modal.open();
}

function closeModal() {
  const modal = new Modal('modal');
  modal.close();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Modal,
    InteractiveDemo,
    FormValidator,
    SmoothScroll,
    ScrollAnimations,
    ThemeToggle,
    PerformanceMonitor,
    AccessibilityEnhancer,
    utils
  };
}

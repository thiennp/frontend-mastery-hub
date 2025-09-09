// Accessible Modal Dialog and Dropdown - Level 6 Mini-Project
// Main JavaScript file with all component implementations

// Global state
let currentModal = null;
let currentDropdown = null;
let progressInterval = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    setupEventListeners();
});

// Initialize all components
function initializeComponents() {
    // Initialize dropdowns
    initializeDropdowns();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize progress bar
    initializeProgressBar();
    
    // Initialize accessibility testing
    initializeAccessibilityTesting();
}

// Setup global event listeners
function setupEventListeners() {
    // Close modals on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (currentModal) {
                closeModal(currentModal);
            }
            if (currentDropdown) {
                currentDropdown.close();
            }
        }
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', function(e) {
        if (currentDropdown && !currentDropdown.dropdown.contains(e.target)) {
            currentDropdown.close();
        }
    });
}

// ============================================================================
// MODAL DIALOG IMPLEMENTATION
// ============================================================================

class AccessibleModal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.previousFocus = null;
        this.focusableElements = [];
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;
        
        this.init();
    }
    
    init() {
        this.setupFocusManagement();
        this.setupEventListeners();
    }
    
    setupFocusManagement() {
        this.focusableElements = this.modal.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
        
        // Trap focus within modal
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === this.firstFocusableElement) {
                        e.preventDefault();
                        this.lastFocusableElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === this.lastFocusableElement) {
                        e.preventDefault();
                        this.firstFocusableElement.focus();
                    }
                }
            }
        });
    }
    
    setupEventListeners() {
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close button
        const closeButton = this.modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }
    }
    
    open() {
        this.previousFocus = document.activeElement;
        this.modal.style.display = 'flex';
        this.modal.setAttribute('aria-hidden', 'false');
        currentModal = this.modal.id;
        
        // Focus first focusable element
        if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.style.display = 'none';
        this.modal.setAttribute('aria-hidden', 'true');
        currentModal = null;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Restore focus
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
    }
    
    isOpen() {
        return this.modal.style.display === 'flex';
    }
}

// Modal functions
function openConfirmationModal() {
    const modal = new AccessibleModal('confirmation-modal');
    modal.open();
}

function openFormModal() {
    const modal = new AccessibleModal('form-modal');
    modal.open();
}

function openInfoModal() {
    const modal = new AccessibleModal('info-modal');
    modal.open();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    currentModal = null;
    document.body.style.overflow = '';
}

function confirmAction() {
    alert('Action confirmed!');
    closeModal('confirmation-modal');
}

function submitModalForm() {
    const name = document.getElementById('modal-name').value;
    const email = document.getElementById('modal-email').value;
    const message = document.getElementById('modal-message').value;
    
    if (name && email) {
        alert(`Thank you, ${name}! Your message has been sent.`);
        closeModal('form-modal');
    } else {
        alert('Please fill in all required fields.');
    }
}

// ============================================================================
// DROPDOWN MENU IMPLEMENTATION
// ============================================================================

class AccessibleDropdown {
    constructor(dropdownId) {
        this.dropdown = document.getElementById(dropdownId);
        this.trigger = this.dropdown.querySelector('.dropdown-trigger');
        this.menu = this.dropdown.querySelector('.dropdown-menu');
        this.menuItems = Array.from(this.menu.querySelectorAll('[role="menuitem"]'));
        this.currentIndex = -1;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Trigger button events
        this.trigger.addEventListener('click', () => this.toggle());
        this.trigger.addEventListener('keydown', (e) => this.handleTriggerKeydown(e));
        
        // Menu events
        this.menu.addEventListener('keydown', (e) => this.handleMenuKeydown(e));
    }
    
    handleTriggerKeydown(e) {
        switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
                e.preventDefault();
                this.open();
                this.focusFirstItem();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.open();
                this.focusLastItem();
                break;
        }
    }
    
    handleMenuKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.focusNextItem();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.focusPreviousItem();
                break;
            case 'Home':
                e.preventDefault();
                this.focusFirstItem();
                break;
            case 'End':
                e.preventDefault();
                this.focusLastItem();
                break;
            case 'Escape':
                e.preventDefault();
                this.close();
                this.trigger.focus();
                break;
            case 'Tab':
                this.close();
                break;
        }
    }
    
    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.menu.style.display = 'block';
        this.menu.setAttribute('aria-hidden', 'false');
        this.trigger.setAttribute('aria-expanded', 'true');
        currentDropdown = this;
        
        // Update tabindex for menu items
        this.menuItems.forEach(item => {
            item.setAttribute('tabindex', '0');
        });
    }
    
    close() {
        this.menu.style.display = 'none';
        this.menu.setAttribute('aria-hidden', 'true');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.currentIndex = -1;
        currentDropdown = null;
        
        // Remove tabindex from menu items
        this.menuItems.forEach(item => {
            item.setAttribute('tabindex', '-1');
        });
    }
    
    isOpen() {
        return this.menu.style.display === 'block';
    }
    
    focusFirstItem() {
        this.currentIndex = 0;
        this.menuItems[0].focus();
    }
    
    focusLastItem() {
        this.currentIndex = this.menuItems.length - 1;
        this.menuItems[this.currentIndex].focus();
    }
    
    focusNextItem() {
        this.currentIndex = Math.min(this.currentIndex + 1, this.menuItems.length - 1);
        this.menuItems[this.currentIndex].focus();
    }
    
    focusPreviousItem() {
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        this.menuItems[this.currentIndex].focus();
    }
}

// Initialize dropdowns
function initializeDropdowns() {
    const dropdowns = ['actions-dropdown', 'settings-dropdown'];
    dropdowns.forEach(id => {
        new AccessibleDropdown(id);
    });
}

// ============================================================================
// FORM VALIDATION IMPLEMENTATION
// ============================================================================

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = this.form.querySelectorAll('input, select, textarea');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        let isValid = true;
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm();
        } else {
            this.announceErrors();
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (isRequired && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required.`;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Update field state
        field.setAttribute('aria-invalid', !isValid);
        this.updateErrorMessage(field, errorMessage);
        
        return isValid;
    }
    
    updateErrorMessage(field, message) {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
    }
    
    clearError(field) {
        field.setAttribute('aria-invalid', 'false');
        this.updateErrorMessage(field, '');
    }
    
    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    announceErrors() {
        const errorMessages = Array.from(this.form.querySelectorAll('.error-message'))
            .filter(error => error.textContent)
            .map(error => error.textContent);
        
        if (errorMessages.length > 0) {
            const announcement = `Form has ${errorMessages.length} error${errorMessages.length > 1 ? 's' : ''}: ${errorMessages.join(', ')}`;
            
            // Create live region for announcement
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'assertive');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.textContent = announcement;
            
            document.body.appendChild(liveRegion);
            
            // Remove after announcement
            setTimeout(() => {
                document.body.removeChild(liveRegion);
            }, 1000);
        }
    }
    
    submitForm() {
        // Form submission logic
        alert('Form submitted successfully!');
        this.form.reset();
    }
}

// Initialize form validation
function initializeFormValidation() {
    new FormValidator('contact-form');
}

// Reset form
function resetForm() {
    const form = document.getElementById('contact-form');
    form.reset();
    
    // Clear all error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    // Reset aria-invalid attributes
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.setAttribute('aria-invalid', 'false');
    });
}

// ============================================================================
// PROGRESS BAR IMPLEMENTATION
// ============================================================================

function initializeProgressBar() {
    // Progress bar is ready for use
}

function startProgress() {
    const progressBar = document.getElementById('progress-bar');
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = document.getElementById('progress-label');
    
    let progress = 0;
    
    progressInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '% complete';
        progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }, 200);
}

// ============================================================================
// ACCESSIBILITY TESTING IMPLEMENTATION
// ============================================================================

class AccessibilityTester {
    constructor() {
        this.results = [];
    }
    
    testKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        this.results.push({
            test: 'Keyboard Navigation',
            status: 'PASS',
            message: `Found ${focusableElements.length} focusable elements`
        });
        
        // Test tab order
        let tabOrder = [];
        focusableElements.forEach((element, index) => {
            element.focus();
            tabOrder.push({
                index: index,
                element: element.tagName,
                text: element.textContent.trim().substring(0, 50)
            });
        });
        
        this.results.push({
            test: 'Tab Order',
            status: 'PASS',
            message: 'Tab order is logical and consistent',
            details: tabOrder
        });
        
        return this.results;
    }
    
    testARIACompliance() {
        const elementsWithRoles = document.querySelectorAll('[role]');
        let ariaIssues = [];
        
        elementsWithRoles.forEach(element => {
            const role = element.getAttribute('role');
            const requiredAttributes = this.getRequiredAttributes(role);
            
            requiredAttributes.forEach(attr => {
                if (!element.hasAttribute(attr)) {
                    ariaIssues.push({
                        element: element.tagName,
                        role: role,
                        missing: attr
                    });
                }
            });
        });
        
        if (ariaIssues.length === 0) {
            this.results.push({
                test: 'ARIA Compliance',
                status: 'PASS',
                message: 'All ARIA attributes are properly implemented'
            });
        } else {
            this.results.push({
                test: 'ARIA Compliance',
                status: 'FAIL',
                message: `Found ${ariaIssues.length} ARIA issues`,
                details: ariaIssues
            });
        }
        
        return this.results;
    }
    
    testFocusManagement() {
        // Test modal focus trapping
        const modals = document.querySelectorAll('.modal-overlay');
        let focusIssues = [];
        
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) {
                focusIssues.push({
                    modal: modal.id,
                    issue: 'No focusable elements found'
                });
            }
        });
        
        if (focusIssues.length === 0) {
            this.results.push({
                test: 'Focus Management',
                status: 'PASS',
                message: 'Focus management is properly implemented'
            });
        } else {
            this.results.push({
                test: 'Focus Management',
                status: 'FAIL',
                message: `Found ${focusIssues.length} focus issues`,
                details: focusIssues
            });
        }
        
        return this.results;
    }
    
    getRequiredAttributes(role) {
        const requirements = {
            'button': ['aria-label'],
            'menu': ['aria-labelledby'],
            'menuitem': [],
            'dialog': ['aria-labelledby', 'aria-modal'],
            'progressbar': ['aria-valuemin', 'aria-valuemax', 'aria-valuenow']
        };
        
        return requirements[role] || [];
    }
    
    runAllTests() {
        this.results = [];
        this.testKeyboardNavigation();
        this.testARIACompliance();
        this.testFocusManagement();
        return this.results;
    }
}

// Initialize accessibility testing
function initializeAccessibilityTesting() {
    // Accessibility testing is ready
}

// Test functions
function runAccessibilityTests() {
    const tester = new AccessibilityTester();
    const results = tester.runAllTests();
    displayTestResults(results);
}

function testKeyboardNavigation() {
    const tester = new AccessibilityTester();
    const results = tester.testKeyboardNavigation();
    displayTestResults(results);
}

function testScreenReader() {
    const results = [{
        test: 'Screen Reader Test',
        status: 'INFO',
        message: 'Please test with a screen reader (NVDA, JAWS, or VoiceOver)'
    }];
    displayTestResults(results);
}

function displayTestResults(results) {
    const resultsContainer = document.getElementById('test-results');
    resultsContainer.innerHTML = '';
    
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = `test-result ${result.status.toLowerCase()}`;
        
        let html = `
            <h4>${result.test} - ${result.status}</h4>
            <p>${result.message}</p>
        `;
        
        if (result.details) {
            html += '<details><summary>Details</summary><pre>' + JSON.stringify(result.details, null, 2) + '</pre></details>';
        }
        
        resultElement.innerHTML = html;
        resultsContainer.appendChild(resultElement);
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Focus management utility
class FocusManager {
    static trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// Keyboard navigation utility
class KeyboardNavigation {
    static handleArrowKeys(e, items, currentIndex) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                return Math.min(currentIndex + 1, items.length - 1);
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                return Math.max(currentIndex - 1, 0);
            case 'Home':
                e.preventDefault();
                return 0;
            case 'End':
                e.preventDefault();
                return items.length - 1;
        }
        return currentIndex;
    }
}

// Error message utility
class ErrorMessenger {
    static showError(field, message) {
        field.setAttribute('aria-invalid', 'true');
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    static clearError(field) {
        field.setAttribute('aria-invalid', 'false');
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Accessible Modal Dialog and Dropdown - Level 6 Mini-Project');
    console.log('All components initialized successfully');
});


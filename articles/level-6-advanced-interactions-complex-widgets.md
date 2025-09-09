# Advanced Interactions & Complex Widgets

## Overview

This article covers the implementation of complex, accessible widgets that go beyond basic HTML elements. We'll explore modal dialogs, dropdowns, tabs, accordions, and other interactive components that require careful attention to accessibility.

## Table of Contents

1. [Modal Dialogs](#modal-dialogs)
2. [Dropdown Menus](#dropdown-menus)
3. [Tab Interfaces](#tab-interfaces)
4. [Accordions](#accordions)
5. [Data Tables](#data-tables)
6. [Form Validation](#form-validation)
7. [Progress Indicators](#progress-indicators)
8. [Tooltips](#tooltips)
9. [Carousels](#carousels)
10. [Best Practices](#best-practices)

## Modal Dialogs

Modal dialogs are overlays that require user interaction before returning to the main content. They must be fully accessible with proper focus management and keyboard support.

### Basic Modal Structure

```html
<div class="modal-overlay" 
     role="dialog" 
     aria-modal="true" 
     aria-labelledby="modal-title"
     aria-describedby="modal-description"
     tabindex="-1">
    
    <div class="modal-content">
        <header class="modal-header">
            <h2 id="modal-title">Modal Title</h2>
            <button class="modal-close" 
                    aria-label="Close modal"
                    onclick="closeModal()">
                ×
            </button>
        </header>
        
        <div class="modal-body">
            <p id="modal-description">Modal content goes here...</p>
            <!-- Additional content -->
        </div>
        
        <footer class="modal-footer">
            <button type="button" onclick="closeModal()">Cancel</button>
            <button type="button" onclick="confirmAction()">Confirm</button>
        </footer>
    </div>
</div>
```

### Modal JavaScript Implementation

```javascript
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
        this.setupEventListeners();
        this.setupFocusManagement();
    }
    
    setupEventListeners() {
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
        
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
    
    open() {
        this.previousFocus = document.activeElement;
        this.modal.style.display = 'block';
        this.modal.setAttribute('aria-hidden', 'false');
        
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
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Restore focus
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
    }
    
    isOpen() {
        return this.modal.style.display === 'block';
    }
}

// Usage
const modal = new AccessibleModal('myModal');

// Open modal
document.getElementById('openModal').addEventListener('click', () => {
    modal.open();
});
```

### Modal CSS

```css
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    z-index: 1000;
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e5e5;
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
}

.modal-close:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

.modal-body {
    padding: 1rem;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e5e5e5;
}
```

## Dropdown Menus

Dropdown menus provide a list of options that appear when triggered. They must support keyboard navigation and proper ARIA attributes.

### Dropdown HTML Structure

```html
<div class="dropdown">
    <button class="dropdown-trigger" 
            aria-expanded="false" 
            aria-haspopup="menu" 
            aria-controls="dropdown-menu"
            id="dropdown-button">
        Select Option
        <span aria-hidden="true">▼</span>
    </button>
    
    <ul class="dropdown-menu" 
        id="dropdown-menu" 
        role="menu" 
        aria-labelledby="dropdown-button"
        aria-hidden="true">
        <li role="none">
            <a href="#" role="menuitem" tabindex="-1">Option 1</a>
        </li>
        <li role="none">
            <a href="#" role="menuitem" tabindex="-1">Option 2</a>
        </li>
        <li role="none">
            <a href="#" role="menuitem" tabindex="-1">Option 3</a>
        </li>
    </ul>
</div>
```

### Dropdown JavaScript Implementation

```javascript
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
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target)) {
                this.close();
            }
        });
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

// Usage
const dropdown = new AccessibleDropdown('myDropdown');
```

## Tab Interfaces

Tab interfaces allow users to switch between different content panels. They must support keyboard navigation and proper ARIA attributes.

### Tab HTML Structure

```html
<div class="tab-container">
    <div class="tab-list" 
         role="tablist" 
         aria-label="Settings">
        <button class="tab-button" 
                role="tab" 
                aria-selected="true" 
                aria-controls="panel1"
                id="tab1"
                tabindex="0">
            General
        </button>
        <button class="tab-button" 
                role="tab" 
                aria-selected="false" 
                aria-controls="panel2"
                id="tab2"
                tabindex="-1">
            Advanced
        </button>
        <button class="tab-button" 
                role="tab" 
                aria-selected="false" 
                aria-controls="panel3"
                id="tab3"
                tabindex="-1">
            Privacy
        </button>
    </div>
    
    <div class="tab-panels">
        <div class="tab-panel" 
             role="tabpanel" 
             id="panel1" 
             aria-labelledby="tab1"
             tabindex="0">
            <h3>General Settings</h3>
            <p>General settings content...</p>
        </div>
        
        <div class="tab-panel" 
             role="tabpanel" 
             id="panel2" 
             aria-labelledby="tab2"
             aria-hidden="true"
             tabindex="-1">
            <h3>Advanced Settings</h3>
            <p>Advanced settings content...</p>
        </div>
        
        <div class="tab-panel" 
             role="tabpanel" 
             id="panel3" 
             aria-labelledby="tab3"
             aria-hidden="true"
             tabindex="-1">
            <h3>Privacy Settings</h3>
            <p>Privacy settings content...</p>
        </div>
    </div>
</div>
```

### Tab JavaScript Implementation

```javascript
class AccessibleTabs {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tabList = this.container.querySelector('[role="tablist"]');
        this.tabs = Array.from(this.tabList.querySelectorAll('[role="tab"]'));
        this.panels = Array.from(this.container.querySelectorAll('[role="tabpanel"]'));
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateTabStates();
    }
    
    setupEventListeners() {
        // Tab button events
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.activateTab(index));
            tab.addEventListener('keydown', (e) => this.handleTabKeydown(e, index));
        });
    }
    
    handleTabKeydown(e, index) {
        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                this.activateNextTab();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.activatePreviousTab();
                break;
            case 'Home':
                e.preventDefault();
                this.activateTab(0);
                break;
            case 'End':
                e.preventDefault();
                this.activateTab(this.tabs.length - 1);
                break;
        }
    }
    
    activateTab(index) {
        this.currentIndex = index;
        this.updateTabStates();
        this.updatePanelStates();
    }
    
    activateNextTab() {
        const nextIndex = (this.currentIndex + 1) % this.tabs.length;
        this.activateTab(nextIndex);
    }
    
    activatePreviousTab() {
        const prevIndex = this.currentIndex === 0 ? this.tabs.length - 1 : this.currentIndex - 1;
        this.activateTab(prevIndex);
    }
    
    updateTabStates() {
        this.tabs.forEach((tab, index) => {
            const isSelected = index === this.currentIndex;
            tab.setAttribute('aria-selected', isSelected);
            tab.setAttribute('tabindex', isSelected ? '0' : '-1');
            
            if (isSelected) {
                tab.focus();
            }
        });
    }
    
    updatePanelStates() {
        this.panels.forEach((panel, index) => {
            const isActive = index === this.currentIndex;
            panel.setAttribute('aria-hidden', !isActive);
            panel.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    }
}

// Usage
const tabs = new AccessibleTabs('myTabs');
```

## Accordions

Accordions allow users to expand and collapse content sections. They must support keyboard navigation and proper ARIA attributes.

### Accordion HTML Structure

```html
<div class="accordion">
    <h2>Frequently Asked Questions</h2>
    
    <div class="accordion-item">
        <button class="accordion-trigger" 
                aria-expanded="false" 
                aria-controls="panel1"
                id="trigger1">
            <span class="accordion-title">What is accessibility?</span>
            <span class="accordion-icon" aria-hidden="true">+</span>
        </button>
        <div class="accordion-panel" 
             id="panel1" 
             aria-labelledby="trigger1"
             aria-hidden="true">
            <div class="accordion-content">
                <p>Accessibility is the practice of making your websites usable by as many people as possible.</p>
            </div>
        </div>
    </div>
    
    <div class="accordion-item">
        <button class="accordion-trigger" 
                aria-expanded="false" 
                aria-controls="panel2"
                id="trigger2">
            <span class="accordion-title">Why is accessibility important?</span>
            <span class="accordion-icon" aria-hidden="true">+</span>
        </button>
        <div class="accordion-panel" 
             id="panel2" 
             aria-labelledby="trigger2"
             aria-hidden="true">
            <div class="accordion-content">
                <p>Accessibility ensures that everyone can use your website, regardless of their abilities.</p>
            </div>
        </div>
    </div>
</div>
```

### Accordion JavaScript Implementation

```javascript
class AccessibleAccordion {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.triggers = Array.from(this.container.querySelectorAll('.accordion-trigger'));
        this.panels = Array.from(this.container.querySelectorAll('.accordion-panel'));
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => this.togglePanel(index));
            trigger.addEventListener('keydown', (e) => this.handleKeydown(e, index));
        });
    }
    
    handleKeydown(e, index) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.focusNextTrigger(index);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.focusPreviousTrigger(index);
                break;
            case 'Home':
                e.preventDefault();
                this.focusFirstTrigger();
                break;
            case 'End':
                e.preventDefault();
                this.focusLastTrigger();
                break;
        }
    }
    
    togglePanel(index) {
        const trigger = this.triggers[index];
        const panel = this.panels[index];
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            this.closePanel(index);
        } else {
            this.openPanel(index);
        }
    }
    
    openPanel(index) {
        const trigger = this.triggers[index];
        const panel = this.panels[index];
        const icon = trigger.querySelector('.accordion-icon');
        
        trigger.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        icon.textContent = '-';
    }
    
    closePanel(index) {
        const trigger = this.triggers[index];
        const panel = this.panels[index];
        const icon = trigger.querySelector('.accordion-icon');
        
        trigger.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        icon.textContent = '+';
    }
    
    focusNextTrigger(currentIndex) {
        const nextIndex = (currentIndex + 1) % this.triggers.length;
        this.triggers[nextIndex].focus();
    }
    
    focusPreviousTrigger(currentIndex) {
        const prevIndex = currentIndex === 0 ? this.triggers.length - 1 : currentIndex - 1;
        this.triggers[prevIndex].focus();
    }
    
    focusFirstTrigger() {
        this.triggers[0].focus();
    }
    
    focusLastTrigger() {
        this.triggers[this.triggers.length - 1].focus();
    }
}

// Usage
const accordion = new AccessibleAccordion('myAccordion');
```

## Data Tables

Data tables must be accessible with proper headers, captions, and keyboard navigation support.

### Accessible Data Table

```html
<table>
    <caption>Monthly Sales Report</caption>
    <thead>
        <tr>
            <th scope="col">Month</th>
            <th scope="col">Sales</th>
            <th scope="col">Growth</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">January</th>
            <td>$10,000</td>
            <td>+5%</td>
            <td>
                <button aria-label="Edit January data">Edit</button>
                <button aria-label="Delete January data">Delete</button>
            </td>
        </tr>
        <tr>
            <th scope="row">February</th>
            <td>$12,000</td>
            <td>+20%</td>
            <td>
                <button aria-label="Edit February data">Edit</button>
                <button aria-label="Delete February data">Delete</button>
            </td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Total</th>
            <td>$22,000</td>
            <td>+12.5%</td>
            <td></td>
        </tr>
    </tfoot>
</table>
```

### Sortable Table

```html
<table>
    <caption>Sortable Employee Directory</caption>
    <thead>
        <tr>
            <th scope="col">
                <button aria-sort="none" onclick="sortTable(0)">
                    Name
                    <span aria-hidden="true">↕</span>
                </button>
            </th>
            <th scope="col">
                <button aria-sort="none" onclick="sortTable(1)">
                    Department
                    <span aria-hidden="true">↕</span>
                </button>
            </th>
            <th scope="col">
                <button aria-sort="none" onclick="sortTable(2)">
                    Salary
                    <span aria-hidden="true">↕</span>
                </button>
            </th>
        </tr>
    </thead>
    <tbody>
        <!-- Table rows -->
    </tbody>
</table>
```

## Form Validation

Form validation must provide clear, accessible error messages and proper ARIA attributes.

### Accessible Form with Validation

```html
<form novalidate>
    <fieldset>
        <legend>Contact Information</legend>
        
        <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" 
                   id="name" 
                   name="name" 
                   required
                   aria-invalid="false"
                   aria-describedby="name-error name-help">
            <div id="name-help" class="help-text">
                Enter your full name
            </div>
            <div id="name-error" 
                 class="error-message" 
                 role="alert" 
                 aria-live="polite">
                <!-- Error messages appear here -->
            </div>
        </div>
        
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" 
                   id="email" 
                   name="email" 
                   required
                   aria-invalid="false"
                   aria-describedby="email-error email-help">
            <div id="email-help" class="help-text">
                We'll never share your email
            </div>
            <div id="email-error" 
                 class="error-message" 
                 role="alert" 
                 aria-live="polite">
                <!-- Error messages appear here -->
            </div>
        </div>
        
        <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" 
                   id="phone" 
                   name="phone"
                   aria-describedby="phone-help">
            <div id="phone-help" class="help-text">
                Optional: Include country code
            </div>
        </div>
    </fieldset>
    
    <div class="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onclick="resetForm()">Reset</button>
    </div>
</form>
```

### Form Validation JavaScript

```javascript
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
        
        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number.';
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
        console.log('Form submitted successfully');
    }
}

// Usage
const validator = new FormValidator('contactForm');
```

## Progress Indicators

Progress indicators show the completion status of a process. They must be accessible to screen readers.

### Progress Bar

```html
<div class="progress-container">
    <label for="progress-bar">Upload Progress</label>
    <div class="progress-bar" 
         role="progressbar" 
         aria-valuemin="0" 
         aria-valuemax="100" 
         aria-valuenow="0"
         aria-labelledby="progress-label"
         id="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
    </div>
    <div id="progress-label" class="progress-text">0% complete</div>
</div>
```

### Step Progress

```html
<nav aria-label="Progress">
    <ol class="step-progress">
        <li class="step completed" aria-current="false">
            <span class="step-number" aria-hidden="true">1</span>
            <span class="step-label">Account</span>
        </li>
        <li class="step completed" aria-current="false">
            <span class="step-number" aria-hidden="true">2</span>
            <span class="step-label">Profile</span>
        </li>
        <li class="step current" aria-current="true">
            <span class="step-number" aria-hidden="true">3</span>
            <span class="step-label">Preferences</span>
        </li>
        <li class="step" aria-current="false">
            <span class="step-number" aria-hidden="true">4</span>
            <span class="step-label">Review</span>
        </li>
    </ol>
</nav>
```

## Tooltips

Tooltips provide additional information about elements. They must be accessible and properly positioned.

### Accessible Tooltip

```html
<div class="tooltip-container">
    <button aria-describedby="tooltip1" 
            aria-expanded="false"
            onclick="toggleTooltip('tooltip1')">
        Hover for more info
    </button>
    <div class="tooltip" 
         id="tooltip1" 
         role="tooltip" 
         aria-hidden="true">
        This is additional information about the button.
    </div>
</div>
```

### Tooltip JavaScript

```javascript
class AccessibleTooltip {
    constructor(triggerId, tooltipId) {
        this.trigger = document.getElementById(triggerId);
        this.tooltip = document.getElementById(tooltipId);
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.trigger.addEventListener('mouseenter', () => this.show());
        this.trigger.addEventListener('mouseleave', () => this.hide());
        this.trigger.addEventListener('focus', () => this.show());
        this.trigger.addEventListener('blur', () => this.hide());
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    }
    
    show() {
        this.tooltip.style.display = 'block';
        this.tooltip.setAttribute('aria-hidden', 'false');
        this.trigger.setAttribute('aria-expanded', 'true');
        this.isVisible = true;
    }
    
    hide() {
        this.tooltip.style.display = 'none';
        this.tooltip.setAttribute('aria-hidden', 'true');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.isVisible = false;
    }
}

// Usage
const tooltip = new AccessibleTooltip('trigger1', 'tooltip1');
```

## Carousels

Carousels display multiple items in a rotating sequence. They must support keyboard navigation and screen readers.

### Accessible Carousel

```html
<div class="carousel" 
     role="region" 
     aria-label="Featured products">
    
    <div class="carousel-container">
        <div class="carousel-track" 
             aria-live="polite"
             aria-atomic="true">
            <div class="carousel-slide" 
                 aria-hidden="false"
                 tabindex="0">
                <img src="product1.jpg" alt="Product 1">
                <h3>Product 1</h3>
                <p>Description of product 1</p>
            </div>
            <div class="carousel-slide" 
                 aria-hidden="true"
                 tabindex="-1">
                <img src="product2.jpg" alt="Product 2">
                <h3>Product 2</h3>
                <p>Description of product 2</p>
            </div>
            <div class="carousel-slide" 
                 aria-hidden="true"
                 tabindex="-1">
                <img src="product3.jpg" alt="Product 3">
                <h3>Product 3</h3>
                <p>Description of product 3</p>
            </div>
        </div>
    </div>
    
    <div class="carousel-controls">
        <button class="carousel-prev" 
                aria-label="Previous slide"
                onclick="previousSlide()">
            ‹
        </button>
        <button class="carousel-next" 
                aria-label="Next slide"
                onclick="nextSlide()">
            ›
        </button>
    </div>
    
    <div class="carousel-indicators" 
         role="tablist" 
         aria-label="Slide navigation">
        <button role="tab" 
                aria-selected="true" 
                aria-controls="slide1"
                onclick="goToSlide(0)">
            <span class="sr-only">Go to slide 1</span>
        </button>
        <button role="tab" 
                aria-selected="false" 
                aria-controls="slide2"
                onclick="goToSlide(1)">
            <span class="sr-only">Go to slide 2</span>
        </button>
        <button role="tab" 
                aria-selected="false" 
                aria-controls="slide3"
                onclick="goToSlide(2)">
            <span class="sr-only">Go to slide 3</span>
        </button>
    </div>
</div>
```

## Best Practices

### 1. Consistent Patterns

Use consistent interaction patterns across your application:

```javascript
// Consistent keyboard navigation
class ConsistentNavigation {
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
```

### 2. Proper Focus Management

Always manage focus appropriately:

```javascript
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
```

### 3. Clear Error Messages

Provide clear, actionable error messages:

```javascript
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
```

### 4. Testing and Validation

Always test your components with real users and assistive technologies:

```javascript
// Accessibility testing utility
class AccessibilityTester {
    static testKeyboardNavigation(component) {
        const focusableElements = component.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        console.log('Focusable elements:', focusableElements.length);
        
        focusableElements.forEach((element, index) => {
            element.focus();
            console.log(`Element ${index}:`, element.tagName, element.textContent);
        });
    }
    
    static testARIACompliance(component) {
        const elementsWithRoles = component.querySelectorAll('[role]');
        elementsWithRoles.forEach(element => {
            const role = element.getAttribute('role');
            const requiredAttributes = this.getRequiredAttributes(role);
            
            requiredAttributes.forEach(attr => {
                if (!element.hasAttribute(attr)) {
                    console.warn(`Element with role "${role}" missing required attribute: ${attr}`);
                }
            });
        });
    }
}
```

## Conclusion

Creating accessible complex widgets requires careful attention to detail and thorough testing. By following established patterns, using proper ARIA attributes, and implementing comprehensive keyboard navigation, you can create components that work for all users.

Key takeaways:
- Use semantic HTML as the foundation
- Implement proper ARIA attributes
- Ensure keyboard navigation works correctly
- Provide clear focus indicators
- Test with real users and assistive technologies
- Follow established patterns and best practices
- Keep components simple and intuitive

## Next Steps

In the next article, we'll create a comprehensive mini-project that demonstrates all the concepts covered in this level: an accessible modal dialog and dropdown system.


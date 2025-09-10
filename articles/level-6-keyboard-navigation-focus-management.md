# Keyboard Navigation & Focus Management

## Overview

Keyboard navigation is essential for accessibility, allowing users to interact with web content without a mouse. This article covers focus management, keyboard navigation patterns, and how to implement them effectively in web applications.

## Table of Contents

1. [Understanding Focus](#understanding-focus)
2. [Keyboard Navigation Basics](#keyboard-navigation-basics)
3. [Focus Management Techniques](#focus-management-techniques)
4. [Tab Order and Tabindex](#tab-order-and-tabindex)
5. [Keyboard Event Handling](#keyboard-event-handling)
6. [Common Navigation Patterns](#common-navigation-patterns)
7. [Focus Trapping](#focus-trapping)
8. [Skip Links](#skip-links)
9. [Testing Keyboard Navigation](#testing-keyboard-navigation)
10. [Best Practices](#best-practices)

## Understanding Focus

Focus is the visual indicator that shows which element is currently active and will receive keyboard input. It's crucial for keyboard users to understand where they are on the page and what they can interact with.

### Visual Focus Indicators

```css
/* Default focus styles */
:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

/* Custom focus styles */
button:focus {
    outline: 3px solid #ff6b35;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.3);
}

/* High contrast focus for better visibility */
@media (prefers-contrast: high) {
    :focus {
        outline: 3px solid;
        outline-offset: 3px;
    }
}
```

### Focusable Elements

Not all elements can receive focus. Focusable elements include:
- Links (`<a>`)
- Form controls (`<input>`, `<select>`, `<textarea>`, `<button>`)
- Elements with `tabindex="0"` or positive values
- Elements with certain ARIA roles

```html
<!-- Focusable elements -->
<a href="/page">Link</a>
<button>Button</button>
<input type="text" placeholder="Input field">
<select>
    <option>Option 1</option>
</select>

<!-- Non-focusable elements -->
<div>Regular div</div>
<span>Regular span</span>
<p>Paragraph text</p>
```

## Keyboard Navigation Basics

### Standard Navigation Keys

- **Tab**: Move to next focusable element
- **Shift + Tab**: Move to previous focusable element
- **Enter/Space**: Activate focused element
- **Arrow Keys**: Navigate within components
- **Escape**: Close modals, cancel actions
- **Home/End**: Navigate to beginning/end of lists

### Navigation Patterns by Component

#### Links and Buttons

```html
<!-- Standard navigation -->
<nav>
    <a href="/" tabindex="0">Home</a>
    <a href="/about" tabindex="0">About</a>
    <a href="/contact" tabindex="0">Contact</a>
</nav>

<!-- Button group -->
<div role="group" aria-label="Actions">
    <button>Save</button>
    <button>Cancel</button>
    <button>Delete</button>
</div>
```

#### Form Controls

```html
<form>
    <fieldset>
        <legend>User Information</legend>
        
        <div>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div>
            <label for="country">Country</label>
            <select id="country" name="country">
                <option value="">Select country</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
            </select>
        </div>
        
        <div>
            <label>
                <input type="checkbox" name="newsletter">
                Subscribe to newsletter
            </label>
        </div>
        
        <button type="submit">Submit</button>
    </fieldset>
</form>
```

## Focus Management Techniques

### Programmatic Focus

```javascript
// Focus an element
document.getElementById('myButton').focus();

// Check if element has focus
if (document.activeElement === document.getElementById('myButton')) {
    console.log('Button has focus');
}

// Focus first focusable element in container
function focusFirstFocusable(container) {
    const focusableElements = container.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

// Focus last focusable element in container
function focusLastFocusable(container) {
    const focusableElements = container.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
    }
}
```

### Focus Restoration

```javascript
class FocusManager {
    constructor() {
        this.previousFocus = null;
    }
    
    // Save current focus before opening modal
    saveFocus() {
        this.previousFocus = document.activeElement;
    }
    
    // Restore focus after closing modal
    restoreFocus() {
        if (this.previousFocus) {
            this.previousFocus.focus();
            this.previousFocus = null;
        }
    }
    
    // Focus trap for modal
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}
```

## Tab Order and Tabindex

### Tabindex Values

- **`tabindex="0"`**: Element is focusable and in natural tab order
- **`tabindex="-1"`**: Element is focusable but not in tab order
- **`tabindex="1+"`**: Element is focusable and in custom tab order (avoid)

```html
<!-- Natural tab order -->
<button tabindex="0">Button 1</button>
<button tabindex="0">Button 2</button>
<button tabindex="0">Button 3</button>

<!-- Skip in tab order -->
<button tabindex="-1">Skip this button</button>

<!-- Custom tab order (avoid) -->
<button tabindex="3">Button 3</button>
<button tabindex="1">Button 1</button>
<button tabindex="2">Button 2</button>
```

### Managing Tab Order

```html
<!-- Logical tab order -->
<form>
    <fieldset>
        <legend>Personal Information</legend>
        
        <div>
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" tabindex="0">
        </div>
        
        <div>
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" tabindex="0">
        </div>
        
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" tabindex="0">
        </div>
        
        <button type="submit" tabindex="0">Submit</button>
        <button type="button" tabindex="0">Cancel</button>
    </fieldset>
</form>
```

## Keyboard Event Handling

### Basic Keyboard Events

```javascript
// Handle keydown events
element.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'Enter':
        case ' ':
            // Activate element
            event.preventDefault();
            element.click();
            break;
        case 'Escape':
            // Cancel or close
            event.preventDefault();
            closeModal();
            break;
        case 'ArrowDown':
            // Navigate down
            event.preventDefault();
            navigateDown();
            break;
        case 'ArrowUp':
            // Navigate up
            event.preventDefault();
            navigateUp();
            break;
    }
});
```

### Arrow Key Navigation

```javascript
class ArrowKeyNavigation {
    constructor(container) {
        this.container = container;
        this.items = Array.from(container.querySelectorAll('[role="option"]'));
        this.currentIndex = 0;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.container.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateDown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateUp();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToFirst();
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToLast();
                    break;
            }
        });
    }
    
    navigateDown() {
        this.currentIndex = Math.min(this.currentIndex + 1, this.items.length - 1);
        this.updateFocus();
    }
    
    navigateUp() {
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        this.updateFocus();
    }
    
    navigateToFirst() {
        this.currentIndex = 0;
        this.updateFocus();
    }
    
    navigateToLast() {
        this.currentIndex = this.items.length - 1;
        this.updateFocus();
    }
    
    updateFocus() {
        // Remove focus from all items
        this.items.forEach(item => {
            item.setAttribute('aria-selected', 'false');
            item.classList.remove('focused');
        });
        
        // Focus current item
        const currentItem = this.items[this.currentIndex];
        currentItem.setAttribute('aria-selected', 'true');
        currentItem.classList.add('focused');
        currentItem.focus();
    }
}
```

## Common Navigation Patterns

### Menu Navigation

```html
<nav role="navigation" aria-label="Main navigation">
    <ul role="menubar">
        <li role="none">
            <a href="/" role="menuitem" tabindex="0">Home</a>
        </li>
        <li role="none">
            <a href="/products" role="menuitem" tabindex="0">Products</a>
        </li>
        <li role="none">
            <a href="/about" role="menuitem" tabindex="0">About</a>
        </li>
        <li role="none">
            <a href="/contact" role="menuitem" tabindex="0">Contact</a>
        </li>
    </ul>
</nav>
```

### Dropdown Menu

```html
<div class="dropdown">
    <button aria-expanded="false" 
            aria-haspopup="menu" 
            aria-controls="menu"
            tabindex="0">
        Actions
    </button>
    <ul role="menu" 
        id="menu" 
        aria-hidden="true"
        tabindex="-1">
        <li role="none">
            <a href="/edit" role="menuitem" tabindex="-1">Edit</a>
        </li>
        <li role="none">
            <a href="/delete" role="menuitem" tabindex="-1">Delete</a>
        </li>
        <li role="none">
            <a href="/share" role="menuitem" tabindex="-1">Share</a>
        </li>
    </ul>
</div>
```

### Tab Interface

```html
<div role="tablist" aria-label="Settings">
    <button role="tab" 
            aria-selected="true" 
            aria-controls="panel1"
            id="tab1"
            tabindex="0">
        General
    </button>
    <button role="tab" 
            aria-selected="false" 
            aria-controls="panel2"
            id="tab2"
            tabindex="-1">
        Advanced
    </button>
</div>

<div role="tabpanel" 
     id="panel1" 
     aria-labelledby="tab1"
     tabindex="0">
    General settings content...
</div>

<div role="tabpanel" 
     id="panel2" 
     aria-labelledby="tab2"
     aria-hidden="true"
     tabindex="-1">
    Advanced settings content...
</div>
```

## Focus Trapping

Focus trapping ensures that keyboard navigation stays within a specific area, commonly used for modals and dialogs.

### Modal Focus Trap

```javascript
class ModalFocusTrap {
    constructor(modal) {
        this.modal = modal;
        this.focusableElements = modal.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        this.firstElement = this.focusableElements[0];
        this.lastElement = this.focusableElements[this.focusableElements.length - 1];
        this.previousFocus = document.activeElement;
        
        this.setupTrap();
    }
    
    setupTrap() {
        // Focus first element
        this.firstElement.focus();
        
        // Trap focus within modal
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === this.firstElement) {
                        e.preventDefault();
                        this.lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === this.lastElement) {
                        e.preventDefault();
                        this.firstElement.focus();
                    }
                }
            }
        });
    }
    
    restoreFocus() {
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
    }
}

// Usage
const modal = document.getElementById('modal');
const trap = new ModalFocusTrap(modal);

// When closing modal
trap.restoreFocus();
```

### List Focus Trap

```javascript
class ListFocusTrap {
    constructor(list) {
        this.list = list;
        this.items = Array.from(list.querySelectorAll('[role="option"]'));
        this.currentIndex = 0;
        this.setupTrap();
    }
    
    setupTrap() {
        this.list.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateDown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateUp();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToFirst();
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToLast();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.close();
                    break;
            }
        });
    }
    
    navigateDown() {
        this.currentIndex = Math.min(this.currentIndex + 1, this.items.length - 1);
        this.updateFocus();
    }
    
    navigateUp() {
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        this.updateFocus();
    }
    
    navigateToFirst() {
        this.currentIndex = 0;
        this.updateFocus();
    }
    
    navigateToLast() {
        this.currentIndex = this.items.length - 1;
        this.updateFocus();
    }
    
    updateFocus() {
        this.items.forEach((item, index) => {
            item.setAttribute('aria-selected', index === this.currentIndex);
            if (index === this.currentIndex) {
                item.focus();
            }
        });
    }
    
    close() {
        this.list.style.display = 'none';
        this.list.setAttribute('aria-hidden', 'true');
    }
}
```

## Skip Links

Skip links allow keyboard users to bypass repetitive content and jump to main content.

### Basic Skip Links

```html
<body>
    <!-- Skip links -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>
    
    <header>
        <nav id="navigation">
            <!-- Navigation content -->
        </nav>
    </header>
    
    <main id="main-content">
        <!-- Main content -->
    </main>
</body>
```

### Skip Link Styling

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: 4px;
}

.skip-link:focus {
    top: 6px;
}

/* Hide skip links when not focused */
.skip-link:not(:focus) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}
```

### Multiple Skip Links

```html
<nav class="skip-links" aria-label="Skip navigation">
    <a href="#main-content">Skip to main content</a>
    <a href="#navigation">Skip to navigation</a>
    <a href="#search">Skip to search</a>
    <a href="#footer">Skip to footer</a>
</nav>
```

## Testing Keyboard Navigation

### Manual Testing Checklist

- [ ] All interactive elements are reachable via keyboard
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible and clear
- [ ] Arrow keys work within components
- [ ] Enter and Space activate appropriate elements
- [ ] Escape closes modals and cancels actions
- [ ] Skip links work correctly
- [ ] Focus is managed properly in dynamic content

### Automated Testing

```javascript
// Test focus management
function testFocusManagement() {
    const focusableElements = document.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    console.log('Focusable elements:', focusableElements.length);
    
    // Test tab order
    focusableElements.forEach((element, index) => {
        element.focus();
        console.log(`Element ${index}:`, element.tagName, element.textContent);
    });
}

// Test keyboard navigation
function testKeyboardNavigation() {
    const testElement = document.getElementById('test-component');
    
    testElement.addEventListener('keydown', (e) => {
        console.log('Key pressed:', e.key);
        console.log('Current focus:', document.activeElement);
    });
}
```

### Screen Reader Testing

Test with actual screen readers to ensure:
- Focus announcements are clear
- Navigation instructions are provided
- State changes are announced
- Content is read in logical order

## Best Practices

### 1. Logical Tab Order

```html
<!-- Good: Logical left-to-right, top-to-bottom order -->
<form>
    <fieldset>
        <legend>Contact Form</legend>
        <input type="text" placeholder="First Name">
        <input type="text" placeholder="Last Name">
        <input type="email" placeholder="Email">
        <textarea placeholder="Message"></textarea>
        <button type="submit">Submit</button>
    </fieldset>
</form>
```

### 2. Clear Focus Indicators

```css
/* Visible focus indicators */
:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

/* High contrast for better visibility */
@media (prefers-contrast: high) {
    :focus {
        outline: 3px solid;
        outline-offset: 3px;
    }
}
```

### 3. Consistent Navigation Patterns

```javascript
// Consistent arrow key navigation
class ConsistentNavigation {
    constructor(container) {
        this.container = container;
        this.setupNavigation();
    }
    
    setupNavigation() {
        this.container.addEventListener('keydown', (e) => {
            // Always prevent default for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.handleArrowKey(e.key);
            }
        });
    }
    
    handleArrowKey(key) {
        // Implement consistent navigation logic
        switch (key) {
            case 'ArrowDown':
                this.navigateDown();
                break;
            case 'ArrowUp':
                this.navigateUp();
                break;
            case 'ArrowLeft':
                this.navigateLeft();
                break;
            case 'ArrowRight':
                this.navigateRight();
                break;
        }
    }
}
```

### 4. Proper ARIA Implementation

```html
<!-- Good: Proper ARIA with keyboard support -->
<button aria-expanded="false" 
        aria-controls="menu"
        aria-haspopup="menu">
    Menu
</button>
<ul role="menu" 
    id="menu" 
    aria-hidden="true">
    <li role="none">
        <a href="/item1" role="menuitem">Item 1</a>
    </li>
</ul>
```

### 5. Focus Management in Dynamic Content

```javascript
// Manage focus when content changes
function updateDynamicContent(newContent) {
    const container = document.getElementById('dynamic-container');
    const currentFocus = document.activeElement;
    
    // Update content
    container.innerHTML = newContent;
    
    // Restore focus if possible
    const newFocusableElement = container.querySelector(
        `[data-focus-id="${currentFocus.dataset.focusId}"]`
    );
    
    if (newFocusableElement) {
        newFocusableElement.focus();
    } else {
        // Focus first focusable element
        const firstFocusable = container.querySelector(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}
```

## Conclusion

Keyboard navigation and focus management are essential for creating accessible web applications. By implementing proper focus management, logical tab order, and consistent navigation patterns, you ensure that all users can effectively interact with your content using only the keyboard.

Key takeaways:
- Always provide clear focus indicators
- Maintain logical tab order
- Implement proper keyboard event handling
- Use focus trapping for modals and dialogs
- Provide skip links for better navigation
- Test with actual keyboard users and screen readers
- Follow established patterns and best practices

## Next Steps

In the next article, we'll explore advanced interactions and complex widgets, building upon the keyboard navigation and focus management techniques covered here.



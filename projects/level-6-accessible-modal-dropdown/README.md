# Accessible Modal Dialog and Dropdown - Level 6 Mini-Project

## Project Overview

This mini-project demonstrates the implementation of accessible modal dialogs and dropdown menus using semantic HTML, ARIA attributes, and comprehensive keyboard navigation. The project showcases all the accessibility concepts covered in Level 6.

## Features

### Modal Dialog
- **Focus Management**: Proper focus trapping and restoration
- **Keyboard Navigation**: Full keyboard support with Tab, Shift+Tab, and Escape
- **ARIA Attributes**: Complete ARIA implementation for screen readers
- **Visual Design**: Clear focus indicators and responsive design
- **Multiple Modals**: Support for different modal types (confirmation, form, info)

### Dropdown Menu
- **Keyboard Navigation**: Arrow keys, Enter, Space, and Escape support
- **Focus Management**: Proper focus handling and restoration
- **ARIA States**: Dynamic ARIA attributes for screen readers
- **Multiple Dropdowns**: Support for multiple dropdown instances
- **Click Outside**: Close dropdown when clicking outside

### Additional Components
- **Skip Links**: Navigation shortcuts for keyboard users
- **Form Validation**: Accessible form with error handling
- **Progress Indicators**: Accessible progress feedback
- **Tooltips**: Accessible tooltip system

## Project Structure

```
level-6-accessible-modal-dropdown/
├── README.md
├── index.html
├── styles.css
├── script.js
├── src/
│   ├── components/
│   │   ├── Modal.js
│   │   ├── Dropdown.js
│   │   ├── FormValidator.js
│   │   └── Tooltip.js
│   ├── utils/
│   │   ├── FocusManager.js
│   │   ├── KeyboardNavigation.js
│   │   └── AccessibilityTester.js
│   └── styles/
│       ├── modal.css
│       ├── dropdown.css
│       └── components.css
└── tests/
    └── accessibility.test.js
```

## Getting Started

### Prerequisites
- Modern web browser
- Basic understanding of HTML, CSS, and JavaScript
- Screen reader for testing (optional but recommended)

### Installation
1. Clone or download the project files
2. Open `index.html` in a web browser
3. Test with keyboard navigation and screen reader

### Usage

#### Opening a Modal
```javascript
// Open confirmation modal
const modal = new AccessibleModal('confirmation-modal');
modal.open();

// Open form modal
const formModal = new AccessibleModal('form-modal');
formModal.open();
```

#### Creating a Dropdown
```javascript
// Create dropdown
const dropdown = new AccessibleDropdown('my-dropdown');
dropdown.init();

// Programmatically open/close
dropdown.open();
dropdown.close();
```

#### Form Validation
```javascript
// Initialize form validator
const validator = new FormValidator('contact-form');
validator.init();
```

## Accessibility Features

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate between focusable elements
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate within components
- **Escape**: Close modals and dropdowns
- **Home/End**: Jump to first/last items in lists

### Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **ARIA States**: Dynamic state announcements
- **Live Regions**: Announce dynamic content changes
- **Semantic HTML**: Proper heading structure and landmarks

### Focus Management
- **Focus Trapping**: Keep focus within modals
- **Focus Restoration**: Return focus to trigger element
- **Visible Focus**: Clear focus indicators
- **Skip Links**: Quick navigation shortcuts

## Testing

### Manual Testing
1. **Keyboard Only**: Navigate using only keyboard
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **High Contrast**: Test with high contrast mode
4. **Zoom**: Test at 200% zoom level

### Automated Testing
```javascript
// Run accessibility tests
const tester = new AccessibilityTester();
tester.testKeyboardNavigation();
tester.testARIACompliance();
tester.testFocusManagement();
```

### Testing Checklist
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] Screen reader announces content correctly
- [ ] Modal focus trapping works properly
- [ ] Dropdown keyboard navigation works
- [ ] Form validation provides clear error messages
- [ ] Skip links function correctly
- [ ] ARIA attributes are properly implemented

## Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Dependencies

- None (vanilla JavaScript)
- Modern browser with ES6+ support

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Navigation Testing](https://webaim.org/techniques/keyboard/)

## Support

For questions or issues:
1. Check the documentation
2. Review the code comments
3. Test with different assistive technologies
4. Consult accessibility guidelines


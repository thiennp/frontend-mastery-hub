# Level 7: CSS Architecture - Custom Properties, Cascade Layers & Nesting Strategies

## Overview

Welcome to the fourth article in Level 7! This article focuses on CSS architecture - the art of organizing, structuring, and maintaining large-scale CSS codebases. We'll explore CSS custom properties, cascade layers, nesting strategies, and modern CSS architecture patterns that make your stylesheets maintainable, scalable, and performant.

## Learning Objectives

By the end of this article, you will be able to:

- **Master CSS Custom Properties**: Create maintainable design systems using CSS variables
- **Implement Cascade Layers**: Control CSS cascade order and specificity conflicts
- **Use CSS Nesting**: Write cleaner, more organized CSS with modern nesting
- **Design CSS Architecture**: Structure large CSS codebases for maintainability
- **Apply Modern Patterns**: Use contemporary CSS architecture methodologies

## CSS Custom Properties (CSS Variables)

CSS custom properties are a powerful way to create maintainable, dynamic stylesheets that can be easily themed and modified.

### Basic Custom Properties

```css
/* Define custom properties */
:root {
  --primary-color: #0066cc;
  --secondary-color: #6c757d;
  --font-family: 'Inter', sans-serif;
  --border-radius: 4px;
  --spacing-unit: 8px;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Use custom properties */
.button {
  background-color: var(--primary-color);
  font-family: var(--font-family);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 2);
  box-shadow: var(--shadow);
}
```

### Custom Property Inheritance

```css
/* Custom properties inherit from parent */
.theme-dark {
  --primary-color: #4dabf7;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}

.theme-light {
  --primary-color: #0066cc;
  --background-color: #ffffff;
  --text-color: #1a1a1a;
}

/* Child elements inherit the custom properties */
.card {
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--primary-color);
}
```

### Fallback Values

```css
/* Provide fallback values */
.button {
  background-color: var(--primary-color, #0066cc);
  font-size: var(--font-size, 16px);
  margin: var(--spacing, 0);
}

/* Multiple fallbacks */
.complex-fallback {
  background: var(--primary-color, var(--secondary-color, #0066cc));
}
```

### Dynamic Custom Properties

```css
/* Custom properties can be changed with JavaScript */
:root {
  --hue: 200;
  --saturation: 50%;
  --lightness: 50%;
}

.dynamic-color {
  background-color: hsl(var(--hue), var(--saturation), var(--lightness));
}

/* JavaScript can update these values */
// document.documentElement.style.setProperty('--hue', '300');
```

### Custom Properties in Media Queries

```css
:root {
  --container-padding: 1rem;
  --grid-columns: 1;
  --font-size-base: 1rem;
}

@media (min-width: 768px) {
  :root {
    --container-padding: 2rem;
    --grid-columns: 2;
    --font-size-base: 1.125rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: 3rem;
    --grid-columns: 3;
    --font-size-base: 1.25rem;
  }
}

.container {
  padding: var(--container-padding);
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  font-size: var(--font-size-base);
}
```

## Cascade Layers

Cascade layers provide explicit control over CSS cascade order, making it easier to manage specificity conflicts and organize stylesheets.

### Basic Cascade Layers

```css
/* Define layer order */
@layer reset, base, components, utilities;

/* Reset layer */
@layer reset {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
  }
}

/* Base layer */
@layer base {
  body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
  }
  
  h1, h2, h3 {
    font-weight: 700;
    margin: 1em 0 0.5em 0;
  }
}

/* Components layer */
@layer components {
  .button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #0066cc;
    color: white;
    cursor: pointer;
  }
  
  .button:hover {
    background: #0052a3;
  }
}

/* Utilities layer */
@layer utilities {
  .text-center { text-align: center; }
  .text-bold { font-weight: bold; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
}
```

### Layer Specificity

```css
/* Layers have their own specificity order */
@layer low, medium, high;

@layer low {
  .button { background: red; }
}

@layer medium {
  .button { background: blue; }
}

@layer high {
  .button { background: green; }
}

/* Green will be applied regardless of specificity */
```

### Nested Layers

```css
@layer components {
  @layer buttons {
    .button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
    }
  }
  
  @layer cards {
    .card {
      padding: 1rem;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
    }
  }
}

/* Reference nested layers */
@layer components.buttons {
  .button--primary {
    background: #0066cc;
    color: white;
  }
}
```

### Layer Import

```css
/* Import external stylesheets into layers */
@import url('reset.css') layer(reset);
@import url('base.css') layer(base);
@import url('components.css') layer(components);
@import url('utilities.css') layer(utilities);
```

## CSS Nesting

CSS nesting allows you to write more organized and maintainable CSS by nesting selectors inside their parent elements.

### Basic Nesting

```css
/* Traditional CSS */
.card {
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
}

.card-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e1e5e9;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.card-content {
  line-height: 1.6;
}

/* With CSS nesting */
.card {
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  
  &-header {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e1e5e9;
  }
  
  &-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }
  
  &-content {
    line-height: 1.6;
  }
}
```

### Pseudo-class and Pseudo-element Nesting

```css
.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #0066cc;
  color: white;
  cursor: pointer;
  
  &:hover {
    background: #0052a3;
  }
  
  &:focus {
    outline: 2px solid #4dabf7;
    outline-offset: 2px;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 0.5rem;
  }
  
  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

### Media Query Nesting

```css
.container {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
}
```

### Container Query Nesting

```css
.card-container {
  container-type: inline-size;
  
  .card {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    
    @container (min-width: 300px) {
      flex-direction: row;
      
      .card-image {
        width: 200px;
        height: 150px;
        flex-shrink: 0;
      }
      
      .card-content {
        margin-left: 1rem;
      }
    }
  }
}
```

### Complex Nesting Patterns

```css
.navigation {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0066cc;
    text-decoration: none;
    
    &:hover {
      color: #0052a3;
    }
  }
  
  &-links {
    display: flex;
    gap: 2rem;
    margin-left: auto;
    
    @media (max-width: 768px) {
      display: none;
    }
    
    .nav-link {
      color: #333;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #f8f9fa;
      }
      
      &.active {
        background-color: #0066cc;
        color: white;
      }
    }
  }
  
  &-toggle {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
}
```

## CSS Architecture Patterns

### 1. ITCSS (Inverted Triangle CSS)

```css
/* 1. Settings - Variables and configuration */
@layer settings {
  :root {
    --primary-color: #0066cc;
    --secondary-color: #6c757d;
    --font-family: 'Inter', sans-serif;
    --spacing-unit: 8px;
  }
}

/* 2. Tools - Mixins and functions */
@layer tools {
  @mixin button-variant($bg, $color) {
    background-color: $bg;
    color: $color;
    
    &:hover {
      background-color: darken($bg, 10%);
    }
  }
}

/* 3. Generic - Reset and normalize */
@layer generic {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

/* 4. Elements - Base HTML elements */
@layer elements {
  body {
    font-family: var(--font-family);
    line-height: 1.6;
  }
  
  h1, h2, h3 {
    font-weight: 700;
  }
}

/* 5. Objects - Layout patterns */
@layer objects {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .grid {
    display: grid;
    gap: 1rem;
  }
}

/* 6. Components - UI components */
@layer components {
  .button {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
}

/* 7. Utilities - Utility classes */
@layer utilities {
  .text-center { text-align: center; }
  .mt-1 { margin-top: 0.25rem; }
}
```

### 2. BEM (Block Element Modifier)

```css
/* Block */
.card {
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
}

/* Element */
.card__header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e1e5e9;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.card__content {
  line-height: 1.6;
}

.card__footer {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e1e5e9;
}

/* Modifier */
.card--featured {
  border-color: #0066cc;
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.1);
}

.card--large {
  padding: 2rem;
}

.card--no-padding {
  padding: 0;
}

/* Element with modifier */
.card__title--large {
  font-size: 1.5rem;
}

.card__content--centered {
  text-align: center;
}
```

### 3. Atomic CSS

```css
/* Atomic CSS classes */
.d-flex { display: flex; }
.d-grid { display: grid; }
.d-block { display: block; }
.d-inline { display: inline; }

.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }

.align-start { align-items: flex-start; }
.align-center { align-items: center; }
.align-end { align-items: flex-end; }

.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }

.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }

.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 0.75rem; }
.m-4 { margin: 1rem; }

.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }

.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
```

## Modern CSS Architecture

### Component-Based Architecture

```css
/* Component: Button */
@layer components {
  .button {
    --button-padding: 0.5rem 1rem;
    --button-radius: 4px;
    --button-font-size: 1rem;
    --button-font-weight: 500;
    
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--button-padding);
    border: none;
    border-radius: var(--button-radius);
    font-size: var(--button-font-size);
    font-weight: var(--button-font-weight);
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    /* Variants */
    &--primary {
      background-color: var(--primary-color);
      color: white;
      
      &:hover:not([disabled]) {
        background-color: var(--primary-color-dark);
      }
    }
    
    &--secondary {
      background-color: var(--secondary-color);
      color: white;
      
      &:hover:not([disabled]) {
        background-color: var(--secondary-color-dark);
      }
    }
    
    &--outline {
      background-color: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      
      &:hover:not([disabled]) {
        background-color: var(--primary-color);
        color: white;
      }
    }
    
    /* Sizes */
    &--small {
      --button-padding: 0.25rem 0.5rem;
      --button-font-size: 0.875rem;
    }
    
    &--large {
      --button-padding: 0.75rem 1.5rem;
      --button-font-size: 1.125rem;
    }
  }
}
```

### Design System Architecture

```css
/* Design System: Colors */
@layer design-system {
  :root {
    /* Primary colors */
    --color-primary-50: #eff6ff;
    --color-primary-100: #dbeafe;
    --color-primary-200: #bfdbfe;
    --color-primary-300: #93c5fd;
    --color-primary-400: #60a5fa;
    --color-primary-500: #3b82f6;
    --color-primary-600: #2563eb;
    --color-primary-700: #1d4ed8;
    --color-primary-800: #1e40af;
    --color-primary-900: #1e3a8a;
    
    /* Semantic colors */
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #3b82f6;
    
    /* Neutral colors */
    --color-gray-50: #f9fafb;
    --color-gray-100: #f3f4f6;
    --color-gray-200: #e5e7eb;
    --color-gray-300: #d1d5db;
    --color-gray-400: #9ca3af;
    --color-gray-500: #6b7280;
    --color-gray-600: #4b5563;
    --color-gray-700: #374151;
    --color-gray-800: #1f2937;
    --color-gray-900: #111827;
  }
}

/* Design System: Typography */
@layer design-system {
  :root {
    /* Font families */
    --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-family-mono: 'Fira Code', 'Monaco', 'Consolas', monospace;
    
    /* Font sizes */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    --text-5xl: 3rem;
    
    /* Line heights */
    --leading-none: 1;
    --leading-tight: 1.25;
    --leading-snug: 1.375;
    --leading-normal: 1.5;
    --leading-relaxed: 1.625;
    --leading-loose: 2;
  }
}

/* Design System: Spacing */
@layer design-system {
  :root {
    --space-0: 0;
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    --space-24: 6rem;
  }
}
```

## Performance Optimization

### CSS Custom Properties Performance

```css
/* Good: Use custom properties for dynamic values */
:root {
  --theme-color: #0066cc;
}

.button {
  background-color: var(--theme-color);
}

/* Bad: Don't use custom properties for static values */
.button {
  --static-color: #0066cc;
  background-color: var(--static-color);
}
```

### Cascade Layers Performance

```css
/* Good: Define layers once at the top */
@layer reset, base, components, utilities;

/* Bad: Don't redefine layers multiple times */
@layer reset { }
@layer base { }
@layer reset { } /* Redefinition */
```

### Nesting Performance

```css
/* Good: Keep nesting shallow */
.card {
  padding: 1rem;
  
  &-header {
    margin-bottom: 1rem;
  }
}

/* Bad: Avoid deep nesting */
.card {
  padding: 1rem;
  
  &-header {
    margin-bottom: 1rem;
    
    &-title {
      font-size: 1.25rem;
      
        &-large {
          font-size: 1.5rem;
        }
    }
  }
}
```

## Best Practices

### 1. Use Custom Properties for Theming

```css
:root {
  --primary-color: #0066cc;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #333333;
}

.theme-dark {
  --primary-color: #4dabf7;
  --secondary-color: #adb5bd;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}
```

### 2. Organize with Cascade Layers

```css
@layer reset, base, components, utilities;

@layer reset {
  /* Reset styles */
}

@layer base {
  /* Base element styles */
}

@layer components {
  /* Component styles */
}

@layer utilities {
  /* Utility classes */
}
```

### 3. Use Nesting for Component Organization

```css
.card {
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  
  &-header {
    margin-bottom: 1rem;
  }
  
  &-content {
    line-height: 1.6;
  }
  
  &-footer {
    margin-top: 1rem;
  }
}
```

### 4. Create Design Systems

```css
:root {
  /* Design tokens */
  --color-primary: #0066cc;
  --font-family: 'Inter', sans-serif;
  --spacing-unit: 8px;
}
```

## Common Patterns and Solutions

### 1. Theme Switching

```css
:root {
  --primary-color: #0066cc;
  --background-color: #ffffff;
  --text-color: #333333;
}

.theme-dark {
  --primary-color: #4dabf7;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}

.component {
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--primary-color);
}
```

### 2. Responsive Design System

```css
:root {
  --container-padding: 1rem;
  --grid-columns: 1;
  --font-size-base: 1rem;
}

@media (min-width: 768px) {
  :root {
    --container-padding: 2rem;
    --grid-columns: 2;
    --font-size-base: 1.125rem;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: 3rem;
    --grid-columns: 3;
    --font-size-base: 1.25rem;
  }
}
```

### 3. Component Variants

```css
.button {
  --button-padding: 0.5rem 1rem;
  --button-radius: 4px;
  --button-bg: #0066cc;
  --button-color: white;
  
  padding: var(--button-padding);
  border-radius: var(--button-radius);
  background: var(--button-bg);
  color: var(--button-color);
  
  &--primary {
    --button-bg: #0066cc;
    --button-color: white;
  }
  
  &--secondary {
    --button-bg: #6c757d;
    --button-color: white;
  }
  
  &--outline {
    --button-bg: transparent;
    --button-color: #0066cc;
    border: 1px solid #0066cc;
  }
}
```

## Exercises

### Exercise 1: Design System with Custom Properties

Create a complete design system using CSS custom properties that includes:
- Color palette with semantic naming
- Typography scale
- Spacing system
- Component variants
- Dark/light theme support

### Exercise 2: CSS Architecture with Layers

Build a CSS architecture using cascade layers that includes:
- Reset layer
- Base layer
- Components layer
- Utilities layer
- Proper layer organization

### Exercise 3: Component Library with Nesting

Create a component library using CSS nesting that includes:
- Button component with variants
- Card component with elements
- Navigation component with responsive behavior
- Form components with states

## Next Steps

Now that you understand CSS architecture, you're ready to explore:

- **Advanced CSS**: Modern CSS features and methodologies
- **Animations & Performance**: Creating smooth, performant animations
- **CSS-in-JS**: Modern styling approaches

## Resources

- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [MDN Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [CSS Nesting on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)
- [ITCSS Architecture](https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528)
- [BEM Methodology](https://getbem.com/)

---

*This article is part of the Frontend Mastery Hub Level 7 series. Continue your journey by exploring advanced CSS features and animations.*


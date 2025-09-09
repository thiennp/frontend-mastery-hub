# Level 7: Responsive Design - Media Queries, Container Queries & Fluid Typography

## Overview

Welcome to the third article in Level 7! This article focuses on creating responsive designs that adapt beautifully to different screen sizes, devices, and user preferences. We'll explore media queries, container queries, fluid typography, and modern responsive design patterns that ensure your layouts work perfectly across all devices.

## Learning Objectives

By the end of this article, you will be able to:

- **Master Media Queries**: Create responsive breakpoints and device-specific styles
- **Implement Container Queries**: Build component-based responsive designs
- **Use Fluid Typography**: Create scalable text that adapts to any screen size
- **Design Mobile-First**: Build responsive layouts starting from mobile devices
- **Optimize for Performance**: Ensure responsive designs are fast and efficient

## Media Queries Fundamentals

Media queries are the foundation of responsive design, allowing you to apply different styles based on device characteristics.

### Basic Media Query Syntax

```css
/* Basic media query */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}

/* Multiple conditions */
@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    padding: 2rem;
  }
}

/* Using 'or' logic */
@media (max-width: 768px), (orientation: portrait) {
  .container {
    flex-direction: column;
  }
}
```

### Common Breakpoints

```css
/* Mobile first approach */
/* Extra small devices (phones, 576px and down) */
@media (max-width: 575.98px) { }

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) { }

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) { }

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) { }

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) { }

/* Extra extra large devices (1400px and up) */
@media (min-width: 1400px) { }
```

### Media Query Features

#### 1. Width and Height

```css
/* Viewport width */
@media (min-width: 768px) { }
@media (max-width: 1024px) { }
@media (width: 768px) { } /* exact width */

/* Viewport height */
@media (min-height: 600px) { }
@media (max-height: 800px) { }

/* Aspect ratio */
@media (aspect-ratio: 16/9) { }
@media (min-aspect-ratio: 4/3) { }
```

#### 2. Orientation

```css
/* Portrait orientation */
@media (orientation: portrait) {
  .container {
    flex-direction: column;
  }
}

/* Landscape orientation */
@media (orientation: landscape) {
  .container {
    flex-direction: row;
  }
}
```

#### 3. Display Density

```css
/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo {
    background-image: url('logo@2x.png');
  }
}

/* Retina displays */
@media (min-resolution: 2dppx) {
  .icon {
    background-image: url('icon@2x.png');
  }
}
```

#### 4. Color and Contrast

```css
/* Dark mode preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
}

/* Light mode preference */
@media (prefers-color-scheme: light) {
  :root {
    --bg-color: #ffffff;
    --text-color: #1a1a1a;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Mobile-First Approach

```css
/* Mobile first - base styles for mobile */
.container {
  padding: 1rem;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    font-size: 18px;
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .container {
    padding: 4rem;
    font-size: 20px;
  }
}
```

## Container Queries

Container queries are a modern CSS feature that allows you to apply styles based on the size of a container rather than the viewport.

### Container Query Basics

```css
/* Define a container context */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Query the container size */
@container card (min-width: 300px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@container card (min-width: 600px) {
  .card {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### Container Query Types

```css
/* Inline size (width in horizontal writing mode) */
.inline-container {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .content {
    display: flex;
  }
}

/* Block size (height in horizontal writing mode) */
.block-container {
  container-type: block-size;
}

@container (min-height: 200px) {
  .content {
    display: grid;
    grid-template-rows: 1fr 1fr;
  }
}

/* Both dimensions */
.both-container {
  container-type: size;
}

@container (min-width: 300px) and (min-height: 200px) {
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
```

### Named Containers

```css
/* Named containers for specificity */
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.main {
  container-type: inline-size;
  container-name: main;
}

/* Query specific containers */
@container sidebar (min-width: 200px) {
  .nav {
    display: block;
  }
}

@container main (min-width: 600px) {
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### Container Query Units

```css
.container {
  container-type: inline-size;
  width: 100%;
  max-width: 1200px;
}

/* Use container query units */
@container (min-width: 300px) {
  .card {
    /* 50% of container width */
    width: 50cqw;
    
    /* 20px relative to container width */
    padding: 20cqw;
    
    /* Font size relative to container */
    font-size: 2cqw;
  }
}
```

## Fluid Typography

Fluid typography creates text that scales smoothly between different screen sizes without discrete breakpoints.

### CSS Clamp Function

```css
/* Fluid typography using clamp */
.fluid-heading {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
}

.fluid-text {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
}

/* More complex fluid typography */
.fluid-complex {
  font-size: clamp(1rem, 2vw + 1rem, 2.5rem);
  line-height: clamp(1.2, 1.5vw + 1.2, 1.8);
}
```

### Viewport Units

```css
/* Viewport width units */
.vw-text {
  font-size: 4vw; /* 4% of viewport width */
}

/* Viewport height units */
.vh-text {
  font-size: 4vh; /* 4% of viewport height */
}

/* Minimum of viewport width and height */
.vmin-text {
  font-size: 4vmin; /* 4% of smaller viewport dimension */
}

/* Maximum of viewport width and height */
.vmax-text {
  font-size: 4vmax; /* 4% of larger viewport dimension */
}
```

### Fluid Typography with Container Queries

```css
.article {
  container-type: inline-size;
  max-width: 65ch;
  margin: 0 auto;
}

/* Fluid typography based on container size */
@container (min-width: 300px) {
  .article h1 {
    font-size: clamp(1.5rem, 5cqw, 2.5rem);
  }
  
  .article p {
    font-size: clamp(1rem, 3cqw, 1.25rem);
  }
}
```

### Typography Scale

```css
/* Modular scale for consistent typography */
:root {
  --text-xs: clamp(0.75rem, 1.5vw, 0.875rem);
  --text-sm: clamp(0.875rem, 2vw, 1rem);
  --text-base: clamp(1rem, 2.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 3vw, 1.25rem);
  --text-xl: clamp(1.25rem, 3.5vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 4vw, 2rem);
  --text-3xl: clamp(1.875rem, 5vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 6vw, 3rem);
}

.heading-1 { font-size: var(--text-4xl); }
.heading-2 { font-size: var(--text-3xl); }
.heading-3 { font-size: var(--text-2xl); }
.body-text { font-size: var(--text-base); }
.small-text { font-size: var(--text-sm); }
```

## Responsive Images

### Responsive Image Techniques

```css
/* Basic responsive images */
.responsive-img {
  max-width: 100%;
  height: auto;
}

/* Responsive images with aspect ratio */
.aspect-ratio-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

/* Responsive images with different sizes */
.responsive-img-multiple {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

@media (min-width: 768px) {
  .responsive-img-multiple {
    height: 300px;
  }
}

@media (min-width: 1024px) {
  .responsive-img-multiple {
    height: 400px;
  }
}
```

### Art Direction with Picture Element

```html
<picture>
  <source media="(min-width: 1024px)" srcset="desktop-image.jpg">
  <source media="(min-width: 768px)" srcset="tablet-image.jpg">
  <img src="mobile-image.jpg" alt="Responsive image">
</picture>
```

### Responsive Background Images

```css
.hero {
  background-image: url('hero-mobile.jpg');
  background-size: cover;
  background-position: center;
  min-height: 50vh;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('hero-tablet.jpg');
    min-height: 60vh;
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('hero-desktop.jpg');
    min-height: 70vh;
  }
}
```

## Responsive Layout Patterns

### 1. Responsive Grid

```css
/* Mobile first grid */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    padding: 3rem;
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 4rem;
    padding: 4rem;
  }
}
```

### 2. Responsive Navigation

```css
/* Mobile navigation */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: none;
}

.nav-toggle {
  display: block;
}

/* Tablet and up */
@media (min-width: 768px) {
  .nav-links {
    display: flex;
    gap: 2rem;
  }
  
  .nav-toggle {
    display: none;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .nav {
    padding: 2rem;
  }
  
  .nav-links {
    gap: 3rem;
  }
}
```

### 3. Responsive Cards

```css
/* Mobile cards */
.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

/* Tablet cards */
@media (min-width: 768px) {
  .card {
    flex-direction: row;
    padding: 1.5rem;
  }
  
  .card-image {
    width: 200px;
    height: 150px;
    flex-shrink: 0;
  }
  
  .card-content {
    margin-left: 1rem;
  }
}

/* Desktop cards */
@media (min-width: 1024px) {
  .card {
    flex-direction: column;
    padding: 2rem;
  }
  
  .card-image {
    width: 100%;
    height: 250px;
  }
  
  .card-content {
    margin-left: 0;
    margin-top: 1rem;
  }
}
```

## Performance Optimization

### Efficient Media Queries

```css
/* Group related media queries */
@media (min-width: 768px) {
  .container { padding: 2rem; }
  .nav { display: flex; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Use specific selectors to avoid over-queries */
@media (min-width: 768px) {
  .specific-element {
    /* Only query what you need */
  }
}
```

### Responsive Images Performance

```css
/* Lazy loading for performance */
.lazy-img {
  opacity: 0;
  transition: opacity 0.3s;
}

.lazy-img.loaded {
  opacity: 1;
}

/* Use appropriate image formats */
.modern-img {
  background-image: url('image.webp');
  background-image: url('image.jpg'); /* fallback */
}
```

### CSS Custom Properties for Responsive Design

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
}

.text {
  font-size: var(--font-size-base);
}
```

## Accessibility in Responsive Design

### Responsive Accessibility

```css
/* Ensure touch targets are large enough */
@media (max-width: 768px) {
  .button {
    min-height: 44px;
    min-width: 44px;
  }
  
  .link {
    padding: 0.5rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

### Responsive Focus Management

```css
/* Responsive focus styles */
.focusable:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .focusable:focus {
    outline-width: 3px;
    outline-offset: 3px;
  }
}
```

## Testing Responsive Design

### Browser Dev Tools

```css
/* Debug responsive design */
.debug-responsive {
  outline: 2px solid red;
}

@media (max-width: 768px) {
  .debug-responsive {
    outline-color: blue;
  }
}

@media (min-width: 1024px) {
  .debug-responsive {
    outline-color: green;
  }
}
```

### Responsive Testing Checklist

1. **Viewport Testing**: Test at common breakpoints (320px, 768px, 1024px, 1440px)
2. **Orientation Testing**: Test both portrait and landscape orientations
3. **Touch Testing**: Ensure touch targets are appropriately sized
4. **Performance Testing**: Check loading times on different devices
5. **Accessibility Testing**: Verify screen reader compatibility

## Common Patterns and Solutions

### 1. Responsive Sidebar

```css
/* Mobile: hidden sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: -100%;
  width: 80%;
  height: 100vh;
  background: white;
  transition: left 0.3s ease;
  z-index: 1000;
}

.sidebar.open {
  left: 0;
}

/* Desktop: visible sidebar */
@media (min-width: 1024px) {
  .sidebar {
    position: static;
    width: 250px;
    height: auto;
    background: transparent;
  }
  
  .main {
    margin-left: 250px;
  }
}
```

### 2. Responsive Tables

```css
/* Mobile: stacked table */
@media (max-width: 768px) {
  .table {
    display: block;
  }
  
  .table thead {
    display: none;
  }
  
  .table tbody,
  .table tr,
  .table td {
    display: block;
  }
  
  .table tr {
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    padding: 1rem;
  }
  
  .table td:before {
    content: attr(data-label) ": ";
    font-weight: bold;
  }
}
```

### 3. Responsive Forms

```css
/* Mobile: stacked form */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Desktop: inline form */
@media (min-width: 768px) {
  .form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .form .full-width {
    grid-column: 1 / -1;
  }
}
```

## Best Practices

### 1. Mobile-First Approach

```css
/* Start with mobile styles */
.component {
  padding: 1rem;
  font-size: 14px;
}

/* Enhance for larger screens */
@media (min-width: 768px) {
  .component {
    padding: 2rem;
    font-size: 16px;
  }
}
```

### 2. Use Container Queries When Appropriate

```css
/* Use container queries for component-level responsiveness */
.card-container {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .card {
    display: flex;
  }
}
```

### 3. Fluid Typography

```css
/* Use clamp for fluid typography */
.heading {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

### 4. Performance Considerations

```css
/* Use efficient selectors */
@media (min-width: 768px) {
  .specific-class {
    /* Avoid over-queries */
  }
}
```

## Exercises

### Exercise 1: Responsive Navigation

Create a responsive navigation that:
- Collapses to hamburger menu on mobile
- Shows full navigation on desktop
- Uses container queries for component-level responsiveness
- Implements proper accessibility features

### Exercise 2: Fluid Typography System

Build a complete fluid typography system that:
- Uses clamp() for smooth scaling
- Implements a modular scale
- Works with container queries
- Includes proper line-height and spacing

### Exercise 3: Responsive Card Grid

Create a responsive card grid that:
- Uses CSS Grid for layout
- Implements container queries
- Has fluid typography
- Includes responsive images
- Works across all device sizes

## Next Steps

Now that you understand responsive design, you're ready to explore:

- **CSS Architecture**: Organizing and structuring your stylesheets
- **Advanced CSS**: Modern CSS features and methodologies
- **Animations & Performance**: Creating smooth, performant animations

## Resources

- [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Container Queries on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [Fluid Typography](https://www.smashingmagazine.com/2016/05/fluid-typography/)
- [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [CSS Clamp Function](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)

---

*This article is part of the Frontend Mastery Hub Level 7 series. Continue your journey by exploring CSS architecture and advanced CSS features.*


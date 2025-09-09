# Level 7: Animations & Performance - CSS Animations, Web Animations API & Performance Optimization

## Overview

Welcome to the final article in Level 7! This article focuses on creating smooth, performant animations and optimizing CSS for the best possible user experience. We'll explore CSS animations, the Web Animations API, performance optimization techniques, and modern animation patterns that make your interfaces feel responsive and delightful.

## Learning Objectives

By the end of this article, you will be able to:

- **Master CSS Animations**: Create smooth, performant animations using CSS
- **Use Web Animations API**: Implement complex animations with JavaScript
- **Optimize Performance**: Ensure animations run at 60fps and don't cause jank
- **Create Animation Systems**: Build reusable animation patterns and utilities
- **Handle Accessibility**: Ensure animations respect user preferences and accessibility needs

## CSS Animations Fundamentals

CSS animations provide a powerful way to create smooth, performant animations without JavaScript.

### Basic CSS Animations

```css
/* Define keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Apply animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### Animation Properties

```css
.animated-element {
  animation-name: fadeIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-delay: 0.2s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
  
  /* Shorthand */
  animation: fadeIn 0.5s ease-in-out 0.2s 1 normal forwards running;
}
```

### Complex Keyframes

```css
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-10px);
  }
  40% {
    transform: translateY(0);
  }
  60% {
    transform: translateY(-5px);
  }
  80% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Animation Timing Functions

```css
/* Built-in timing functions */
.linear { animation-timing-function: linear; }
.ease { animation-timing-function: ease; }
.ease-in { animation-timing-function: ease-in; }
.ease-out { animation-timing-function: ease-out; }
.ease-in-out { animation-timing-function: ease-in-out; }

/* Cubic bezier curves */
.custom-timing {
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Steps */
.step-animation {
  animation-timing-function: steps(4, end);
}
```

## CSS Transitions

CSS transitions provide smooth animations between different states of an element.

### Basic Transitions

```css
.button {
  background-color: #0066cc;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  /* Transition properties */
  transition-property: background-color, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  transition-delay: 0s;
  
  /* Shorthand */
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.button:hover {
  background-color: #0052a3;
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
}
```

### Transition Properties

```css
.element {
  /* All properties */
  transition: all 0.3s ease;
  
  /* Specific properties */
  transition: background-color 0.2s ease, transform 0.3s ease-out;
  
  /* Multiple transitions */
  transition: 
    background-color 0.2s ease,
    transform 0.3s ease-out,
    opacity 0.1s ease-in;
}
```

### Advanced Transition Patterns

```css
/* Staggered transitions */
.staggered-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.staggered-item:nth-child(1) { transition-delay: 0.1s; }
.staggered-item:nth-child(2) { transition-delay: 0.2s; }
.staggered-item:nth-child(3) { transition-delay: 0.3s; }
.staggered-item:nth-child(4) { transition-delay: 0.4s; }

.staggered-container:hover .staggered-item {
  opacity: 1;
  transform: translateY(0);
}

/* Morphing transitions */
.morphing-button {
  width: 100px;
  height: 40px;
  background: #0066cc;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.morphing-button:hover {
  width: 120px;
  height: 50px;
  border-radius: 25px;
  background: #0052a3;
}
```

## Web Animations API

The Web Animations API provides a powerful JavaScript interface for creating and controlling animations.

### Basic Web Animations API

```javascript
// Basic animation
const element = document.querySelector('.animated-element');

element.animate([
  { transform: 'translateX(0px)', opacity: 1 },
  { transform: 'translateX(100px)', opacity: 0.5 }
], {
  duration: 1000,
  easing: 'ease-in-out',
  iterations: 1,
  direction: 'normal',
  fill: 'forwards'
});
```

### Animation Options

```javascript
const animation = element.animate([
  { transform: 'scale(1)', opacity: 1 },
  { transform: 'scale(1.2)', opacity: 0.8 }
], {
  duration: 500,
  delay: 200,
  iterations: 3,
  iterationStart: 0,
  direction: 'alternate',
  easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  fill: 'both',
  playbackRate: 1
});
```

### Animation Control

```javascript
// Play/pause control
animation.play();
animation.pause();
animation.reverse();
animation.cancel();

// Seek to specific time
animation.currentTime = 500; // 500ms

// Change playback rate
animation.playbackRate = 2; // 2x speed
animation.playbackRate = 0.5; // 0.5x speed

// Event listeners
animation.addEventListener('finish', () => {
  console.log('Animation finished');
});

animation.addEventListener('cancel', () => {
  console.log('Animation cancelled');
});
```

### Complex Animations

```javascript
// Sequential animations
async function animateSequence() {
  const elements = document.querySelectorAll('.sequence-item');
  
  for (let i = 0; i < elements.length; i++) {
    const animation = elements[i].animate([
      { transform: 'translateY(20px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    });
    
    await animation.finished;
  }
}

// Parallel animations
function animateParallel() {
  const elements = document.querySelectorAll('.parallel-item');
  
  elements.forEach((element, index) => {
    element.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.1)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ], {
      duration: 1000,
      delay: index * 100,
      easing: 'ease-in-out'
    });
  });
}
```

## Performance Optimization

### CSS Performance Best Practices

```css
/* Good: Use transform and opacity for animations */
.performant-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.performant-animation:hover {
  transform: translateY(-5px);
  opacity: 0.8;
}

/* Bad: Avoid animating layout properties */
.bad-animation {
  transition: width 0.3s ease, height 0.3s ease;
}

.bad-animation:hover {
  width: 200px;
  height: 100px;
}
```

### GPU Acceleration

```css
/* Force GPU acceleration */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Or use transform3d */
.gpu-accelerated-3d {
  transform: translate3d(0, 0, 0);
}
```

### Animation Performance Classes

```css
/* Performance-optimized animation classes */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.animate-scale {
  animation: scale 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale {
  from { transform: scale(0.9); }
  to { transform: scale(1); }
}
```

### Reduced Motion Support

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Alternative: Provide reduced motion versions */
.animated-element {
  animation: fadeIn 0.5s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: fadeInReduced 0.1s ease-in-out;
  }
}

@keyframes fadeInReduced {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Animation Systems

### Animation Utility Classes

```css
/* Animation utility classes */
.animate {
  animation-duration: 0.3s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}

.animate-fast { animation-duration: 0.15s; }
.animate-slow { animation-duration: 0.5s; }

.animate-bounce { animation-name: bounce; }
.animate-fade-in { animation-name: fadeIn; }
.animate-slide-in { animation-name: slideIn; }
.animate-pulse { animation-name: pulse; }
.animate-spin { animation-name: spin; }

/* Hover animations */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.hover-rotate:hover {
  transform: rotate(5deg);
  transition: transform 0.2s ease;
}
```

### Animation States

```css
/* Animation states */
.entering {
  animation: slideIn 0.3s ease-out;
}

.entered {
  animation: none;
}

.exiting {
  animation: slideOut 0.3s ease-in;
}

.exited {
  animation: none;
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
```

### Animation Hooks

```javascript
// Animation hooks for React
function useAnimation(initialState = false) {
  const [isAnimating, setIsAnimating] = useState(initialState);
  const [animationState, setAnimationState] = useState('idle');
  
  const startAnimation = useCallback(() => {
    setAnimationState('entering');
    setIsAnimating(true);
  }, []);
  
  const endAnimation = useCallback(() => {
    setAnimationState('exiting');
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationState('idle');
    }, 300);
  }, []);
  
  return {
    isAnimating,
    animationState,
    startAnimation,
    endAnimation
  };
}
```

## Advanced Animation Patterns

### Staggered Animations

```css
/* Staggered animation classes */
.stagger-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease-out forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.1s; }
.stagger-item:nth-child(2) { animation-delay: 0.2s; }
.stagger-item:nth-child(3) { animation-delay: 0.3s; }
.stagger-item:nth-child(4) { animation-delay: 0.4s; }
.stagger-item:nth-child(5) { animation-delay: 0.5s; }
.stagger-item:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Morphing Animations

```css
/* Morphing button */
.morph-button {
  position: relative;
  width: 100px;
  height: 40px;
  background: #0066cc;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.morph-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0052a3;
  border-radius: 20px;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.morph-button:hover::before {
  transform: scale(1);
}

.morph-button:hover {
  width: 120px;
  height: 50px;
  border-radius: 25px;
}
```

### Loading Animations

```css
/* Spinner animation */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Pulse animation */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## Accessibility and Animations

### Respecting User Preferences

```css
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}

/* Provide alternative for reduced motion */
.animated-element {
  animation: fadeIn 0.5s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: fadeInReduced 0.1s ease-in-out;
  }
}

@keyframes fadeInReduced {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Focus Management

```css
/* Focus animations */
.focusable:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  animation: focusPulse 0.3s ease-in-out;
}

@keyframes focusPulse {
  0% { outline-width: 2px; }
  50% { outline-width: 4px; }
  100% { outline-width: 2px; }
}

/* Skip to content animation */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #0066cc;
  color: white;
  padding: 8px;
  text-decoration: none;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}
```

## Performance Monitoring

### Animation Performance

```javascript
// Monitor animation performance
function measureAnimationPerformance() {
  const element = document.querySelector('.animated-element');
  
  const startTime = performance.now();
  
  element.animate([
    { transform: 'translateX(0px)' },
    { transform: 'translateX(100px)' }
  ], {
    duration: 1000,
    easing: 'ease-in-out'
  }).addEventListener('finish', () => {
    const endTime = performance.now();
    console.log(`Animation took ${endTime - startTime}ms`);
  });
}

// Check for 60fps
function checkFrameRate() {
  let lastTime = performance.now();
  let frameCount = 0;
  
  function measureFrame() {
    const currentTime = performance.now();
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {
      console.log(`FPS: ${frameCount}`);
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFrame);
  }
  
  requestAnimationFrame(measureFrame);
}
```

### Animation Debugging

```css
/* Debug animation performance */
.debug-animations * {
  outline: 1px solid red;
}

.debug-animations *:hover {
  outline: 2px solid blue;
}

/* Show animation timing */
.animation-timing {
  animation: fadeIn 0.5s ease-in-out;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

## Common Patterns and Solutions

### 1. Page Transitions

```css
/* Page transition animations */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

### 2. Modal Animations

```css
/* Modal animations */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: white;
  border-radius: 8px;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.modal-content.show {
  transform: translate(-50%, -50%) scale(1);
}
```

### 3. Scroll Animations

```css
/* Scroll-triggered animations */
.scroll-animate {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-animate.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

```javascript
// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
});

document.querySelectorAll('.scroll-animate').forEach(el => {
  observer.observe(el);
});
```

## Best Practices

### 1. Use Transform and Opacity

```css
/* Good: Use transform and opacity */
.performant {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.performant:hover {
  transform: translateY(-5px);
  opacity: 0.8;
}

/* Bad: Avoid layout properties */
.expensive {
  transition: width 0.3s ease, height 0.3s ease;
}

.expensive:hover {
  width: 200px;
  height: 100px;
}
```

### 2. Respect User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Use will-change Sparingly

```css
/* Good: Use will-change for elements that will animate */
.animating-element {
  will-change: transform, opacity;
}

/* Bad: Don't use will-change on all elements */
.everything {
  will-change: auto; /* This is bad */
}
```

### 4. Optimize for 60fps

```css
/* Use efficient animations */
.efficient {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Exercises

### Exercise 1: Animation System

Create a complete animation system that includes:
- Utility classes for common animations
- Performance-optimized keyframes
- Reduced motion support
- Animation state management

### Exercise 2: Interactive Animations

Build interactive animations using the Web Animations API that include:
- Hover effects
- Click animations
- Scroll-triggered animations
- Sequential animations

### Exercise 3: Performance Optimization

Optimize a set of animations for performance by:
- Using transform and opacity
- Implementing GPU acceleration
- Adding reduced motion support
- Monitoring frame rates

## Next Steps

Now that you've completed Level 7, you're ready to move on to:

- **Level 8**: Design System Development
- **Level 9**: Advanced CSS Features
- **Level 10**: CSS Testing and Optimization

## Resources

- [MDN CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [CSS Animation Performance](https://web.dev/animations/)
- [Reduced Motion Support](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [Animation Timing Functions](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)

---

*This article completes Level 7 of the Frontend Mastery Hub. Congratulations on mastering CSS fundamentals, modern layout systems, responsive design, CSS architecture, advanced CSS methodologies, and animations! You're now ready to tackle more advanced frontend development challenges.*


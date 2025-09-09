# Level 7: Modern Layout Systems - Flexbox, CSS Grid & Logical Properties

## Overview

Welcome to the second article in Level 7! This article focuses on modern CSS layout systems that have revolutionized how we create responsive, flexible, and maintainable layouts. We'll dive deep into Flexbox patterns, CSS Grid systems, and logical properties - the tools that make complex layouts simple and accessible.

## Learning Objectives

By the end of this article, you will be able to:

- **Master Flexbox**: Create flexible, responsive layouts using Flexbox properties and patterns
- **Implement CSS Grid**: Build complex two-dimensional layouts with CSS Grid
- **Use Logical Properties**: Write internationalization-friendly CSS using logical properties
- **Combine Layout Methods**: Effectively combine Flexbox and Grid for optimal layouts
- **Create Responsive Patterns**: Build layouts that adapt to different screen sizes and orientations

## Flexbox Fundamentals

Flexbox is a one-dimensional layout method that excels at distributing space and aligning items within a container.

### Flex Container Properties

The parent element becomes a flex container when you set `display: flex`:

```css
.flex-container {
  display: flex;
  flex-direction: row; /* row (default), row-reverse, column, column-reverse */
  flex-wrap: nowrap; /* nowrap (default), wrap, wrap-reverse */
  justify-content: flex-start; /* main axis alignment */
  align-items: stretch; /* cross axis alignment */
  align-content: stretch; /* cross axis alignment for wrapped items */
  gap: 1rem; /* space between items */
}
```

### Flex Item Properties

Child elements in a flex container can have these properties:

```css
.flex-item {
  flex-grow: 0; /* ability to grow */
  flex-shrink: 1; /* ability to shrink */
  flex-basis: auto; /* initial size before free space distribution */
  flex: 0 1 auto; /* shorthand for grow shrink basis */
  align-self: auto; /* override container's align-items */
  order: 0; /* visual order (default is source order) */
}
```

### Common Flexbox Patterns

#### 1. Centering Content

```css
/* Perfect centering */
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Horizontal centering only */
.horizontal-center {
  display: flex;
  justify-content: center;
}

/* Vertical centering only */
.vertical-center {
  display: flex;
  align-items: center;
}
```

#### 2. Space Distribution

```css
/* Space between items */
.space-between {
  display: flex;
  justify-content: space-between;
}

/* Equal space around items */
.space-around {
  display: flex;
  justify-content: space-around;
}

/* Equal space between and around items */
.space-evenly {
  display: flex;
  justify-content: space-evenly;
}
```

#### 3. Flexible Sizing

```css
/* Equal width items */
.equal-width {
  display: flex;
}

.equal-width > * {
  flex: 1; /* flex: 1 1 0 */
}

/* Fixed and flexible items */
.mixed-width {
  display: flex;
}

.mixed-width .fixed {
  flex: 0 0 200px; /* fixed width */
}

.mixed-width .flexible {
  flex: 1; /* takes remaining space */
}
```

#### 4. Navigation Patterns

```css
/* Horizontal navigation */
.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-brand {
  flex: 0 0 auto;
}

.nav-links {
  display: flex;
  gap: 1rem;
  margin-left: auto; /* push to the right */
}

/* Vertical navigation */
.nav-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

#### 5. Card Layouts

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* grow, shrink, basis */
  min-width: 0; /* prevent flex items from overflowing */
}

/* Responsive card grid */
@media (max-width: 768px) {
  .card {
    flex: 1 1 100%;
  }
}
```

## CSS Grid Fundamentals

CSS Grid is a two-dimensional layout system that excels at creating complex layouts with rows and columns.

### Grid Container Properties

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* column sizes */
  grid-template-rows: auto 1fr auto; /* row sizes */
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer"; /* named grid areas */
  gap: 1rem; /* gap between grid items */
  column-gap: 2rem; /* gap between columns */
  row-gap: 1rem; /* gap between rows */
}
```

### Grid Item Properties

```css
.grid-item {
  grid-column: 1 / 3; /* start / end */
  grid-row: 1 / 2;
  grid-area: main; /* named area */
  justify-self: start; /* horizontal alignment within cell */
  align-self: center; /* vertical alignment within cell */
  place-self: center start; /* shorthand for align-self justify-self */
}
```

### Grid Template Areas

```css
/* Define layout with named areas */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main sidebar"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }

/* Responsive grid areas */
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "nav"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### Common Grid Patterns

#### 1. Auto-Fit and Auto-Fill

```css
/* Auto-fit: creates as many columns as fit */
.auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Auto-fill: creates columns even if empty */
.auto-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
```

#### 2. Asymmetric Layouts

```css
/* Asymmetric grid with different column sizes */
.asymmetric {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
}

/* Complex asymmetric layout */
.complex {
  display: grid;
  grid-template-columns: 
    [sidebar-start] 200px 
    [sidebar-end main-start] 1fr 
    [main-end sidebar2-start] 150px 
    [sidebar2-end];
  grid-template-rows: 
    [header-start] auto 
    [header-end content-start] 1fr 
    [content-end footer-start] auto 
    [footer-end];
}
```

#### 3. Masonry-Style Layouts

```css
/* CSS Grid masonry (with some limitations) */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px; /* small row height */
  gap: 1rem;
}

.masonry-item {
  grid-row-end: span var(--row-span, 1);
}

/* JavaScript can set --row-span based on content height */
```

#### 4. Overlapping Elements

```css
/* Overlapping grid items */
.overlapping {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.overlapping .item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  z-index: 2;
}

.overlapping .item-2 {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  z-index: 1;
}
```

## Logical Properties

Logical properties provide a way to write CSS that adapts to different writing modes and text directions, making your layouts internationalization-friendly.

### Writing Modes

```css
/* Different writing modes */
.horizontal-tb { writing-mode: horizontal-tb; } /* default */
.vertical-rl { writing-mode: vertical-rl; } /* Japanese */
.vertical-lr { writing-mode: vertical-lr; } /* Mongolian */
.sideways-rl { writing-mode: sideways-rl; } /* experimental */
.sideways-lr { writing-mode: sideways-lr; } /* experimental */
```

### Logical Properties Mapping

| Physical Property | Logical Property | Description |
|------------------|------------------|-------------|
| `width` | `inline-size` | Size along the inline axis |
| `height` | `block-size` | Size along the block axis |
| `margin-left` | `margin-inline-start` | Start margin on inline axis |
| `margin-right` | `margin-inline-end` | End margin on inline axis |
| `margin-top` | `margin-block-start` | Start margin on block axis |
| `margin-bottom` | `margin-block-end` | End margin on block axis |
| `padding-left` | `padding-inline-start` | Start padding on inline axis |
| `padding-right` | `padding-inline-end` | End padding on inline axis |
| `padding-top` | `padding-block-start` | Start padding on block axis |
| `padding-bottom` | `padding-block-end` | End padding on block axis |
| `border-left` | `border-inline-start` | Start border on inline axis |
| `border-right` | `border-inline-end` | End border on inline axis |
| `border-top` | `border-block-start` | Start border on block axis |
| `border-bottom` | `border-block-end` | End border on block axis |

### Using Logical Properties

```css
/* Traditional approach */
.traditional {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-left: 2px solid blue;
  width: 200px;
  height: 100px;
}

/* Logical properties approach */
.logical {
  margin-inline: 1rem; /* left and right */
  padding-block: 0.5rem; /* top and bottom */
  border-inline-start: 2px solid blue; /* left border */
  inline-size: 200px; /* width */
  block-size: 100px; /* height */
}

/* Responsive to writing mode */
.responsive {
  margin-inline-start: 1rem;
  padding-block: 0.5rem;
  border-inline-start: 2px solid blue;
  inline-size: 200px;
  block-size: 100px;
}
```

### Logical Properties in Flexbox and Grid

```css
/* Flexbox with logical properties */
.flex-logical {
  display: flex;
  flex-direction: row; /* inline direction */
  justify-content: flex-start; /* main axis */
  align-items: flex-start; /* cross axis */
  gap: 1rem;
}

/* Grid with logical properties */
.grid-logical {
  display: grid;
  grid-template-columns: 1fr 1fr; /* inline axis */
  grid-template-rows: auto 1fr; /* block axis */
  gap: 1rem;
}

/* Logical properties for grid items */
.grid-item-logical {
  justify-self: start; /* inline axis alignment */
  align-self: start; /* block axis alignment */
  margin-inline: auto; /* center horizontally */
  padding-block: 1rem; /* vertical padding */
}
```

## Combining Flexbox and Grid

The best layouts often combine both Flexbox and Grid, using each for what it does best.

### Grid for Layout, Flexbox for Components

```css
/* Grid for overall page layout */
.page-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* Flexbox for component layouts */
.header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

.footer {
  grid-area: footer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
```

### Nested Layouts

```css
/* Grid container with flexbox children */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  flex: 0 0 auto;
  padding: 1rem;
  background: #f8f9fa;
}

.card-content {
  flex: 1 1 auto;
  padding: 1rem;
}

.card-footer {
  flex: 0 0 auto;
  padding: 1rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Responsive Layout Patterns

### Mobile-First Approach

```css
/* Mobile first - single column */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

/* Tablet - two columns */
@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop - three columns */
@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

/* Large desktop - four columns */
@media (min-width: 1440px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Queries (Modern Approach)

```css
/* Container query approach */
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* When container is wide enough */
@container (min-width: 300px) {
  .card {
    grid-template-columns: 1fr 1fr;
  }
}

@container (min-width: 600px) {
  .card {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### Flexible Typography with Logical Properties

```css
/* Responsive typography using logical properties */
.article {
  max-inline-size: 65ch; /* max-width in characters */
  margin-inline: auto; /* center horizontally */
  padding-inline: 1rem;
  padding-block: 2rem;
}

.article h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
  margin-block-end: 1rem;
}

.article p {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
  margin-block-end: 1.5rem;
}
```

## Performance Considerations

### Layout Thrashing Prevention

```css
/* Use transform instead of changing layout properties */
.animated-element {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.animated-element.moved {
  transform: translateX(100px);
}

/* Avoid changing properties that trigger layout */
.bad-animation {
  left: 0; /* triggers layout */
  transition: left 0.3s ease;
}

.good-animation {
  transform: translateX(0); /* only triggers composite */
  transition: transform 0.3s ease;
}
```

### Efficient Grid Patterns

```css
/* Use CSS Grid for complex layouts */
.efficient-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

/* Avoid nested flexbox for simple layouts */
.inefficient {
  display: flex;
}

.inefficient > * {
  display: flex;
  flex-direction: column;
}

.inefficient > * > * {
  display: flex;
  justify-content: space-between;
}
```

## Common Patterns and Solutions

### 1. Sticky Footer

```css
/* Using Grid */
.sticky-footer {
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 100vh;
}

/* Using Flexbox */
.sticky-footer-flex {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sticky-footer-flex .main {
  flex: 1;
}
```

### 2. Equal Height Columns

```css
/* Using Grid */
.equal-height {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

/* Using Flexbox */
.equal-height-flex {
  display: flex;
  gap: 1rem;
}

.equal-height-flex > * {
  flex: 1;
  display: flex;
  flex-direction: column;
}
```

### 3. Responsive Image Grid

```css
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.image-grid img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
```

## Best Practices

### 1. Choose the Right Tool

- **Use Flexbox for**: One-dimensional layouts, component alignment, space distribution
- **Use Grid for**: Two-dimensional layouts, complex page structures, overlapping elements
- **Use both**: Grid for layout, Flexbox for components

### 2. Logical Properties First

```css
/* Prefer logical properties for internationalization */
.component {
  margin-inline: 1rem;
  padding-block: 0.5rem;
  border-inline-start: 2px solid blue;
}
```

### 3. Responsive Design

```css
/* Mobile-first with logical properties */
.responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-inline: 1rem;
}

@media (min-width: 768px) {
  .responsive {
    grid-template-columns: 1fr 1fr;
    padding-inline: 2rem;
  }
}
```

### 4. Performance

```css
/* Use CSS Grid for complex layouts */
.complex-layout {
  display: grid;
  grid-template-areas: "header header" "nav main" "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Avoid deep nesting */
.flat-structure {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

## Exercises

### Exercise 1: Flexbox Navigation

Create a responsive navigation bar that:
- Uses Flexbox for layout
- Has a logo on the left and navigation links on the right
- Collapses to a hamburger menu on mobile
- Uses logical properties for internationalization

### Exercise 2: CSS Grid Dashboard

Build a dashboard layout using CSS Grid with:
- Header spanning full width
- Sidebar with fixed width
- Main content area that's flexible
- Footer spanning full width
- Responsive behavior for mobile

### Exercise 3: Card Grid with Logical Properties

Create a card grid that:
- Uses CSS Grid for the overall layout
- Uses Flexbox for individual card layouts
- Implements logical properties throughout
- Is fully responsive and accessible

## Next Steps

Now that you understand modern layout systems, you're ready to explore:

- **Responsive Design**: Media queries, container queries, and fluid typography
- **CSS Architecture**: Organizing and structuring your stylesheets
- **Advanced CSS**: Modern CSS features and methodologies

## Resources

- [MDN Flexbox Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [MDN CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [Grid by Example](https://gridbyexample.com/)
- [Flexbox Froggy](https://flexboxfroggy.com/)
- [Grid Garden](https://cssgridgarden.com/)

---

*This article is part of the Frontend Mastery Hub Level 7 series. Continue your journey by exploring responsive design patterns and CSS architecture.*


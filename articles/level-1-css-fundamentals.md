# CSS Fundamentals: Styling the Web

## Introduction

CSS (Cascading Style Sheets) is the language that brings visual life to HTML documents. It controls layout, colors, typography, animations, and responsive design, transforming plain HTML into beautiful, engaging web pages.

## What is CSS?

CSS is a stylesheet language that describes how HTML elements should be displayed. It separates content (HTML) from presentation (CSS), making websites more maintainable and accessible.

### Key Concepts
- **Separation of Concerns**: HTML for structure, CSS for presentation
- **Cascade**: Multiple CSS rules can apply to the same element
- **Specificity**: Determines which CSS rule takes precedence
- **Inheritance**: Child elements inherit some properties from parent elements

## CSS Syntax

### Basic Rule Structure
```css
selector {
    property: value;
    another-property: value;
}
```

### Example
```css
h1 {
    color: blue;
    font-size: 24px;
    text-align: center;
}
```

## CSS Selectors

### Element Selectors
```css
/* Select all h1 elements */
h1 {
    color: red;
}

/* Select all paragraphs */
p {
    margin-bottom: 1em;
}
```

### Class Selectors
```css
/* Select elements with class "highlight" */
.highlight {
    background-color: yellow;
}

/* Select elements with multiple classes */
.button.primary {
    background-color: blue;
    color: white;
}
```

### ID Selectors
```css
/* Select element with id "header" */
#header {
    background-color: #333;
    color: white;
}
```

### Attribute Selectors
```css
/* Select input elements with type "text" */
input[type="text"] {
    border: 1px solid #ccc;
}

/* Select elements with class containing "btn" */
[class*="btn"] {
    padding: 10px 20px;
}
```

### Pseudo-class Selectors
```css
/* Select links on hover */
a:hover {
    color: red;
}

/* Select first child element */
li:first-child {
    font-weight: bold;
}

/* Select form elements when focused */
input:focus {
    border-color: blue;
    outline: none;
}
```

### Pseudo-element Selectors
```css
/* Add content before element */
.quote::before {
    content: '"';
    font-size: 2em;
    color: #999;
}

/* Style first line of text */
p::first-line {
    font-weight: bold;
}
```

### Combinators
```css
/* Descendant selector */
div p {
    margin-left: 20px;
}

/* Child selector */
div > p {
    border-left: 3px solid blue;
}

/* Adjacent sibling selector */
h1 + p {
    font-size: 1.2em;
}

/* General sibling selector */
h1 ~ p {
    color: #666;
}
```

## CSS Properties

### Typography
```css
/* Font properties */
h1 {
    font-family: Arial, sans-serif;
    font-size: 2.5em;
    font-weight: bold;
    font-style: italic;
    line-height: 1.4;
    text-align: center;
    text-decoration: underline;
    text-transform: uppercase;
    letter-spacing: 2px;
    word-spacing: 5px;
}

/* Text properties */
p {
    text-indent: 2em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

### Colors and Backgrounds
```css
/* Color values */
.text {
    color: red;                    /* Named color */
    color: #ff0000;               /* Hexadecimal */
    color: rgb(255, 0, 0);       /* RGB */
    color: rgba(255, 0, 0, 0.5); /* RGBA with transparency */
    color: hsl(0, 100%, 50%);    /* HSL */
    color: hsla(0, 100%, 50%, 0.5); /* HSLA with transparency */
}

/* Background properties */
.box {
    background-color: #f0f0f0;
    background-image: url('image.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    
    /* Shorthand */
    background: #f0f0f0 url('image.jpg') no-repeat center/cover;
}
```

### Box Model
```css
/* Box model properties */
.element {
    width: 300px;
    height: 200px;
    padding: 20px;
    border: 2px solid #333;
    margin: 10px;
    
    /* Box sizing */
    box-sizing: border-box;
    
    /* Border properties */
    border-width: 2px;
    border-style: solid;
    border-color: #333;
    
    /* Border radius */
    border-radius: 10px;
    
    /* Box shadow */
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

### Layout Properties
```css
/* Display property */
.inline {
    display: inline;
}

.block {
    display: block;
}

.inline-block {
    display: inline-block;
}

.hidden {
    display: none;
}

/* Position property */
.relative {
    position: relative;
    top: 10px;
    left: 20px;
}

.absolute {
    position: absolute;
    top: 0;
    right: 0;
}

.fixed {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

.sticky {
    position: sticky;
    top: 0;
}
```

### Flexbox
```css
/* Flexbox container */
.flex-container {
    display: flex;
    flex-direction: row;          /* row | row-reverse | column | column-reverse */
    flex-wrap: wrap;              /* nowrap | wrap | wrap-reverse */
    justify-content: center;      /* flex-start | flex-end | center | space-between | space-around */
    align-items: center;          /* flex-start | flex-end | center | baseline | stretch */
    align-content: space-between; /* flex-start | flex-end | center | space-between | space-around | stretch */
}

/* Flexbox items */
.flex-item {
    flex: 1;                      /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 200px;
    align-self: center;
    order: 1;
}
```

### Grid
```css
/* CSS Grid container */
.grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;  /* Fractional units */
    grid-template-rows: 100px auto 100px;
    grid-gap: 20px;
    grid-template-areas: 
        "header header header"
        "sidebar main aside"
        "footer footer footer";
}

/* Grid items */
.grid-item {
    grid-column: 1 / 3;          /* Start at line 1, end at line 3 */
    grid-row: 1 / 2;
    grid-area: main;              /* Named grid area */
}
```

## CSS Units

### Absolute Units
```css
.element {
    width: 100px;     /* Pixels */
    height: 2in;      /* Inches */
    margin: 1cm;      /* Centimeters */
    padding: 5mm;     /* Millimeters */
    font-size: 12pt;  /* Points */
    line-height: 1pc; /* Picas */
}
```

### Relative Units
```css
.element {
    font-size: 1.2em;     /* Relative to parent font size */
    margin: 1rem;          /* Relative to root font size */
    width: 50%;            /* Relative to parent width */
    height: 50vh;          /* Relative to viewport height */
    padding: 2vw;          /* Relative to viewport width */
    line-height: 1.5;      /* Unitless - relative to font size */
}
```

## CSS Cascade and Specificity

### Cascade Order
CSS rules are applied in this order:
1. User agent styles (browser defaults)
2. User styles (user preferences)
3. Author styles (your CSS)
4. Author `!important` declarations
5. User `!important` declarations

### Specificity Hierarchy
```css
/* Inline styles (highest specificity) */
<div style="color: red;">Content</div>

/* ID selectors */
#header { color: blue; }

/* Class selectors, attribute selectors, pseudo-classes */
.button { color: green; }
[type="text"] { color: orange; }
:hover { color: purple; }

/* Element selectors, pseudo-elements (lowest specificity) */
p { color: black; }
::before { color: gray; }
```

### Calculating Specificity
```css
/* Specificity: 0,0,1,0 */
p { color: red; }

/* Specificity: 0,0,1,1 */
p span { color: blue; }

/* Specificity: 0,1,0,0 */
.highlight { color: yellow; }

/* Specificity: 0,1,1,0 */
.highlight span { color: green; }

/* Specificity: 1,0,0,0 */
#title { color: purple; }
```

## CSS Best Practices

### Organization
```css
/* Group related properties */
.element {
    /* Layout */
    display: block;
    position: relative;
    width: 100%;
    height: auto;
    
    /* Typography */
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    
    /* Visual */
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    
    /* Spacing */
    margin: 0;
    padding: 20px;
}
```

### Naming Conventions
```css
/* BEM Methodology */
.block { }
.block__element { }
.block--modifier { }

/* Example */
.card { }
.card__title { }
.card__content { }
.card--featured { }
.card--small { }
```

### Performance
```css
/* Avoid universal selectors */
* { margin: 0; }  /* Expensive */

/* Use specific selectors */
body { margin: 0; }  /* Better */

/* Avoid deep nesting */
.nav .menu .item .link { }  /* Expensive */

/* Use classes instead */
.nav-link { }  /* Better */
```

## Responsive Design

### Media Queries
```css
/* Mobile first approach */
.container {
    width: 100%;
    padding: 10px;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
        padding: 20px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        width: 970px;
        padding: 30px;
    }
}

/* Large desktop */
@media (min-width: 1200px) {
    .container {
        width: 1170px;
    }
}
```

### Flexible Images
```css
img {
    max-width: 100%;
    height: auto;
}

.video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    height: 0;
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

## CSS Animations and Transitions

### Transitions
```css
.button {
    background-color: blue;
    transition: all 0.3s ease;
}

.button:hover {
    background-color: darkblue;
    transform: scale(1.1);
}
```

### Keyframe Animations
```css
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

.slide-in {
    animation: slideIn 0.5s ease-out;
}
```

## CSS Frameworks and Methodologies

### Popular Frameworks
- **Bootstrap**: Comprehensive UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Foundation**: Responsive frontend framework
- **Bulma**: Modern CSS framework

### CSS Methodologies
- **BEM**: Block Element Modifier
- **SMACSS**: Scalable and Modular Architecture
- **OOCSS**: Object-Oriented CSS
- **ITCSS**: Inverted Triangle CSS

## Debugging CSS

### Browser Developer Tools
```css
/* Use browser dev tools to: */
/* - Inspect element styles */
/* - See computed values */
/* - Debug layout issues */
/* - Test CSS changes in real-time */
/* - Profile performance */
```

### Common Issues
```css
/* Box model issues */
* {
    box-sizing: border-box;
}

/* Clearfix for floats */
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

/* Prevent text overflow */
.text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

## Conclusion

CSS is a powerful language that transforms plain HTML into beautiful, responsive web pages. Understanding CSS fundamentals provides the foundation for creating engaging user experiences and maintaining code quality.

## Key Takeaways

- CSS separates presentation from content structure
- Selectors determine which elements are styled
- The box model controls element dimensions and spacing
- Flexbox and Grid provide powerful layout capabilities
- Responsive design ensures accessibility across devices
- Best practices improve maintainability and performance

## Next Steps

- Practice building layouts with CSS
- Learn advanced CSS techniques
- Explore CSS frameworks and methodologies
- Study responsive design principles
- Experiment with CSS animations and transitions

# Design Tokens & Foundations

## Overview

Design tokens are the foundational values that define the visual design of your product. They are the smallest pieces of your design system - the atoms that make up everything else. By centralizing these values, you ensure consistency across all platforms and make it easy to maintain and evolve your design system.

## What are Design Tokens?

Design tokens are named entities that store visual design attributes. They represent decisions about color, typography, spacing, and other design elements in a platform-agnostic way.

**Key Characteristics:**
- **Named**: Each token has a descriptive name
- **Platform-agnostic**: Work across web, mobile, and other platforms
- **Centralized**: Single source of truth for design decisions
- **Scalable**: Easy to maintain and update across all implementations

## Token Categories

### Color Tokens
Color tokens define your color palette and semantic color usage.

**Basic Color Structure:**
```json
{
  "color": {
    "primary": {
      "50": { "value": "#eff6ff", "type": "color" },
      "100": { "value": "#dbeafe", "type": "color" },
      "500": { "value": "#3b82f6", "type": "color" },
      "900": { "value": "#1e3a8a", "type": "color" }
    },
    "semantic": {
      "success": { "value": "{color.green.500}", "type": "color" },
      "warning": { "value": "{color.yellow.500}", "type": "color" },
      "error": { "value": "{color.red.500}", "type": "color" }
    }
  }
}
```

**CSS Implementation:**
```css
:root {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  --color-semantic-success: var(--color-green-500);
  --color-semantic-warning: var(--color-yellow-500);
  --color-semantic-error: var(--color-red-500);
}
```

### Typography Tokens
Typography tokens define your text styles and hierarchy.

**Typography Structure:**
```json
{
  "typography": {
    "fontFamily": {
      "sans": { "value": "Inter, system-ui, sans-serif", "type": "fontFamily" },
      "mono": { "value": "JetBrains Mono, monospace", "type": "fontFamily" }
    },
    "fontSize": {
      "xs": { "value": "0.75rem", "type": "fontSize" },
      "sm": { "value": "0.875rem", "type": "fontSize" },
      "base": { "value": "1rem", "type": "fontSize" },
      "lg": { "value": "1.125rem", "type": "fontSize" },
      "xl": { "value": "1.25rem", "type": "fontSize" }
    },
    "fontWeight": {
      "normal": { "value": "400", "type": "fontWeight" },
      "medium": { "value": "500", "type": "fontWeight" },
      "semibold": { "value": "600", "type": "fontWeight" },
      "bold": { "value": "700", "type": "fontWeight" }
    },
    "lineHeight": {
      "tight": { "value": "1.25", "type": "lineHeight" },
      "normal": { "value": "1.5", "type": "lineHeight" },
      "relaxed": { "value": "1.75", "type": "lineHeight" }
    }
  }
}
```

### Spacing Tokens
Spacing tokens create consistent rhythm and spacing throughout your interface.

**Spacing Scale:**
```json
{
  "spacing": {
    "0": { "value": "0", "type": "spacing" },
    "1": { "value": "0.25rem", "type": "spacing" },
    "2": { "value": "0.5rem", "type": "spacing" },
    "3": { "value": "0.75rem", "type": "spacing" },
    "4": { "value": "1rem", "type": "spacing" },
    "5": { "value": "1.25rem", "type": "spacing" },
    "6": { "value": "1.5rem", "type": "spacing" },
    "8": { "value": "2rem", "type": "spacing" },
    "10": { "value": "2.5rem", "type": "spacing" },
    "12": { "value": "3rem", "type": "spacing" },
    "16": { "value": "4rem", "type": "spacing" },
    "20": { "value": "5rem", "type": "spacing" },
    "24": { "value": "6rem", "type": "spacing" }
  }
}
```

### Border Radius Tokens
Border radius tokens define the roundness of corners throughout your interface.

**Border Radius Scale:**
```json
{
  "borderRadius": {
    "none": { "value": "0", "type": "borderRadius" },
    "sm": { "value": "0.125rem", "type": "borderRadius" },
    "md": { "value": "0.375rem", "type": "borderRadius" },
    "lg": { "value": "0.5rem", "type": "borderRadius" },
    "xl": { "value": "0.75rem", "type": "borderRadius" },
    "full": { "value": "9999px", "type": "borderRadius" }
  }
}
```

### Shadow Tokens
Shadow tokens create depth and elevation in your interface.

**Shadow System:**
```json
{
  "shadow": {
    "sm": { 
      "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)", 
      "type": "boxShadow" 
    },
    "md": { 
      "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", 
      "type": "boxShadow" 
    },
    "lg": { 
      "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", 
      "type": "boxShadow" 
    },
    "xl": { 
      "value": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", 
      "type": "boxShadow" 
    }
  }
}
```

## Token Naming Conventions

### Semantic Naming
Use semantic names that describe the purpose rather than the appearance.

**Good Examples:**
- `color.text.primary` - Primary text color
- `color.background.elevated` - Background for elevated surfaces
- `spacing.component.padding` - Standard component padding

**Avoid:**
- `color.blue.500` - Too specific to implementation
- `spacing.16` - Not descriptive of purpose

### Hierarchical Structure
Organize tokens in a logical hierarchy that reflects their usage.

```
color/
├── primary/
│   ├── 50, 100, 200... 900
├── secondary/
│   ├── 50, 100, 200... 900
├── neutral/
│   ├── 50, 100, 200... 900
└── semantic/
    ├── success
    ├── warning
    ├── error
    └── info
```

## Token Implementation

### CSS Custom Properties
The most common way to implement design tokens in web applications.

```css
:root {
  /* Color tokens */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* Typography tokens */
  --font-family-sans: Inter, system-ui, sans-serif;
  --font-size-base: 1rem;
  --font-weight-medium: 500;
  
  /* Spacing tokens */
  --spacing-1: 0.25rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;
  
  /* Other tokens */
  --border-radius-md: 0.375rem;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### JavaScript/TypeScript
For applications that need programmatic access to tokens.

```typescript
export const tokens = {
  color: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    }
  },
  spacing: {
    1: '0.25rem',
    4: '1rem',
    8: '2rem'
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif'
    },
    fontSize: {
      base: '1rem',
      lg: '1.125rem'
    }
  }
} as const;
```

### Design Tool Integration
Many design tools support design tokens for better handoff.

**Figma Variables:**
- Create color variables in Figma
- Link to design tokens via plugins
- Sync changes automatically

**Sketch Libraries:**
- Create symbol libraries with token values
- Use shared styles for consistency
- Export tokens for development

## Token Management Tools

### Style Dictionary
A build system for creating design tokens.

**Configuration:**
```json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "dist/css/",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables"
      }]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "dist/scss/",
      "files": [{
        "destination": "_variables.scss",
        "format": "scss/variables"
      }]
    }
  }
}
```

### Figma Tokens Plugin
Sync design tokens between Figma and code.

**Features:**
- Two-way sync between Figma and code
- Support for multiple token types
- Automatic code generation
- Version control integration

### Design Token Studio
A comprehensive tool for managing design tokens.

**Features:**
- Visual token editor
- Multi-platform output
- Version control
- Team collaboration

## Best Practices

### 1. Start Simple
Begin with the most commonly used tokens and expand over time.

**Priority Order:**
1. Colors (primary, neutral, semantic)
2. Typography (font families, sizes, weights)
3. Spacing (common spacing values)
4. Border radius (common corner styles)
5. Shadows (elevation system)

### 2. Use Semantic Names
Choose names that describe purpose, not appearance.

```css
/* Good */
--color-text-primary
--color-background-elevated
--spacing-component-padding

/* Avoid */
--color-blue-500
--spacing-16
--font-size-14
```

### 3. Create Aliases
Use token references to create semantic aliases.

```json
{
  "color": {
    "text": {
      "primary": { "value": "{color.neutral.900}", "type": "color" },
      "secondary": { "value": "{color.neutral.600}", "type": "color" }
    }
  }
}
```

### 4. Document Everything
Provide clear documentation for each token.

```json
{
  "color": {
    "primary": {
      "500": {
        "value": "#3b82f6",
        "type": "color",
        "description": "Primary brand color used for main actions and highlights",
        "usage": "Buttons, links, focus states, brand elements"
      }
    }
  }
}
```

### 5. Version Control
Track changes to your design tokens over time.

**Git Workflow:**
- Create feature branches for token changes
- Use pull requests for review
- Tag releases for major updates
- Maintain changelog

## Common Pitfalls

### 1. Too Many Tokens
Creating tokens for every possible value leads to complexity.

**Solution:** Only create tokens for values that are reused or have semantic meaning.

### 2. Inconsistent Naming
Poor naming conventions make tokens hard to use and maintain.

**Solution:** Establish clear naming conventions and stick to them.

### 3. No Documentation
Undocumented tokens are difficult to use correctly.

**Solution:** Document the purpose and usage of each token.

### 4. Platform-Specific Values
Using platform-specific values in tokens reduces reusability.

**Solution:** Use platform-agnostic values and let tools handle platform-specific output.

### 5. No Governance
Without proper governance, tokens can become inconsistent over time.

**Solution:** Establish clear ownership and review processes for token changes.

## Conclusion

Design tokens are the foundation of a successful design system. By centralizing design decisions in a platform-agnostic way, you ensure consistency across all touchpoints while making it easy to maintain and evolve your design system.

The key to success is starting simple, using semantic naming, and establishing good governance processes. Remember that design tokens are not just for developers - they're a communication tool that helps designers and developers work together more effectively.

## Next Steps

1. **Audit your current design values** and identify what should become tokens
2. **Establish naming conventions** that work for your team
3. **Start with the most commonly used values** (colors, typography, spacing)
4. **Choose appropriate tools** for your workflow and team size
5. **Document everything** and establish governance processes
6. **Iterate based on usage** and team feedback

Remember: Good design tokens make your design system more maintainable, consistent, and scalable. Invest time in getting them right, and your entire design system will benefit.
